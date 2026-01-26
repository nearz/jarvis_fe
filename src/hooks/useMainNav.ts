import { useCallback, useState, useEffect } from "react";
import { historyService } from "../api/services/historyService";
import { projectService } from "../api/services/projectService";
import type { ThreadMetaData, ProjectsMetaData } from "../api/types";

/** Available tray names for the main navigation */
export type TrayName = "threads" | "projects";

interface UseMainNavReturn {
  /** List of thread metadata for the threads tray */
  threads: ThreadMetaData[];
  /** List of project metadata for the projects tray */
  projects: ProjectsMetaData[];
  /** Currently active/open tray, or null if none */
  activeTray: TrayName | null;
  /** Toggle a tray open/closed - fetches data when opening */
  handleTrayToggle: (trayName: TrayName) => void;
  /** Remove a thread from the list after confirmed server deletion */
  handleThreadDelete: (threadID: string) => void;
  /** Remove a project from the list after confirmed server deletion */
  handleProjectDelete: (projectID: string) => void;
  /** Refetch projects when new one is created*/
  handleNewProject: () => void;
  /** Direct setter for active tray state (useful for delayed close) */
  setActiveTray: React.Dispatch<React.SetStateAction<TrayName | null>>;
}

/**
 * Hook to manage main navigation state including threads and projects trays.
 *
 * Handles:
 * - Fetching and storing threads and projects lists
 * - Toggling tray visibility
 * - Local state updates for thread/project deletion
 * - Initial data fetch on mount
 *
 * @example
 * ```tsx
 * // Basic usage with MainNav component
 * function MainNav({ onSelectThread, onSelectProject }) {
 *   const {
 *     threads,
 *     projects,
 *     activeTray,
 *     handleTrayToggle,
 *     handleThreadDelete,
 *     handleProjectDelete,
 *     setActiveTray,
 *   } = useMainNav();
 *
 *   return (
 *     <>
 *       <SideBar
 *         onChatsToggle={() => handleTrayToggle("threads")}
 *         onProjectsToggle={() => handleTrayToggle("projects")}
 *       />
 *       <Tray isOpen={activeTray === "threads"}>
 *         {threads.map((thread) => (
 *           <Thread
 *             key={thread.thread_id}
 *             onDelete={() => handleThreadDelete(thread.thread_id)}
 *           />
 *         ))}
 *       </Tray>
 *     </>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With delayed close using setActiveTray
 * const { setActiveTray } = useMainNav();
 *
 * const closeChatsTray = useCallback(() => {
 *   setActiveTray((current) => (current === "threads" ? null : current));
 * }, []);
 *
 * const chatsTrayCloser = useDelayedClose({
 *   delay: 1000,
 *   onClose: closeChatsTray,
 * });
 * ```
 */
export function useMainNav(): UseMainNavReturn {
  const [threads, setThreads] = useState<ThreadMetaData[]>([]);
  const [projects, setProjects] = useState<ProjectsMetaData[]>([]);
  const [activeTray, setActiveTray] = useState<TrayName | null>(null);

  /**
   * Toggle a tray open or closed.
   * When opening, fetches fresh data for that tray.
   */
  function handleTrayToggle(trayName: TrayName) {
    const isOpening = activeTray !== trayName;
    setActiveTray(isOpening ? trayName : null);
    if (isOpening) {
      if (trayName === "threads") fetchThreads();
      if (trayName === "projects") fetchProjects();
    }
  }

  /**
   * Remove a thread from the local list.
   * Called after the server confirms successful deletion.
   */
  function handleThreadDelete(threadID: string) {
    console.log(`Nav Delete Thread: ${threadID}`);
    setThreads((prevThreads) =>
      prevThreads.filter((thread) => thread.thread_id !== threadID),
    );
  }

  /**
   * Remove a project from the local list.
   * Called after the server confirms successful deletion.
   */
  function handleProjectDelete(projectID: string) {
    setProjects((prevProjects) =>
      prevProjects.filter((project) => project.project_id !== projectID),
    );
  }

  /**
   * Refetch projects list when a new one is created
   */
  function handleNewProject() {
    fetchProjects();
  }

  /**
   * Fetch all threads from the history service.
   * Updates local state on success.
   * TODO: Logs on failure, need improvement
   */
  const fetchThreads = useCallback(async () => {
    const threadList = await historyService.history();
    if (threadList.success) {
      setThreads(threadList.threads);
    } else {
      console.log("Thread list fetch failed");
    }
  }, []);

  /**
   * Fetch all projects from the project service.
   * Updates local state on success.
   * TODO: Logs on failure, need improvement
   */
  const fetchProjects = useCallback(async () => {
    const projectList = await projectService.projects();
    if (projectList.success) {
      setProjects(projectList.projects);
    } else {
      console.log("Projects list fetch failed");
    }
  }, []);

  // Fetch initial data on mount
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
    handleNewProject,
    setActiveTray,
  };
}
