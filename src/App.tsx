import Chat from "./components/chat";
import MainNav from "./components/mainNav";
import Login from "./components/login";
import Register from "./components/register";
import { HStack, Box } from "@chakra-ui/react";
import { useState } from "react";

function App() {
  const [register, setRegister] = useState(false);
  const [loggedIn, setLogin] = useState(false);
  if (loggedIn) {
    return (
      <Box h="100vh" w="100vw" position="relative">
        <HStack h="100%" position="relative" gap={0}>
          <MainNav />
          <Chat />
        </HStack>
      </Box>
    );
  } else {
    if (register) {
      return <Register />;
    } else {
      return (
        <Login
          goToRegister={() => setRegister(!register)}
          onLogin={() => setLogin(!loggedIn)}
        />
      );
    }
  }
}

export default App;
