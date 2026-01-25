import { useCallback, useState, useEffect } from "react";
import { historyService } from "../api/services/historyService";
import { projectService } from "../api/services/projectService";
import type { ThreadMetaData, ProjectsMetaData } from "../api/types";

export type TrayName = "threads" | "projects";

interface UseMainNavReturn {
  threads: ThreadMetaData[];
  projects: ProjectsMetaData[];
  activeTray: TrayName | null;
  handleTrayToggle: (trayName: TrayName) => void;
  handleThreadDelete: (threadID: string) => void;
  handleProjectDelete: (projectID: string) => void;
  setActiveTray: React.Dispatch<React.SetStateAction<TrayName | null>>;
}

export function useMainNav(): UseMainNavReturn {
  const [threads, setThreads] = useState<ThreadMetaData[]>([]);
  const [projects, setProjects] = useState<ProjectsMetaData[]>([]);
  const [activeTray, setActiveTray] = useState<TrayName | null>(null);

  function handleTrayToggle(trayName: TrayName) {
    const isOpening = activeTray !== trayName;
    setActiveTray(isOpening ? trayName : null);
    if (isOpening) {
      if (trayName === "threads") fetchThreads();
      if (trayName === "projects") fetchProjects();
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

  const fetchThreads = useCallback(async () => {
    const threadList = await historyService.history();
    if (threadList.success) {
      setThreads(threadList.threads);
    } else {
      console.log("Thread list fetch failed");
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    const projectList = await projectService.projects();
    if (projectList.success) {
      setProjects(projectList.projects);
    } else {
      console.log("Projects list fetch failed");
    }
  }, []);

  useEffect(() => {
    fetchThreads();
    fetchProjects();
  }, [fetchThreads, fetchProjects]);

  return {
    threads,
    projects,
    activeTray,
    handleTrayToggle,
    handleThreadDelete,
    handleProjectDelete,
    setActiveTray,
  };
}
