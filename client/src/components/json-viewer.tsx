import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface JsonViewerProps {
  data: any;
  title?: string;
}

export function JsonViewer({ data, title }: JsonViewerProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatJson = (obj: any, depth = 0): JSX.Element => {
    const indent = "  ".repeat(depth);
    
    if (obj === null) return <span className="text-gray-500">null</span>;
    if (obj === undefined) return <span className="text-gray-500">undefined</span>;
    
    if (typeof obj === "string") {
      return <span className="text-green-600">"{obj}"</span>;
    }
    
    if (typeof obj === "number") {
      return <span className="text-blue-600">{obj}</span>;
    }
    
    if (typeof obj === "boolean") {
      return <span className="text-purple-600">{obj.toString()}</span>;
    }
    
    if (Array.isArray(obj)) {
      if (obj.length === 0) return <span>[]</span>;
      
      return (
        <div>
          <span>[</span>
          {obj.map((item, index) => (
            <div key={index} className="ml-4">
              {formatJson(item, depth + 1)}
              {index < obj.length - 1 && <span>,</span>}
            </div>
          ))}
          <span>]</span>
        </div>
      );
    }
    
    if (typeof obj === "object") {
      const keys = Object.keys(obj);
      if (keys.length === 0) return <span>{"{}"}</span>;
      
      return (
        <div>
          <span>{"{"}</span>
          {keys.map((key, index) => (
            <div key={key} className="ml-4">
              <span className="text-blue-800 font-medium">"{key}"</span>
              <span>: </span>
              {formatJson(obj[key], depth + 1)}
              {index < keys.length - 1 && <span>,</span>}
            </div>
          ))}
          <span>{"}"}</span>
        </div>
      );
    }
    
    return <span>{String(obj)}</span>;
  };

  return (
    <div className="bg-slate-50 rounded-lg border border-slate-200">
      {title && (
        <div className="flex items-center justify-between p-3 border-b border-slate-200">
          <h3 className="font-medium text-slate-900">{title}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="text-slate-600 hover:text-slate-900"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </Button>
        </div>
      )}
      <div className="p-4 font-mono text-sm overflow-auto max-h-96">
        {formatJson(data)}
      </div>
    </div>
  );
}