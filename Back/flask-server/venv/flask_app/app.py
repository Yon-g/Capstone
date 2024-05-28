from flask import Flask, render_template, jsonify, request, Response
from flask import send_from_directory, send_file

from flask_cors import CORS
from mapProcess import totalProcess
from socket import *
import threading, os, time, random
import astar as AS
import bitmap2img

Address = {'IP_webserver' : '192.168.0.130',
           'IP_ROS' : '192.168.0.156',
           'PORT_socket1' : 8000,
           'PORT_socket2' : 8001}

NumOfChair = 4
SystemIsOn = True
AstarPlanner = False

app = Flask(__name__)

#CORS정책 비활성화
cors = CORS(app, resources={r"/*/": {"origins": "*"}})

map_saved = []
Pos = [0.00] * (3 * NumOfChair) # {X, Y, Heading}
sidePos = [[50.00 for _ in range(3)] for _ in range(NumOfChair)]
goalPos = [[20.00, 40.00, 0.00 ] for _ in range(6)]
Order = ["0"] 
status = ["0"]
isWorking = [False]

def generate_PathPlanner(map_arr):
    map_arr = bitmap2img.stringArr2IntArr(map_arr)
    newPlanner = AS.generateNewPlanner(map_arr)
    return newPlanner

def websocket_communicate():
    global Pos, Order, Address, NumOfChair, isWorking, SystemIsOn, status, map_saved, AstarPlanner, goalPos, sidePos

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
    print(imgSize.decode('utf-8'))
    print(R, C)
    client_sock.send('Img Size recieved'.encode('utf-8'))

    #사전에 전달받은 이미지 파일 크기만큼의 메시지(바이트) 수신
    Map_arr = []
    map_msg = client_sock.recv(R*C)
    print(map_msg.decode('utf-8'))
    map_msg = map_msg.decode('utf-8')
    print(len(map_msg))
    t_pos = 0
    Map_arr = []
    for _ in range(R):
        line = map_msg[t_pos:t_pos+C]
        t_pos += C
        Map_arr.append(line)
    
    # print(Map_arr)
    os.chdir(os.path.dirname(os.path.realpath(__file__)))
    map_saved = totalProcess(Map_arr,'static/map_image.png')
    AstarPlanner = generate_PathPlanner(Map_arr)
    
    client_sock.send('Map Image received'.encode('utf-8'))
    SystemIsOn = True

    #도착점 좌표 6개 수령 메시지필요
    goal = [20.0, 50.0, 0.0, 40.0, 20.0, 0.0, 60.0, 20.0, 0.0, 40.0, 80.0, 0.0, 60.0, 80.0, 0.0, 80,0, 50.0, 0.0]
    goalMsg = client_sock.recv(1024)
    goal = list(goalMsg.decode('utf-8').split())
    print(goal)
    for i in range(len(goalPos)):
        tmp = []
        tmp.append(float(goal[i*3]))
        tmp.append(float(goal[i*3 + 1]))
        tmp.append(float(goal[i*3 + 2]))
        goalPos[i] = tmp

    client_sock.send('Goals Pos received'.encode('utf-8'))

    #코너 4개 위치 수령 메시지 필요
    side = [10.0,10.0,0.0,10.0,70.0,0.0,70.0,10.0,0.0,70.0,70.0,0.0]
    sideMsg = client_sock.recv(1024)
    side = list(sideMsg.decode('utf-8').split())
    print(side)
    for i in range(len(sidePos)):
        tmp = []
        tmp.append(float(side[i*3]))
        tmp.append(float(side[i*3 + 1]))
        tmp.append(float(side[i*3 + 2]))
        sidePos[i] = tmp
    
    print(goalPos)
    print(sidePos)

    client_sock.send('Goals Pos received'.encode('utf-8'))

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
            status[0] = "7"

        #작업종료시
        if rawData[0] == "8" :
            isWorking[0] = False
            if Order[0] == "5":
                status[0] = "5"
            else :
                status[0] = "8"
            Order[0] = "0"

        #시스템 오류
        if rawData[0] == "9" :
            isWorking[0] = False
            status[0] = '9'
            Order[0] = '0'
       
        # 0번 : 작업 실행 없음, 작업 요청 가능
        # 1번 : 작업 있음
        # 5번 : 정지
        # 6번 : 작동중
        if isWorking[0] == True:
            msg2ROS = "6" #1
        elif rawData[0] == "0" :
            msg2ROS = Order[0]
            if status[0] == '6':
                msg2ROS = "1"
                if Order[0] == '2':
                    botNum = [0,1,2,3]
                    goalNum = [1,2,4,5]

                elif Order[0] == '3':
                    botNum = [0,1,2,3]
                    goalNum = [0,1,3,4]

                elif Order[0] == '4':
                    sx = []; sy = []; gx = []; gy = []
                    goalNum = [1,2,4,5]

                    for i in range(NumOfChair):
                        sx.append(float(Pos[3*i]))
                        sy.append(float(Pos[3*i + 1]))

                    for i in goalNum:
                        gx.append(goalPos[i][0])
                        gy.append(goalPos[i][1])

                    paths, start = AS.get_best_path(AstarPlanner,sx,sy,gx,gy)
                    botNum = start
                    print("**************************")
                    print(start, botNum)
                    print("**************************")

                else : #이경우에는 사이드 좌표로 써야함
                    botNum = [0,1,2,3]
                    goalNum = [0,1,2,3]

                for i in range(NumOfChair):
                    for j in range(NumOfChair):
                        if botNum[j] == i : 
                            msg2ROS += (" " + str(goalNum[j]))
                            break
        #자체적으로 인터벌 유지
        time.sleep(0.15)
        print(msg2ROS)
        client_sock.send(msg2ROS.encode('utf-8'))

        
