import { FaRegTrashCan } from "react-icons/fa6";
import { LuPencil } from "react-icons/lu";
import NavListItem from "./NavListItem";
import { historyService } from "../api/services/historyService";

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
  function handleThreadSelect() {
    onSelectThread(threadID);
    onTrayToggle(trayName);
  }

  function handleThreadDelete() {
    console.log(`Delete: ${threadID}`);
    (async () => {
      const deleteThread = await historyService.deleteThread(threadID);
      if (deleteThread.success) {
        onDeleteThread(threadID);
      } else {
        console.log("Delete thread failed");
      }
    })();
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
