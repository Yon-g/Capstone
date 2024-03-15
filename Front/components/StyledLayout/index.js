import React, { useEffect, useState } from "react";
import { StyledLayout } from "./styles";
import Header from "../Header";
import FooterComponents from "../Footer";
import Content from "../Content";
import MapComponet from "../MapComponet";

export default function LayoutComponet() {
  const [turtlebots, setTurtlebots] = useState([]);

  /* 임시 사용하는 더미 데이터 */
  useEffect(() => {
    const initializeDummyData = () => {
      const dummyTurtlebots = [
        { id: 1, name: "Turtlebot 1", lat: 50, lng: 50 },
        { id: 2, name: "Turtlebot 2", lat: 150, lng: 50 },
      ];
      setTurtlebots(dummyTurtlebots);
    };
    initializeDummyData();
    const timerId = setInterval(() => {
      setTurtlebots((prevTurtlebots) =>
        prevTurtlebots.map((turtlebots) => ({
          ...turtlebots,
          lat: Math.max(
            0,
            Math.min(100, turtlebots.lat + Math.random() * 10 - 5)
          ),
          lng: Math.max(
            0,
            Math.min(100, turtlebots.lng + Math.random() * 10 - 5)
          ),
        }))
      );
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  /* 
  
  임시 주석 -> api 확인후 주석 제거 예정 

  useEffect(() => {
    // Turtlebot의 위치 정보를 비동기적으로 가져오는 함수
    const fetchTurtlebotPositions = async () => {
      //Turtlebot의 위치 정보를 가져오는 코드 작성 (API 호출)
      try {
        const response = await fetch("api_endpoint");
        const data = await response.json();
        setTurtlebots(data);
      } catch (error) {
        console.error("TurtleBot position feching error: ", error);
        //에러 핸들러 로직 추가
      }
    };

    fetchTurtlebotPositions();
    const intervalId = setInterval(fetchTurtlebotPositions, 5000);

    return () => clearInterval(intervalId);
  }, []);
    */
  return (
    <StyledLayout>
      <Header></Header>
      <Content></Content>
      <MapComponet turtlebots={turtlebots}></MapComponet>
      <FooterComponents></FooterComponents>
    </StyledLayout>
  );
}
