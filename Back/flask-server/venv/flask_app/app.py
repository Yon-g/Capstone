from flask import Flask, render_template, jsonify, request, Response
from flask_cors import CORS
from socket import *
import threading, io
import os, time, json
from PIL import Image


app = Flask(__name__)

#CORS정책 비활성화
cors = CORS(app, resources={r"/*/": {"origins": "*"}})


pos = [0.00,0.00,0.00]
order = ""

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

    while True:
        data = client_sock.recv(32)
        data.decode('utf-8')
        data = str(data)
        x,y,ort = data[2:-1].split()
        x = float(x)
        y = float(y)
        ort = float(ort)

        pos[0] = x
        pos[1] = y
        pos[2] = ort

        #자체적으로 인터벌 유지
        time.sleep(0.3)
        #client2server msg send
        client_sock.send('좌표감사요'.encode('utf-8'))

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
    
    imgSize = client_sock.recv(1024)
    Size = int(imgSize.decode('utf-8'))
    print(Size)

    image_data = b''
    #사전에 전달받은 이미지 파일 크기만큼의 메시지(바이트) 수신
    while True:
        data = client_sock.recv(1024)
        image_data += data
        if len(image_data) == Size : break

    print('*'*100)
    #Image라이브러리 통해서 로컬 directory에 저장
    image = Image.open(io.BytesIO(image_data))
    image.save('mapImage.png','png')
    client_sock.send('사진감사요'.encode('utf-8'))
    client_sock.close()
    # print("끝남")

# def changingGlobal():
#     global pos
#     while(True):
#         for i in range(3):
#             pos[0] += (i+1)
#         time.sleep(1)

@app.route("/")
def home():
    return render_template("index.html")

#전역변수를 사용해 실시간 웹소켓 통신으로 전달받은 좌표값을 json데이터로 반환
@app.route("/socket_Pos/",methods=['GET'])
def socket_Pos():
    global pos
    # print(pos)
    return jsonify({'X':pos[0],'Y':pos[1],'ORT':pos[2]})

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
    app.run('0.0.0.0',port=5000,debug=False)