import { Box, Separator, Text, Code, Table } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import { memo, useMemo } from "react";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark-dimmed.min.css";

function createMarkdownComponents(msgID: string): Components {
  let headingIndex = 0;

  const h1Handler = ({ children }: { children?: React.ReactNode }) => {
    const currentIndex = headingIndex++;
    const headingId = `${msgID}-h1-${currentIndex}`;
    return (
      <Text
        fontSize="2xl"
        fontWeight="bold"
        my={2}
        id={headingId}
        data-ct-mark={headingId}
        data-thread-msg-type="ai-h1"
      >
        {children}
      </Text>
    );
  };

  const h2Handler = ({ children }: { children?: React.ReactNode }) => {
    const currentIndex = headingIndex++;
    const headingId = `${msgID}-h2-${currentIndex}`;
    return (
      <Text
        fontSize="xl"
        fontWeight="bold"
        my={2}
        id={headingId}
        data-ct-mark={headingId}
        data-thread-msg-type="ai-h2"
      >
        {children}
      </Text>
    );
  };

  return {
    pre: ({ children }) => (
      <Box as="pre" overflowX="auto" overflowY="auto" my={6} borderRadius="md">
        {children}
      </Box>
    ),
    code: ({ className, children, ...props }) => (
      <Code size="md" bg="gray.800" className={className} {...props}>
        {children}
      </Code>
    ),
    hr: () => <Separator my={6} borderColor="gray.500" size="sm" />,
    h1: h1Handler,
    h2: h2Handler,
    h3: ({ children }) => (
      <Text fontSize="l" fontWeight="bold" my={2}>
        {children}
      </Text>
    ),
    ul: ({ children }) => (
      <Box as="ul" pl={6} my={2} listStyleType="disc">
        {children}
      </Box>
    ),
    ol: ({ children }) => (
      <Box as="ol" pl={6} my={2} listStyleType="decimal">
        {children}
      </Box>
    ),
    li: ({ children }) => (
      <Box as="li" my={1}>
        {children}
      </Box>
    ),
    table: ({ children }) => (
      <Box overflowX="auto" my={8}>
        <Table.Root size="sm" variant="outline">
          {children}
        </Table.Root>
      </Box>
    ),
    thead: ({ children }) => <Table.Header>{children}</Table.Header>,
    tbody: ({ children }) => <Table.Body>{children}</Table.Body>,
    tr: ({ children }) => <Table.Row>{children}</Table.Row>,
    th: ({ children }) => <Table.ColumnHeader>{children}</Table.ColumnHeader>,
    td: ({ children }) => <Table.Cell>{children}</Table.Cell>,
  };
}

interface AiMessageProps {
  content: string;
  msgID: string;
}

function AiMessage({ content, msgID }: AiMessageProps) {
  const markdownComponents = useMemo(
    () => createMarkdownComponents(msgID),
    [msgID],
  );

  return (
    <Box px={3} marginBottom={5} data-thread-msg-type="ai" id={msgID}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
}

export default memo(AiMessage);
