import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";


// 애니메이션 정의
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
  }
  to {
    opacity: 0;
  }
`;

export const StyledModal = styled.div`
    width: 500px;
    height: 60px;
    // background: white;
    background-color: rgba(255, 255, 255, 0.8);
    border: 1px solid black;
    position: absolute;
    display: flex;
    flex-direction: column; // 자식 요소들을 수직 방향으로 정렬합니다.
    position: absolute; // 화면에 고정
    top: 11.47%; // 상단으로부터 50% 위치에 배치
    left: 50%; // 좌측으로부터 50% 위치에 배치
    transform: translate(-50%, -50%); // 중앙 정렬을 위해 자신의 크기의 반만큼 이동
    z-index: 1000; // 다른 요소들 위에 위치하도록 z-index 값을 높임
    border-radius: 8px;
    animation:
    ${slideDown} 0.5s ease-out, // 나타나는 애니메이션
    ${fadeOut} 0.5s ease-out 2s; // 3초 뒤 사라지는 애니메이션
    animation-fill-mode: forwards; // 애니메이션 종료 후 상태 유지
`;

