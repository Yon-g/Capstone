import React, { useEffect, useState } from "react";
import { StyledLayout } from "./styles";
import Header from "../Header";
import FooterComponents from "../Footer";
import Content from "../Content";
import MapComponet from "../MapComponet";

export default function LayoutComponet() {
  const [turtlebots, setTurtlebots] = useState([]);
  const [order, setOrder] = useState(0);

  //작업 명령 상태 정보를 비동기적으로 가져오는 함수
  useEffect(() => {
    const fetchTurtlebotOrder = async () => {
      try {
        const response = await fetch("http://localhost:5000/socket_order");
        const data = await response.json();
        setOrder(data.order);
        console.log(data.order);
      } catch (error) {
        console.error("TurtleBot position fetching error: ", error);
      }
    };

    // Turtlebot의 위치 정보를 비동기적으로 가져오는 함수
    const fetchTurtlebotPositions = async () => {
      try {
        const response = await fetch("http://localhost:5000/socket_Pos");
        const data = await response.json();
        const updatedTurtlebots = data.map((turtlebot) => ({
          id: turtlebot.id,
          lat: turtlebot.x,
          lng: turtlebot.y,
          heading: turtlebot.heading,
        }));

        setTurtlebots(updatedTurtlebots);
      } catch (error) {
        console.error("TurtleBot position fetching error: ", error);
      }
    };

    // 실제 데이터로 마커 위치 업데이트
    const orderIntervalId = setInterval(fetchTurtlebotOrder, 1000);
    const positionIntervalId = setInterval(fetchTurtlebotPositions, 100);

    return () => {
      clearInterval(orderIntervalId);
      clearInterval(positionIntervalId);
    };
  }, []);

  return (
    <StyledLayout>
      <Header></Header>
      <Content></Content>
      <MapComponet turtlebots={turtlebots}></MapComponet>
      <FooterComponents order={order}></FooterComponents>
    </StyledLayout>
  );
}
