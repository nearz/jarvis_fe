import { Input, Button } from "@chakra-ui/react";
import { Field } from "@chakra-ui/react";
import { useState } from "react";
import { authService } from "../../api/services/authService";
import { useAsyncService } from "../../hooks";
import AuthCard from "./AuthCard";

interface LoginProps {
  onLogin: (login: boolean) => void;
  goToRegister: () => void;
}

function Login({ onLogin, goToRegister }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrMsg] = useState<string | null>(null);

  //TODO: Improve error handling in api/services, and hooks will be able to handle these better.
  const { execute: login, loading } = useAsyncService(authService.login, {
    onSuccess: (result) => {
      if (result.success) {
        onLogin(true);
      } else {
        setErrMsg(result.error);
      }
    },
    onError: (err) => {
      console.error(err);
      setErrMsg("Network Error");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
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
