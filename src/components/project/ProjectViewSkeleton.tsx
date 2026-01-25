import { VStack, HStack, Box, Skeleton, Separator } from "@chakra-ui/react";

function ProjectViewSkeleton() {
  return (
    <Box
      position="absolute"
      left="50%"
      top="18%"
      transform="translate(-50%)"
      maxW="2xl"
      w="100%"
    >
      <VStack align="stretch" w="full">
        <HStack justify="space-between" px={1}>
          {/* Skeleton for the project title */}
          <Skeleton height="36px" width="200px" />
          {/* Skeleton for ProjectUpdate button */}
          <Skeleton height="32px" width="80px" borderRadius="md" />
        </HStack>
        {/* Skeleton for UserChat input area */}
        <Skeleton height="100px" borderRadius={5} />
        {/* Skeleton for thread list */}
        <Box marginTop={4} h="55vh" overflowY="hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <Box key={i}>
              <Separator />
              <HStack justify="space-between" px={4} py={2}>
                <VStack align="start" gap={2}>
                  <Skeleton height="20px" width="250px" />
                  <Skeleton height="16px" width="120px" />
                </VStack>
                <Skeleton height="16px" width="60px" />
              </HStack>
            </Box>
          ))}
        </Box>
      </VStack>
    </Box>
  );
}

export default ProjectViewSkeleton;
