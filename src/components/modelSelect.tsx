import Model from "./model";
import { Box, HStack, Text } from "@chakra-ui/react";
import { LuAtom } from "react-icons/lu";

interface ModelSelectProps {
  onModelSelect: (name: string) => void;
}

function ModelSelect({ onModelSelect }: ModelSelectProps) {
  return (
    <Box>
      <HStack my="5px">
        <Text textStyle="xs" color="teal">
          GENERAL
        </Text>
        <Box h="1px" w="100%" bg="teal"></Box>
      </HStack>
      <Model name="GPT 4o" icon={<LuAtom />} onClick={onModelSelect} />
      <Model
        name="Claude 3.7 Sonnet"
        icon={<LuAtom />}
        onClick={onModelSelect}
      />
    </Box>
  );
}

export default ModelSelect;
