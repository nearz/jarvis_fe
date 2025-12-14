import { Box, Separator, Text, Code, Table } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark-dimmed.min.css";

const HeadingHandler = ({ children }: { children?: React.ReactNode }) => (
  <Text fontSize="xl" fontWeight="bold" my={2}>
    {children}
  </Text>
);

function AiMessage({ content }: { content: string }) {
  return (
    <Box px={3} marginBottom={5}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          pre: ({ children }) => (
            <Box
              as="pre"
              overflowX="auto"
              overflowY="auto"
              my={6}
              borderRadius="md"
            >
              {children}
            </Box>
          ),
          code: ({ className, children, ...props }) => (
            <Code size="md" bg="gray.800" className={className} {...props}>
              {children}
            </Code>
          ),
          hr: () => <Separator my={6} borderColor="gray.500" size="sm" />,
          h1: HeadingHandler,
          h2: HeadingHandler,
          h3: HeadingHandler,
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
          th: ({ children }) => (
            <Table.ColumnHeader>{children}</Table.ColumnHeader>
          ),
          td: ({ children }) => <Table.Cell>{children}</Table.Cell>,
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
}

export default AiMessage;
