import { Box } from "@chakra-ui/react";
import MainViewHeader from "./MainViewHeader";
import Tools from "../chat/Tools";
import NewThreadView from "../chat/NewThreadView";
import ThreadView from "../chat/ThreadView";
import { ProjectView } from "../project";
import { useState, useRef, useEffect } from "react";
import { useChatStream, useThreadLoader, useTools } from "../../hooks";
import type { Message, ViewState } from "../../api/types";

interface MainViewProps {
  selectedProjectID: string;
  selectedThreadID: string;
  onSyncIDs: (threadID: string, projectID: string) => void;
}

//TODO: Switching between threads, leaves existing thread msgs until thread is loaded. Ways to improve?

const TOOLS_WIDTH = "350px";

function MainView({
  selectedProjectID,
  selectedThreadID,
  onSyncIDs,
}: MainViewProps) {
  const threadContainerRef = useRef<HTMLDivElement | null>(null);
  const [selectedModel, setSelectedModel] = useState("Select Model");
  const [msgList, setMsgList] = useState<Message[]>([]);

  // Derive view state
  const viewState: ViewState =
    selectedThreadID === "" && msgList.length === 0
      ? selectedProjectID !== ""
        ? "project"
        : "new-thread"
      : "thread";

  const { streamingMsg, isStreaming, handleSubmitChat, clearMessages } =
    useChatStream({
      threadID: selectedThreadID,
      projectID: selectedProjectID,
      onThreadCreated: (threadID) => {
        onSyncIDs(threadID, selectedProjectID);
      },
      setMsgList,
    });

  useThreadLoader({
    selectedThreadID,
    onThreadLoaded: (messages) => {
      setMsgList(messages);
    },
    onThreadCleared: () => {
      setMsgList([]);
    },
  });

  const { toolsOpen, toggleTools, closeTools, threadMarks, scrollToMark } =
    useTools({ threadContainerRef, msgList, isStreaming });

  // Close Tools when leaving the thread view
  useEffect(() => {
    if (viewState !== "thread") {
      closeTools();
    }
  }, [viewState, closeTools]);

  const handleNewChat = () => {
    clearMessages();
    setSelectedModel("Select Model");
    onSyncIDs("", "");
  };

  return (
    <Box
      display="grid"
      gridTemplateColumns={toolsOpen ? `1fr ${TOOLS_WIDTH}` : "1fr 0px"}
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
          zIndex="1"
          viewState={viewState}
          onNewChat={handleNewChat}
          onToolsToggle={toggleTools}
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
            containerRef={threadContainerRef}
            onModelSelect={setSelectedModel}
            onSubmitChat={handleSubmitChat}
          />
        )}
      </Box>

      <Tools
        toolsWidth={TOOLS_WIDTH}
        onMarkClick={scrollToMark}
        threadMarks={threadMarks}
        transition="all 0.3s"
        transform={toolsOpen ? "translateX(0)" : "translateX(100%)"}
      />
    </Box>
  );
}

export default MainView;
