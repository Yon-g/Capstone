import React from "react";
import { StyledMapContainer } from "./styles";

const MapComponet = ({ turtlebots }) => {
  return (
    <StyledMapContainer>
      <img src="./images/map_rotate.png" alt="SLAM MAP"></img>
    </StyledMapContainer>
  );
};

export default MapComponet;
