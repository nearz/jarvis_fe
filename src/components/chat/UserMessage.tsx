import { Box, Text } from "@chakra-ui/react";
import { memo } from "react";

interface UserMessageProps {
  content: string;
  msgID: string;
  attachedContext?: string;
}

function UserMessage({ content, msgID, attachedContext }: UserMessageProps) {
  return (
    <>
      {attachedContext && (
        <Text textStyle="md" color="gray.700" mt={8}>
          {attachedContext}
        </Text>
      )}
      <Box
        bg="teal.700"
        ml="auto"
        maxW="80%"
        w="fit-content"
        py={2}
        px={4}
        mt={attachedContext ? 2 : 8}
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
    </>
  );
}

export default memo(UserMessage);
