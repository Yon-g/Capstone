import React from "react";
import { StyledFooter, StyledMoveButton } from "./styles";
import IconButton from "../IconButtonComponent";
import {
  MessageOutlined,
  ShopOutlined,
  SettingOutlined,
} from "@ant-design/icons";
export default function FooterComponents() {
  return (
    <StyledFooter>
      <IconButton icon={<MessageOutlined />}></IconButton>
      <IconButton icon={<ShopOutlined />}></IconButton>
      <StyledMoveButton type="primary" shape="round">
        이동하기
      </StyledMoveButton>
      <IconButton icon={<SettingOutlined />}></IconButton>
      <IconButton icon={<ShopOutlined />}></IconButton>
    </StyledFooter>
  );
}
