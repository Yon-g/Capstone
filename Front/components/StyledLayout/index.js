import React, { useEffect, useState, useRef } from "react";
import { StyledLayout } from "./styles";
import Header from "../Header";
import FooterComponents from "../Footer";
// import { MyVerticallyCenteredModal } from "../Modal";
import MapComponet from "../MapComponet";

export default function LayoutComponet() {
  const [turtlebots, setTurtlebots] = useState([]);
  const [order, setOrder] = useState(0);
  const [messageOrder, setMessageOrder] = useState(false);
  const [messageState, setMessageState] = useState(0);
  const [message, setMessage] = useState("자율주행의자가 이동을 완료하였습니다!");
  const [previewTurtlebotsPos, setPreviewTurtlebotsPos] = useState([]);
  const [preview, setPreview] = useState(false);

  // 이전 order 값을 저장하는 ref 변수 선언
  const previousOrderRef = useRef(-1);

  //작업 명령 상태 정보를 비동기적으로 가져오는 함수
  useEffect(() => {
    const fetchTurtlebotOrder = async () => {
      try {
        const response = await fetch("http://192.168.0.130:5000/socket_order");
        const data = await response.json();
        const newOrder = data.status;
        console.log("서버에서 받는 데이터:", newOrder);

        // 이전 order와 새로 받아온 order 비교
        if (newOrder != previousOrderRef.current) {
          setOrder(newOrder);

          if (newOrder == 5) { // 0: 동작 안하고 있음 / 5: 작업중지 / 7: 시작 / 8: 종료 / 9: 시스템 오류
            setMessage("이동을 종료합니다.");
            setMessageState(5);
            setMessageOrder(true);
            setTimeout(() => setMessageOrder(false), 3000);
          } else if (newOrder == 7) {
            setMessage("자율주행의자가 이동을 시작합니다.");
            setMessageState(7);
            setMessageOrder(true);
            setTimeout(() => setMessageOrder(false), 3000);
          } else if (newOrder == 8) {
            setMessage("자율주행의자가 이동을 완료하였습니다!");
            setMessageState(8);
            setMessageOrder(true);
            setTimeout(() => setMessageOrder(false), 3000);
          } else if (newOrder == 9) {
            setMessage("시스템 오류로 이동을 종료합니다.");
            setMessageState(9);
            setMessageOrder(true);
            setTimeout(() => setMessageOrder(false), 3000);
          }
        }

        // 새로운 order를 previousOrderRef에 저장
        previousOrderRef.current = newOrder;

      } catch (error) {
        console.error("TurtleBot order fetching error: ", error);
      }
    };

    // Turtlebot의 위치 정보를 비동기적으로 가져오는 함수
    const fetchTurtlebotPositions = async () => {
      try {
        const response = await fetch("http://192.168.0.130:5000/socket_Pos");
        const data = await response.json();
        const updatedTurtlebots = data.map(turtlebot => {
          return {
            id: turtlebot.id,
            lat: turtlebot.x,
            lng: turtlebot.y,
            heading: turtlebot.heading
          };
        });
        setTurtlebots(updatedTurtlebots);
      } catch (error) {
        console.error("TurtleBot position fetching error: ", error);
      }
    };

    const orderIntervalId = setInterval(fetchTurtlebotOrder, 50);
    const positionIntervalId = setInterval(fetchTurtlebotPositions, 100);

    return () => {
      clearInterval(orderIntervalId);
      clearInterval(positionIntervalId);
    };
  }, []);

  useEffect(() => {
    // console.log(turtlebots);
  }, [turtlebots]);

  return (
    <StyledLayout>
      <Header></Header>
      {/* <Content></Content> */}
      <MapComponet turtlebots={turtlebots} previewTurtlebotsPos={previewTurtlebotsPos} preview={preview}></MapComponet>
      <FooterComponents order={order} setPreviewTurtlebotsPos={setPreviewTurtlebotsPos} setPreview={setPreview} previewTurtlebotsPos={previewTurtlebotsPos}
        messageOrder={messageOrder} setMessageOrder={setMessageOrder} message={message} setMessage={setMessage} messageState={messageState} >
      </FooterComponents>
    </StyledLayout>
  );
}
