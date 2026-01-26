import { IconButton, HStack, Button } from "@chakra-ui/react";
import {
  FaArrowUp,
  FaPaperclip,
  FaSquareWebAwesomeStroke,
} from "react-icons/fa6";
import ModelSelectPopover from "./ModelSelectPopover";

interface ChatToolbarProps {
  /** The currently selected model name */
  selectedModel: string;
  /** Callback fired when a model is selected */
  onModelSelect: (name: string) => void;
  /** Callback fired when submit button is clicked */
  onSubmit: () => void;
  /** Whether the submit button should be enabled */
  canSubmit: boolean;
}

/**
 * Toolbar component for the chat input area.
 * Contains search button, model selector, file upload, and submit button.
 */
const ChatToolbar = ({
  selectedModel,
  onModelSelect,
  onSubmit,
  canSubmit,
}: ChatToolbarProps) => {
  const handleFileUpload = () => {
    // TODO: Implement file upload functionality
    console.log("File Upload");
  };

  const handleChatOptions = () => {
    // TODO: May be more than just search, should be a popover or dropdown?
    console.log("Search clicked");
  };

  return (
    <HStack w="100%" justify="space-between" m="1" p="1">
      <Button
        aria-label="web-search"
        size="xs"
        colorPalette="teal"
        variant="outline"
        onClick={handleChatOptions}
      >
        <FaSquareWebAwesomeStroke /> Search
      </Button>
      <HStack>
        <ModelSelectPopover
          selectedModel={selectedModel}
          onModelSelect={onModelSelect}
        />
        <IconButton
          aria-label="upload-file"
          size="xs"
          mx="1"
          rounded="md"
          variant="ghost"
          color="gray.500"
          onClick={handleFileUpload}
        >
          <FaPaperclip />
        </IconButton>
        <IconButton
          aria-label="submit-chat"
          size="xs"
          ml="4px"
          rounded="md"
          bg="teal.700"
          _hover={{ bg: "teal.600" }}
          color="gray.900"
          onClick={onSubmit}
          disabled={!canSubmit}
        >
          <FaArrowUp />
        </IconButton>
      </HStack>
    </HStack>
  );
};

export default ChatToolbar;
