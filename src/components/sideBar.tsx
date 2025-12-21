import Logo from "./logo";
import { Box, VStack, Icon, IconButton } from "@chakra-ui/react";
import { CiChat2, CiFolderOn } from "react-icons/ci";

interface SideBarProps {
  onChatsToggle: () => void;
  onTrayTwoToggle: () => void;
}

function SideBar({ onChatsToggle, onTrayTwoToggle }: SideBarProps) {
  return (
    <Box
      zIndex={10}
      p={0}
      m={0}
      h="100%"
      minW="70px"
      w="70px"
      bg="gray.800"
      borderRightWidth="2px"
      borderRightColor="gray.900"
    >
      <VStack>
        <Logo />
        <VStack>
          <IconButton
            name="chats"
            size="md"
            variant="ghost"
            onClick={onChatsToggle}
          >
            <Icon boxSize={8}>
              <CiChat2 />
            </Icon>
          </IconButton>
          <IconButton
            name="one"
            size="md"
            variant="ghost"
            onClick={onTrayTwoToggle}
          >
            <Icon boxSize={8}>
              <CiFolderOn />
            </Icon>
          </IconButton>
        </VStack>
      </VStack>
    </Box>
  );
}

export default SideBar;
