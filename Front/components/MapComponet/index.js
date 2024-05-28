import React, { useState } from "react";
import { StyledMapContainer, StyledTable } from "./styles";
import { Marker, PresetMarker } from "../Marker";
import { MessageOutlined, ShopOutlined, SettingOutlined, QuestionCircleOutlined } from "@ant-design/icons";

const MapComponet = ({ turtlebots, previewTurtlebotsPos, preview }) => {
  const imageUrl = "http://192.168.0.130:5000/map-image/";
  const [testturtlebot, setTestturtlebot] = useState([{ id: 1, lat: 50, lng: 50, heading: 0 }, { id: 2, lat: 60, lng: 60, heading: 0 }, { id: 3, lat: 70, lng: 70, heading: 0 }, { id: 4, lat: 80, lng: 80, heading: 0 }]);
  const [color, setColor] = useState(["red", "blue", "green", "orange"])
  // console.log(turtlebots);
  return (
    <StyledMapContainer>
      <img
        src={imageUrl}
        alt="SLAM MAP"
        style={{ position: "relative", width: "100%", height: "100%" }}
      ></img>
      <StyledTable></StyledTable>
      {/* turtlebots 배열을 순회하며 Marker 컴포넌트를 렌더링 */}
      {turtlebots.map((turtlebot, i) => {
        const markerColor = color[i % color.length];
        return (
          <Marker
            key={turtlebot.id}
            lat={turtlebot.lat * 8.2 - 33}
            lng={turtlebot.lng * 8.2 - 33}
            heading={turtlebot.heading}
            color={markerColor}
          ></Marker>
        );
      })}
      {preview ? previewTurtlebotsPos.map((turtlebot, i) => {
        const markerColor = color[i % color.length];
        return (
          <PresetMarker
            key={turtlebot.id}
            lat={turtlebot.lat * 8.2 - 33}
            lng={turtlebot.lng * 8.2 - 33}
            heading={turtlebot.heading}
            color={markerColor}
          ></PresetMarker>
        );
      }) : null}
    </StyledMapContainer>
  );
};

export default MapComponet;