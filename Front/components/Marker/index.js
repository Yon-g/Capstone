import React, { useEffect, useState } from "react";
import { StyledMarker, StyledPresetMarker } from "./style";
import { MessageOutlined, ShopOutlined, SettingOutlined, QuestionCircleOutlined } from "@ant-design/icons";

/* Marker 스타일링 */
export const Marker = ({ lat, lng, color }) => {
  // const [position, setPosition] = useState({ x: 0, y: 0 });
  // const [markerColor, setMarkerColor] = useState("");

  // const convertLatLonToScreenCoords = (latitude, longitude) => ({
  //   x: Math.min(Math.max(latitude, 0), 100),
  //   y: Math.min(Math.max(longitude, 0), 100),
  // });

  // useEffect(() => {
  //   const { x, y } = convertLatLonToScreenCoords(lat, lng);
  //   setPosition({ x, y });
  // }, [lat, lng]); //lat 또는 lng가 변경될 때마다 실행

  const colors = {
    red: "#FF6F61  ",
    blue: "#42A5F5 ",
    green: "#66BB6A ",
    orange: "#FFB74D "
  };

  return (<StyledMarker style={{ left: `${lat}px`, top: `${lng}px`, color: colors[color] }} />);
};

/* PresetMarker 스타일링 */
export const PresetMarker = ({ lat, lng, color }) => {

  const colors = {
    red: "#FF6F61  ",
    blue: "#42A5F5 ",
    green: "#66BB6A ",
    orange: "#FFB74D "
  };

  return (<StyledPresetMarker style={{ left: `${lat}px`, top: `${lng}px`, backgroundColor: colors[color] }} />);
};