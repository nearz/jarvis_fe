import {
  VStack,
  HStack,
  Text,
  List,
  Separator,
  Box,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { projectService } from "../api/services/projectService";
import type { ThreadMetaData, ChatRequest } from "../api/types";
import UserChat from "./userChat";
import ProjectUpdate from "./projectUpdate";
import ProjectThreadOptions from "./projectThreadOptions";

interface ProjectViewProps {
  selectedProjectID: string;
  selectedModel: string;
  onSubmitChat: (chatRequest: ChatRequest) => void;
  onThreadSelect: (threadID: string, projectID: string) => void;
  onModelSelect: (name: string) => void;
}

function formatDate(date: string): string {
  const dateObj = new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(dateObj);
}

function ProjectView({
  selectedProjectID,
  selectedModel,
  onModelSelect,
  onSubmitChat,
  onThreadSelect,
}: ProjectViewProps) {
  const [projectTitle, setProjectTitle] = useState("");
  const [threads, setThreads] = useState<ThreadMetaData[]>([]);
  const [openPopoverThreadId, setOpenPopoverThreadId] = useState<string | null>(null);

  function handlePopoverOpenChange(threadID: string, isOpen: boolean) {
    setOpenPopoverThreadId(isOpen ? threadID : null);
  }

  function handleThreadDelete(threadID: string) {
    setThreads((prevThreads) =>
      prevThreads.filter((thread) => thread.thread_id !== threadID),
    );
  }

  useEffect(() => {
    (async () => {
      const resp = await projectService.getProject(selectedProjectID);
      if (resp.success) {
        setProjectTitle(resp.title);
        setThreads(resp.threads !== undefined ? resp.threads : []);
      } else {
        console.log("Error get project data");
      }
    })();
  }, [selectedProjectID]);

  return (
    <VStack align="stretch" w="full">
      <HStack justify="space-between" px={1}>
        <Text fontSize="3xl" fontWeight="bold">
          {projectTitle}
        </Text>
        <ProjectUpdate projectID={selectedProjectID} />
      </HStack>
      <UserChat
        placeholder={`New chat in ${projectTitle}...`}
        selectedModel={selectedModel}
        onSubmitChat={onSubmitChat}
        onModelSelect={onModelSelect}
        borderRadiusProps={{ borderRadius: 5 }}
      />
      <Box>
        <List.Root
          listStyleType="none"
          marginTop={4}
          overflowY="auto"
          h="55vh"
          css={{
            scrollbarWidth: "thin",
            scrollbarColor:
              "var(--chakra-colors-gray-600) var(--chakra-colors-gray-900)",
          }}
        >
          {threads.map((thread) => {
            const isPopoverOpen = openPopoverThreadId === thread.thread_id;

            return (
              <List.Item
                key={thread.thread_id}
                onClick={() =>
                  onThreadSelect(thread.thread_id, selectedProjectID)
                }
              >
                <Separator />
                <HStack
                  data-group
                  justify="space-between"
                  px={4}
                  py={2}
                  _hover={{ bg: "gray.800", cursor: "pointer" }}
                  borderRadius={2}
                >
                  <VStack align="start">
                    <Text fontWeight="bold">{thread.title}</Text>
                    <Text color="gray.500">{thread.last_llm_used}</Text>
                  </VStack>
                  <Text
                    display={isPopoverOpen ? "none" : undefined}
                    css={{
                      "[data-group]:hover &": { display: "none" },
                    }}
                  >
                    {formatDate(thread.updated_at)}
                  </Text>
                  <ProjectThreadOptions
                    display={isPopoverOpen ? "flex" : "none"}
                    css={
                      isPopoverOpen
                        ? undefined
                        : { "[data-group]:hover &": { display: "flex" } }
                    }
                    threadID={thread.thread_id}
                    onDeleteThread={handleThreadDelete}
                    onOpenChange={(isOpen) =>
                      handlePopoverOpenChange(thread.thread_id, isOpen)
                    }
                  />
                </HStack>
              </List.Item>
            );
          })}
        </List.Root>
      </Box>
    </VStack>
  );
}

export default ProjectView;
