import React, { useState } from "react";
import { StyledHeader, StyledKOREA, StyledTECH } from "./styles";

export default function Header_Componet() {
  const [headerName, setHeaderName] = useState("KOREA")
  return <StyledHeader>
    <div style={{ width: '100%' }}>
      <StyledKOREA>KOREA</StyledKOREA>
      <StyledTECH>TECH</StyledTECH>
    </div>
  </StyledHeader>;
}
