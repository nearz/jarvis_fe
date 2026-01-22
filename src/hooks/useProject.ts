import { useState, useEffect } from "react";
import { projectService } from "../api/services/projectService";
import type { ThreadMetaData } from "../api/types";

type Flags = "project" | "details";

interface UseProjectOptions {
  projectID: string;
  flag: Flags;
}

interface UseProjectReturn {
  title: string;
  instructions: string;
  loading: boolean;
  threads: ThreadMetaData[];
  handleThreadDelete: (threadID: string) => void;
  setInstructions: React.Dispatch<React.SetStateAction<string>>;
  setProjectTitle: React.Dispatch<React.SetStateAction<string>>;
}

export function useProject({
  projectID,
  flag,
}: UseProjectOptions): UseProjectReturn {
  const [title, setProjectTitle] = useState("");
  const [threads, setThreads] = useState<ThreadMetaData[]>([]);
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);

  function onProjectLoaded(title: string, threads: ThreadMetaData[]) {
    setProjectTitle(title);
    setThreads(threads);
  }

  function onProjectDetailsLoaded(instructions: string, title: string) {
    setProjectTitle(title);
    setInstructions(instructions);
  }

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
