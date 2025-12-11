import { Box, type BoxProps } from "@chakra-ui/react";
import React from "react";

interface TrayProps extends BoxProps {
  name: string;
  children: React.ReactNode;
}

function Tray(props: TrayProps) {
  return <Box {...props}>{props.children}</Box>;
}

export default Tray;
