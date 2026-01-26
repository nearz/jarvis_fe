import { Textarea, Container, VStack } from "@chakra-ui/react";
import { useChatInput } from "../../hooks";
import ChatToolbar from "./ChatToolbar";
import type { ChatRequest } from "../../api/types";

interface BorderRadiusProps {
  borderRadius?: number | string;
  borderTopRadius?: number | string;
}

interface UserChatProps {
  onModelSelect: (name: string) => void;
  onSubmitChat: (chatRequest: ChatRequest) => void;
  placeholder?: string;
  selectedModel: string;
  borderRadiusProps?: BorderRadiusProps;
}

const UserChat = ({
  onModelSelect,
  onSubmitChat,
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
  } = useChatInput({ selectedModel, onSubmitChat });

  return (
    <Container p={1} {...borderRadiusProps} bg="gray.800">
      <VStack>
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