def changingGlobal():
    global Pos, NumOfChair
    while(True):
        for i in range(0,len(Pos),3):
            Pos[i] = random.randint(10,35)
            Pos[i+1] = random.randint(63,75)
        for i in range(NumOfChair):
            Pos[3*i+2] = random.randint(0,3)
        time.sleep(0.1)

@app.route("/")
def home():
    return render_template("index.html")

#Flask 서버에서 클릭 좌표를 사용하여 POST 요청을 처리할 새 경로 정의
@app.route('/user_order', methods=['POST'])
def handle_click_coordinates():
    global Order, isWorking
    user_order = str(request.json['option'])

    print("Coordinates received:", user_order)
    print(isWorking[0], user_order)
    #작업 중 종료요청 or 미작업 중 1~3 요청
    if (not isWorking[0] and user_order != '5') or (isWorking[0] and user_order == '5'):
        #작업 메시지 확인 시
        Order[0] = user_order
        status[0] = '6'
        print("*" * 100)
        print(Order[0])
        print("*" * 100)
        return jsonify({"status": "success", "message": "Coordinates received"}), 200
    
    return jsonify({"status": "fail", "message": "Your previous order is not finished"})

#미리보기 post
@app.route('/preview_post/', methods=['POST'])
def preview_click_coordinates():
    global preview, AstarPlanner, goalPos, Pos, NumOfChair, sidePos
    preview_req = str(request.json['option'])

    print("*" * 100)
    print("preview received:", preview_req)
    print("*" * 100)
    print(type(preview_req))
    
    if AstarPlanner == False:
        return jsonify({"status": "failed", "message": "planner has not been generated"})

    elif preview_req not in ('1','2','3','4') or preview_req not in (1,2,3,4):
        return jsonify({"status": "failed", "message": "worng preview number posted"})

    path_data = []

    if preview_req == '2' or preview_req == '3':
        #사이드로 보내기
        if preview_req == '2' :
            goalSet = [1,2,4,5]
        elif preview_req == '3' :
            goalSet = [0,1,3,4]
        
        j = 0
        for i in goalSet:
            tmp_dict = {}
            tmp_dict['id'] = str(j + 1)
            tmp_dict['x'] = goalPos[i][1]
            tmp_dict['y'] = goalPos[i][0]
            tmp_dict['heading'] = AS.radian2degree(float(goalPos[i][2]))
            j += 1
            path_data.append(tmp_dict)
            
    elif preview_req == '4' :
        for i in range(NumOfChair):
            tmp_dict = {}
            tmp_dict['id'] = str(i + 1)
            tmp_dict['x'] = sidePos[i][1]
            tmp_dict['y'] = sidePos[i][0]
            tmp_dict['heading'] = AS.radian2degree(float(sidePos[i][2]))
            path_data.append(tmp_dict)
    
    else :
        gx = []; gy = []; sx = []; sy = []

        for i in range(NumOfChair):
            sx.append(float(Pos[3*i]))
            sy.append(float(Pos[3*i+1]))

        for i in (1,2,4,5):
                gx.append(float(goalPos[i][0]))
                gy.append(float(goalPos[i][1]))

        paths, start = AS.get_best_path(AstarPlanner,sx,sy,gx,gy)
        
        sett = []
        for i in range(NumOfChair):
            sett.append(start[i])
        sett.sort()
        
        for i in range(NumOfChair):
            tmp_dict = {}
            tmp_dict['id'] = sett[i][0] + 1
            tmp_dict['x'] = goalPos[sett[i][0]][1]
            tmp_dict['y'] = goalPos[sett[i][0]][0]
            tmp_dict['heading'] = AS.radian2degree(float(goalPos[sett[i][0]][2]))
            path_data.append(tmp_dict)
        
    return jsonify(path_data)

#전역변수를 사용해 실시간 웹소켓 통신으로 전달받은 좌표값을 json데이터로 반환
@app.route("/socket_Pos/",methods=['GET'])
def socket_Pos():
    global Pos, NumOfChair, Order, isWorking
    status_pos = []
    for i in range(NumOfChair):
        status_pos.append({'id': i+1,'x':Pos[3*i+1],'y':Pos[3*i],'heading':AS.radian2degree(float(Pos[3*i + 2]))})

    return jsonify(status_pos)

#여기서 아래 2번째 리턴을 주석 풀면 테스트 가능
@app.route("/socket_order/",methods=['GET'])
def socket_Order():
    global status
    # return jsonify({'status': 7})
    return jsonify({'status':status[0]})

@app.route('/map-image/')
def serve_map_image():
    return send_from_directory('static','map_image.png')

#MAIN
if __name__ == '__main__':
    # thread = threading.Thread(target=serverClient_getImage)
    thread = threading.Thread(target=websocket_communicate)
    # thread = threading.Thread(target=changingGlobal)
    thread.start()
    if SystemIsOn :
        app.run('0.0.0.0',port=5000,debug=False)
#최신본2