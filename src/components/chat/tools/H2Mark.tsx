import { Box, Text } from "@chakra-ui/react";
import type { AiH2Mark } from "../../navigation/types";
import { truncate } from "../../utils/utils";

interface H2MarkProps {
  mark: AiH2Mark;
  onMarkClick: (markID: string) => void;
}

function H2Mark({ mark, onMarkClick }: H2MarkProps) {
  return (
    <Box display="flex" justifyContent="flex-start" m={2}>
      <Box
        bg="gray.600"
        p={2}
        ml={2}
        borderRadius="md"
        cursor="pointer"
        w="fit-content"
        maxW="100%"
        onClick={() => onMarkClick(mark.elemID)}
      >
        <Text fontSize="xs" color="white" fontStyle="italic">
          {truncate(mark.content, 30)}
        </Text>
      </Box>
    </Box>
  );
}

export default H2Mark;
