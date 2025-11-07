import { Box, type BoxProps } from "@chakra-ui/react";

interface TrayProps extends BoxProps {
  name: string;
}

function Tray({ ...props }: TrayProps) {
  return <Box {...props}></Box>;
}

export default Tray;
