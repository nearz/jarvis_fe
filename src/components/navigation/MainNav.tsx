import SideBar from "./SideBar";
import Tray from "./Tray";
import Thread from "./Thread";
import Project from "./Project";
import { NewProject } from "../project";
import { Text, Box } from "@chakra-ui/react";
import type { ThreadMetaData, ProjectsMetaData } from "../../api/types";
import { useState, useEffect, useCallback } from "react";
import { historyService } from "../../api/services/historyService";
import { projectService } from "../../api/services/projectService";
import { useDelayedClose } from "../../hooks";

interface MainNavProps {
  onSelectThread: (threadID: string) => void;
  onSelectProject: (projectID: string) => void;
}

function MainNav({ onSelectThread, onSelectProject }: MainNavProps) {
  const [activeTray, setActiveTray] = useState<string | null>(null);
  const [threads, setThreads] = useState<ThreadMetaData[]>([]);
  const [callHistory, setCallHistory] = useState(false);
  const [projects, setProjects] = useState<ProjectsMetaData[]>([]);
  const [callProjects, setCallProjects] = useState(false);

  // Close handlers for each tray - use functional setState to get current value
  // and avoid stale closures when the timer fires
  const closeChatsTray = useCallback(() => {
    setActiveTray((current) => (current === "chats" ? null : current));
  }, []);

  const closeProjectsTray = useCallback(() => {
    setActiveTray((current) => (current === "projects" ? null : current));
  }, []);

  // Separate hook instance for each tray
  const chatsTrayCloser = useDelayedClose({
    delay: 1000,
    onClose: closeChatsTray,
  });

  const projectsTrayCloser = useDelayedClose({
    delay: 1000,
    onClose: closeProjectsTray,
  });

  function handleTrayToggle(trayName: string) {
    setActiveTray(activeTray === trayName ? null : trayName);
    if (trayName === "chats" && activeTray !== "chats") {
      setCallHistory(!callHistory);
    }
    if (trayName === "projects" && activeTray !== "projects") {
      setCallProjects(!callProjects);
    }
  }

  function handleThreadDelete(threadID: string) {
    console.log(`Nav Delete Thread: ${threadID}`);
    setThreads((prevThreads) =>
      prevThreads.filter((thread) => thread.thread_id !== threadID),
    );
  }

  function handleProjectDelete(projectID: string) {
    setProjects((prevProjects) =>
      prevProjects.filter((project) => project.project_id !== projectID),
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

  useEffect(() => {
    (async () => {
      console.log("projects use effect executed.");
      const projectList = await projectService.projects();
      if (projectList.success) {
        setProjects(projectList.projects);
      } else {
        console.log("Projects fetch failed");
      }
    })();
  }, [callProjects]);

  return (
    <>
      {activeTray && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="black/60"
          zIndex={5}
          onClick={() => setActiveTray(null)}
          cursor="pointer"
        />
      )}
      <SideBar
        onChatsToggle={() => handleTrayToggle("chats")}
        onTrayTwoToggle={() => handleTrayToggle("projects")}
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
        zIndex={8}
        transition="all 0.3s"
        transform={
          activeTray === "chats" ? "translateX(0)" : "translateX(-100%)"
        }
        visibility={activeTray === "chats" ? "visible" : "hidden"}
        onMouseEnter={chatsTrayCloser.handleMouseEnter}
        onMouseLeave={chatsTrayCloser.handleMouseLeave}
      >
        <Text m={2} color="teal.500" fontWeight="semibold">
          Chats:
        </Text>
        {threads.map((thread) => (
          <Thread
            key={thread.thread_id}
            threadID={thread.thread_id}
            trayName="chats"
            title={thread.title}
            llm={thread.last_llm_used}
            onSelectThread={onSelectThread}
            onDeleteThread={handleThreadDelete}
            onTrayToggle={handleTrayToggle}
            isTrayOpen={activeTray === "chats"}
          />
        ))}
      </Tray>
      <Tray
        name="projects"
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
        zIndex={8}
        transition="all 0.3s"
        transform={
          activeTray === "projects" ? "translateX(0)" : "translateX(-100%)"
        }
        visibility={activeTray === "projects" ? "visible" : "hidden"}
        onMouseEnter={projectsTrayCloser.handleMouseEnter}
        onMouseLeave={projectsTrayCloser.handleMouseLeave}
      >
        <NewProject />
        {projects.map((project) => (
          <Project
            key={project.project_id}
            projectID={project.project_id}
            trayName="projects"
            title={project.title}
            onSelectProject={onSelectProject}
            onDeleteProject={handleProjectDelete}
            onTrayToggle={handleTrayToggle}
            isTrayOpen={activeTray === "projects"}
          />
        ))}
      </Tray>
    </>
  );
}

export default MainNav;
