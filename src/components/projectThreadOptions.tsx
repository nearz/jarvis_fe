import { Icon, IconButton, Popover, Portal } from "@chakra-ui/react";
import type { IconButtonProps } from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaRegTrashCan } from "react-icons/fa6";
import { LuPencil } from "react-icons/lu";
import { useState } from "react";
import Option from "./option";
import { historyService } from "../api/services/historyService";

interface ProjectThreadOptsProps extends Omit<IconButtonProps, "children"> {
  threadID: string;
  onDeleteThread: (threadID: string) => void;
  onOpenChange?: (isOpen: boolean) => void;
}

function ProjectThreadOptions({
  threadID,
  onDeleteThread,
  onOpenChange,
  ...iconButtonProps
}: ProjectThreadOptsProps) {
  function handleThreadDelete(e: React.MouseEvent) {
    e.stopPropagation();
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

  function handleThreadRename(e: React.MouseEvent) {
    e.stopPropagation();
    console.log(`Rename: ${threadID}`);
  }
  const [optionsIsOpen, setOptsIsOpen] = useState(false);

  function handleOpenChange(details: { open: boolean }) {
    setOptsIsOpen(details.open);
    onOpenChange?.(details.open);
  }

  return (
    <Popover.Root
      open={optionsIsOpen}
      onOpenChange={handleOpenChange}
      lazyMount
      unmountOnExit
      positioning={{ placement: "right-end" }}
      size="xs"
    >
      <Popover.Trigger asChild>
        <IconButton
          size="xs"
          variant="outline"
          {...iconButtonProps}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Icon>
            <BsThreeDotsVertical />
          </Icon>
        </IconButton>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content
            w="150px"
            css={{ "--popover-bg": "colors.gray.700" }}
          >
            <Popover.Arrow />
            <Popover.Body p={2}>
              <Option
                text="Rename"
                textIconColor="white"
                hoverColor="gray.800"
                onClick={handleThreadRename}
              >
                <LuPencil />
              </Option>
              <Option
                text="Delete"
                textIconColor="red.400"
                hoverColor="gray.800"
                onClick={handleThreadDelete}
              >
                <FaRegTrashCan />
              </Option>
            </Popover.Body>
            <Popover.CloseTrigger />
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}

export default ProjectThreadOptions;
