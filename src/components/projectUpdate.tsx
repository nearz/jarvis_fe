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
import { useState, useEffect } from "react";
import { projectService } from "../api/services/projectService";

interface ProjectUpdateProps {
  projectID: string;
}

function ProjectUpdate({ projectID }: ProjectUpdateProps) {
  const [instructions, setInstructions] = useState("temp");
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (!projectID) return;
    (async () => {
      try {
        const resp = await projectService.getProjectOmitThreads(projectID);
        if (resp.success) {
          setTitle(resp.title);
          setInstructions(resp.instructions);
        }
      } catch (err) {
        console.log("Error loading project", err);
      }
    })();
  }, [projectID]);

  function handleSubmitProjectUpdate() {
    (async () => {
      try {
        const resp = await projectService.projectUpdate(
          projectID,
          title,
          instructions,
        );
        if (resp.success) {
          console.log("Updated project successfuly");
        }
      } catch (err) {
        console.log("Error loading project", err);
      }
    })();
  }

  function handleInstUpdate(e: React.ChangeEvent<HTMLTextAreaElement>) {
    console.log(e.target.value);
    setInstructions(e.target.value);
  }

  function handleTitleUpdate(e: React.ChangeEvent<HTMLInputElement>) {
    console.log(e.target.value);
    setTitle(e.target.value);
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
                defaultValue={title}
                onChange={handleTitleUpdate}
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
                defaultValue={instructions}
                onChange={handleInstUpdate}
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
