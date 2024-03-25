import React from "react";
import { StyledIconButton } from "./styles";

import { IconBaseProps } from "@ant-design/icons/lib/components/Icon";

export default function IconButton({ icon }) {
  return <StyledIconButton shape="circle" icon={icon}></StyledIconButton>;
}
