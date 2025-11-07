import { Box, type BoxProps } from "@chakra-ui/react";

interface ChatToolsProps extends BoxProps {}

function ChatTools({ ...props }: ChatToolsProps) {
  return <Box m={0} h="100%" minW="300px" w="150px" {...props}></Box>;
}

export default ChatTools;
