import { useEffect, useState } from "react";
import { projectService } from "../api/services/projectService";

//NOTES: Should I add loading state?

interface UseProjectDetailsOptions {
  /** The project ID to load details for */
  projectID: string;
}

interface UseProjectDetailsReturn {
  instructions: string;
  title: string;
  setInstructions: React.Dispatch<React.SetStateAction<string>>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * Hook to handle loading project details.
 *
 * @example
 */

export function useProjectDetails({
  projectID,
}: UseProjectDetailsOptions): UseProjectDetailsReturn {
  const [instructions, setInstructions] = useState("temp");
  const [title, setTitle] = useState("");

  function onLoaded(instructions: string, title: string) {
    setInstructions(instructions);
    setTitle(title);
  }

  useEffect(() => {
    if (!projectID) return;

    let cancelled = false;
    loadProjectDetails(projectID, onLoaded, () => cancelled);

    return () => {
      cancelled = true;
    };
  }, [projectID]);

  return {
    instructions,
    title,
    setInstructions,
    setTitle,
  };
}

async function loadProjectDetails(
  projectID: string,
  onLoaded: (instructions: string, title: string) => void,
  isCancelled: () => boolean,
): Promise<void> {
  try {
    const resp = await projectService.getProjectOmitThreads(projectID);
    if (isCancelled()) return;
    if (resp.success) {
      onLoaded(resp.instructions, resp.title);
    }
  } catch (err) {
    if (!isCancelled()) {
      console.log("Error loading thread", err);
    }
  }
}
