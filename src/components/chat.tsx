import { Box, Container, List, Text, VStack } from "@chakra-ui/react";

import UserChat from "./userChat";
import ChatHeader from "./chatHeader";
import ChatTools from "./chatTools";
import UserMessage from "./userMessage";
import AiMessage from "./AiMessage";
import { useState, useEffect, useRef, useCallback } from "react";
import type { ChatRequest, Message } from "../api/types";
import { chatService } from "../api/services/chatService";
import { historyService } from "../api/services/historyService";

interface ChatProps {
  selectedThreadID: string | null;
  onNewChat: (emptyThreadID: string) => void;
}

function Chat({ selectedThreadID, onNewChat }: ChatProps) {
  const [chatToolsOpen, setChatToolsOpen] = useState(false);
  const [msgList, setMsgList] = useState<Message[]>([]);
  const [streamingMsg, setStreamingMsg] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [threadID, setThreadID] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef<boolean>(true);
  const SCROLL_THRESHOLD = 150;

  const isNearBottom = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return true;
    const { scrollTop, scrollHeight, clientHeight } = container;
    return scrollHeight - scrollTop - clientHeight < SCROLL_THRESHOLD;
  }, []);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior,
      });
    }
  }, []);

  const handleScroll = useCallback(() => {
    shouldAutoScrollRef.current = isNearBottom();
  }, [isNearBottom]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (shouldAutoScrollRef.current) {
      scrollToBottom("smooth");
    }
  }, [msgList, scrollToBottom]);

  // Auto-scroll during streaming
  useEffect(() => {
    if (isStreaming && shouldAutoScrollRef.current) {
      scrollToBottom("smooth");
    }
  }, [streamingMsg, isStreaming, scrollToBottom]);

  useEffect(() => {
    if (selectedThreadID !== null) {
      (async () => {
        const resp = await historyService.threadHistory(selectedThreadID);
        if (resp.success && resp.messages.length > 0) {
          setMsgList(resp.messages);
          setThreadID(selectedThreadID);
          shouldAutoScrollRef.current = true;
          setTimeout(() => scrollToBottom("instant"), 0);
        } else {
          console.log("Error loading thread");
        }
      })();
    }
  }, [selectedThreadID, scrollToBottom]);

  function handleNewChat() {
    setMsgList([]);
    setThreadID(null);
    onNewChat("");
  }

  function handleSubmitChat(chatRequest: ChatRequest) {
    //Need to move new message to after api call so that it does not add it until call success.
    shouldAutoScrollRef.current = true;
    setMsgList((prev) => [
      ...prev,
      {
        index: prev.length,
        content: chatRequest.message,
        llm: chatRequest.llm,
        message_type: "user",
      },
    ]);

    (async () => {
      let accumulate = "";
      setIsStreaming(true);
      let stream = null;
      if (threadID === null) {
        stream = chatService.newChat(chatRequest);
      } else {
        stream = chatService.chat(chatRequest, threadID);
      }
      for await (const chunk of stream) {
        if (chunk.type === "content") {
          accumulate += chunk.text;
          setStreamingMsg(accumulate);
          console.log(chunk);
        } else if (chunk.type === "done") {
          setThreadID(chunk.thread_id);
          console.log(chunk);
        }
      }
      setIsStreaming(false);
      setMsgList((prev) => [
        ...prev,
        {
          index: prev.length,
          content: accumulate,
          llm: chatRequest.llm,
          message_type: "ai",
        },
      ]);
      setStreamingMsg("");
    })();
  }

  return (
    <Box
      display="grid"
      gridTemplateColumns={chatToolsOpen ? "1fr 300px" : "1fr 0px"}
      h="100%"
      w="100%"
      flex="1"
      transition="all 0.3s"
      overflow="hidden"
    >
      <Box
        bg="gray.900"
        position="relative"
        h="100%"
        w="100%"
        display="flex"
        flexDirection="column"
      >
        <ChatHeader
          position="absolute"
          top="0"
          left="0"
          right="0"
          zIndex="10"
          onNewChat={handleNewChat}
          onChatToolsToggle={() => setChatToolsOpen(!chatToolsOpen)}
        />
        {msgList.length === 0 && threadID === null ? (
          <VStack
            position="absolute"
            left="50%"
            bottom="45%"
            transform="translate(-50%)"
            maxW="3xl"
            w="100%"
          >
            <Text fontSize="3xl">How can I assist you today?</Text>
            <UserChat
              position="relative"
              onSubmitChat={handleSubmitChat}
              borderRadiusProps={{ borderRadius: 5 }}
            />
          </VStack>
        ) : (
          <>
            <Box
              ref={scrollContainerRef}
              onScroll={handleScroll}
              flex="1"
              top="0px"
              position="relative"
              overflowY="auto"
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
            <UserChat
              position="absolute"
              bottom="0px"
              onSubmitChat={handleSubmitChat}
              borderRadiusProps={{ borderTopRadius: 5 }}
            />
          </>
        )}
      </Box>
      <ChatTools
        transition="all 0.3s"
        transform={chatToolsOpen ? "translateX(0)" : "translateX(100%)"}
        // onMouseLeave={() => setChatToolsOpen(false)}
      />
    </Box>
  );
}

export default Chat;
