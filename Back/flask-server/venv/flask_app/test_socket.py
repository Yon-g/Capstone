def communication_with_server(self):
    try:
        serverSock = socket(AF_INET, SOCK_STREAM)
        serverSock.bind(('', 8000))
        serverSock.listen(1)
        print("서버 오픈")
        connectionSock, addr = serverSock.accept()
        print(str(addr), '에서 접속이 확인되었습니다.')
        connectionSock.send('okay?'.encode('utf-8'))
        user_command = connectionSock.recv(1024).decode('utf-8')
        print('클라이언트 메시지 :',user_command)
        if user_command == 'ok':
            print('연결 완료')
        
        # /map 보내기과정 필요
        
        # 1. 맵크기 전송
        # 2. 맵 전송

        msg = ""
        mapSize = ""

        f = open("fileName",'r')
        lines = f.readlines()
        
        mapsize += 
        for line in lines:
            if len(line) > 0 :
                arr.append(list(map(int,line.strip())))
        

        #도착좌표 전송과정
        goal = [[20.0, 50.0, 0.0], #이렇게 배열 있다고 치고
                [40.0, 20.0, 0.0],
                [60.0, 20.0, 0.0],
                [40.0, 80.0, 0.0],
                [60.0, 80.0, 0.0],
                [80,0, 50.0, 0.0]] # x,y,heading 6개
        msg = ""
        for i in range(len(goal)):
            for j in range(len(goal[0])):
                msg += (" " + str(goal[i][j]))

        connectionSock.send(msg.encode('utf-8'))
        afterGoalPos = connectionSock.recv(1024).decode('utf-8')

        #코너좌표 보내기
        side = [[20.0, 50.0, 0.0], #이렇게 배열 있다고 치고
                [40.0, 20.0, 0.0],
                [60.0, 20.0, 0.0],
                [40.0, 80.0, 0.0]] # x,y,heading 4개

        msg = ""
        for i in range(len(side)):
            for j in range(len(side[0])):
                msg += (" " + str(side[i][j]))

        connectionSock.send(msg.encode('utf-8'))
        afterSidePos = connectionSock.recv(1024).decode('utf-8')

        while(1):
            bot1_odom = [str(i) for i in self.bot1_odom]
            bot2_odom = [str(i) for i in self.bot2_odom]
            bot3_odom = [str(i) for i in self.bot3_odom]
            bot4_odom = [str(i) for i in self.bot4_odom]
            msg = [str(self.center_command)]+bot1_odom+bot2_odom+bot3_odom+bot4_odom
            msg = ' '.join(msg)
            connectionSock.send(msg.encode('utf-8'))
            client_msg = connectionSock.recv(1024).decode('utf-8')
            self.user_command = int(client_msg[0])
            print('클라이언트 메시지 :',client_msg)
            if self.user_command in (1,2) : #이때는 인덱스 4개가 포함된 메시지
                move_index = list(map(int,client_msg[2:].strip().split()))
                # move index => 도착점 (0 1 2 3 4 5) 중 4개
                # ex) move_index = [0, 1, 2, 3]
                if self.user_command == "1":
                    pass #이때는 도착점 0~5 중 4개 인덱스
                else : #코너에 이동하는 프리셋
                    pass #이때는 코너점 0~3 중 4개 인덱스

            elif self.user_command == 9:
                break #걍 반복문 터쳐버리기   
            
    except Exception as e:
        print('이미지를 전송하는 중 오류가 발생했습니다:', e)
    finally:
        serverSock.close()
        connectionSock.close()