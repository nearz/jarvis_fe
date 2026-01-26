import { Box } from "@chakra-ui/react";
import MainViewHeader from "./MainViewHeader";
import ChatTools from "../chat/ChatTools";
import NewThreadView from "../chat/NewThreadView";
import ThreadView from "../chat/ThreadView";
import { ProjectView } from "../project";
import { useState } from "react";
import { useChatStream, useThreadLoader } from "../../hooks";
import type { Message, ViewState } from "../../api/types";

interface MainViewProps {
  selectedProjectID: string;
  selectedThreadID: string;
  onSyncIDs: (threadID: string, projectID: string) => void;
}

function MainView({
  selectedProjectID,
  selectedThreadID,
  onSyncIDs,
}: MainViewProps) {
  const [chatToolsOpen, setChatToolsOpen] = useState(false);
  const [threadID, setThreadID] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState("Select Model");
  const [msgList, setMsgList] = useState<Message[]>([]);

  const { streamingMsg, isStreaming, handleSubmitChat, clearMessages } =
    useChatStream({
      threadID,
      projectID: selectedProjectID,
      onThreadCreated: (id) => {
        setThreadID(id);
        onSyncIDs(id, selectedProjectID);
      },
      setMsgList,
    });

  useThreadLoader({
    selectedThreadID,
    currentThreadID: threadID,
    onThreadLoaded: (messages, id) => {
      setMsgList(messages);
      setThreadID(id);
    },
    onThreadCleared: () => {
      setMsgList([]);
      setThreadID("");
    },
  });

  // Derive view state
  const viewState: ViewState =
    threadID === "" && msgList.length === 0
      ? selectedProjectID !== ""
        ? "project"
        : "new-thread"
      : "thread";

  const handleNewChat = () => {
    clearMessages();
    setThreadID("");
    setSelectedModel("Select Model");
    onSyncIDs("", "");
  };

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
        <MainViewHeader
          position="absolute"
          top="0"
          right="0"
          w="40px"
          mr="20px"
          zIndex="10"
          viewState={viewState}
          onNewChat={handleNewChat}
          onChatToolsToggle={() => setChatToolsOpen(!chatToolsOpen)}
        />

        {viewState === "new-thread" && (
          <NewThreadView
            selectedModel={selectedModel}
            onModelSelect={setSelectedModel}
            onSubmitChat={handleSubmitChat}
          />
        )}

        {viewState === "project" && (
          <ProjectView
            onModelSelect={setSelectedModel}
            selectedModel={selectedModel}
            onThreadSelect={onSyncIDs}
            onSubmitChat={handleSubmitChat}
            selectedProjectID={selectedProjectID}
          />
        )}

        {viewState === "thread" && (
          <ThreadView
            msgList={msgList}
            streamingMsg={streamingMsg}
            isStreaming={isStreaming}
            selectedModel={selectedModel}
            onModelSelect={setSelectedModel}
            onSubmitChat={handleSubmitChat}
          />
        )}
      </Box>

      <ChatTools
        transition="all 0.3s"
        transform={chatToolsOpen ? "translateX(0)" : "translateX(100%)"}
      />
    </Box>
  );
}

export default MainView;
