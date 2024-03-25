import React, { useEffect, useState } from "react";
import { StyledLayout } from "./styles";
import Header from "../Header";
import FooterComponents from "../Footer";
import Content from "../Content";
import MapComponet from "../MapComponet";

export default function LayoutComponet() {
  

  const [turtlebots, setTurtlebots] = useState([]);
  
  const [X, setX] = useState(0);
  const [Y, setY] = useState(0);
  const [ORT, setORT] = useState(0);

  /* 테스트를 위한 useEffect() */
  useEffect(() => {
    /* 임시 사용하는 더미 데이터 */
    const initializeDummyData = () => {
      const dummyTurtlebots = [
        { id: 1, name: "Turtlebot 1", lat: 50, lng: 50 },
        { id: 2, name: "Turtlebot 2", lat: 50, lng: 50 },
        { id: 3, name: "Turtlebot 3", lat: 50, lng: 50 },
      ];
      setTurtlebots(dummyTurtlebots);
    };
    initializeDummyData();

    // 마커의 위치를 더 작은 단위로 업데이트하여 부드러운 움직임 구현
    const moveMarkers = () => {
      setTurtlebots((prevTurtlebots) =>
        prevTurtlebots.map((turtlebot) => ({
          ...turtlebot,
          lat: Math.max(
            0,
            Math.min(100, turtlebot.lat + (Math.random() * 2 - 1))
          ),
          lng: Math.max(
            0,
            Math.min(100, turtlebot.lng + (Math.random() * 2 - 1))
          ),
        }))
      );
    };

    const timerId = setInterval(moveMarkers, 100);
    return () => clearInterval(timerId);
  }, []);

  /* 
  
  임시 주석 -> api 확인후 주석 제거 예정 
*/
  useEffect(() => {
    // Turtlebot의 위치 정보를 비동기적으로 가져오는 함수
    const fetchTurtlebotPositions = async () => {
      //Turtlebot의 위치 정보를 가져오는 코드 작성 (API 호출)
      try {
        const response = await fetch('http://localhost:5000/socket_Pos');
        const data = await response.json();
        setX(data.X);
        setY(data.Y);
        setORT(data.ORT)
      } catch (error) {
        console.error("TurtleBot position feching error: ", error);
        //에러 핸들러 로직 추가
      }
    };

    fetchTurtlebotPositions();
    const intervalId = setInterval(fetchTurtlebotPositions, 100);

    return () => clearInterval(intervalId);
  }, []);
  
  //
  return (
    <StyledLayout>
        <div>
      <h4>Position Now</h4>
      <h5>X : {X}</h5>
      <h5>Y : {Y}</h5>
      <h5>ORT : {ORT}</h5>
        </div>
      
      <Content></Content>
      <MapComponet turtlebots={turtlebots}></MapComponet>
      <FooterComponents></FooterComponents>
    </StyledLayout>
  );
}
