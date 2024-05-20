import styled from "@emotion/styled";
import { UpCircleOutlined } from "@ant-design/icons";

// export const StyledMarker = styled.div`
//   position: absolute;
//   // transform: translate(0%, 0%);
//   fontsize: 100px;
//   transition: left 0.5s linear, top 0.5s linear;
//   background-color: red;
//   width:50px;
//   height:50px;
//   border-radius:5px
// `;

export const StyledMarker = styled(UpCircleOutlined)`
  position: absolute;
  // transform: translate(0%, 0%);
  font-size: 150%;
  color: red;
  transition: left 0.5s linear, top 0.5s linear;
  width:50px;
  height:50px;
  border-radius:5px
`;