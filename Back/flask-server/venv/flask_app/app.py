from flask import Flask, render_template, jsonify, request, Response
from flask import send_from_directory

from flask_cors import CORS
from socket import *
from collections import deque
import threading, io
import os, time, json
from PIL import Image
import random


#192.168.0.130
app = Flask(__name__)

#CORS정책 비활성화
cors = CORS(app, resources={r"/*/": {"origins": "*"}})


pos = [0.00] * 12
order = []

#ROS to Flask, 좌표값 수신 코드
def serverClient_getPos():
    global pos
    global order
    client_sock=socket(AF_INET, SOCK_STREAM)
    try:
        client_sock.connect(('192.168.0.146', 8000)) #용원 ROS돌리는 IP, Port

    except ConnectionRefusedError:
        print('좌표 전송 서버에 연결할 수 없습니다.')
        print('1. 서버의 ip주소와 포트번호가 올바른지 확인하십시오.')
        print('2. 서버 실행 여부를 확인하십시오.')
        os._exit(1)

    #서버 접속 후 대기
    msg = client_sock.recv(128)
    client_sock.send('접속완료, 맵 주세요'.encode('utf-8'))

    #맵 파일 수신
    imgSize = client_sock.recv(1024)
    Size = int(imgSize.decode('utf-8'))
    print(Size)
    client_sock.send('이미지 크기 확인, 이미지 주세요'.encode('utf-8'))

    #사전에 전달받은 이미지 파일 크기만큼의 메시지(바이트) 수신
    image_data = b''
    while True:
        data = client_sock.recv(1024)
        image_data += data
        if len(image_data) == Size : break

    print('*'*100)
    #Image라이브러리 통해서 로컬 directory에 저장
    image = Image.open(io.BytesIO(image_data))
    image.save('static/mapImage.png','png')
    client_sock.send('사진감사요, 센서값 주세요'.encode('utf-8'))

    #터틀봇 좌표 수신 및 명령 전달

    while True:
        data = client_sock.recv(128)
        data.decode('utf-8')
        data = str(data)
        print(data)
        lst = list(data[2:-1].split())
        
        for i in range(len(lst)):
            pos[i] = lst[i]

        #자체적으로 인터벌 유지
        time.sleep(0.1)
        #client2server msg send
        client_sock.send(str(order[-1]).encode('utf-8'))

#ROS to Flask, 이미지 수신
def serverClient_getImage():
    client_sock=socket(AF_INET, SOCK_STREAM)

    try:
        client_sock.connect(('192.168.0.146', 8000))

    except ConnectionRefusedError:
        print('이미지 전송 서버에 연결할 수 없습니다.')
        print('1. 서버의 ip주소와 포트번호가 올바른지 확인하십시오.')
        print('2. 서버 실행 여부를 확인하십시오.')
        os._exit(1)
    
    client_sock.close()
    # print("끝남")

def changingGlobal():
    global pos
    while(True):
        pos[0] = random.randint(0,100)
        pos[1] = random.randint(0,100)
        pos[2] = random.randint(0,100)
        time.sleep(0.5)


@app.route("/")
def home():
    return render_template("index.html")


#Flask 서버에서 클릭 좌표를 사용하여 POST 요청을 처리할 새경로 정의

@app.route('/api/click-coordinates', methods=['POST'])
def handle_click_coordinates():
    global order
    data = request.json
    print("Coordinates received:", data)
    order.append(data)
    
    return jsonify({"status": "success", "message": "Coordinates received"}), 200

#전역변수를 사용해 실시간 웹소켓 통신으로 전달받은 좌표값을 json데이터로 반환
@app.route("/socket_Pos/",methods=['GET'])
def socket_Pos():
    global pos
    # print(pos)
    return jsonify([{'id':1,'x':pos[0],'y':pos[1],'heading':pos[2]},
                    {'id':2,'x':pos[3],'y':pos[4],'heading':pos[5]},
                    {'id':3,'x':pos[6],'y':pos[7],'heading':pos[8]},
                    {'id':4,'x':pos[9],'y':pos[10],'heading':pos[11]}])

@app.route('/map-image/')
def serve_map_image():
    return send_from_directory('static', 'map.png')

@app.route('/users/')
def users():
	# users 데이터를 Json 형식으로 반환한다
    return jsonify({"members": [{ "id" : 1, "name" : "yerin" },{ "id" : 2, "name" : "dalkong" }]})

#MAIN
if __name__ == '__main__':
    # thread = threading.Thread(target=serverClient_getImage)
    # thread.start()
    thread = threading.Thread(target=serverClient_getPos)
    thread.start()
    # thread = threading.Thread(target=changingGlobal)
    # thread.start()
    app.run('0.0.0.0',port=5000,debug=False)