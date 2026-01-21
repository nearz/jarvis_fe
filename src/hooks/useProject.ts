import { useState, useEffect } from "react";
import { projectService } from "../api/services/projectService";
import type { ThreadMetaData } from "../api/types";

interface UseProjectOptions {
  projectID: string;
}

interface UseProjectReturn {
  projectTitle: string;
  threads: ThreadMetaData[];
  handleThreadDelete: (threadID: string) => void;
}

export function useProject({ projectID }: UseProjectOptions): UseProjectReturn {
  const [projectTitle, setProjectTitle] = useState("");
  const [threads, setThreads] = useState<ThreadMetaData[]>([]);

  function onLoaded(projectTitle: string, threads: ThreadMetaData[]) {
    setProjectTitle(projectTitle);
    setThreads(threads);
  }

  useEffect(() => {
    if (!projectID) return;
    let cancelled = false;
    loadProject(projectID, onLoaded, () => cancelled);

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
    projectTitle,
    threads,
    handleThreadDelete,
  };
}

async function loadProject(
  projectID: string,
  onLoaded: (projectTitle: string, threads: ThreadMetaData[]) => void,
  isCancelled: () => boolean,
): Promise<void> {
  try {
    const resp = await projectService.getProject(projectID);
    if (resp.success && resp.threads) {
      onLoaded(resp.title, resp.threads);
    }
  } catch (err) {
    if (!isCancelled()) {
      console.log("Error loading project");
    }
  }
}
