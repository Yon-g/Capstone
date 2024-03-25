import React from "react";
import { StyledMapContainer } from "./styles";
import Marker from "../Marker";

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
