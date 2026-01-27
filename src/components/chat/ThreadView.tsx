import { Box, Container, List } from "@chakra-ui/react";
import UserChat from "./UserChat";
import UserMessage from "./UserMessage";
import AiMessage from "./AiMessage";
import type { ChatRequest, Message } from "../../api/types";
import { useScrollToBottom, useAutoScroll } from "../../hooks";

interface ThreadViewProps {
  msgList: Message[];
  streamingMsg: string;
  isStreaming: boolean;
  selectedModel: string;
  onModelSelect: (model: string) => void;
  onSubmitChat: (request: ChatRequest) => void;
}

/**
 * View component for displaying an existing chat thread.
 * Shows the message list with auto-scrolling and the chat input.
 */
function ThreadView({
  msgList,
  streamingMsg,
  isStreaming,
  selectedModel,
  onModelSelect,
  onSubmitChat,
}: ThreadViewProps) {
  const { containerRef, scrollToBottom, scrollToBottomIfEnabled, handleScroll } =
    useScrollToBottom({ threshold: 85 });

  // Autoscroll on thread load
  useAutoScroll(scrollToBottom, [msgList]);
  // Autoscroll on streaming if user is within threshold (instant to avoid race conditions)
  useAutoScroll(scrollToBottomIfEnabled, [streamingMsg], { behavior: "instant" });

  return (
    <>
      <Box
        ref={containerRef}
        onScroll={handleScroll}
        flex="1"
        top="0px"
        position="relative"
        overflowY="auto"
        overflowX="hidden"
        css={{
          scrollbarColor:
            "var(--chakra-colors-gray-600) var(--chakra-colors-gray-900)",
        }}
      >
        <Container
          position="absolute"
          left="50%"
          transform="translate(-50%)"
          mx={3}
          px={2}
          maxW="3xl"
          w="3xl"
          paddingBottom="150px"
        >
          <List.Root listStyleType="none" paddingLeft={0}>
            {msgList.map((msg, index) =>
              msg.message_type === "user" ? (
                <List.Item key={index}>
                  <UserMessage content={msg.content} />
                </List.Item>
              ) : (
                <List.Item key={index}>
                  <AiMessage content={msg.content} />
                </List.Item>
              ),
            )}
            {isStreaming && (
              <List.Item>
                <AiMessage content={streamingMsg} />
              </List.Item>
            )}
          </List.Root>
        </Container>
      </Box>
      <Box
        maxW="3xl"
        w="full"
        position="absolute"
        bottom={0}
        left="50%"
        transform="translate(-50%)"
      >
        <UserChat
          selectedModel={selectedModel}
          onModelSelect={onModelSelect}
          onSubmitChat={onSubmitChat}
          borderRadiusProps={{ borderTopRadius: 5 }}
        />
      </Box>
    </>
  );
}

export default ThreadView;
