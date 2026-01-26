import { FaRegTrashCan, FaPlus } from "react-icons/fa6";
import { NavListItem } from "../common";
import { projectService } from "../../api/services/projectService";
import { useAsyncService } from "../../hooks";
import type { TrayName } from "../../hooks/useMainNav";

interface ProjectProps {
  projectID: string;
  trayName: TrayName;
  title: string;
  onSelectProject: (projectID: string) => void;
  onDeleteProject: (projectID: string) => void;
  onTrayToggle: (trayName: TrayName) => void;
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

  const handleProjectSelect = () => {
    onSelectProject(projectID);
    onTrayToggle(trayName);
  };

  const handleProjectDelete = () => {
    console.log(`Delete Project: ${projectID}`);
    deleteProject(projectID);
  };

  const handleNewChat = () => {
    console.log(`New Chat in Project: ${projectID}`);
    // TODO: Implement new chat in project
  };

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
