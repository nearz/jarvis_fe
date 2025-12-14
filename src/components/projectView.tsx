import Project from "./project";
import { Dialog, Button, Portal, CloseButton } from "@chakra-ui/react";

interface ProjectViewProps {
  projectID: string;
  trayName: string;
  title: string;
  isTrayOpen: boolean;
}

function ProjectView({
  projectID,
  trayName,
  title,
  isTrayOpen,
}: ProjectViewProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Project
          projectID={projectID}
          trayName={trayName}
          title={title}
          isTrayOpen={isTrayOpen}
        />
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Dialog Title</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button>Save</Button>
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

export default ProjectView;
