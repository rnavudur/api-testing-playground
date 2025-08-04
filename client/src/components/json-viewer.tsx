import { useEffect, useRef } from "react";

interface JsonViewerProps {
  data: any;
  className?: string;
}

export function JsonViewer({ data, className = "" }: JsonViewerProps) {
  const preRef = useRef<HTMLPreElement>(null);

  const formatJson = (obj: any): string => {
    if (obj === null) return '<span class="json-null">null</span>';
    if (obj === undefined) return '<span class="json-null">undefined</span>';
    if (typeof obj === "boolean") return `<span class="json-boolean">${obj}</span>`;
    if (typeof obj === "number") return `<span class="json-number">${obj}</span>`;
    if (typeof obj === "string") return `<span class="json-string">"${obj}"</span>`;

    if (Array.isArray(obj)) {
      if (obj.length === 0) return "[]";
      const items = obj.map((item, index) => {
        const comma = index < obj.length - 1 ? "," : "";
        return `  ${formatJson(item)}${comma}`;
      });
      return `[\n${items.join("\n")}\n]`;
    }

    if (typeof obj === "object") {
      const keys = Object.keys(obj);
      if (keys.length === 0) return "{}";
      
      const items = keys.map((key, index) => {
        const comma = index < keys.length - 1 ? "," : "";
        return `  <span class="json-key">"${key}"</span>: ${formatJson(obj[key])}${comma}`;
      });
      return `{\n${items.join("\n")}\n}`;
    }

    return String(obj);
  };

  useEffect(() => {
    if (preRef.current) {
      preRef.current.innerHTML = formatJson(data);
    }
  }, [data]);

  return (
    <pre
      ref={preRef}
      className={`text-sm font-mono leading-relaxed ${className}`}
      style={{
        color: "var(--code-text)",
      }}
    />
  );
}
