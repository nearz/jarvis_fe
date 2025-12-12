import SideBar from "./sideBar";
import Tray from "./tray";
import Thread from "./thread";
import { Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import type { ThreadMetaData } from "../api/types";
import { historyService } from "../api/services/historyService";

interface MainNavProps {
  onSelectThread: (threadID: string) => void;
}

function MainNav({ onSelectThread }: MainNavProps) {
  const [activeTray, setActiveTray] = useState<string | null>(null);
  const [callHistory, setCallHistory] = useState(false);

  function handleTrayToggle(trayName: string) {
    setActiveTray(activeTray === trayName ? null : trayName);
    if (trayName === "chats" && activeTray !== "chats") {
      setCallHistory(!callHistory);
    }
  }

  const [threads, setThreads] = useState<ThreadMetaData[]>([]);

  function handleThreadDelete(threadID: string) {
    console.log(`Nav Delete Thread: ${threadID}`);
    setThreads((prevThreads) =>
      prevThreads.filter((thread) => thread.thread_id !== threadID),
    );
  }

  useEffect(() => {
    (async () => {
      console.log("chat history use effect executed.");
      const threadHistory = await historyService.history();
      if (threadHistory.success) {
        setThreads(threadHistory.threads);
      } else {
        console.log("History fetch failed");
      }
    })();
  }, [callHistory]);

  return (
    <>
      <SideBar
        onChatsToggle={() => handleTrayToggle("chats")}
        onTrayTwoToggle={() => handleTrayToggle("two")}
      />
      <Tray
        name="chats"
        bg="gray.800"
        position="absolute"
        left="70px"
        top="0"
        bottom="0"
        w="300px"
        h="100%"
        overflowY="auto"
        m={0}
        p={0}
        zIndex={1}
        transition="all 0.3s"
        transform={
          activeTray === "chats" ? "translateX(0)" : "translateX(-100%)"
        }
        visibility={activeTray === "chats" ? "visible" : "hidden"}
        onMouseLeave={() =>
          activeTray === "chats" ? handleTrayToggle("chats") : null
        }
      >
        <Text m={2} color="teal.500" fontWeight="semibold">
          Chats:
        </Text>
        {threads.map((thread) => (
          <Thread
            key={thread.thread_id}
            threadID={thread.thread_id}
            trayName="one"
            title={thread.title}
            llm={thread.last_llm_used}
            onSelectThread={onSelectThread}
            onDeleteThread={handleThreadDelete}
            onTrayToggle={handleTrayToggle}
            isTrayOpen={activeTray === "chats"}
          />
        ))}
      </Tray>
    </>
  );
}

export default MainNav;
// <SideBar onToggleTray={() => setIsTrayOpen(!isTrayOpen)} />
