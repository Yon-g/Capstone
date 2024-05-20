import React, { useEffect, useState, useRef } from "react";
import { StyledLayout } from "./styles";
import Header from "../Header";
import FooterComponents from "../Footer";
import Content from "../Content";
import MapComponet from "../MapComponet";

export default function LayoutComponet() {
  const [turtlebots, setTurtlebots] = useState([]);
  const [order, setOrder] = useState(0);
  const [isError, setIsError] = useState(false); // 에러 상태 추가

  // isError 상태와 타이머를 관리하기 위한 ref 변수 선언
  const isErrorRef = useRef(false);
  const errorTimeoutId = useRef(null);

  //작업 명령 상태 정보를 비동기적으로 가져오는 함수
  useEffect(() => {
    // const fetchTurtlebotOrder = async () => {
    //   try {
    //     const response = await fetch("http://192.168.0.130:5000/socket_order");
    //     const data = await response.json();
    //     setOrder(data.order);
    //     console.log("서버에서 받는 데이터:", data.order);
    //     // 여긴 백엔드에서 처리한다고함 -> 승헌
    //     // if (data.order == 1 || data.order == 2 || data.order == 3 || data.order == 4) {
    //     //   // 서버로부터 0이 아닌 값을 받았고, 아직 타이머가 설정되지 않았다면 타이머 시작
    //     //   // 서버로부터 문자열도 받고 있어서 일단 1,2,3,4로 코딩함
    //     //   if (!errorTimeoutId.current) {
    //     //     errorTimeoutId.current = setTimeout(() => {
    //     //       alert("의자가 이동 중에 오류가 발생하였습니다."); //alert가 아닌 새로운 모달창(?)을 만들어야 좋을 듯(일단 틀은 만들었으니 그건 나중에하자)
    //     //       setIsError(true);
    //     //       isErrorRef.current = true;
    //     //     }, 3000); // 3초 후에 오류 메시지를 표시(이건 테스트용으로 3초로 했기 때문에 나중에 몇분으로 할 지 수정하자)
    //     //   }
    //     // } else {
    //     // 서버로부터 0을 받았을 때, 타이머가 있다면 취소하고 상태를 초기화
    //     //   if (errorTimeoutId.current) {
    //     //     clearTimeout(errorTimeoutId.current);
    //     //     errorTimeoutId.current = null;
    //     //     setIsError(false);
    //     //     isErrorRef.current = false;
    //     //   }
    //     // }
    //   } catch (error) {
    //     console.error("TurtleBot order fetching error: ", error);
    //   }
    // };

    // Turtlebot의 위치 정보를 비동기적으로 가져오는 함수
    const fetchTurtlebotPositions = async () => {
      try {
        const response = await fetch("http://192.168.0.158:5000/socket_Pos");
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

    // const orderIntervalId = setInterval(fetchTurtlebotOrder, 1000);
    const positionIntervalId = setInterval(fetchTurtlebotPositions, 100);

    return () => {
      // clearInterval(orderIntervalId);
      clearInterval(positionIntervalId);
      if (errorTimeoutId.current) {
        clearTimeout(errorTimeoutId.current);
      }
    };
  }, []);

  useEffect(() => {
    // console.log(turtlebots);
  }, [turtlebots]);


  // useEffect(() => {
  //   // isError가 true일 때 alert를 통해 사용자에게 알림
  //   console.log(isError);
  //   if (isError) {
  //     alert("의자가 이동 중에 오류가 발생하였습니다.");
  //     console.log(2222222);
  //   }
  // }, [isError]); // isError 상태를 의존성 배열에 추가

  return (
    <StyledLayout>
      <Header></Header>
      {/* <Content></Content> */}
      <MapComponet turtlebots={turtlebots}></MapComponet>
      <FooterComponents order={order}></FooterComponents>
    </StyledLayout>
  );
}
