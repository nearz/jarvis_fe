import SideBar from "./SideBar";
import Tray from "./Tray";
import Thread from "./Thread";
import Project from "./Project";
import { NewProject } from "../project";
import { Text, Box } from "@chakra-ui/react";
import { useCallback } from "react";
import { useDelayedClose, useMainNav } from "../../hooks";

interface MainNavProps {
  onSelectThread: (threadID: string) => void;
  onSelectProject: (projectID: string) => void;
}

function MainNav({ onSelectThread, onSelectProject }: MainNavProps) {
  const {
    threads,
    projects,
    activeTray,
    handleTrayToggle,
    handleThreadDelete,
    handleProjectDelete,
    setActiveTray,
  } = useMainNav();

  // Close handlers for each tray - use functional setState to get current value
  // and avoid stale closures when the timer fires
  const closeChatsTray = useCallback(() => {
    setActiveTray((current) => (current === "threads" ? null : current));
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
        onChatsToggle={() => handleTrayToggle("threads")}
        onTrayTwoToggle={() => handleTrayToggle("projects")}
      />
      <Tray
        name="threads"
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
          activeTray === "threads" ? "translateX(0)" : "translateX(-100%)"
        }
        visibility={activeTray === "threads" ? "visible" : "hidden"}
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
            trayName="threads"
            title={thread.title}
            llm={thread.last_llm_used}
            onSelectThread={onSelectThread}
            onDeleteThread={handleThreadDelete}
            onTrayToggle={handleTrayToggle}
            isTrayOpen={activeTray === "threads"}
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
