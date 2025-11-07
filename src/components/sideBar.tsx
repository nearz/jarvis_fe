import Logo from "./logo";
import CustomIconButton from "./customIconButton";

import { Box, VStack } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa6";

interface SideBarProps {
  onTrayOneToggle: () => void;
  onTrayTwoToggle: () => void;
}

function SideBar({ onTrayOneToggle, onTrayTwoToggle }: SideBarProps) {
  return (
    <Box zIndex={2} p={0} m={0} h="100%" minW="70px" w="70px" bg="gray.800">
      <VStack>
        <Logo />
        <VStack>
          <CustomIconButton
            name="one"
            size="xs"
            variant="ghost"
            icon={<FaPlus />}
            onClick={onTrayOneToggle}
          />
          <CustomIconButton
            name="two"
            size="xs"
            variant="ghost"
            icon={<FaPlus />}
            onClick={onTrayTwoToggle}
          />
        </VStack>
      </VStack>
    </Box>
  );
}

export default SideBar;
