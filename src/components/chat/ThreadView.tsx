import { Box, Container, IconButton, List } from "@chakra-ui/react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa6";
import UserChat from "./UserChat";
import UserMessage from "./UserMessage";
import AiMessage from "./AiMessage";
import type { ChatRequest, Message } from "../../api/types";
import {
  useScrollToBottom,
  useAutoScroll,
  useUserMessageNavigation,
} from "../../hooks";

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
  const {
    containerRef,
    scrollToBottom,
    scrollToBottomIfEnabled,
    handleScroll,
  } = useScrollToBottom({ threshold: 85 });

  const { navigateUp, navigateDown, isAtTop, isAtBottom } =
    useUserMessageNavigation({ containerRef, scrollToBottom });

  // Autoscroll on thread load
  useAutoScroll(scrollToBottom, [msgList]);
  // Autoscroll on streaming if user is within threshold (instant to avoid race conditions)
  useAutoScroll(scrollToBottomIfEnabled, [streamingMsg], {
    behavior: "instant",
  });

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
                <List.Item key={index} data-user-msg-index={index}>
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
        <Box
          position="absolute"
          right={0}
          bottom={2}
          transform="translateX(calc(100% + 8px))"
          display="flex"
          flexDirection="column"
          gap={1}
        >
          <IconButton
            aria-label="Previous user message"
            size="xs"
            variant="ghost"
            // _hover={{ bg: isAtTop ? "transparent" : "teal.800" }}
            _hover={{ bg: "teal.700" }}
            visibility={isAtTop ? "hidden" : "visible"}
            onClick={navigateUp}
          >
            <FaChevronUp />
          </IconButton>
          <IconButton
            aria-label="Next user message"
            size="xs"
            variant="ghost"
            _hover={{ bg: "teal.700" }}
            visibility={isAtBottom ? "hidden" : "visible"}
            onClick={navigateDown}
          >
            <FaChevronDown />
          </IconButton>
        </Box>
      </Box>
    </>
  );
}

export default ThreadView;
