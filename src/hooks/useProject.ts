import { useState, useEffect } from "react";
import { projectService } from "../api/services/projectService";
import type { ThreadMetaData } from "../api/types";

/**
 * Flag to determine which project data to load:
 * - "project": Loads title and threads list (for ProjectView)
 * - "details": Loads title and instructions only, omits threads (for ProjectUpdate)
 */
type Flags = "project" | "details";

interface UseProjectOptions {
  /** The project ID to load */
  projectID: string;
  /** Determines which endpoint to use and what data to fetch */
  flag: Flags;
}

interface UseProjectReturn {
  /** The project title */
  title: string;
  /** The project instructions (only populated when flag is "details") */
  instructions: string;
  /** Whether project data is currently being fetched */
  loading: boolean;
  /** List of threads in the project (only populated when flag is "project") */
  threads: ThreadMetaData[];
  /** Remove a thread from the list after confirmed server deletion */
  handleThreadDelete: (threadID: string) => void;
  /** Setter for instructions (for form editing) */
  setInstructions: React.Dispatch<React.SetStateAction<string>>;
  /** Setter for project title (for form editing) */
  setProjectTitle: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * Hook to load and manage project data.
 *
 * Handles:
 * - Loading project with threads list (flag: "project")
 * - Loading project details without threads (flag: "details")
 * - Cleanup on unmount to prevent stale updates
 * - Local state updates for thread deletion
 *
 * @example
 * ```tsx
 * // Loading a project with its threads (for ProjectView)
 * function ProjectView({ projectID }) {
 *   const { title, threads, loading, handleThreadDelete } = useProject({
 *     projectID,
 *     flag: "project",
 *   });
 *
 *   if (loading) return <Skeleton />;
 *
 *   return (
 *     <Box>
 *       <Heading>{title}</Heading>
 *       {threads.map((thread) => (
 *         <Thread
 *           key={thread.thread_id}
 *           onDelete={() => handleThreadDelete(thread.thread_id)}
 *         />
 *       ))}
 *     </Box>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Loading project details for editing (for ProjectUpdate)
 * function ProjectUpdate({ projectID }) {
 *   const { title, instructions, loading, setInstructions, setProjectTitle } =
 *     useProject({
 *       projectID,
 *       flag: "details",
 *     });
 *
 *   if (loading) return <Spinner />;
 *
 *   return (
 *     <form>
 *       <Input value={title} onChange={(e) => setProjectTitle(e.target.value)} />
 *       <Textarea
 *         value={instructions}
 *         onChange={(e) => setInstructions(e.target.value)}
 *       />
 *     </form>
 *   );
 * }
 * ```
 */
export function useProject({
  projectID,
  flag,
}: UseProjectOptions): UseProjectReturn {
  const [title, setProjectTitle] = useState("");
  const [threads, setThreads] = useState<ThreadMetaData[]>([]);
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);

  /** Callback when project with threads is loaded */
  function onProjectLoaded(title: string, threads: ThreadMetaData[]) {
    setProjectTitle(title);
    setThreads(threads);
  }

  /** Callback when project details (without threads) are loaded */
  function onProjectDetailsLoaded(instructions: string, title: string) {
    setProjectTitle(title);
    setInstructions(instructions);
  }

  // Load project data when projectID changes
  useEffect(() => {
    if (!projectID) return;
    let cancelled = false;
    if (flag === "project") {
      loadProject(projectID, onProjectLoaded, setLoading, () => cancelled);
    } else {
      loadProjectDetails(
        projectID,
        onProjectDetailsLoaded,
        setLoading,
        () => cancelled,
      );
    }

    return () => {
      cancelled = true;
    };
  }, [projectID]);

  /**
   * Remove a thread from the local list.
   * Called after the server confirms successful deletion.
   */
  function handleThreadDelete(threadID: string) {
    setThreads((prevThreads) =>
      prevThreads.filter((thread) => thread.thread_id !== threadID),
    );
  }

  return {
    title,
    instructions,
    loading,
    threads,
    handleThreadDelete,
    setInstructions,
    setProjectTitle,
  };
}

/**
 * Load a project with its threads list.
 * Handles loading state and cancellation for unmount safety.
 * TODO: Error handling needs improvement
 */
async function loadProject(
  projectID: string,
  onLoaded: (projectTitle: string, threads: ThreadMetaData[]) => void,
  setLoading: (isLoading: boolean) => void,
  isCancelled: () => boolean,
): Promise<void> {
  try {
    setLoading(true);
    const resp = await projectService.getProject(projectID);
    if (resp.success && resp.threads) {
      onLoaded(resp.title, resp.threads);
    }
  } catch (err) {
    if (!isCancelled()) {
      console.log("Error loading project");
    }
  } finally {
    setLoading(false);
  }
}

/**
 * Load project details without threads (lighter payload for editing).
 * Handles loading state and cancellation for unmount safety.
 * TODO: Error handling needs improvement
 */
async function loadProjectDetails(
  projectID: string,
  onLoaded: (instructions: string, title: string) => void,
  setLoading: (isLoading: boolean) => void,
  isCancelled: () => boolean,
): Promise<void> {
  try {
    setLoading(true);
    const resp = await projectService.getProjectOmitThreads(projectID);
    if (isCancelled()) return;
    if (resp.success) {
      onLoaded(resp.instructions, resp.title);
    }
  } catch (err) {
    if (!isCancelled()) {
      console.log("Error loading thread", err);
    }
  } finally {
    setLoading(false);
  }
}
