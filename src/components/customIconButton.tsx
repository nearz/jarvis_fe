import {
  IconButton,
  Icon,
  VStack,
  Text,
  type SystemStyleObject,
  type ConditionalValue,
} from "@chakra-ui/react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface CustomIconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  iconSize?: number;
  text?: string;
  color?: string;
  bg?: string;
  hover?: SystemStyleObject;
  variant: ConditionalValue<
    "outline" | "solid" | "subtle" | "surface" | "ghost" | "plain" | undefined
  >;
  size: ConditionalValue<
    "sm" | "md" | "lg" | "xl" | "2xl" | "2xs" | "xs" | undefined
  >;
}

function CustomIconButton({
  text,
  color,
  bg,
  hover,
  icon,
  iconSize,
  size,
  variant,
  onClick,
}: CustomIconButtonProps) {
  return (
    <VStack>
      <IconButton
        color={color}
        bg={bg}
        _hover={hover}
        size={size}
        variant={variant}
        onClick={onClick}
      >
        <Icon boxSize={iconSize}>{icon}</Icon>
      </IconButton>
      {text && <Text>{text}</Text>}
    </VStack>
  );
}

export default CustomIconButton;
