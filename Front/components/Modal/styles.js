import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

// 나타나는 애니메이션 정의
const slideDown = keyframes`
  from {
    transform: translate(-50%, -60%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, -50%);
    opacity: 1;
  }
`;

// 사라지는 애니메이션 정의
const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -60%); // 위쪽으로 조금 이동
  }
`;

export const StyledModal = styled.div`
    width: 500px;
    height: 60px;
    background-color: rgba(255, 255, 255, 0.8);
    border: 1px solid black;
    display: flex;
    text-align: center;
    flex-direction: column;
    justify-content: center;
    position: absolute;
    top: 11.47%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    border-radius: 8px;
    animation: ${slideDown} 0.5s ease-out, ${fadeOut} 1s ease-out 3s, 3s;  // 나타남과 사라짐을 분리하여 적용
    animation-fill-mode: forwards; // 애니메이션 종료 후 상태 유지
`;

export const StyledMessage = styled.p`
   margin: auto; // 수직 중앙 정렬을 위해 추가
   font-weight: 700; 
   font-size: 150%; 
`;
