import React, { useState } from "react";
import { StyledFooter, StyledMoveButton } from "./styles";
import IconButton from "../IconButtonComponent";
import PresetModal from "../Modal";
import {
  MessageOutlined,
  ShopOutlined,
  SettingOutlined,
} from "@ant-design/icons";

export default function FooterComponents() {

  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
    console.log(open);
  };

  return (
    <>
      <StyledFooter>
        <IconButton icon={<MessageOutlined />}></IconButton>
        <IconButton icon={<ShopOutlined />}></IconButton>
        <StyledMoveButton type="primary" onClick={showModal}>
          Preset Move
        </StyledMoveButton>
        <IconButton icon={<SettingOutlined />}></IconButton>
        <IconButton icon={<ShopOutlined />}></IconButton>
      </StyledFooter>
      <PresetModal open={open} setOpen={setOpen}></PresetModal>
    </>
  );
}
