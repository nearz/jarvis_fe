import { Input, Button } from "@chakra-ui/react";
import { Field } from "@chakra-ui/react";
import { useState } from "react";
import { authService } from "../../api/services/authService";
import { useAsyncService } from "../../hooks";
import AuthCard from "./AuthCard";

interface RegisterProps {
  onRegister: (redirectLogin: boolean) => void;
}

function Register({ onRegister }: RegisterProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrMsg] = useState<string | null>(null);

  const { execute: register, loading } = useAsyncService(authService.register);

  //TODO: Improve error handling in api/services, and hooks will be able to handle these better.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await register({
      email: email,
      password: password,
      password_confirm: confirmPassword,
    });
    if (!result) return;
    if (!result.success) {
      setErrMsg("Registration Failed");
    } else {
      onRegister(false);
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
        loading={loading}
        type="submit"
        w="100%"
        mt={4}
        bg="teal.700"
        _hover={{ bg: "teal.600" }}
        color="white"
      >
        Register
      </Button>
    </AuthCard>
  );
}

export default Register;
