import React, { useEffect, useState } from "react";
import { StyledLayout } from "./styles";
import Header from "../Header";
import FooterComponents from "../Footer";
import Content from "../Content";
import MapComponet from "../MapComponet";
import PresetModal from "../Modal";

export default function LayoutComponet() {
  const [turtlebots, setTurtlebots] = useState([]);

  /* 임시 사용하는 더미 데이터 */
  useEffect(() => {
    const initializeDummyData = () => {
      const dummyTurtlebots = [
        { id: 1, name: "Turtlebot 1", lat: 50, lng: 50, rotation: 20 },
        { id: 2, name: "Turtlebot 2", lat: 50, lng: 20, rotation: 90 },
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

    const timerId = setInterval(moveMarkers, 50);
    return () => clearInterval(timerId);
  }, []);

  // useEffect(() => {
  //   // Turtlebot의 위치 정보를 비동기적으로 가져오는 함수
  //   const fetchTurtlebotPositions = () => {
  //     fetch('서버주소')
  //       .then(response => {
  //         if (!response.ok) {
  //           throw new Error('Network response was not ok');
  //         }
  //         return response.json();
  //       })
  //       .then(jsonData => console.log(jsonData)) // 서버로부터 받은 JSON 형식의 데이터 임시 테스트용
  //       // .then(jsonData => setTurtlebots(jsonData)) // 서버로부터 받은 JSON형식의 데이터를 Turtlebots state에 저장
  //       .catch(error => console.error('TurtleBot position feching error:', error));
  //   }

  //   // 일정시간(0.05초)마다 fetchDataPeriodically 함수 실행
  //   setInterval(fetchTurtlebotPositions, 50);
  // });

  return (
    <StyledLayout>
      <Header></Header>
      <Content></Content>
      <MapComponet turtlebots={turtlebots}></MapComponet>
      <FooterComponents></FooterComponents>
    </StyledLayout>
  );
}