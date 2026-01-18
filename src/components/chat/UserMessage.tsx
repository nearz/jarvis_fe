import { Box, Text } from "@chakra-ui/react";

function UserMessage({ content }: { content: string }) {
  return (
    <Box bg="gray.800" py={2} px={4} mt={8} mb={6} borderRadius="md">
      <Text textStyle="xl" color="gray.200">
        {content}
      </Text>
    </Box>
  );
}

export default UserMessage;
