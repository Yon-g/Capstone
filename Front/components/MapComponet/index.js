import React, { useState } from "react";
import { StyledMapContainer } from "./styles";
import Marker from "../Marker";

const MapComponet = ({ turtlebots }) => {
  const imageUrl = "http://192.168.0.158:5000/map-image/";
  const [testturtlebot, setTestturtlebot] = useState([{ id: 1, lat: 187.5, lng: 313.5, heading: 0 }, { id: 2, lat: 60, lng: 60, heading: 0 }, { id: 3, lat: 70, lng: 70, heading: 0 }, { id: 4, lat: 80, lng: 80, heading: 0 }]);
  console.log(testturtlebot);
  return (
    <StyledMapContainer>
      <img
        // src="./images/map_rotate.png"
        src={imageUrl}
        alt="SLAM MAP"
        style={{ position: "relative", width: "100%", height: "100%" }}
      ></img>
      {/* turtlebots 배열을 순회하며 Marker 컴포넌트를 렌더링 */}
      {testturtlebot.map((turtlebot) => (
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