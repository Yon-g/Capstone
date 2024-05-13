import React from "react";
import { StyledMapContainer } from "./styles";
import Marker from "../Marker";

const MapComponet = ({ turtlebots }) => {
  const imageUrl = "http://192.168.0.130:5000/map-image/";
  return (
    <StyledMapContainer>
      <img
        // src="./images/map_rotate.png"
        src={imageUrl}
        alt="SLAM MAP"
        style={{ position: "relative" }}
      ></img>
      {/* turtlebots 배열을 순회하며 Marker 컴포넌트를 렌더링 */}
      {turtlebots.map((turtlebot) => (
        <Marker
          key={turtlebot.id}
          lat={turtlebot.lat}
          lng={turtlebot.lng}
          heading={turtlebot.heading}
        ></Marker>
      ))}
    </StyledMapContainer>
  );
};

export default MapComponet;