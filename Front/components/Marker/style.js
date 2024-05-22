import styled from "@emotion/styled";
import { UpCircleOutlined } from "@ant-design/icons";

export const StyledPresetMarker = styled.div`
  position: absolute;
  // transform: translate(0%, 0%);
  // fontsize: 100px;
  transition: left 0.5s linear, top 0.5s linear;
  width:50px;
  height:50px;
  border-radius:30px;
  opacity: 0.4;
`;

export const StyledMarker = styled(UpCircleOutlined)`
  position: absolute;
  // transform: translate(0%, 0%);
  font-size: 50px;
  // color: blue;
  transition: left 0.5s linear, top 0.5s linear;
  width:50px;
  height:50px;
  border-radius:5px
`;