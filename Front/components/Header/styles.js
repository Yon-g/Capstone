import styled from "@emotion/styled";
import { Layout } from "antd";

export const StyledHeader = styled(Layout.Header)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  // background: #fff;
  background: white;
  @media (max-width: 768px) {
    display: none;
  }
  height:90px;
`;

export const StyledKOREA = styled.span`
  color: #00005f;
  font-size: 250%;
  text-align: center;
  font-weight: 500;
`;

export const StyledTECH = styled.span`
  color: orange;
  font-size: 250%;
  text-align: center;
  font-weight: 500;
`;

export const Styledtitle = styled.span`
  margin-left: 10px;
  font-size: 150%;
  text-align: center;
  font-weight: 1000;
`;



