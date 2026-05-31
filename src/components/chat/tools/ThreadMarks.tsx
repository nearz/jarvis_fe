import type { ThreadMark } from "../../navigation/types";
import { Box, HStack, Icon } from "@chakra-ui/react";
import {
  IoIosArrowDropdown,
  IoIosArrowDropup,
  IoIosCloseCircleOutline,
} from "react-icons/io";
import { useState } from "react";
import H1Mark from "./H1Mark";
import H2Mark from "./H2Mark";
import UserMark from "./UserMark";

interface ThreadMarksProps {
  threadMarks: ThreadMark[];
  onMarkClick: (markID: string) => void;
}

function ThreadMarks({ threadMarks, onMarkClick }: ThreadMarksProps) {
  const [globalToggle, setGlobalToggle] = useState(false);
  return (
    <Box>
      <HStack m={3}>
        <Box
          as="button"
          cursor="pointer"
          p={1.5}
          borderRadius="md"
          bg="gray.700"
          _hover={{ bg: "gray.600" }}
          onClick={() => setGlobalToggle((prev) => !prev)}
        >
          <Icon
            as={globalToggle ? IoIosArrowDropup : IoIosArrowDropdown}
            boxSize="20px"
          />
        </Box>
        <Box
          as="button"
          cursor="pointer"
          p={1.5}
          borderRadius="md"
          bg="gray.700"
          _hover={{ bg: "gray.600" }}
        >
          <Icon as={IoIosCloseCircleOutline} boxSize="20px" />
        </Box>
      </HStack>
      {threadMarks.map((mark) => {
        switch (mark.type) {
          case "user":
            return (
              <UserMark
                key={mark.elemID}
                mark={mark}
                onMarkClick={onMarkClick}
              />
            );
          case "ai-h1":
            return (
              <H1Mark
                key={mark.elemID}
                mark={mark}
                globalToggle={globalToggle}
                onMarkClick={onMarkClick}
              />
            );
          case "ai-h2":
            return (
              <H2Mark key={mark.elemID} mark={mark} onMarkClick={onMarkClick} />
            );
        }
      })}
    </Box>
  );
}

export default ThreadMarks;
