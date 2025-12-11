import { Text, Button, Icon } from "@chakra-ui/react";
import React from "react";

interface ThreadOptProps {
  text: string;
  textIconColor: string;
  children: React.ReactNode;
  hoverColor: string;
  onClick: () => void;
}

function ThreadOptions({
  text,
  children,
  textIconColor,
  hoverColor,
  onClick,
}: ThreadOptProps) {
  return (
    <Button
      variant="plain"
      h="30px"
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

export default ThreadOptions;
