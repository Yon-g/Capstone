import React, { useEffect, useState } from "react";
import { StyledMapContainer } from "./styles";

/* Marker 스타일링 */
const Marker = ({ lat, lng }) => {
  const convertLatLonToScreenCoords = (latitude, longitude) => ({
    x: Math.min(Math.max(latitude, 0), 100),
    y: Math.min(Math.max(longitude, 0), 100),
  });

  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const { x, y } = convertLatLonToScreenCoords(lat, lng);
    setPosition({ x, y });
  }, [lat, lng]); //lat 또는 lng가 변경될 때마다 실행
  return (
    <div
      style={{
        position: "absolute",
        left: `${lat}%`,
        top: `${lng}%`,
        transform: `translate(-50%, -50%)`,
        fontSize: "2rem",
        transition: "left 0.5s linear, top 0.5s linear",
      }}
    >
      📍
    </div>
  );
};

const MapComponet = ({ turtlebots }) => {
  
  return (
    <StyledMapContainer>
      <img
        src="./images/map_rotate.png"
        alt="SLAM MAP"
        style={{ position: "relative" }}
      ></img>
      {/* turtlebots 배열을 순회하며 Marker 컴포넌트를 렌더링 */}
      {turtlebots.map((turtlebot) => (
        <Marker
          key={turtlebot.id}
          lat={turtlebot.lat}
          lng={turtlebot.lng}
        ></Marker>
      ))}
    </StyledMapContainer>
  );
};

export default MapComponet;
