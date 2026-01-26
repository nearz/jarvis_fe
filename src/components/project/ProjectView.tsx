import { VStack, HStack, Text, List, Separator, Box } from "@chakra-ui/react";
import { useState } from "react";
import type { ChatRequest } from "../../api/types";
import { UserChat } from "../chat";
import ProjectUpdate from "./ProjectUpdate";
import ProjectThreadOptions from "./ProjectThreadOptions";
import ProjectViewSkeleton from "./ProjectViewSkeleton";
import { useProject } from "../../hooks";

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
  const [openPopoverThreadId, setOpenPopoverThreadId] = useState<string | null>(
    null,
  );

  const handlePopoverOpenChange = (threadID: string, isOpen: boolean) => {
    setOpenPopoverThreadId(isOpen ? threadID : null);
  };

  const { title, threads, loading, handleThreadDelete } = useProject({
    projectID: selectedProjectID,
    flag: "project",
  });

  if (loading) {
    return <ProjectViewSkeleton />;
  }

  return (
    <Box
      position="absolute"
      left="50%"
      top="18%"
      transform="translate(-50%)"
      maxW="2xl"
      w="100%"
    >
      <VStack align="stretch" w="full">
        <HStack justify="space-between" px={1}>
          <Text fontSize="3xl" fontWeight="bold">
            {title}
          </Text>
          <ProjectUpdate projectID={selectedProjectID} />
        </HStack>
        <UserChat
          placeholder={`New chat in ${title}...`}
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
    </Box>
  );
}

export default ProjectView;
