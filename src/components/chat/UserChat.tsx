import {
  Textarea,
  Container,
  VStack,
  Box,
  HStack,
  Text,
  CloseButton,
} from "@chakra-ui/react";
import { useChatInput } from "../../hooks";
import ChatToolbar from "./ChatToolbar";
import type { ChatRequest } from "../../api/types";
import { truncate } from "../utils/utils";

interface BorderRadiusProps {
  borderRadius?: number | string;
  borderTopRadius?: number | string;
}

interface UserChatProps {
  onModelSelect: (name: string) => void;
  onSubmitChat: (chatRequest: ChatRequest) => void;
  onRemoveAttached?: (emptyString: string) => void;
  attachedFromThread?: string;
  placeholder?: string;
  selectedModel: string;
  borderRadiusProps?: BorderRadiusProps;
}

const UserChat = ({
  onModelSelect,
  onSubmitChat,
  onRemoveAttached,
  attachedFromThread,
  borderRadiusProps,
  placeholder,
  selectedModel,
}: UserChatProps) => {
  const {
    chatMsg,
    textAreaRef,
    canSubmit,
    handleMsgUpdate,
    handleChatSubmit,
    handleChatKeyDown,
  } = useChatInput({
    selectedModel,
    onSubmitChat,
    attachedFromThread,
    onRemoveAttached,
  });

  return (
    <Container p={1} {...borderRadiusProps} bg="gray.800">
      <VStack>
        {attachedFromThread && (
          <Box p={2} bg="gray.700" w="100%" {...borderRadiusProps}>
            <HStack justify="space-between" alignItems="flex-start">
              <Text>{truncate(attachedFromThread, 300)}</Text>
              <CloseButton
                size="2xs"
                variant="outline"
                onClick={() => onRemoveAttached?.("")}
              />
            </HStack>
          </Box>
        )}
        <Textarea
          ref={textAreaRef}
          id="user-chat"
          size="md"
          placeholder={placeholder ?? "Chat..."}
          value={chatMsg}
          onChange={handleMsgUpdate}
          onKeyDown={handleChatKeyDown}
          variant="subtle"
          bg="gray.800"
          autoresize
          maxH="8lh"
          overflowY="auto"
          p={2}
          _focus={{
            boxShadow: "none",
            borderColor: "transparent",
            outline: "none",
          }}
        />
        <ChatToolbar
          selectedModel={selectedModel}
          onModelSelect={onModelSelect}
          onSubmit={handleChatSubmit}
          canSubmit={canSubmit}
        />
      </VStack>
    </Container>
  );
};

export default UserChat;
