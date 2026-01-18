import { Center, Popover, Portal } from "@chakra-ui/react";
import type { CenterProps } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import Option from "./option";

/**
 * Configuration for a single menu option
 */
export interface MenuOption {
  /** Display text for the option */
  label: string;
  /** Icon element to display */
  icon: React.ReactNode;
  /** Click handler for this option */
  onClick: (e: React.MouseEvent) => void;
  /** Text and icon color. Default: "white" */
  color?: string;
}

interface OptionsMenuProps extends CenterProps {
  /** Array of menu options to display */
  options: MenuOption[];
  /** Whether the parent container (e.g., tray) is open. Used to auto-close menu. */
  isParentOpen?: boolean;
  /** Callback when menu open state changes */
  onOpenChange?: (isOpen: boolean) => void;
}

/**
 * A reusable popover menu with configurable options.
 * Displays a three-dot trigger that opens a menu with action items.
 *
 * @example
 * ```tsx
 * <OptionsMenu
 *   options={[
 *     { label: "Rename", icon: <LuPencil />, onClick: handleRename },
 *     { label: "Delete", icon: <FaRegTrashCan />, onClick: handleDelete, color: "red.400" },
 *   ]}
 *   isParentOpen={isTrayOpen}
 * />
 * ```
 */
function OptionsMenu({
  options,
  isParentOpen = true,
  onOpenChange,
  ...centerProps
}: OptionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  function handleOpenChange(details: { open: boolean }) {
    setIsOpen(details.open);
    onOpenChange?.(details.open);
  }

  // Close menu when parent closes
  useEffect(() => {
    if (!isParentOpen) {
      setIsOpen(false);
    }
  }, [isParentOpen]);

  return (
    <Popover.Root
      open={isOpen}
      onOpenChange={handleOpenChange}
      lazyMount
      unmountOnExit
      positioning={{ placement: "right-end" }}
      size="xs"
    >
      <Popover.Trigger asChild>
        <Center
          alignSelf="stretch"
          bg="gray.700"
          borderRightRadius={5}
          _hover={{ bg: "teal.800", cursor: "pointer" }}
          {...centerProps}
        >
          <BsThreeDotsVertical />
        </Center>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content w="150px" css={{ "--popover-bg": "colors.gray.700" }}>
            <Popover.Arrow />
            <Popover.Body p={2}>
              {options.map((option) => (
                <Option
                  key={option.label}
                  text={option.label}
                  textIconColor={option.color ?? "white"}
                  hoverColor="gray.800"
                  onClick={option.onClick}
                >
                  {option.icon}
                </Option>
              ))}
            </Popover.Body>
            <Popover.CloseTrigger />
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}

export default OptionsMenu;
