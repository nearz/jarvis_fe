import { Box, Container } from "@chakra-ui/react";

import UserChat from "./userChat";
import ChatHeader from "./chatHeader";
import ChatTools from "./chatTools";
import { useState } from "react";

function Chat() {
  const [ctOpen, setCTOpen] = useState(false);
  return (
    <Box
      display="grid"
      gridTemplateColumns={ctOpen ? "1fr 300px" : "1fr 0px"}
      h="100%"
      w="100%"
      flex="1"
      transition="all 0.3s"
      overflow="hidden"
    >
      <Box
        bg="gray.900"
        position="relative"
        h="100%"
        w="100%"
        display="flex"
        flexDirection="column"
      >
        <ChatHeader onCTToggle={() => setCTOpen(!ctOpen)} />
        <Box flex="1" position="relative">
          <Container
            position="absolute"
            left="50%"
            transform="translate(-50%)"
            mx={3}
            bottom="20px"
            maxW="2xl"
            w="2xl"
            h="calc(100% - 20px)"
            bg="teal"
          ></Container>
          <UserChat />
        </Box>
      </Box>
      <ChatTools
        transition="all 0.3s"
        transform={ctOpen ? "translateX(0)" : "translateX(100%)"}
      />
    </Box>
  );
}

export default Chat;
