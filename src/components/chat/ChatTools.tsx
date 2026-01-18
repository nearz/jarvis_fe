import { Box, type BoxProps } from "@chakra-ui/react";

interface ChatToolsProps extends BoxProps {}

function ChatTools(props: ChatToolsProps) {
  return <Box m={0} h="100%" w="300px" bg="gray.800" {...props}></Box>;
}

export default ChatTools;
