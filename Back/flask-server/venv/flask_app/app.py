from flask import Flask, render_template, jsonify, request, Response
from flask import send_from_directory

from flask_cors import CORS
from socket import *
from collections import deque
import threading, io
import os, time, json
from PIL import Image
import random

Address = {'IP_webserver' : '192.168.0.130',
           'IP_ROS' : '192.168.0.146',
           'PORT_socket' : 8000}

NumOfChair = 4

app = Flask(__name__)

#CORS정책 비활성화
cors = CORS(app, resources={r"/*/": {"origins": "*"}})


Pos = [0.00] * (3 * NumOfChair) # {X, Y, Heading}
Order = [0, "None"] # type, order_Msg
Status = [""]

# 0 : No Order Now
# 1 : Yes order Now  

#ROS to Flask, 좌표값 수신 코드
def websocket_communicate():
    global Pos, Order, Address, NumOfChair

    client_sock=socket(AF_INET, SOCK_STREAM)

    try:
        client_sock.connect((Address['IP_ROS'], 8000)) #용원 ROS돌리는 IP, Port

    except ConnectionRefusedError:
        print('좌표 전송 서버에 연결할 수 없습니다.')
        print('1. 서버의 ip주소와 포트번호가 올바른지 확인하십시오.')
        print('2. 서버 실행 여부를 확인하십시오.')
        os._exit(1)

    #서버 접속 후 대기
    msg = client_sock.recv(128)
    client_sock.send('Connection Success'.encode('utf-8'))

    #맵 파일 수신
    imgSize = client_sock.recv(1024)
    Size = int(imgSize.decode('utf-8'))
    print(Size)
    client_sock.send('Img Size recieved'.encode('utf-8'))

    #사전에 전달받은 이미지 파일 크기만큼의 메시지(바이트) 수신
    image_data = b''
    while True:
        seperate = client_sock.recv(1024)
        image_data += seperate
        if len(image_data) == Size : break

    print('*'*100)

    #Image라이브러리 통해서 로컬 directory에 저장
    image = Image.open(io.BytesIO(image_data))
    image.save('static/mapImage.png','png')

    client_sock.send('Map Image received'.encode('utf-8'))

    #터틀봇 좌표 수신 및 명령 전달
    while True:
        msgFrmROS = client_sock.recv(128)
        msgFrmROS.decode('utf-8')
        msgFrmROS = str(msgFrmROS)
        print(msgFrmROS)

        #작업 상태 + 좌표로 변경 필요함
        rawData = list(msgFrmROS[2:-1].split())
        # status = rawData[0]
        for i in range(NumOfChair * 3):
            # pos[i] = rawData[i + 1]
            Pos[i] = rawData[i]

        msg2ROS = ''
        msg2ROS += str(Order[0])
        msg2ROS += str(Order[1])

        # if status != Order[1] and status == "":
        #     #Order배열초기화
        #     Order[0] = 0
        #     Order[1] = ""
        #     Status[0] = "" 

        # + ROS에서 최근 작업을 변수로 가지고 있고 자체적인 작업 상황(터틀봇이 이동 중인지, 명령 수행 중인지 여부)도 변수로 가지고 있어야
        # 여기서 보내는 msg2ROS에 대해서 판단할 수 있음!!!!!!

        #자체적으로 인터벌 유지
        time.sleep(0.1)

        client_sock.send(msg2ROS).encode('utf-8')
        
def changingGlobal():
    global Pos, NumOfChair
    while(True):
        for i in range(NumOfChair * 3):
            Pos[i] = random.randint(100)
        time.sleep(0.1)

@app.route("/")
def home():
    return render_template("index.html")

#Flask 서버에서 클릭 좌표를 사용하여 POST 요청을 처리할 새 경로 정의
@app.route('/user_order', methods=['POST'])
def handle_click_coordinates():
    global Order, Status
    user_order = request.json['option']
    #time_stamp = request.json['time']

    #react에서 post요청 직후에 modal, Order 버튼을 불가능하게 만들어야 함 + 작업수행중 글씨로 바꾸면 좋을듯? 
    # (ex. 직전 명령이 아직 수행중입니다. 오랜시간 대기상태가 지속될 경우, 의자의 상태와 장애물 존재 여부를 확인하세요)
    # + 동작 종료버튼을 만들자 => 터틀봇 전체 움직임 정지 

    #print("Order time :", time_stamp)
    print("Coordinates received:", user_order)

    #현재 작업 상태가 공백이 아니거나, 유저 명령이 작업 멈춰! 가 아니라면
    if Status[0] != "" or user_order != "STOP":
        #명령하달 실패 메시지 반환
        return jsonify({"status": "fail", "message": "Your previous order is not finished yet"})

    #작업 메시지 확인 시
    Order[0] = 1
    #Order[1] = time_stamp + "||" + user_order

    return jsonify({"status": "success", "message": "Coordinates received"}), 200

#전역변수를 사용해 실시간 웹소켓 통신으로 전달받은 좌표값을 json데이터로 반환
@app.route("/socket_Pos/",methods=['GET'])
def socket_Pos():
    global Pos, NumOfChair, Order, Status
    status_pos = []

    #여기도 수정 필요함 => status + pos 형태로
    #status_pos.append({"status : Status[0]"})

    #react에서 직전에 보낸 명령을 기억해뒀다가
    #여기서 보내는 status랑 비교해서 상태가 달라진 걸 확인할 수 있어야 함
    for i in range(NumOfChair):
        status_pos.append({'id': i+1,'x':Pos[3*i],'y':Pos[3*i + 1],'heading':Pos[3*i + 2]})

    return jsonify(status_pos)

@app.route('/map-image/')
def serve_map_image():
    return send_from_directory('static', 'map.png')

#MAIN
if __name__ == '__main__':
    # thread = threading.Thread(target=serverClient_getImage)
    # thread.start()
    # thread = threading.Thread(target=websocket_communicate)
    # thread.start()
    thread = threading.Thread(target=changingGlobal)
    thread.start()
    app.run('0.0.0.0',port=5000,debug=False)