import React, { useEffect, useState } from "react";
import { StyledFooter, StyledMoveButton, StyledStopButton, StyledModal, StyledPreset, StyledPresetHead, StyledApplyButton, StyledPreview, StyledPreviewIcon, styledIconButton } from "./styles";
import IconButton from "../IconButtonComponent";
import PresetModal from "../Modal";
import { MessageOutlined, ShopOutlined, SettingOutlined, QuestionCircleOutlined } from "@ant-design/icons";

export default function FooterComponents({ order }) {
  const isDisabled = Number(order) !== 0;
  const [open, setOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null); // 선택된 프리셋의 상태
  const [loading, setLoading] = useState(false); // 로딩 상태 관리

  const showModal = () => {
    if (open == false)
      setOpen(true);
    else setOpen(false);
  };

  const selectPreset = (presetId) => {
    setSelectedPreset(presetId); // 선택된 프리셋의 ID를 상태로 저장
  };

  const closeModal = () => {
    setOpen(false);
    setSelectedPreset(null);
    console.log(selectedPreset);
  };

  const startPreset = async () => {
    setLoading(true);
    try {
      // 여기에 서버로 데이터를 전송하는 코드를 작성
      const response = await fetch("http://192.168.0.130:5000/user_order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ option: selectedPreset }), // 서버로 전송할 데이터
      });
      if (!response.ok) {
        throw new Error("서버 오류");
      }
      // 서버 응답 처리
      const data = await response.json();
      console.log(data); // 응답 로깅
    } catch (error) {
      console.error("전송 중 에러 발생:", error);
    } finally {
      setLoading(false);
      setOpen(false); // 모달 닫기
      setSelectedPreset(null);
    }
  };

  const stopPreset = async () => { // 서버로 stop 신호를 보내는 함수
    try {
      const stopSignal = JSON.stringify({ option: -1 }); //취소신호를 -1로 함 
      console.log("서버로 보내는 데이터:", stopSignal); // 콘솔에 서버로 보낼 데이터 출력 확인용

      const response = await fetch("http://192.168.0.158:5000/user_order", { //이 주소가 맞는지 확인 필요할 듯
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
      {open ?
        <StyledModal>
          <StyledPresetHead>
            <div style={{ flexGrow: 1, marginLeft: '15px' }}>Preset</div>
            <div style={{ color: 'red', marginTop: '-8px', marginRight: '-8px', width: '20px' }} onClick={closeModal}>x</div>
          </StyledPresetHead>
          {["1. 은재민", "2. 송승헌", "3. 김용원", "4. 김요셉"].map((presetContent, presetId) => (
            <StyledPreset
              key={presetId}
              onClick={() => selectPreset(presetId)}
              style={{ backgroundColor: selectedPreset === presetId ? '#a9a9a9' : 'transparent' }} // 조건부 스타일 적용
            >
              {/* <p style={{ margin: '0px', marginLeft: '90px' }}>{presetId}. 정리{presetId}</p> */}
              <p style={{ margin: '0px', marginLeft: '90px' }}>{presetContent}</p>
              {selectedPreset === presetId ? <StyledPreview type="primary" shape="circle" icon={<StyledPreviewIcon />} onClick={(e) => { e.stopPropagation(); closeModal(); }} /> : null}
            </StyledPreset>
          ))}
        </StyledModal> : null
      }
      <StyledFooter>
        <IconButton icon={<MessageOutlined />}></IconButton>
        <IconButton icon={<ShopOutlined />}></IconButton>
        {selectedPreset !== null ? (
          <StyledApplyButton type="primary" onClick={startPreset}>
            Apply
          </StyledApplyButton>
        ) : isDisabled ? (
          <StyledStopButton type="primary" onClick={stopPreset}>
            Stop
          </StyledStopButton> // Preset 작동 시켰을 때 나오는 Stop 버튼 
        ) : (
          <StyledMoveButton type="primary" onClick={showModal}>
            Move
          </StyledMoveButton> // 기존 Preset Move 버튼
        )}
        <IconButton icon={<SettingOutlined />}></IconButton>
        <IconButton icon={<QuestionCircleOutlined />}></IconButton>
        {/* <StyledPreview type="primary" shape="circle" icon={<StyledPreviewIcon />} /> */}
      </StyledFooter>
      {/* <PresetModal open={open} setOpen={setOpen}></PresetModal> */}
    </>
  );
}
