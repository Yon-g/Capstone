import React, { useEffect, useState } from "react";
import { StyledMarker } from "./style";
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
    <StyledMarker style={{ left: `${lat}%`, top: `${lng}%` }}>📍</StyledMarker>
  );
};

export default Marker;
