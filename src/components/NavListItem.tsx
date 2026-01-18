import { Text, VStack, HStack } from "@chakra-ui/react";
import OptionsMenu, { type MenuOption } from "./OptionsMenu";

interface NavListItemProps {
  /** Primary text to display */
  title: string;
  /** Optional secondary text (e.g., model name) */
  subtitle?: string;
  /** Click handler for selecting this item */
  onSelect: () => void;
  /** Menu options for the popover */
  options: MenuOption[];
  /** Whether the parent tray is open (used to auto-close menu) */
  isParentOpen?: boolean;
}

/**
 * A navigation list item with title, optional subtitle, and options menu.
 * Used for threads and projects in the sidebar trays.
 *
 * @example
 * ```tsx
 * // Thread item with subtitle
 * <NavListItem
 *   title="Chat about React hooks"
 *   subtitle="Claude 3.5"
 *   onSelect={() => selectThread(id)}
 *   options={[
 *     { label: "Rename", icon: <LuPencil />, onClick: handleRename },
 *     { label: "Delete", icon: <FaRegTrashCan />, onClick: handleDelete, color: "red.400" },
 *   ]}
 *   isParentOpen={isTrayOpen}
 * />
 *
 * // Project item without subtitle
 * <NavListItem
 *   title="My Project"
 *   onSelect={() => selectProject(id)}
 *   options={[...]}
 * />
 * ```
 */
function NavListItem({
  title,
  subtitle,
  onSelect,
  options,
  isParentOpen = true,
}: NavListItemProps) {
  return (
    <HStack my={1.5} mx={2} gap="2.5px">
      <VStack
        flex={1}
        minW={0}
        align="flex-start"
        gap={0}
        bg="gray.700"
        borderLeftRadius={5}
        p={1}
        onClick={onSelect}
        _hover={{ bg: "teal.700", cursor: "pointer" }}
      >
        <Text
          textStyle="sm"
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
          maxW="100%"
        >
          {title}
        </Text>
        {subtitle && <Text textStyle="sm">{subtitle}</Text>}
      </VStack>
      <OptionsMenu options={options} isParentOpen={isParentOpen} />
    </HStack>
  );
}

export default NavListItem;
