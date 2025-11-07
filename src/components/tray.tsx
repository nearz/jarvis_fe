import { Box, type BoxProps } from "@chakra-ui/react";

interface TrayProps extends BoxProps {
  name: String;
}

function Tray({ ...props }: TrayProps) {
  return <Box p={0} m={0} h="100%" minW="150px" w="150px" {...props}></Box>;
}

export default Tray;
