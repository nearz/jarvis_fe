import { Box, Container, List, Text, VStack } from "@chakra-ui/react";

import UserChat from "./userChat";
import ChatHeader from "./chatHeader";
import ChatTools from "./chatTools";
import UserMessage from "./userMessage";
import AiMessage from "./AiMessage";
import ProjectView from "./projectView";
import { useState, useEffect, useRef, useCallback } from "react";
import type { ChatRequest, Message } from "../api/types";
import { chatService } from "../api/services/chatService";
import { historyService } from "../api/services/historyService";
import { projectService } from "../api/services/projectService";

interface ChatProps {
  selectedProjectID: string;
  selectedThreadID: string;
  onSyncIDs: (threadID: string, projectID: string) => void;
}

function Chat({ selectedProjectID, selectedThreadID, onSyncIDs }: ChatProps) {
  const [chatToolsOpen, setChatToolsOpen] = useState(false);
  const [msgList, setMsgList] = useState<Message[]>([]);
  const [streamingMsg, setStreamingMsg] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [threadID, setThreadID] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState("Select Model");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef<boolean>(true);
  const SCROLL_THRESHOLD = 150;
  const isActiveChat = threadID !== "" || msgList.length > 0;

  function handleSelectedModel(name: string) {
    setSelectedModel(name);
  }

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
  // TODO: Not always working, stops while streaming
  useEffect(() => {
    if (isStreaming && shouldAutoScrollRef.current) {
      scrollToBottom("smooth");
    }
  }, [streamingMsg, isStreaming, scrollToBottom]);

  function handleNewChat() {
    setMsgList([]);
    setThreadID("");
    setSelectedModel("Select Model");
    onSyncIDs("", "");
  }

  useEffect(() => {
    setThreadID(selectedThreadID);
    if (!selectedThreadID) {
      setMsgList([]);
    }
  }, [selectedThreadID]);

  useEffect(() => {
    if (!selectedThreadID) return;
    if (selectedThreadID === threadID) return;
    let cancelled = false;
    (async () => {
      try {
        const resp = await historyService.threadHistory(selectedThreadID);
        if (cancelled) return;
        if (resp.success && resp.messages.length > 0) {
          setMsgList(resp.messages);
          setThreadID(selectedThreadID);
          shouldAutoScrollRef.current = true;
          setTimeout(() => scrollToBottom("instant"), 0);
        }
      } catch (err) {
        if (!cancelled) {
          console.log("Error loading thread", err);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedThreadID, scrollToBottom]);

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
    void submitChat(chatRequest);
  }

  async function submitChat(chatRequest: ChatRequest) {
    let stream = null;
    if (selectedProjectID !== "") {
      threadID !== ""
        ? (stream = projectService.projectsChat(
            chatRequest,
            selectedProjectID,
            threadID,
          ))
        : (stream = projectService.projectsNewChat(
            chatRequest,
            selectedProjectID,
          ));
    } else {
      threadID !== ""
        ? (stream = chatService.chat(chatRequest, threadID))
        : (stream = chatService.newChat(chatRequest));
    }
    const fullContent = await streamer(stream);
    setMsgList((prev) => [
      ...prev,
      {
        index: prev.length,
        content: fullContent,
        llm: chatRequest.llm,
        message_type: "ai",
      },
    ]);
    setStreamingMsg("");
  }

  async function streamer(
    stream: AsyncGenerator<any, unknown, void>,
  ): Promise<string> {
    let accumulate = "";
    setIsStreaming(true);
    for await (const chunk of stream) {
      if (chunk.type === "content") {
        accumulate += chunk.text;
        setStreamingMsg(accumulate);
        console.log(chunk);
      } else if (chunk.type === "done") {
        setThreadID(chunk.thread_id);
        onSyncIDs(chunk.thread_id, selectedProjectID);
        console.log(chunk);
      }
    }
    setIsStreaming(false);
    return accumulate;
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
        id="chat-container"
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
          right="0"
          w="40px"
          mr="20px"
          zIndex="10"
          isActiveChat={isActiveChat}
          onNewChat={handleNewChat}
          onChatToolsToggle={() => setChatToolsOpen(!chatToolsOpen)}
        />
        {threadID === "" && selectedProjectID === "" && msgList.length <= 0 ? (
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
              onModelSelect={handleSelectedModel}
              onSubmitChat={handleSubmitChat}
              borderRadiusProps={{ borderRadius: 5 }}
            />
          </VStack>
        ) : selectedProjectID !== "" &&
          threadID === "" &&
          msgList.length <= 0 ? (
          <Box
            position="absolute"
            left="50%"
            top="18%"
            transform="translate(-50%)"
            maxW="2xl"
            w="100%"
          >
            <ProjectView
              onModelSelect={handleSelectedModel}
              selectedModel={selectedModel}
              onThreadSelect={onSyncIDs}
              onSubmitChat={handleSubmitChat}
              selectedProjectID={selectedProjectID}
            />
          </Box>
        ) : (
          <>
            <Box
              ref={scrollContainerRef}
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
                onModelSelect={handleSelectedModel}
                onSubmitChat={handleSubmitChat}
                borderRadiusProps={{ borderTopRadius: 5 }}
              />
            </Box>
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
