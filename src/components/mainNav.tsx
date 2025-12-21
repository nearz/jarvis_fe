import SideBar from "./sideBar";
import Tray from "./tray";
import Thread from "./thread";
import NewProject from "./newProject";
import Project from "./project";
import { Text, Box } from "@chakra-ui/react";
import type { ThreadMetaData, ProjectsMetaData } from "../api/types";
import { useState, useEffect, useRef } from "react";
import { historyService } from "../api/services/historyService";
import { projectService } from "../api/services/projectService";

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

  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const CLOSE_DELAY_MS = 1000;

  function handleMouseLeave(trayName: string) {
    closeTimerRef.current = setTimeout(() => {
      if (activeTray === trayName) {
        handleTrayToggle(trayName);
      }
    }, CLOSE_DELAY_MS);
  }

  function handleMouseEnter() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }

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
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => handleMouseLeave("chats")}
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
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => handleMouseLeave("projects")}
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
          ></Project>
        ))}
      </Tray>
    </>
  );
}

export default MainNav;
// <SideBar onToggleTray={() => setIsTrayOpen(!isTrayOpen)} />
