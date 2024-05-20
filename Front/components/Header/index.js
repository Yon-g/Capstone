import React, { useState } from "react";
import { StyledHeader, StyledKOREA, StyledTECH, Styledtitle } from "./styles";

export default function Header_Componet() {
  const [headerName, setHeaderName] = useState("KOREA")
  return <StyledHeader>
    <div>
      <StyledKOREA>KOREA</StyledKOREA>
      <StyledTECH>TECH</StyledTECH>
      <Styledtitle>자동정리의자</Styledtitle>
    </div>
    {/* <Styledtitle>자동정리의자</Styledtitle>/ */}
  </StyledHeader>;
}
