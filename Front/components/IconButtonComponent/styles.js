import styled from "@emotion/styled";
import { Button } from "antd";

export const StyledIconButton = styled(Button)`
  && .anticon {
    font-size: 2em;
  }
   @media (min-width: 820px) and (max-width: 1179px) {
    width : 70px;
    height: 70%;
    font-size: 180%;
  }
`;
