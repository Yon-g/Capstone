import React from "react";
import { StyledMapContainer } from "./styles";
<<<<<<< HEAD

/* Marker 스타일링 */
const Marker = ({ lat, lng, rotation }) => {
  const convertLatLonToScreenCoords = (latitude, longitude, rotation) => {
    // x: Math.min(Math.max(latitude, 0), 100),
    // y: Math.min(Math.max(longitude, 0), 100),
    const cosAngle = Math.cos(rotation * Math.PI / 180);
    const sinAngle = Math.sin(rotation * Math.PI / 180);
    const newX = (latitude - 50) * cosAngle - (longitude - 50) * sinAngle + 50;
    const newY = (latitude - 50) * sinAngle + (longitude - 50) * cosAngle + 50;
    return { x: newX, y: newY };
  };

  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const { x, y } = convertLatLonToScreenCoords(lat, lng, rotation);
    setPosition({ x, y });
  }, [lat, lng, rotation]); //lat 또는 lng가 변경될 때마다 실행
  return (
    <div
      style={{
        position: "absolute",
        left: `${lat}%`,
        top: `${lng}%`,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        fontSize: "2rem",
        transition: "left 0.5s linear, top 0.5s linear",

      }}
    >
      📍
    </div>
  );
};

const MapComponet = ({ turtlebots }) => {
  
=======
import Marker from "../Marker";

const MapComponet = ({ turtlebots }) => {
  const imageUrl = "http://localhost:5000/map-image";
>>>>>>> 6c29860c0aef8a2edb22ba18464c9d3469bdedff
  return (
    <StyledMapContainer>
      <img
        //src="./images/map_rotate.png"
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
<<<<<<< HEAD
          rotation={turtlebot.rotation}
=======
          heading={turtlebot.heading}
>>>>>>> 6c29860c0aef8a2edb22ba18464c9d3469bdedff
        ></Marker>
      ))}
    </StyledMapContainer>
  );
};

export default MapComponet;
