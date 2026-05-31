import { Box, Text, Icon } from "@chakra-ui/react";
import { FaRegUserCircle } from "react-icons/fa";
import type { UserMark as UserMarkType } from "../../navigation/types";
import { Tooltip } from "../../ui/tooltip";
import { truncate } from "../../utils/utils";

interface UserMarkProps {
  mark: UserMarkType;
  onMarkClick: (markID: string) => void;
}

function UserMark({ mark, onMarkClick }: UserMarkProps) {
  return (
    <Box display="flex" justifyContent="flex-end" m={2}>
      <Tooltip
        content={truncate(mark.content, 200)}
        contentProps={{
          css: {
            maxWidth: "300px",
            whiteSpace: "normal",
            "--tooltip-bg": "var(--chakra-colors-gray-900)",
            backgroundColor: "var(--tooltip-bg)",
            color: "white",
            border: "1px solid white",
          },
        }}
        disabled={mark.content.length <= 30}
        openDelay={500}
      >
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          bg="teal.700"
          _hover={{ bg: "teal.600" }}
          p={2}
          borderRadius="md"
          cursor="pointer"
          // w="fit-content"
          maxW="100%"
          onClick={() => onMarkClick(mark.elemID)}
        >
          <Text fontSize="xs" color="white" fontWeight="bold">
            {truncate(mark.content, 30)}
          </Text>
          <Icon as={FaRegUserCircle} boxSize="15px" color="gray.200" />
        </Box>
      </Tooltip>
    </Box>
  );
}

export default UserMark;
