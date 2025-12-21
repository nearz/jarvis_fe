import Chat from "./components/chat";
import MainNav from "./components/mainNav";
import Login from "./components/login";
import Register from "./components/register";
import { HStack, Box } from "@chakra-ui/react";
import { useState } from "react";
import { ModelsProvider } from "./contexts/modelContext";

function App() {
  const [register, setRegister] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [selectedThread, setSelectedThread] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<string>("");

  function handleSelectThread(threadID: string) {
    setSelectedThread(threadID);
    setSelectedProject("");
  }

  function handleSyncIDs(threadID: string, projectID: string) {
    setSelectedThread(threadID);
    setSelectedProject(projectID);
  }

  function handleSelectProject(projectID: string) {
    setSelectedProject(projectID);
    setSelectedThread("");
  }

  if (loggedIn) {
    return (
      <ModelsProvider>
        <Box
          h="100vh"
          w="100vw"
          position="relative"
          overflowX="hidden"
          overflowY="hidden"
        >
          <HStack h="100%" position="relative" gap={0}>
            <MainNav
              onSelectThread={handleSelectThread}
              onSelectProject={handleSelectProject}
            />
            <Chat
              selectedProjectID={selectedProject}
              selectedThreadID={selectedThread}
              onSyncIDs={handleSyncIDs}
            />
          </HStack>
        </Box>
      </ModelsProvider>
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
