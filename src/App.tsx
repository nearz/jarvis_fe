import Chat from "./components/chat";
import MainNav from "./components/mainNav";
import Login from "./components/login";
import Register from "./components/register";
import { HStack, Box } from "@chakra-ui/react";
import { useState } from "react";

function App() {
  const [register, setRegister] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);

  function handleSelectThread(threadID: string) {
    console.log(threadID);
    setSelectedThread(threadID);
  }

  if (loggedIn) {
    return (
      <Box
        h="100vh"
        w="100vw"
        position="relative"
        overflowX="hidden"
        overflowY="hidden"
      >
        <HStack h="100%" position="relative" gap={0}>
          <MainNav onSelectThread={handleSelectThread} />
          <Chat
            onNewChat={handleSelectThread}
            selectedThreadID={selectedThread}
          />
        </HStack>
      </Box>
    );
  } else {
    if (register) {
      return <Register onRegister={setRegister} />;
    } else {
      return (
        <Login
          goToRegister={() => setRegister(!register)}
          onLogin={setLoggedIn}
        />
      );
    }
  }
}

export default App;
