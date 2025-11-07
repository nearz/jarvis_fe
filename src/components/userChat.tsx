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
import { useState } from "react";
// import { Tooltip } from "./ui/tooltip";

function UserChat() {
  const [selectedModel, setSelectedModel] = useState("Default");
  const [isOpen, setIsOpen] = useState(false);
  const handleModelSelect = (name: string) => {
    setSelectedModel(name);
    setIsOpen(false);
  };

  return (
    <Container
      position="absolute"
      left="50%"
      transform="translate(-50%)"
      bottom="10px"
      maxW="2xl"
      p={1}
      mx={3}
      rounded={5}
      bg="gray.800"
    >
      <VStack>
        <Textarea
          id="user-chat"
          size="md"
          placeholder="Chat..."
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
              onClick={() => console.log("Chat Submit")}
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
              onClick={() => console.log("Chat Submit")}
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
