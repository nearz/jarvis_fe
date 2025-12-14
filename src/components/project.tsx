import {
  Text,
  VStack,
  HStack,
  Center,
  Popover,
  Portal,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaRegTrashCan, FaPlus } from "react-icons/fa6";
import Option from "./option";

interface ProjectProps {
  projectID: string;
  trayName: string;
  title: string;
  isTrayOpen: boolean;
}

function Project({ title, isTrayOpen }: ProjectProps) {
  const [optionsIsOpen, setOptsIsOpen] = useState(false);

  function handleProjectSelect() {
    console.log(title);
  }

  function handleProjectDelete() {
    console.log("Project Delete");
  }

  useEffect(() => {
    if (!isTrayOpen) {
      setOptsIsOpen(false);
    }
  }, [isTrayOpen]);

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
        onClick={handleProjectSelect}
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
                <Option
                  text="New Chat"
                  textIconColor="white"
                  hoverColor="gray.800"
                  onClick={handleProjectDelete}
                >
                  <FaPlus />
                </Option>
                <Option
                  text="Delete"
                  textIconColor="red.400"
                  hoverColor="gray.800"
                  onClick={handleProjectDelete}
                >
                  <FaRegTrashCan />
                </Option>
              </Popover.Body>
              <Popover.CloseTrigger />
            </Popover.Content>
          </Popover.Positioner>
        </Portal>
      </Popover.Root>
    </HStack>
  );
}

export default Project;
