from flask import Flask, render_template, jsonify, request, Response
from flask import send_from_directory, send_file

from flask_cors import CORS
from mapProcess import totalProcess
from socket import *
import threading, os, time, random
import astar as AS

Address = {'IP_webserver' : '192.168.0.130',
           'IP_ROS' : '192.168.0.146',
           'PORT_socket1' : 8000,
           'PORT_socket2' : 8001}

NumOfChair = 4
SystemIsOn = True
AstarPlanner = False

app = Flask(__name__)

#CORS정책 비활성화
cors = CORS(app, resources={r"/*/": {"origins": "*"}})

map_saved = []
goalPos = {}
Pos = [0.00] * (3 * NumOfChair) # {X, Y, Heading}
Order = ["0"] 
status = ["0"]
preview = []
isWorking = [False]

def generate_PathPlanner(map_arr):
    newPlanner = AS.AstarPlanner()
    return newPlanner

def websocket_communicate():
    global Pos, Order, Address, NumOfChair, isWorking, SystemIsOn, status, map_saved, AstarPlanner, goalPos

    client_sock=socket(AF_INET, SOCK_STREAM)

    try:
        client_sock.connect((Address['IP_ROS'], 8000)) #용원 ROS돌리는 IP, Port

    except ConnectionRefusedError:
        print('좌표 전송 서버에 연결할 수 없습니다.')
        print('1. 서버의 ip주소와 포트번호가 올바른지 확인하십시오.')
        print('2. 서버 실행 여부를 확인하십시오.')
        os._exit(1)
    
    msg = client_sock.recv(128)
    client_sock.send('Connection Success'.encode('utf-8'))

    #맵 파일 수신 ==>>> 수정필요 / 100x100 배열로 수정
    imgSize = client_sock.recv(1024)
    R,C = map(int,imgSize.decode('utf-8').split())
    print(R, C)
    client_sock.send('Img Size recieved'.encode('utf-8'))

    #사전에 전달받은 이미지 파일 크기만큼의 메시지(바이트) 수신
    Map_arr = []
    map_msg = client_sock.recv(R * C + 2)
    map_msg = map_msg.decode('utf-8')[2:]
    t_pos = 0
    Map_arr = []
    for _ in range(R):
        line = map_msg[t_pos:t_pos+C]
        t_pos += C
        Map_arr.append(list(line))

    #도착점 좌표 6개 수령 메시지필요
    goal = [20.0, 50.0, 40.0, 20.0, 60.0, 20.0, 40.0, 80.0, 60.0, 80.0, 80,0, 50.0]
    goalPos['x'] = []; goalPos['y'] = []
    for i in range(0,len(goal),2):
        goalPos['x'].append(float(goal[i]))
        goalPos['y'].append(float(goal[i+1]))

    map_saved = totalProcess(Map_arr,'static/map.png')
    AstarPlanner = generate_PathPlanner(map_saved)
    
    client_sock.send('Map Image received'.encode('utf-8'))
    SystemIsOn = True

    #터틀봇 좌표 수신 및 명령 전달
    while True:
        msgFrmROS = client_sock.recv(128)
        msgFrmROS.decode('utf-8')
        msgFrmROS = str(msgFrmROS)
        print(msgFrmROS)

        rawData = list(msgFrmROS[2:-1].split())
        for i in range(NumOfChair * 3):
            Pos[i] = rawData[i + 1]

        print(Pos[0:3])
        print(Pos[3:6])
        print(Pos[6:9])
        print(Pos[9:])
        print("============================================")

        #작업시작시
        if rawData[0] == "7" :
            isWorking[0] = True
            status[0] = Order[0]

        #작업종료시
        if rawData[0] == "8" :
            isWorking[0] = False
            Order[0] = "0"
            status[0] = "0"

        #시스템 오류
        if rawData[0] == "9" :
            isWorking[0] = False
            status[0] = '9'
            Order[0] = '0'

        # 0번 : 작업 실행 없음, 작업 요청 가능
        # 1 ~ 4번 : 해당 작업 수행 중
        # 5번 : 작업 시작 대기 중
        msg2ROS = str(Order[0])
        if status[0] == '5':
            if Order[0] == '1':
                botNum = [0,1,2,3]
                goalNum = [1,2,4,5]

            elif Order[0] == '2':
                botNum = [0,1,2,3]
                goalNum = [0,1,3,4]

            elif Order[0] == '3':
                sx = []; sy = []; gx = []; gy = []
                goalNum = [1,2,4,5]
                
                for i in range(NumOfChair):
                    sx.append(float(Pos[3*i]))
                    sy.append(float(Pos[3*i + 1]))

                for i in goalNum:
                    gx.append(goalPos['x'][i])
                    gy.append(goalPos['y'][i])

                paths, start = AS.get_best_path(AstarPlanner,sx,sy,gx,gy)
                botNum = [start[i] for i in range(NumOfChair)]
            
            for i in range(NumOfChair):
                msg2ROS += (" " + str(botNum[i]) + " " + str(goalNum[i]))

            else : # 종료명령
                pass
        else : #명령 수행중 or 없음
            pass
        #자체적으로 인터벌 유지
        time.sleep(0.1)
        client_sock.send(msg2ROS.encode('utf-8'))
        
