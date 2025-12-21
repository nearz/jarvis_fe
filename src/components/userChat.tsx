import {
  IconButton,
  Textarea,
  Container,
  VStack,
  HStack,
  Button,
  Flex,
  Popover,
  Portal,
} from "@chakra-ui/react";
import {
  FaArrowUp,
  FaPaperclip,
  FaSquareWebAwesomeStroke,
} from "react-icons/fa6";
import { TbBrandMetabrainz } from "react-icons/tb";
import ModelSelect from "./modelSelect";
import { useState, useEffect, useRef } from "react";
import type { ChatRequest } from "../api/types";

interface BorderRadiusProps {
  borderRadius?: number | string;
  borderTopRadius?: number | string;
}

interface UserChatProps {
  onModelSelect: (name: string) => void;
  onSubmitChat: (chatRequest: ChatRequest) => void;
  placeholder?: string;
  selectedModel: string;
  borderRadiusProps?: BorderRadiusProps;
}

function UserChat({
  onModelSelect,
  onSubmitChat,
  borderRadiusProps,
  placeholder,
  selectedModel,
}: UserChatProps) {
  // const [selectedModel, setSelectedModel] = useState("Default");
  const [isOpen, setIsOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  const handleModelSelect = (name: string) => {
    onModelSelect(name);
    // setSelectedModel(name);
    setIsOpen(false);
  };

  function handleMsgUpdate(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setChatMsg(e.target.value);
  }

  function handleChatSubmit() {
    if (chatMsg.trim() && selectedModel.trim() !== "Select Model") {
      onSubmitChat({ message: chatMsg, llm: selectedModel });
      setChatMsg("");
      textAreaRef.current?.focus();
    }
  }

  function handleChatKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (chatMsg.trim() && selectedModel.trim() !== "Select Model") {
        handleChatSubmit();
      }
    }
  }

  return (
    <Container p={1} {...borderRadiusProps} bg="gray.800">
      <VStack>
        <Textarea
          ref={textAreaRef}
          id="user-chat"
          size="md"
          placeholder={placeholder !== undefined ? placeholder : "Chat..."}
          value={chatMsg}
          onChange={handleMsgUpdate}
          onKeyDown={handleChatKeyDown}
          variant="subtle"
          bg="gray.800"
          autoresize
          maxH="8lh"
          overflowY="auto"
          p={2}
          _focus={{
            boxShadow: "none",
            borderColor: "transparent",
            outline: "none",
          }}
        />
        <HStack w="100%">
          <Flex m="1" w="50%" justify="flex-start">
            <Button
              aria-label="web-search"
              size="xs"
              colorPalette="teal"
              variant="outline"
            >
              <FaSquareWebAwesomeStroke /> Search
            </Button>
          </Flex>
          <Flex m="1" w="50%" justify="flex-end">
            <Popover.Root
              open={isOpen}
              onOpenChange={(details) => setIsOpen(details.open)}
            >
              <Popover.Trigger asChild>
                <Button
                  aria-label="model-Select"
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
            <IconButton
              aria-label="upload-file"
              size="xs"
              mx="1"
              rounded="md"
              variant="ghost"
              color="gray.500"
              onClick={() => console.log("File Upload")}
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
              onClick={handleChatSubmit}
            >
              <FaArrowUp />
            </IconButton>
          </Flex>
        </HStack>
      </VStack>
    </Container>
  );
}

export default UserChat;
