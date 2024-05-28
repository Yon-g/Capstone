import React, { useEffect, useState } from "react";
import { StyledFooter, StyledMoveButton, StyledStopButton, StyledModal, StyledPreset, StyledPresetHead, StyledApplyButton, StyledPreview, StyledPreviewIcon, styledIconButton } from "./styles";
import IconButton from "../IconButtonComponent";
import { MessageModal } from "../Modal";
import { MessageOutlined, ShopOutlined, SettingOutlined, QuestionCircleOutlined } from "@ant-design/icons";

export default function FooterComponents({ order, setPreview, setPreviewTurtlebotsPos, previewTurtlebotsPos, messageOrder, setMessageOrder, message, messageState }) {
  const isDisabled = (order == 7);
  const [open, setOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null); // 선택된 프리셋의 상태
  const [loading, setLoading] = useState(false); // 로딩 상태 관리

  const showModal = () => {
    if (open == false)
      setOpen(true);
    else setOpen(false);
  };

  const selectPreset = (presetId) => {
    setSelectedPreset(presetId); // 선택된 프리셋의 ID를 상태로 저장`
  };

  const closeModal = () => {
    setOpen(false);
    setSelectedPreset(null);
    setPreview(false);
    console.log(selectedPreset);
  };

  const startPreset = async () => {
    setLoading(true);
    const order = selectedPreset + 1;
    try {
      // 여기에 서버로 데이터를 전송하는 코드를 작성
      const response = await fetch("http://192.168.0.158:5000/user_order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ option: order }), // 서버로 전송할 데이터
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
      const stopSignal = JSON.stringify({ option: 5 }); //취소신호를 5로 함 
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

  const previewMarker = async (presetId) => {
    // setPreviewTurtlebotsPos([{ id: 1, lat: 5, lng: 5, heading: 0 }, { id: 2, lat: 90, lng: 90, heading: 0 }, { id: 3, lat: 100, lng: 3, heading: 0 }, { id: 4, lat: 3, lng: 100, heading: 0 }]);
    // setPreview(true);
    // console.log(previewTurtlebotsPos[presetId]);

    // 재민이랑 얘기해보고 미리보기 통신해야함
    try {
      // 서버에 presetId 값을 전송하여 위치 정보를 요청
      const response = await fetch("http://192.168.0.130:5000/preview_post/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ option: presetId }), // 서버로 presetId 값을 보냄
      });
      if (!response.ok) {
        throw new Error("서버 오류");
      }
      // 서버로부터 받은 위치 정보
      const data = await response.json();
      console.log(data); // 서버로부터 받은 데이터 확인

      // 받은 위치 정보를 상태에 저장하여 화면에 표시
      const previewTurtlebots = data.map((previewturtlebot) => {
        return {
          id: previewturtlebot.id,
          lat: previewturtlebot.x,
          lng: previewturtlebot.y,
          heading: previewturtlebot.heading
        };
      });
      setPreviewTurtlebotsPos(previewTurtlebots);
      setPreview(true);
    } catch (error) {
      console.error("Preset position fetching error: ", error);
    }
    console.log("서버로 보내는 데이터:", presetId); // 콘솔에 서버로 보낼 데이터 출력 확인용
  };

  // const showModal = () => {
  //   if (messageOrder == true)
  //     setMessageOrder(false);
  //   else
  //     setMessageOrder(true);
  //   console.log(messageOrder);
  // };

  useEffect(() => { }, [open]);

  return (
    <>
      {open ?
        <StyledModal>
          <StyledPresetHead>
            <div style={{ flexGrow: 1, marginLeft: '15px' }}>Preset</div>
            <div style={{ color: 'red', marginTop: '-8px', marginRight: '-8px', width: '20px' }} onClick={closeModal}>x</div>
          </StyledPresetHead>
          {["1. 프리셋1", "2. 프리셋2", "3. 프리셋3", "4. 프리셋4"].map((presetContent, presetId) => (
            <StyledPreset
              key={presetId}
              onClick={() => { selectPreset(presetId); setPreview(false); }}
              style={{ backgroundColor: selectedPreset === presetId ? '#cccccc' : 'transparent' }} // 조건부 스타일 적용
            >
              {/* <p style={{ margin: '0px', marginLeft: '90px' }}>{presetId}. 정리{presetId}</p> */}
              <p style={{ margin: '0px', marginLeft: '90px' }}>{presetContent}</p>
              {selectedPreset === presetId ? <StyledPreview type="primary" shape="circle" icon={<StyledPreviewIcon />} onClick={(e) => { e.stopPropagation(); previewMarker(presetId + 1); }} /> : null}
            </StyledPreset>
          ))}
        </StyledModal> : null
      }
      {messageOrder ? <MessageModal message={message} messageState={messageState}> </MessageModal> : null}
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
        <IconButton icon={<QuestionCircleOutlined />} onClick={showModal}></IconButton>
      </StyledFooter>

    </>
  );
}
