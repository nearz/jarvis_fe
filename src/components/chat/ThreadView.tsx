import { Box, Container, IconButton, List, Button } from "@chakra-ui/react";
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
import { useState, useEffect } from "react";

interface ThreadViewProps {
  msgList: Message[];
  streamingMsg: string;
  isStreaming: boolean;
  selectedModel: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
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
  containerRef,
  onModelSelect,
  onSubmitChat,
}: ThreadViewProps) {
  const { scrollToBottom, scrollToBottomIfEnabled, handleScroll } =
    useScrollToBottom({ threshold: 85, containerRef });

  const { navigateUp, navigateDown, isAtTop, isAtBottom } =
    useUserMessageNavigation({ containerRef, scrollToBottom });

  // Autoscroll on thread load
  useAutoScroll(scrollToBottom, [msgList]);
  // Autoscroll on streaming if user is within threshold (instant to avoid race conditions)
  useAutoScroll(scrollToBottomIfEnabled, [streamingMsg], {
    behavior: "instant",
  });

  //TODO: Use state? How would I change if selection is removed?
  const [isHilighted, setIsHilighted] = useState(false);
  const [hlx, setHLX] = useState(0);
  const [hly, setHLY] = useState(0);
  const [attachedText, setAttachedText] = useState("");

  const clearHighlights = () => {
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
    }
    setIsHilighted(false);
    setHLY(0);
    setHLX(0);
  };

  const handleHilighted = () => {
    const sel = window.getSelection();
    if (sel && !sel.isCollapsed && sel.rangeCount > 0 && containerRef.current) {
      const range = sel.getRangeAt(0);
      setAttachedText(range.toString());
      clearHighlights();
    }
  };

  const attachHilightBtn = () => {
    const sel = window.getSelection();
    if (sel && !sel.isCollapsed && sel.rangeCount > 0 && containerRef.current) {
      const range = sel.getRangeAt(0);
      const rects = range.getClientRects();
      const fistRect = rects[0];
      const parentRect = containerRef.current?.getBoundingClientRect();
      setIsHilighted(true);
      setHLX(fistRect.x - parentRect.x);
      setHLY(fistRect.y - parentRect.y + containerRef.current.scrollTop);
    }
  };

  useEffect(() => {
    const handleSelectionChange = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) {
        setIsHilighted(false);
      }
    };
    document.addEventListener("selectionchange", handleSelectionChange);
    return () =>
      document.removeEventListener("selectionchange", handleSelectionChange);
  }, []);

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
        onMouseLeave={clearHighlights}
        css={{
          scrollbarColor:
            "var(--chakra-colors-gray-600) var(--chakra-colors-gray-900)",
        }}
      >
        {isHilighted && (
          <Button
            position="absolute"
            bg="teal.600"
            _hover={{ bg: "teal.500" }}
            color="white"
            fontWeight="bold"
            top={hly}
            left={hlx}
            zIndex={10}
            transform="translate(0%, -110%)"
            onClick={handleHilighted}
          >
            Ask Jarvis
          </Button>
        )}
        <Container
          position="absolute"
          left="50%"
          transform="translate(-50%)"
          mx={3}
          px={2}
          maxW="3xl"
          w="3xl"
          paddingBottom="150px"
          onMouseUp={attachHilightBtn}
        >
          <List.Root listStyleType="none" paddingLeft={0}>
            {msgList.map((msg, index) =>
              msg.message_type === "user" ? (
                <List.Item key={index} data-user-msg-index={index}>
                  <UserMessage
                    msgID={msg.message_id}
                    content={msg.content}
                    attachedContext={msg.attached_context}
                  />
                </List.Item>
              ) : (
                <List.Item key={index} data-ai-msg-index={index}>
                  <AiMessage msgID={msg.message_id} content={msg.content} />
                </List.Item>
              ),
            )}
            {isStreaming && (
              <List.Item>
                <AiMessage msgID={"temp-streaming"} content={streamingMsg} />
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
          attachedFromThread={attachedText}
          selectedModel={selectedModel}
          onModelSelect={onModelSelect}
          onSubmitChat={onSubmitChat}
          onRemoveAttached={setAttachedText}
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
          {!isStreaming && (
            <>
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
            </>
          )}
        </Box>
      </Box>
    </>
  );
}

export default ThreadView;
