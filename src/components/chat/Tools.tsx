import { Box, Text, type BoxProps } from "@chakra-ui/react";
import type { ThreadMark } from "../navigation/MainView";

interface ToolsProps extends BoxProps {
  threadMarks: ThreadMark[];
  onMarkClick: (markID: string) => void;
}

function truncate(str: string, max: number) {
  return str.length > max ? str.slice(0, max) + "..." : str;
}

function Tools(props: ToolsProps) {
  const { threadMarks, onMarkClick, ...rest } = props;
  return (
    <Box m={0} h="100%" w="300px" bg="gray.800" overflowY="auto" {...rest}>
      {threadMarks.map((mark) => (
        <Box
          key={mark.elemID}
          display="flex"
          justifyContent={mark.type === "user" ? "flex-end" : "flex-start"}
          m={2}
          ml={mark.type === "ai-h2" ? 3 : 2}
        >
          <Box
            bg={
              mark.type === "user"
                ? "teal.700"
                : mark.type === "ai-h2"
                  ? "gray.600"
                  : "gray.700"
            }
            p={2}
            borderRadius="md"
            cursor="pointer"
            w="fit-content"
            maxW="100%"
            onClick={() => onMarkClick(mark.elemID)}
          >
            <Text
              fontSize="xs"
              color="white"
              fontWeight={
                mark.type === "user" || mark.type === "ai-h1"
                  ? "bold"
                  : "normal"
              }
              fontStyle={mark.type === "ai-h2" ? "italic" : "normal"}
            >
              {truncate(mark.content, 30)}
            </Text>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default Tools;
