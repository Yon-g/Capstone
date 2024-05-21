import styled from "@emotion/styled";
import { Layout, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";

export const StyledFooter = styled(Layout.Footer)`
  height: 10vh;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 10px;
  background: white;
  position: relative;
  top: 100px;
`;

export const StyledMoveButton = styled(Button)`
  // font-size: 1.2em;
  margin-top: 8px;
  @media (min-width: 820px) and (max-width: 1179px) {
    width : 150px;
    height: 60%;
    font-size: 180%;
    margin-bottom:5px;
  }
`;

export const StyledApplyButton = styled(Button)`
  // font-size: 1.2em;
  margin-top: 8px;
  background-color: #66BB6A   ;
  border-color: #66BB6A   ;

  // 클릭 상태에서 배경색과 테두리 색상 유지
  &:active {
    background-color: #66BB6A   ;
    border-color: #66BB6A   ;
  }

  // 포커스 상태에서 배경색과 테두리 색상 유지
  &:focus {
    background-color: #66BB6A   ;
    border-color: #66BB6A   ;
    outline: none; // 포커스 테두리 제거
  }

  @media (min-width: 820px) and (max-width: 1179px) {
    width : 150px;
    height: 60%;
    font-size: 180%;
    margin-bottom:5px;
  }
`;

export const StyledStopButton = styled(Button)`
  // font-size: 1.2em;
  margin-top: 8px;
  background-color: #ff6347; 
  border-color: #ff6347; 
  font-weight: bold; 

  // 클릭 상태에서 배경색과 테두리 색상 유지
  &:active {
    background-color: #ff6347;
    border-color: #ff6347;
  }

  // 포커스 상태에서 배경색과 테두리 색상 유지
  &:focus {
    background-color: #ff6347;
    border-color: #ff6347;
    outline: none; // 포커스 테두리 제거
  }

  @media (min-width: 820px) and (max-width: 1179px) {
    width : 150px;
    height: 60%;
    font-size: 180%;
    margin-bottom:5px;
  }
`;

export const StyledModal = styled.div`
  background-color: rgba(255, 255, 255, 0.8); // 흰색 배경에 50% 투명도 적용
  width : 25vh; // 상위 요소의 글꼴 크기에 대한 상대적 너비
  height: 25vh; // 상위 요소의 글꼴 크기에 대한 상대적 높이
  display: flex;
  flex-direction: column; // 자식 요소들을 수직 방향으로 정렬합니다.
  position: fixed; // 화면에 고정
  top: 77.5%; // 상단으로부터 50% 위치에 배치
  left: 50%; // 좌측으로부터 50% 위치에 배치
  transform: translate(-50%, -50%); // 중앙 정렬을 위해 자신의 크기의 반만큼 이동
  z-index: 1000; // 다른 요소들 위에 위치하도록 z-index 값을 높임
  border-radius: 4px;
  @media (min-width: 820px) and (max-width: 1179px) {
    top: 78.3%; // 상단으로부터 50% 위치에 배치
  }
`;


export const StyledPreset = styled.div`
  display: flex; /* Flexbox 사용 */
  justify-content: space-between; /* 양 끝에 요소를 배치 */
  align-items: center; /* 세로 중앙 정렬 */
  padding: 6px;
  font-weight: 500;
  &:hover {
    background-color: #d0d0d0; /* 마우스를 올렸을 때의 배경색 */
  }
  height: 20%;
  font-size : 24px;
`;


export const StyledPresetHead = styled.div`
  text-align: center;
  padding: 6px;
  font-weight: 700;
  display: flex;
  justify-content: space-between; /* 모든 자식 요소를 양쪽 끝으로 정렬 */
  width: 98%; /* 전체 너비 사용 */
  height: 20%;
  font-size : 25px;
`;

export const StyledPreview = styled(Button)`
  min-width: 10px;
  width: 15px;
  min-height: 10px;
  height: 15px;
  display: flex; /* Flex 컨테이너 설정 */
  justify-content: center; /* 가로축에서 중앙 정렬 */
  align-items: center; /* 세로축에서 중앙 정렬 */
  background-color: #66BB6A;
  border-color: #66BB6A;
  // 클릭 상태에서 배경색과 테두리 색상 유지
  &:active {
    background-color: #66BB6A;
    border-color: #66BB6A;
  }

  // 포커스 상태에서 배경색과 테두리 색상 유지
  &:focus {
    background-color: #66BB6A;
    border-color: #66BB6A;
    outline: none; /* 포커스 테두리 제거 */
  }

  &:hover {
       background-color: #66BB6A;
       border-color: #66BB6A;
    }

  @media (min-width: 820px) and (max-width: 1179px) {
    height: 40px;
    width: 40px;
  }
`;


export const StyledPreviewIcon = styled(SearchOutlined)`
  // min-width: 10px;
  // width: 15px;
  // min-height: 10px;
  // height: 15px;
  background-color: #66BB6A;
  border-color: #66BB6A;
  // 클릭 상태에서 배경색과 테두리 색상 유지
  &:active {
    background-color: #66BB6A;
    border-color: #66BB6A;
  }

  // 포커스 상태에서 배경색과 테두리 색상 유지
  &:focus {
    background-color: #66BB6A;
    border-color: #66BB6A;
    outline: none; // 포커스 테두리 제거
  }
  @media (min-width: 820px) and (max-width: 1179px) {
    font-size: 170%;
`;
