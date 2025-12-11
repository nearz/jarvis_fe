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
      <Model
        modelName="GPT 4o"
        modelValue="gpt-4o"
        icon={<LuAtom />}
        onClick={onModelSelect}
      />
      <Model
        modelName="Claude 3.7 Sonnet"
        modelValue="claude-sonnet-3-7"
        icon={<LuAtom />}
        onClick={onModelSelect}
      />
      <Model
        modelName="Claude 4.5 Sonnet"
        modelValue="claude-sonnet-4-5"
        icon={<LuAtom />}
        onClick={onModelSelect}
      />
    </Box>
  );
}

export default ModelSelect;
