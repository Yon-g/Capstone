import React, { useEffect, useState } from "react";
import { StyledFooter, StyledMoveButton } from "./styles";
import IconButton from "../IconButtonComponent";
import PresetModal from "../Modal";
import {
  MessageOutlined,
  ShopOutlined,
  SettingOutlined,
} from "@ant-design/icons";

export default function FooterComponents({ order }) {
  const isDisabled = Number(order) !== 0;
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
    console.log(open);
  };

  useEffect(() => {}, [open]);

  return (
    <>
      <StyledFooter>
        <IconButton icon={<MessageOutlined />}></IconButton>
        <IconButton icon={<ShopOutlined />}></IconButton>
        <StyledMoveButton
          type="primary"
          onClick={showModal}
          disabled={isDisabled}
        >
          Preset Move
        </StyledMoveButton>
        <IconButton icon={<SettingOutlined />}></IconButton>
        <IconButton icon={<ShopOutlined />}></IconButton>
      </StyledFooter>
      <PresetModal open={open} setOpen={setOpen}></PresetModal>
    </>
  );
}
