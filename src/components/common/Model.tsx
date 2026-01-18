import { Button, Icon, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { CiCircleInfo } from "react-icons/ci";

interface ModelProps {
  modelName: string;
  modelValue: string;
  icon: ReactNode;
  onClick: (name: string) => void;
}

function Model({ modelName, modelValue, icon, onClick }: ModelProps) {
  return (
    <Button
      w="100%"
      p="3px"
      h="30px"
      justifyContent="flex-start"
      variant="ghost"
      onClick={() => onClick?.(modelValue)}
    >
      <Icon size="md">{icon}</Icon>
      <Text textStyle="sm" fontWeight="medium">
        {modelName}
      </Text>
      <Icon>
        <CiCircleInfo />
      </Icon>
    </Button>
  );
}

export default Model;
