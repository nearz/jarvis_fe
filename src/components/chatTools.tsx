import { Box, type BoxProps } from "@chakra-ui/react";

interface ChatToolsProps extends BoxProps {}

function ChatTools(props: ChatToolsProps) {
  return <Box m={0} h="100%" w="300px" bg="teal.400" {...props}></Box>;
}

export default ChatTools;
