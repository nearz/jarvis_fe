import { VStack, Icon, IconButton, type StackProps } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa6";
import { RiChatNewLine } from "react-icons/ri";
import type { ViewState } from "./Chat";

interface ChatHeaderProps extends StackProps {
  viewState: ViewState;
  onChatToolsToggle: () => void;
  onNewChat: () => void;
}

function ChatHeader({
  viewState,
  onChatToolsToggle,
  onNewChat,
  ...rest
}: ChatHeaderProps) {
  return (
    <VStack
      bg="transparent"
      gap={2}
      align="center"
      justify="flex-start"
      py={2}
      {...rest}
    >
      <IconButton
        aria-label="New chat"
        bg="teal.600"
        _hover={{ bg: "teal.500" }}
        size="xs"
        variant="solid"
        onClick={onNewChat}
      >
        <Icon>
          <RiChatNewLine />
        </Icon>
      </IconButton>
      {viewState !== "thread" ? null : (
        <IconButton
          aria-label="Chat tools"
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
      )}
    </VStack>
  );
}

export default ChatHeader;
