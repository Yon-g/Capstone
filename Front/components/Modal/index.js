import React, { useState } from "react";
import { StyledModal, StyledButton, StyledDiv, StyledInput } from "./styles";

export default function PresetModal(props) {
    const [selectedOption, setSelectedOption] = useState(""); // 사용자가 선택한 값을 저장할 상태
    const [loading, setLoading] = useState(false); // 로딩 상태 관리

    const handleOk = async () => {
        setLoading(true);
        try {
            // 여기에 서버로 데이터를 전송하는 코드를 작성합니다.
            const response = await fetch("서버 주소", {
                method: "POST", // 또는 서버에 맞는 메소드
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ option: selectedOption }), // 서버로 전송할 데이터
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
            props.setOpen(false); // 모달 닫기
        }
    };

    const handleCancel = () => {
        props.setOpen(false);
    };

    return (
      <>
        <StyledModal
          open={props.open}
          title="Preset"
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <StyledButton key="back" onClick={handleCancel}>
              Cancel
            </StyledButton>,
            <StyledButton key="submit" type="primary" loading={loading} onClick={handleOk}>
              Apply
            </StyledButton>,
          ]}
        >
          <form>
            <StyledDiv>
              <StyledInput
                id="option1"
                type="radio"
                value="1"
                checked={selectedOption === "1"}
                onChange={(e) => setSelectedOption(e.target.value)}
              />
              <label htmlFor="option1">1. 여기로 이동</label>
            </StyledDiv>
            <br />
            <StyledDiv>
              <StyledInput
                id="option2"
                type="radio"
                value="2"
                checked={selectedOption === "2"}
                onChange={(e) => setSelectedOption(e.target.value)}
              />
              <label htmlFor="option2">2. 저기로 이동</label>
            </StyledDiv>
            <br />
            <StyledDiv>
              <StyledInput
                id="option3"
                type="radio"
                value="3"
                checked={selectedOption === "3"}
                onChange={(e) => setSelectedOption(e.target.value)}
              />
              <label htmlFor="option3">3. 저쪽으로 이동</label>
            </StyledDiv>
            <br />
            <StyledDiv>
              <StyledInput
                id="option4"
                type="radio"
                value="4"
                checked={selectedOption === "4"}
                onChange={(e) => setSelectedOption(e.target.value)}
              />
              <label htmlFor="option4">4. 아무대나 이동</label>
            </StyledDiv>
          </form>
        </StyledModal>
      </>
    );
};

