import React from "react";
import { StyledFooter } from "./styles";
import IconButton from "../IconButtonComponent";
import {
  MessageOutlined,
  ShopOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
export default function FooterComponents() {
  return (
    <StyledFooter>
      <IconButton icon={<MessageOutlined />}></IconButton>
      <IconButton icon={<ShopOutlined />}></IconButton>
      <Button type="primary" shape="round">
        이동하기
      </Button>
      <IconButton icon={<SettingOutlined />}></IconButton>
      <IconButton icon={<ShopOutlined />}></IconButton>
    </StyledFooter>
  );
}
