import { Card, Input, Button, VStack, Box } from "@chakra-ui/react";
import { Field } from "@chakra-ui/react";
import { useState } from "react";

interface RegisterProps {
  onRegister?: (
    email: string,
    password: string,
    confirmPassword: string,
  ) => void;
}

function Register({ onRegister }: RegisterProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister?.(email, password, confirmPassword);
    console.log(email, password, confirmPassword);
  };

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
          <form onSubmit={handleSubmit}>
            <VStack gap={4}>
              <Field.Root w="100%">
                <Field.Label>Email</Field.Label>
                <Input
                  type="email"
                  placeholder="Email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  bg="gray.900"
                  borderColor="gray.700"
                  _focus={{
                    borderColor: "teal.500",
                  }}
                  required
                />
              </Field.Root>

              <Field.Root w="100%">
                <Field.Label>Password</Field.Label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  bg="gray.900"
                  borderColor="gray.700"
                  _focus={{
                    borderColor: "teal.500",
                  }}
                  required
                />
              </Field.Root>

              <Field.Root w="100%">
                <Field.Label>Confirm Password</Field.Label>
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  bg="gray.900"
                  borderColor="gray.700"
                  _focus={{
                    borderColor: "teal.500",
                  }}
                  required
                />
              </Field.Root>

              <Button
                type="submit"
                w="100%"
                mt={4}
                bg="teal.700"
                _hover={{ bg: "teal.600" }}
                color="white"
              >
                Register
              </Button>
            </VStack>
          </form>
        </Card.Body>
      </Card.Root>
    </Box>
  );
}

export default Register;
