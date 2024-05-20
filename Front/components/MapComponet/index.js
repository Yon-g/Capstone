import React, { useState } from "react";
import { StyledMapContainer } from "./styles";
import Marker from "../Marker";
import { MessageOutlined, ShopOutlined, SettingOutlined, QuestionCircleOutlined } from "@ant-design/icons";

const MapComponet = ({ turtlebots }) => {
  const imageUrl = "http://192.168.0.158:5000/map-image/";
  // const [testturtlebot, setTestturtlebot] = useState([{ id: 1, lat: 1, lng: 1, heading: 0 }]);
  console.log(turtlebots);
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
          lat={turtlebot.lat * 8.2}
          lng={turtlebot.lng * 8.2}
          heading={turtlebot.heading}
        ></Marker>
      ))}
    </StyledMapContainer>
  );
};

export default MapComponet;