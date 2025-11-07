import {
  IconButton,
  VStack,
  Text,
  type ConditionalValue,
} from "@chakra-ui/react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface CBTProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  text?: String;
  variant: ConditionalValue<
    "outline" | "solid" | "subtle" | "surface" | "ghost" | "plain" | undefined
  >;
  size: ConditionalValue<
    "sm" | "md" | "lg" | "xl" | "2xl" | "2xs" | "xs" | undefined
  >;
}

function CustomIconButton({ text, icon, size, variant, onClick }: CBTProps) {
  return (
    <VStack>
      <IconButton size={size} variant={variant} onClick={onClick}>
        {icon}
      </IconButton>
      {text && <Text>{text}</Text>}
    </VStack>
  );
}

export default CustomIconButton;
