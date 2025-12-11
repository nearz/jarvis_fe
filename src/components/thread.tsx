import {
  Text,
  VStack,
  HStack,
  Center,
  Popover,
  Portal,
  Button,
  Icon,
} from "@chakra-ui/react";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaRegTrashCan } from "react-icons/fa6";
import ThreadOptions from "./threadOptions";

interface ThreadProps {
  title: string;
  llm: string;
  threadID: string;
  trayName: string;
  onSelectThread: (threadID: string) => void;
  onTrayToggle: (trayName: string) => void;
}

function Thread({
  threadID,
  trayName,
  title,
  llm,
  onSelectThread,
  onTrayToggle,
}: ThreadProps) {
  const [optionsIsOpen, setOptsIsOpen] = useState(false);

  function handleThreadSelect() {
    onSelectThread(threadID);
    onTrayToggle(trayName);
  }

  function handleThreadDelete() {
    console.log(threadID);
  }

  return (
    <HStack my={1.5} mx={2} gap="2.5px">
      <VStack
        flex={1}
        minW={0}
        align="flex-start"
        gap={0}
        bg="gray.700"
        borderLeftRadius={5}
        p={1}
        onClick={handleThreadSelect}
        _hover={{ bg: "teal.700", cursor: "pointer" }}
      >
        <Text
          textStyle="sm"
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
          maxW="100%"
        >
          {title}
        </Text>
        <Text textStyle="sm">{llm}</Text>
      </VStack>
      <Popover.Root
        open={optionsIsOpen}
        onOpenChange={(details) => setOptsIsOpen(details.open)}
        lazyMount
        unmountOnExit
        positioning={{ placement: "right-end" }}
        size="xs"
      >
        <Popover.Trigger asChild>
          <Center
            alignSelf="stretch"
            bg="gray.700"
            borderRightRadius={5}
            _hover={{ bg: "teal.800" }}
          >
            <BsThreeDotsVertical />
          </Center>
        </Popover.Trigger>
        <Portal>
          <Popover.Positioner>
            <Popover.Content
              w="150px"
              css={{ "--popover-bg": "colors.gray.700" }}
            >
              <Popover.Arrow />
              <Popover.Body p={2}>
                <ThreadOptions
                  text="Delete"
                  textIconColor="red.400"
                  hoverColor="red.subtle"
                  onClick={handleThreadDelete}
                >
                  <FaRegTrashCan />
                </ThreadOptions>
              </Popover.Body>
              <Popover.CloseTrigger />
            </Popover.Content>
          </Popover.Positioner>
        </Portal>
      </Popover.Root>
    </HStack>
  );
}

export default Thread;
