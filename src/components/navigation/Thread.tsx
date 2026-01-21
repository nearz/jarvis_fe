import { FaRegTrashCan } from "react-icons/fa6";
import { LuPencil } from "react-icons/lu";
import { NavListItem } from "../common";
import { historyService } from "../../api/services/historyService";
import { useAsyncService } from "../../hooks";

interface ThreadProps {
  title: string;
  llm: string;
  threadID: string;
  trayName: string;
  isTrayOpen: boolean;
  onSelectThread: (threadID: string) => void;
  onDeleteThread: (threadID: string) => void;
  onTrayToggle: (trayName: string) => void;
}

function Thread({
  threadID,
  trayName,
  title,
  llm,
  isTrayOpen,
  onSelectThread,
  onDeleteThread,
  onTrayToggle,
}: ThreadProps) {
  const { execute: deleteThread } = useAsyncService(
    historyService.deleteThread,
    {
      onSuccess: (result) => {
        if (result.success) {
          onDeleteThread(threadID);
        } else {
          console.log("Delete thread failed");
        }
      },
      onError: (error) => {
        console.error("Delete thread error:", error);
      },
    },
  );

  function handleThreadSelect() {
    onSelectThread(threadID);
    onTrayToggle(trayName);
  }

  function handleThreadDelete() {
    console.log(`Delete: ${threadID}`);
    deleteThread(threadID);
  }

  function handleThreadRename() {
    console.log(`Rename: ${threadID}`);
  }

  return (
    <NavListItem
      title={title}
      subtitle={llm}
      onSelect={handleThreadSelect}
      isParentOpen={isTrayOpen}
      options={[
        {
          label: "Rename",
          icon: <LuPencil />,
          onClick: handleThreadRename,
        },
        {
          label: "Delete",
          icon: <FaRegTrashCan />,
          onClick: handleThreadDelete,
          color: "red.400",
        },
      ]}
    />
  );
}

export default Thread;
