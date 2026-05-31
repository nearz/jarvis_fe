import { Box, type BoxProps } from "@chakra-ui/react";
import type { ThreadMark } from "../navigation/types";
import ThreadMarks from "./tools/ThreadMarks";

//TODO:Thread mark list
//Add set of buttons at top, first 1 to collaps all h1s?
//Mark code blocks?

interface ToolsProps extends BoxProps {
  threadMarks: ThreadMark[];
  toolsWidth: string;
  onMarkClick: (markID: string) => void;
}

function Tools(props: ToolsProps) {
  const { threadMarks, toolsWidth, onMarkClick, ...rest } = props;

  return (
    <Box m={0} h="100%" w={toolsWidth} bg="gray.800" overflowY="auto" {...rest}>
      <ThreadMarks threadMarks={threadMarks} onMarkClick={onMarkClick} />
    </Box>
  );
}

export default Tools;
