import { FaRegTrashCan, FaPlus } from "react-icons/fa6";
import { NavListItem } from "../common";
import { projectService } from "../../api/services/projectService";
import { useAsyncService } from "../../hooks";

interface ProjectProps {
  projectID: string;
  trayName: string;
  title: string;
  onSelectProject: (projectID: string) => void;
  onDeleteProject: (projectID: string) => void;
  onTrayToggle: (trayName: string) => void;
  isTrayOpen: boolean;
}

function Project({
  projectID,
  trayName,
  title,
  isTrayOpen,
  onSelectProject,
  onDeleteProject,
  onTrayToggle,
}: ProjectProps) {
  const { execute: deleteProject } = useAsyncService(
    projectService.delete_project,
    {
      onSuccess: (result) => {
        if (result.success) {
          onDeleteProject(projectID);
        } else {
          console.log("Delete Project failed");
        }
      },
      onError: (error) => {
        console.error("Delete Project error:", error);
      },
    },
  );

  function handleProjectSelect() {
    onSelectProject(projectID);
    onTrayToggle(trayName);
  }

  function handleProjectDelete() {
    console.log(`Delete Project: ${projectID}`);
    deleteProject(projectID);
  }

  function handleNewChat() {
    console.log(`New Chat in Project: ${projectID}`);
    // TODO: Implement new chat in project
  }

  return (
    <NavListItem
      title={title}
      onSelect={handleProjectSelect}
      isParentOpen={isTrayOpen}
      options={[
        {
          label: "New Chat",
          icon: <FaPlus />,
          onClick: handleNewChat,
        },
        {
          label: "Delete",
          icon: <FaRegTrashCan />,
          onClick: handleProjectDelete,
          color: "red.400",
        },
      ]}
    />
  );
}

export default Project;
