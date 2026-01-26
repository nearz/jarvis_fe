import { useState } from "react";
import { Button, Popover, Portal } from "@chakra-ui/react";
import { TbBrandMetabrainz } from "react-icons/tb";
import { ModelSelect } from "../common";

interface ModelSelectPopoverProps {
  /** The currently selected model name */
  selectedModel: string;
  /** Callback fired when a model is selected */
  onModelSelect: (name: string) => void;
}

/**
 * A popover component for selecting an AI model.
 * Manages its own open/closed state internally.
 */
const ModelSelectPopover = ({
  selectedModel,
  onModelSelect,
}: ModelSelectPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleModelSelect = (name: string) => {
    onModelSelect(name);
    setIsOpen(false);
  };

  return (
    <Popover.Root
      open={isOpen}
      onOpenChange={(details) => setIsOpen(details.open)}
    >
      <Popover.Trigger asChild>
        <Button
          aria-label="model-select"
          size="xs"
          mx="1"
          rounded="md"
          variant="ghost"
          color="gray.500"
        >
          {selectedModel} <TbBrandMetabrainz />
        </Button>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content h="500px" w="250px" bg="gray.800">
            <Popover.Body p="10px">
              <ModelSelect onModelSelect={handleModelSelect} />
            </Popover.Body>
            <Popover.CloseTrigger />
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
};

export default ModelSelectPopover;
