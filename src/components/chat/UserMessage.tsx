import { Box, Text } from "@chakra-ui/react";
import { memo } from "react";

interface UserMessageProps {
  content: string;
  msgID: string;
}

function UserMessage({ content, msgID }: UserMessageProps) {
  return (
    <Box
      bg="teal.700"
      ml="auto"
      maxW="80%"
      w="fit-content"
      py={2}
      px={4}
      mt={8}
      mb={6}
      borderRadius="md"
      data-thread-msg-type="user"
      id={msgID}
      data-ct-mark={msgID}
    >
      <Text textStyle="l" color="gray.200">
        {content}
      </Text>
    </Box>
  );
}

export default memo(UserMessage);
