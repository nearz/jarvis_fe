import {
  Dialog,
  Button,
  Portal,
  CloseButton,
  Icon,
  IconButton,
  Input,
  Textarea,
  Text,
} from "@chakra-ui/react";
import { LuPencil } from "react-icons/lu";
import { projectService } from "../../api/services/projectService";
import { useAsyncService, useProject } from "../../hooks";

interface ProjectUpdateProps {
  projectID: string;
}

function ProjectUpdate({ projectID }: ProjectUpdateProps) {
  const { instructions, title, setInstructions, setProjectTitle } = useProject({
    projectID: projectID,
    flag: "details",
  });

  //TODO: Improve error handling in api/services, and hooks will be able to handle these better.
  //TODO: How to display error and success. Toast and close modal?
  const { execute: projectUpdate } = useAsyncService(
    projectService.projectUpdate,
    {
      onSuccess: (result) => {
        if (result.success) {
          console.log("Update Project Details success");
        } else {
          console.log("Update Project Details error");
        }
      },
      onError: (err) => {
        console.error("Update Project Details:", err);
      },
    },
  );

  function handleSubmitProjectUpdate() {
    projectUpdate({
      project_id: projectID,
      title: title,
      instructions: instructions,
    });
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <IconButton size="xs" colorPalette="teal" variant="outline">
          <Icon>
            <LuPencil />
          </Icon>
        </IconButton>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            bg="gray.800"
            w={{ base: "95vw", md: "80vw", lg: "60vw" }}
            maxW="700px"
            h="80vh"
            maxH="700px"
            display="flex"
            flexDirection="column"
          >
            <Dialog.Header p={4}>
              <Dialog.Title>Update Project</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body
              px={4}
              py={2}
              flex="1"
              display="flex"
              flexDirection="column"
              overflow="hidden"
            >
              <Text fontSize="sm" px={1} pb={1}>
                Project Title:
              </Text>
              <Input
                value={title}
                onChange={(e) => setProjectTitle(e.target.value)}
                w="full"
                mb={3}
                flexShrink={0}
                bg="gray.900"
                _focus={{ borderColor: "teal.700" }}
              />
              <Text fontSize="sm" px={1} pb={1}>
                Give the AI model instructions to scope your chats to a topic or
                rules to follow.
              </Text>
              <Textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                w="full"
                flex="1"
                resize="none"
                bg="gray.900"
                _focus={{ borderColor: "teal.700" }}
              />
            </Dialog.Body>
            <Dialog.Footer flexShrink={0}>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button onClick={handleSubmitProjectUpdate}>Save</Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

export default ProjectUpdate;
