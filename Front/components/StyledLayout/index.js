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
  const [message, setMessage] = useState("");
  const [previewTurtlebotsPos, setPreviewTurtlebotsPos] = useState([]);
  const [preview, setPreview] = useState(false);

  // isError 상태와 타이머를 관리하기 위한 ref 변수 선언
  const isErrorRef = useRef(false);
  const errorTimeoutId = useRef(null);

  //작업 명령 상태 정보를 비동기적으로 가져오는 함수
  useEffect(() => {
    const fetchTurtlebotOrder = async () => {
      // setModalShow(true);
      try {
        // const response = await fetch("http://192.168.0.130:5000/socket_order");
        const data = await response.json();
        setOrder(data.order);
        console.log("서버에서 받는 데이터:", data.order);
        if (data.order == 0) { // 동작 중 : 0, 동작 완료 : 1, 오류 발생 :2 -> 어케할지 재민이랑 얘기
          setMessage("자율주행의자가 이동을 완료하였습니다!")
          setMessageState(0);
          setMessageOrder(true);
          // 3초 후에 setMessageOrder(false) 실행
          setTimeout(() => setMessageOrder(false), 2000);
        }
        else if (data.order == 1) {
          setMessage("자율주행의자가 이동 중 문제가 발생하여 이동이 종료됩니다.")
          setMessageState(1);
          setMessageOrder(true);
          // 3초 후에 setMessageOrder(false) 실행
          setTimeout(() => setMessageOrder(false), 2000);
        }

      } catch (error) {
        console.error("TurtleBot order fetching error: ", error);
      }
    };

    // Turtlebot의 위치 정보를 비동기적으로 가져오는 함수
    const fetchTurtlebotPositions = async () => {
      try {
        const response = await fetch("http://192.168.0.159:5000/socket_Pos");
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

    const orderIntervalId = setInterval(fetchTurtlebotOrder, 100);
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
