import Model from "./model";
import { useModels } from "../contexts/modelContext";
import { Box, HStack, Text, Button } from "@chakra-ui/react";
import { LuAtom } from "react-icons/lu";

interface ModelSelectProps {
  onModelSelect: (name: string) => void;
}

function ModelSelect({ onModelSelect }: ModelSelectProps) {
  const { models, loading, error, refetch } = useModels();

  // TODO: handle better with spinner
  if (loading) {
    return <Text>Loading</Text>;
  }

  // TODO: Handle better
  if (error || !models?.success) {
    return (
      <Box>
        <Text>Failed to load models</Text>;
        <Button onClick={refetch}>Retry</Button>
      </Box>
    );
  }

  return (
    <Box>
      <HStack my="5px">
        <Text textStyle="xs" color="teal">
          MODELS
        </Text>
        <Box h="1px" w="100%" bg="teal"></Box>
      </HStack>
      {models.supported_models.map((model) => (
        <Model
          key={model.model}
          modelName={model.display_name}
          modelValue={model.model}
          icon={<LuAtom />}
          onClick={onModelSelect}
        />
      ))}
    </Box>
  );
}

export default ModelSelect;
