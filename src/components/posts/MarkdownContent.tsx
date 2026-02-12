import ReactMarkdown from "react-markdown";

type Props = {
  content: string;
};

export function MarkdownContent({ content }: Props) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold mt-8 mb-4 text-slate-100">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-semibold mt-6 mb-3 text-slate-100">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-medium mt-4 mb-2 text-slate-200">{children}</h3>
        ),
        p: ({ children }) => <p className="mb-4 text-slate-300 leading-relaxed">{children}</p>,
        ul: ({ children }) => (
          <ul className="list-disc list-inside mb-4 space-y-1 text-slate-300">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside mb-4 space-y-1 text-slate-300">{children}</ol>
        ),
        li: ({ children }) => <li className="ml-2">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-slate-600 pl-4 italic text-slate-400 my-4">
            {children}
          </blockquote>
        ),
        code: ({ className, children, ...props }) => {
          const isInline = !className;
          if (isInline) {
            return (
              <code
                className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-sm"
                {...props}
              >
                {children}
              </code>
            );
          }
          return (
            <code
              className="block p-4 rounded bg-slate-800 text-slate-300 text-sm overflow-x-auto"
              {...props}
            >
              {children}
            </code>
          );
        },
        pre: ({ children }) => <pre className="mb-4 overflow-x-auto">{children}</pre>,
        a: ({ href, children }) => (
          <a
            href={href}
            className="text-slate-200 underline hover:text-cyan-400"
            target={href?.startsWith("http") ? "_blank" : undefined}
            rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
          >
            {children}
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
