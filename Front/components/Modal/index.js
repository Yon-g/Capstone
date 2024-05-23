import React from 'react';
import { StyledModal, StyledMessage } from "./styles";
import { CheckCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined, StopOutlined } from "@ant-design/icons";

export function MessageModal(props) {
  return (
    <StyledModal>
      <StyledMessage> {props.messageState === 5 ? (
        <StopOutlined style={{ paddingRight: '5px', color: 'red' }} />
      ) : props.messageState === 7 ? (
        <ExclamationCircleOutlined style={{ paddingRight: '5px', color: 'orange', fontWeight: '900' }} />
      ) : props.messageState === 8 ? (
        <CheckCircleOutlined style={{ paddingRight: '5px', color: '#4CAF50', fontWeight: '900' }} />
      ) : props.messageState === 9 ? (
        <CloseCircleOutlined style={{ paddingRight: '5px', color: 'red', fontWeight: '900' }} />
      ) : null}
        {props.message}
      </StyledMessage>

    </StyledModal>
  );
}