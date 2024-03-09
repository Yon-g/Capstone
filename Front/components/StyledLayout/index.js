import React from "react";
import { StyledLayout } from "./styles";
import Header from "../Header";
import FooterComponents from "../Footer";
import Content from "../Content";
import MapComponet from "../MapComponet";
import { Button } from "antd";
export default function LayoutComponet() {
  return (
    <StyledLayout>
      <Header></Header>
      <Content></Content>
      <MapComponet></MapComponet>
      <FooterComponents></FooterComponents>
    </StyledLayout>
  );
}
