import {
  Dialog,
  Button,
  Portal,
  CloseButton,
  Icon,
  Input,
} from "@chakra-ui/react";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import { projectService } from "../../api/services/projectService";
import { useState } from "react";
import { useAsyncService } from "../../hooks";

function NewProject() {
  const [title, setTitle] = useState("");

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
  }

  //TODO: Improve error handling in api/services, and hooks will be able to handle these better.
  //TODO: How to present errors?
  const { execute: newProject } = useAsyncService(projectService.newProject, {
    onSuccess: (result) => {
      if (result.success) {
        console.log("New Project Creation success");
      } else {
        console.log("New Project Creation error");
      }
    },
    onError: (err) => {
      console.error("New Project Creation error: ", err);
    },
  });

  const handleSumbitProject = async () => {
    console.log("Submit New Project");
    if (title.trim()) {
      newProject({ title: title.trim() });
    }
  };

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
