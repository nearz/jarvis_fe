import { Box, Text, type BoxProps } from "@chakra-ui/react";
import type { ThreadMark } from "../navigation/MainView";

interface ChatToolsProps extends BoxProps {
  threadMarks: ThreadMark[] | null;
  onMarkID: (markID: string) => void;
}

function truncate(str: string, max: number) {
  return str.length > max ? str.slice(0, max) + "..." : str;
}

function ChatTools(props: ChatToolsProps) {
  const { threadMarks, onMarkID, ...rest } = props;
  //TODO: add "data-" attr. for elemID and pass that instead of registering and closing over each one.
  return (
    <Box m={0} h="100%" w="300px" bg="gray.800" overflowY="auto" {...rest}>
      {threadMarks?.map((mark) => (
        <Box
          key={mark.elemID}
          display="flex"
          justifyContent={mark.type === "user" ? "flex-end" : "flex-start"}
          m={2}
        >
          <Box
            bg={mark.type === "user" ? "teal.700" : "gray.700"}
            p={2}
            borderRadius="md"
            cursor="pointer"
            w="fit-content"
            maxW="100%"
            onClick={() => onMarkID(mark.elemID)}
          >
            <Text fontSize="xs" color="white">
              {truncate(mark.content, 30)}
            </Text>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default ChatTools;
