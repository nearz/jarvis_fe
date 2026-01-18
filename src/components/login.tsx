import { Input, Button } from "@chakra-ui/react";
import { Field } from "@chakra-ui/react";
import { useState } from "react";
import { authService } from "../api/services/authService";
import { useAsyncService } from "../hooks";
import AuthCard from "./AuthCard";

interface LoginProps {
  onLogin: (login: boolean) => void;
  goToRegister: () => void;
}

function Login({ onLogin, goToRegister }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrMsg] = useState<string | null>(null);

  const { execute: login, loading } = useAsyncService(authService.login);

  //TODO: Improve error handling in api/services, and hooks will be able to handle these better.
  //TODO: Use hook callbacks once imrpoved error handling.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login({ email, password });
    if (!result) return;
    if (!result.success) {
      setErrMsg(result.error);
    } else {
      onLogin(true);
    }
  };

  return (
    <AuthCard onSubmit={handleSubmit} errorMessage={errorMsg}>
      <Field.Root w="100%">
        <Field.Label>Email</Field.Label>
        <Input
          type="email"
          placeholder="Email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          bg="gray.900"
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
          _focus={{
            borderColor: "teal.500",
          }}
          required
        />
      </Field.Root>

      <Button
        loading={loading}
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
    </AuthCard>
  );
}

export default Login;
