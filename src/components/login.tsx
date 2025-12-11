import { Card, Input, Button, VStack, Box, Text } from "@chakra-ui/react";
import { Field } from "@chakra-ui/react";
import { useState } from "react";
import { authService } from "../api/services/authService";

interface LoginProps {
  onLogin: (login: boolean) => void;
  goToRegister: () => void;
}

function Login({ onLogin, goToRegister }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [errorMsg, setErrMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    (async () => {
      const resp = await authService.login({
        email: email,
        password: password,
      });
      if (resp.success) {
        onLogin(true);
      } else {
        setLoginError(true);
        setErrMsg(resp.error);
      }
    })();
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
              {loginError && <Text color="red.500">{errorMsg}</Text>}
              <Button
                type="submit"
                w="100%"
                mt={4}
                bg="teal.700"
                _hover={{ bg: "teal.600" }}
                color="white"
              >
                Login
              </Button>
              <Button
                w="100%"
                mt={4}
                bg="teal.700"
                _hover={{ bg: "teal.600" }}
                color="white"
                onClick={goToRegister}
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

export default Login;
