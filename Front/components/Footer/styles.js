import styled from "@emotion/styled";
import { Layout, Button } from "antd";

export const StyledFooter = styled(Layout.Footer)`
  height: 10vh;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 10px;
  background: white;
`;

export const StyledMoveButton = styled(Button)`
  // font-size: 1.2em;
  margin-top: 8px;
`;

export const StyledStopButton = styled(Button)`
  // font-size: 1.2em;
  margin-top: 8px;
  background-color: #ff6347; 
  border-color: #ff6347; 
  font-weight: bold; 

  // 클릭 상태에서 배경색과 테두리 색상 유지
  &:active {
    background-color: #ff6347;
    border-color: #ff6347;
  }

  // 포커스 상태에서 배경색과 테두리 색상 유지
  &:focus {
    background-color: #ff6347;
    border-color: #ff6347;
    outline: none; // 포커스 테두리 제거
  }
`;