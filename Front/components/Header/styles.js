import styled from "@emotion/styled";
import { Layout } from "antd";

export const StyledHeader = styled(Layout.Header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background: #fff;

  @media (max-width: 768px) {
    display: none;
  }
`;
