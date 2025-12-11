import {
  HStack,
  Box,
  Flex,
  Icon,
  IconButton,
  type BoxProps,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa6";
import { RiChatNewLine } from "react-icons/ri";

interface ChatHeaderProps extends BoxProps {
  onChatToolsToggle: () => void;
  onNewChat: () => void;
}

function ChatHeader({ onChatToolsToggle, onNewChat, ...rest }: ChatHeaderProps) {
  return (
    <Box w="100%" bg="transparent" {...rest}>
      <HStack m={2} bg="transparent">
        <Flex w="50%" justify="flex-start" mr="5"></Flex>
        <Flex w="50%" justify="flex-end" mr="5">
          <IconButton
            name="new-chat"
            bg="teal.600"
            mr={2}
            _hover={{ bg: "teal.500" }}
            size="xs"
            variant="solid"
            onClick={onNewChat}
          >
            <Icon>
              <RiChatNewLine />
            </Icon>
          </IconButton>
          <IconButton
            name="chat-tools"
            bg="teal.600"
            _hover={{ bg: "teal.500" }}
            size="xs"
            variant="solid"
            onClick={onChatToolsToggle}
          >
            <Icon>
              <FaPlus />
            </Icon>
          </IconButton>
        </Flex>
      </HStack>
    </Box>
  );
}

export default ChatHeader;
