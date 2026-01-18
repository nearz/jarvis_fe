import { Card, VStack, Box, Text } from "@chakra-ui/react";

interface AuthCardProps {
  /** The form content to render inside the card */
  children: React.ReactNode;
  /** Error message to display, if any */
  errorMessage?: string | null;
  /** Form submit handler */
  onSubmit: (e: React.FormEvent) => void;
}

/**
 * A centered card layout for authentication forms (login, register, etc.).
 * Provides consistent styling and error display.
 */
function AuthCard({ children, errorMessage, onSubmit }: AuthCardProps) {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minH="100vh"
      bg="gray.900"
    >
      <Card.Root w="400px" bg="gray.800" rounded="md" boxShadow="md">
        <Card.Body>
          <form onSubmit={onSubmit}>
            <VStack gap={4}>
              {children}
              {errorMessage && <Text color="red.500">{errorMessage}</Text>}
            </VStack>
          </form>
        </Card.Body>
      </Card.Root>
    </Box>
  );
}

export default AuthCard;
