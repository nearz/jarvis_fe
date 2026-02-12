import { Box } from "@chakra-ui/react";
import MainViewHeader from "./MainViewHeader";
import ChatTools from "../chat/ChatTools";
import NewThreadView from "../chat/NewThreadView";
import ThreadView from "../chat/ThreadView";
import { ProjectView } from "../project";
import { useState, useRef } from "react";
import { useChatStream, useThreadLoader } from "../../hooks";
import type { Message, ViewState } from "../../api/types";

interface MainViewProps {
  selectedProjectID: string;
  selectedThreadID: string;
  onSyncIDs: (threadID: string, projectID: string) => void;
}

//TODO: Switching between threads, leaves existing thread msgs until thread is loaded. Ways to improve?

export type ThreadMark = {
  type: string;
  elemID: string;
  content: string;
};

function MainView({
  selectedProjectID,
  selectedThreadID,
  onSyncIDs,
}: MainViewProps) {
  // -> TODO: Probably move to custom hook
  const threadContainerRef = useRef<HTMLDivElement | null>(null);
  const [selectedMarkID, setSelectedMarkID] = useState("");

  // <- TODO: Probably move to custom hook
  const [chatToolsOpen, setChatToolsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("Select Model");
  const [msgList, setMsgList] = useState<Message[]>([]);

  const { streamingMsg, isStreaming, handleSubmitChat, clearMessages } =
    useChatStream({
      threadID: selectedThreadID,
      projectID: selectedProjectID,
      onThreadCreated: (threadID) => {
        onSyncIDs(threadID, selectedProjectID);
      },
      setMsgList,
    });

  const { loading: threadLoading } = useThreadLoader({
    selectedThreadID,
    onThreadLoaded: (messages) => {
      setMsgList(messages);
    },
    onThreadCleared: () => {
      setMsgList([]);
    },
  });

  // -> TODO: Probably move to custom hook
  //How to handle headers?
  //pass to chat tools component
  //Do I need to check loading for Thread Loader?
  //Really should I be checking isStreaming?
  //Should be a handler for button to toggle chat tools.
  //Should ref be cleared on new chat and new load?
  //Chat tools renders just is hidden. Can I improve this, only render on open?
  const threadMarks = useRef<ThreadMark[]>([]);
  const handleChatToolsOpen = () => {
    if (!threadLoading && !isStreaming) {
      if (!chatToolsOpen) {
        const container = threadContainerRef.current;
        if (!container) return;
        const ctMarks =
          container.querySelectorAll<HTMLElement>("[data-ct-mark]");
        threadMarks.current = [];
        ctMarks.forEach((el) => {
          threadMarks.current.push({
            type: el.dataset.threadMsgType ?? "",
            elemID: el.dataset.ctMark ?? "",
            content: el.textContent ?? "",
          });
        });
      }
      setChatToolsOpen(!chatToolsOpen);
    }
  };
  // <- TODO: Move to custom hook

  // Derive view state
  const viewState: ViewState =
    selectedThreadID === "" && msgList.length === 0
      ? selectedProjectID !== ""
        ? "project"
        : "new-thread"
      : "thread";

  const handleNewChat = () => {
    clearMessages();
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
          onChatToolsToggle={handleChatToolsOpen}
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
            selectedMarkID={selectedMarkID}
            containerRef={threadContainerRef}
            onModelSelect={setSelectedModel}
            onSubmitChat={handleSubmitChat}
          />
        )}
      </Box>

      <ChatTools
        onMarkID={setSelectedMarkID}
        threadMarks={threadMarks.current}
        transition="all 0.3s"
        transform={chatToolsOpen ? "translateX(0)" : "translateX(100%)"}
      />
    </Box>
  );
}

export default MainView;
