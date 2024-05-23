import React from 'react';
import { StyledModal, StyledMessage } from "./styles";
import { CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

export function MessageModal(props) {
  return (
    <StyledModal>
      <StyledMessage>{props.messageState == 2 ? < CheckCircleOutlined style={{ paddingRight: '5px', color: 'blue' }} /> :
        <ExclamationCircleOutlined style={{ paddingRight: '5px', color: 'red' }} />}
        {props.message}
      </StyledMessage>

    </StyledModal>
  );
}


