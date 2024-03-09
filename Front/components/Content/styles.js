import styled from "@emotion/styled";
import { Layout } from "antd";

export const StyledContent = styled(Layout.Content)`
  position: relative;
  padding: 50px;
  overflow: auto;
  @media (max-width: 768px) {
    display: none;
  }
`;
