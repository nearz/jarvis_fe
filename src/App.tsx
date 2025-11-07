import Chat from "./components/chat";
import MainNav from "./components/mainNav";

import { HStack, Box } from "@chakra-ui/react";

function App() {
  return (
    <Box h="100vh" w="100vw" position="relative">
      <HStack h="100%" position="relative" gap={0}>
        <MainNav />
        <Chat />
      </HStack>
    </Box>
  );
}

export default App;
