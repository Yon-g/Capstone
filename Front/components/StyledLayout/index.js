import React, { useEffect, useState } from "react";
import { StyledLayout } from "./styles";
import Header from "../Header";
import FooterComponents from "../Footer";
import Content from "../Content";
import MapComponet from "../MapComponet";

export default function LayoutComponet() {
  const [turtlebots, setTurtlebots] = useState([]);
  useEffect(() => {
    // Turtlebot의 위치 정보를 비동기적으로 가져오는 함수
    const fetchTurtlebotPositions = async () => {
      //Turtlebot의 위치 정보를 가져오는 코드 작성 (API 호출)
    };

    fetchTurtlebotPositions();
  });
  return (
    <StyledLayout>
      <Header></Header>
      <Content></Content>
      <MapComponet turtlebots={turtlebots}></MapComponet>
      <FooterComponents></FooterComponents>
    </StyledLayout>
  );
}