def changingGlobal():
    global Pos, NumOfChair
    while(True):
        for i in range(len(Pos)):
            Pos[i] = random.randint(1,99)
        time.sleep(0.1)

@app.route("/")
def home():
    return render_template("index.html")

#Flask 서버에서 클릭 좌표를 사용하여 POST 요청을 처리할 새 경로 정의
@app.route('/user_order', methods=['POST'])
def handle_click_coordinates():
    global Order, isWorking
    user_order = request.json['option']

    # react에서 post요청 직후에 modal, Order 버튼을 불가능하게 만들어야 함 + 작업수행중 글씨로 바꾸면 좋을듯? 
    # (ex. 직전 명령이 아직 수행중입니다. 오랜시간 대기상태가 지속될 경우, 의자의 상태와 장애물 존재 여부를 확인하세요)
    # + 동작 종료버튼을 만들자 => 터틀봇 전체 움직임 정지 

    print("Coordinates received:", user_order)
    print(isWorking[0], user_order)
    #작업 중 종료요청 or 미작업 중 1~3 요청
    if (not isWorking[0] and user_order != 4) or (isWorking[0] and user_order == '4'):
        #작업 메시지 확인 시
        Order[0] = user_order
        status[0] = '5'
        print("*" * 100)
        print(Order[0])
        print("*" * 100)
        return jsonify({"status": "success", "message": "Coordinates received"}), 200
    
    return jsonify({"status": "fail", "message": "Your previous order is not finished"})

#미리보기 post
@app.route('/preview_post/', methods=['POST'])
def preview_click_coordinates():
    global preview, AstarPlanner, goalPos, Pos, NumOfChair, preview
    preview_req = request.json['preview']

    print("*" * 100)
    print("preview received:", preview_req)
    print("*" * 100)
    
    res = []
    res.append({"status":"failed"})
    res.append({"x1" : "10.0", "x2" : "20.0"})``
    if AstarPlanner == False:
        return jsonify({"status": "failed", "message": "planner has not been generated"})

    elif preview_req not in ('1','2','3'):
        return jsonify({"status": "failed", "message": "worng preview number posted"})

    gx = []; gy = []; sx = []; sy = []
    for _ in range(NumOfChair):
        sx.append(float(Pos[3*i]))
        sy.append(float(Pos[3*i + 1]))

    path_data = []

    if preview_req != '3':
        if preview_req == '1':
            for i in (1,2,4,5):
                gx.append(goalPos['x'][i])
                gy.append(goalPos['y'][i])
        else :
            for i in (0,1,3,4):
                gx.append(goalPos['x'][i])
                gy.append(goalPos['y'][i])

        paths = AS.get_fixed_path(AstarPlanner,sx,sy,gx,gy)

        for i in range(len(paths)):
            tmp = paths[i]
            tmp_dict = {}
            tmp_dict['id'] = str(i)
            for j in range(len(tmp)):
                if j % 2 == 0 :
                    tmp_dict["y"+str(j//2 + 1)]
                else :
                    tmp_dict["x"+str(j//2 + 1)]
            path_data.append(tmp_dict)
        preview = path_data
    
    else :
        for i in (1,2,4,5):
                gx.append(goalPos['x'][i])
                gy.append(goalPos['y'][i])

        paths, start = AS.get_best_path(AstarPlanner,sx,sy,gx,gy)
        for i in range(len(paths)):
            tmp = paths[i]
            tmp_dict = {}
            tmp_dict['id'] = str(start[i])
            for j in range(len(tmp)):
                if j % 2 == 0 :
                    tmp_dict["y"+str(j//2 + 1)] = tmp[j]
                else :
                    tmp_dict["x"+str(j//2 + 1)] = tmp[j]
            path_data.append(tmp_dict)
        preview = path_data
    preview
    return jsonify({"status": "success", "message": "preview info updated", ""})

#전역변수를 사용해 실시간 웹소켓 통신으로 전달받은 좌표값을 json데이터로 반환
@app.route("/socket_Pos/",methods=['GET'])
def socket_Pos():
    global Pos, NumOfChair, Order, isWorking
    status_pos = []

    #react에서 직전에 보낸 명령을 기억해뒀다가
    #여기서 보내는 status랑 비교해서 상태가 달라진 걸 확인할 수 있어야 함
    for i in range(NumOfChair):
        status_pos.append({'id': i+1,'x':Pos[3*i+1],'y':Pos[3*i],'heading':Pos[3*i + 2]})

    return jsonify(status_pos)

#여기서 아래 2번째 리턴을 주석 풀면 테스트 가능
@app.route("/socket_order/",methods=['GET'])
def socket_Order():
    global status
    return jsonify({'order':status[0]})

@app.route('/map-image/')
def serve_map_image():
    return send_from_directory('static','map_image.png')

@app.route('/route-data/',methods=['GET'])
# id, x1, y1, x2, y2, x3, y3,... 4개
def serve_route_data():
    global preview
    if len(preview) < 4:
        return jsonify({"status": "success", "message": "preview info updated"})
    return jsonify(preview)

#MAIN
if __name__ == '__main__':
    # thread = threading.Thread(target=serverClient_getImage)
    # thread = threading.Thread(target=websocket_communicate)
    thread = threading.Thread(target=changingGlobal)
    thread.start()
    if SystemIsOn :
        app.run('0.0.0.0',port=5000,debug=False)
#최신본