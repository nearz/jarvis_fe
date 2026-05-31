import { useState, useEffect } from "react";
import { Box, Collapsible, Icon, Text } from "@chakra-ui/react";
import type { AiH1Mark } from "../../navigation/types";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { TbBrandMetabrainz } from "react-icons/tb";
import { truncate } from "../../utils/utils";

interface H1MarkProps {
  mark: AiH1Mark;
  globalToggle: boolean;
  onMarkClick: (markID: string) => void;
}

function H1Mark({ mark, globalToggle, onMarkClick }: H1MarkProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(globalToggle);
  }, [globalToggle]);

  if (mark.h2Marks.length === 0) {
    return (
      <Box display="flex" justifyContent="flex-start" m={2}>
        <Box
          bg="gray.700"
          p={2}
          ml={2}
          borderRadius="md"
          cursor="pointer"
          w="fit-content"
          maxW="100%"
          onClick={() => onMarkClick(mark.elemID)}
        >
          <Text fontSize="xs" color="white" fontWeight="bold">
            {truncate(mark.content, 30)}
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <Collapsible.Root open={open} onOpenChange={({ open: o }) => setOpen(o)}>
      <Box bg="gray.700" borderRadius="md" overflow="hidden" m={2}>
        <Box display="flex">
          <Collapsible.Trigger asChild>
            <Box
              as="button"
              cursor="pointer"
              px={2}
              borderLeftRadius={open ? undefined : "sm"}
              borderTopLeftRadius={open ? "sm" : undefined}
              borderRight="3px"
              borderRightStyle="solid"
              borderRightColor="gray.800"
              _hover={{ bg: "gray.600" }}
            >
              <Icon
                as={open ? FaMinus : FaPlus}
                boxSize="10px"
                color="gray.400"
              />
            </Box>
          </Collapsible.Trigger>
          <Box
            as="button"
            cursor="pointer"
            w="100%"
            borderRightRadius="sm"
            p={2}
            pl={3}
            onClick={() => onMarkClick(mark.elemID)}
            _hover={{ bg: "gray.600" }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Text fontSize="xs" color="white" fontWeight="bold">
                {truncate(mark.content, 30)}
              </Text>
              <Icon as={TbBrandMetabrainz} boxSize="15px" color="gray.200" />
            </Box>
          </Box>
        </Box>
        <Collapsible.Content>
          <Box
            py={2}
            borderTop="3px"
            borderTopColor="gray.800"
            borderTopStyle="solid"
          >
            {mark.h2Marks.map((h2m) => (
              <Box
                key={h2m.elemID}
                px={2}
                py={1}
                // ml={4}
                cursor="pointer"
                borderRadius="sm"
                _hover={{ bg: "gray.600" }}
                onClick={() => onMarkClick(h2m.elemID)}
              >
                <Text fontSize="xs" color="gray.300" fontStyle="italic">
                  {truncate(h2m.content, 30)}
                </Text>
              </Box>
            ))}
          </Box>
        </Collapsible.Content>
      </Box>
    </Collapsible.Root>
  );
}

export default H1Mark;
