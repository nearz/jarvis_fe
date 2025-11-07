import {
  HStack,
  Text,
  Box,
  Separator,
  Flex,
  type BoxProps,
} from "@chakra-ui/react";
import CustomIconButton from "./customIconButton";
import { FaPlus } from "react-icons/fa6";

interface ChatHeaderProps extends BoxProps {
  onCTToggle: () => void;
}

function ChatHeader({ onCTToggle }: ChatHeaderProps) {
  return (
    <Box w="100%">
      <HStack m={2}>
        <Flex w="80%" justify="flex-start">
          <Flex w="100%" justify="space-between">
            <Text>Header</Text>
            <Text>Header</Text>
            <Text>Header</Text>
          </Flex>
        </Flex>
        <Flex w="20%" justify="flex-end" mr="5">
          <CustomIconButton
            name="chat-options"
            size="xs"
            variant="solid"
            icon={<FaPlus />}
            onClick={onCTToggle}
          />
        </Flex>
      </HStack>
      <Separator />
    </Box>
  );
}

export default ChatHeader;
