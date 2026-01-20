import { Text, VStack } from "@chakra-ui/react";
import UserChat from "./UserChat";
import type { ChatRequest } from "../../api/types";

interface NewThreadViewProps {
  selectedModel: string;
  onModelSelect: (model: string) => void;
  onSubmitChat: (request: ChatRequest) => void;
}

/**
 * View component for starting a new chat thread.
 * Displays a welcome message and the chat input.
 */
function NewThreadView({
  selectedModel,
  onModelSelect,
  onSubmitChat,
}: NewThreadViewProps) {
  return (
    <VStack
      position="absolute"
      left="50%"
      bottom="45%"
      transform="translate(-50%)"
      maxW="xl"
      w="100%"
    >
      <Text fontSize="3xl">How can I assist you today?</Text>
      <UserChat
        selectedModel={selectedModel}
        onModelSelect={onModelSelect}
        onSubmitChat={onSubmitChat}
        borderRadiusProps={{ borderRadius: 5 }}
      />
    </VStack>
  );
}

export default NewThreadView;
