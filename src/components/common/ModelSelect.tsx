import { useState, useMemo, type ReactNode } from "react";
import Model from "./Model";
import { useModels } from "../../contexts/modelContext";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  IconButton,
  Icon,
} from "@chakra-ui/react";
import { LuAtom } from "react-icons/lu";
import { SiOpenai, SiAnthropic, SiGoogle, SiMeta } from "react-icons/si";
import type { ModelMetaData } from "../../api/types";

/** Map provider identifiers to their brand icons */
const providerIcons: Record<string, ReactNode> = {
  openai: <SiOpenai />,
  anthropic: <SiAnthropic />,
  google: <SiGoogle />,
  meta: <SiMeta />,
};

function getProviderIcon(provider: string): ReactNode {
  return providerIcons[provider] ?? <LuAtom />;
}

interface ModelSelectProps {
  onModelSelect: (name: string) => void;
}

function ModelSelect({ onModelSelect }: ModelSelectProps) {
  const { models, loading, error, refetch } = useModels();
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  /** Group models by provider, preserving order of first appearance */
  const providerGroups = useMemo(() => {
    if (!models?.success) return new Map<string, ModelMetaData[]>();
    const groups = new Map<string, ModelMetaData[]>();
    for (const model of models.supported_models) {
      const key = model.provider;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(model);
    }
    return groups;
  }, [models]);

  /** The list of unique providers */
  const providers = useMemo(
    () => Array.from(providerGroups.keys()),
    [providerGroups],
  );

  /** Auto-select the first provider once data loads */
  const activeProvider = selectedProvider ?? providers[0] ?? null;

  /** Models for the currently selected provider */
  const activeModels = activeProvider
    ? (providerGroups.get(activeProvider) ?? [])
    : [];

  /** Display name for the active provider */
  const activeProviderName =
    activeModels[0]?.provider_display_name ?? activeProvider ?? "";

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
    <HStack align="stretch" h="100%" gap={0}>
      {/* Provider sidebar */}
      <VStack
        gap={1}
        p={3}
        borderRightWidth="1px"
        borderColor="gray.700"
        minW="46px"
      >
        {providers.map((provider) => (
          <IconButton
            key={provider}
            aria-label={provider}
            size="sm"
            variant={provider === activeProvider ? "solid" : "ghost"}
            colorPalette={provider === activeProvider ? "teal" : "gray"}
            onClick={() => setSelectedProvider(provider)}
          >
            <Icon boxSize={5}>{getProviderIcon(provider)}</Icon>
          </IconButton>
        ))}
      </VStack>

      {/* Model list */}
      <Box flex={1} overflowY="auto" p={3}>
        <HStack my="5px">
          <Text textStyle="xs" color="teal" whiteSpace="nowrap">
            {activeProviderName.toUpperCase()}
          </Text>
          <Box h="1px" w="100%" bg="teal" />
        </HStack>
        {activeModels.map((model) => (
          <Model
            key={model.model}
            modelName={model.display_name}
            modelValue={model.model}
            icon={getProviderIcon(model.provider)}
            onClick={onModelSelect}
          />
        ))}
      </Box>
    </HStack>
  );
}

export default ModelSelect;
