import React, { useEffect, useState } from "react";
import { StyledMarker } from "./style";
import { MessageOutlined, ShopOutlined, SettingOutlined, QuestionCircleOutlined } from "@ant-design/icons";

/* Marker 스타일링 */
const Marker = ({ key, lat, lng }) => {
  const convertLatLonToScreenCoords = (latitude, longitude) => ({
    x: Math.min(Math.max(latitude, 0), 100),
    y: Math.min(Math.max(longitude, 0), 100),
  });

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [markerColor, setMarkerColor] = useState(null);

  useEffect(() => {
    const { x, y } = convertLatLonToScreenCoords(lat, lng);
    setPosition({ x, y });
  }, [lat, lng]); //lat 또는 lng가 변경될 때마다 실행

  // key 값에 따른 배경색을 결정하는 함수
  const getBackgroundColor = (key) => {
    switch (key) {
      case 1:
        setMarkerColor(red);
      case 2:
        setMarkerColor(blue);
      case 3:
        setMarkerColor(green);
      case 4:
        setMarkerColor(yellow);
      default:
        return "transparent"; // 기본값
    }
  };

  return (
    <StyledMarker style={{
      left: `${lat}px`, top: `${lng}px`, color: `${markerColor}`
    }} />
    // <StyledMarker style={{ left: `${position.x}px`, top: `${position.y}px`, color: getBackgroundColor(key) }} />

  );
};
export default Marker;
