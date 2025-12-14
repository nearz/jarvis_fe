import {
  Dialog,
  Button,
  Portal,
  CloseButton,
  Icon,
  Input,
} from "@chakra-ui/react";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import { projectService } from "../api/services/projectService";
import { useState } from "react";

function NewProject() {
  const [title, setTitle] = useState("");

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
  }

  function handleSumbitProject() {
    console.log("Submit New Project");
    if (title.trim()) {
      (async () => {
        const submitProj = await projectService.newProject({
          title: title.trim(),
        });
        if (submitProj.success) {
          console.log(submitProj.project_id);
        } else {
          console.log("Error creating new project");
        }
      })();
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button
          size="sm"
          w="calc(100% - 16px)"
          mx={2}
          my={2}
          bg="teal.700"
          _hover={{ bg: "teal.600", color: "gray.50" }}
          color="gray.400"
          fontWeight="bold"
        >
          New Project
          <Icon boxSize={6}>
            <MdOutlineCreateNewFolder />
          </Icon>
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content bg="gray.800">
            <Dialog.Header p={4}>
              <Dialog.Title>Create Project</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body px={4} py={2}>
              <Input
                placeholder="Enter Project Title..."
                bg="gray.900"
                _focus={{ borderColor: "teal.500" }}
                onChange={handleTitleChange}
              />
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button onClick={handleSumbitProject}>Save</Button>
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

export default NewProject;
