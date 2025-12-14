import { Text, Button, Icon } from "@chakra-ui/react";
import React from "react";

interface OptionProps {
  text: string;
  textIconColor: string;
  children: React.ReactNode;
  hoverColor: string;
  onClick: () => void;
}

function Option({
  text,
  children,
  textIconColor,
  hoverColor,
  onClick,
}: OptionProps) {
  return (
    <Button
      variant="plain"
      h="30px"
      w="100%"
      justifyContent="flex-start"
      px={2}
      _hover={{ bg: hoverColor }}
      onClick={onClick}
    >
      <Icon size="sm" color={textIconColor}>
        {children}
      </Icon>
      <Text textStyle="md" color={textIconColor}>
        {text}
      </Text>
    </Button>
  );
}

export default Option;
