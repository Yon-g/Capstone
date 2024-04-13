import React, { useEffect, useState } from "react";
import { StyledFooter, StyledMoveButton, StyledStopButton } from "./styles";
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
  };
  const stopPreset = async () => { // 서버로 stop 신호를 보내는 함수
    try {
      const stopSignal = JSON.stringify({ option: -1 }); //취소신호를 -1로 함 
      console.log("서버로 보내는 데이터:", stopSignal); // 콘솔에 서버로 보낼 데이터 출력 확인용

      const response = await fetch("http://localhost:5000/user_order", { //이 주소가 맞는지 확인 필요할 듯
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: stopSignal, // 서버로 -1 값을 보냄
      });
      if (!response.ok) {
        throw new Error("서버 오류");
      }
      const data = await response.json();
      console.log(data); 
    } catch (error) {
      console.error("전송 중 에러 발생:", error);
    }
  };

  useEffect(() => { }, [open]);

  return (
    <>
      <StyledFooter>
        <IconButton icon={<MessageOutlined />}></IconButton>
        <IconButton icon={<ShopOutlined />}></IconButton>
        {/* 기존 코드(재민이한테 의견 물어보고 다시 원상복귀할거면 해놓아야겠음) */}
        {/* <StyledMoveButton
          type="primary"
          onClick={showModal}
          disabled={isDisabled}
        >
          Preset Move
        </StyledMoveButton> */} 
        {isDisabled ? (
          <StyledStopButton
            type="primary"
            onClick={stopPreset}
          >
            Stop
          </StyledStopButton> // Preset 작동 시켰을 때 나오는 Stop 버튼 
        ) : (
          <StyledMoveButton
            type="primary"
            onClick={showModal}
          >
            Preset Move
          </StyledMoveButton> // 기존 Preset Move 버튼
        )}
        <IconButton icon={<SettingOutlined />}></IconButton>
        <IconButton icon={<ShopOutlined />}></IconButton>
      </StyledFooter>
      <PresetModal open={open} setOpen={setOpen}></PresetModal>
    </>
  );
}
