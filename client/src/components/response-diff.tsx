import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { GitCompare, Plus, Minus, Equal } from "lucide-react";

interface ApiResponse {
  id: string;
  url: string;
  method: string;
  timestamp: Date;
  data: any;
  status: number;
}

interface ResponseDiffProps {
  responses: ApiResponse[];
}

export function ResponseDiff({ responses }: ResponseDiffProps) {
  const [selectedResponse1, setSelectedResponse1] = useState<string>("");
  const [selectedResponse2, setSelectedResponse2] = useState<string>("");

  const response1 = responses.find(r => r.id === selectedResponse1);
  const response2 = responses.find(r => r.id === selectedResponse2);

  const getDiff = (obj1: any, obj2: any, path = ""): any[] => {
    const diff: any[] = [];
    
    if (typeof obj1 !== typeof obj2) {
      diff.push({
        type: "changed",
        path,
        from: obj1,
        to: obj2
      });
      return diff;
    }

    if (obj1 === null || obj2 === null) {
      if (obj1 !== obj2) {
        diff.push({
          type: "changed",
          path,
          from: obj1,
          to: obj2
        });
      }
      return diff;
    }

    if (typeof obj1 === "object" && !Array.isArray(obj1)) {
      const keys1 = Object.keys(obj1 || {});
      const keys2 = Object.keys(obj2 || {});
      const allKeys = [...new Set([...keys1, ...keys2])];

      for (const key of allKeys) {
        const newPath = path ? `${path}.${key}` : key;
        
        if (!(key in obj1)) {
          diff.push({
            type: "added",
            path: newPath,
            value: obj2[key]
          });
        } else if (!(key in obj2)) {
          diff.push({
            type: "removed",
            path: newPath,
            value: obj1[key]
          });
        } else {
          diff.push(...getDiff(obj1[key], obj2[key], newPath));
        }
      }
    } else if (Array.isArray(obj1) && Array.isArray(obj2)) {
      const maxLength = Math.max(obj1.length, obj2.length);
      
      for (let i = 0; i < maxLength; i++) {
        const newPath = `${path}[${i}]`;
        
        if (i >= obj1.length) {
          diff.push({
            type: "added",
            path: newPath,
            value: obj2[i]
          });
        } else if (i >= obj2.length) {
          diff.push({
            type: "removed",
            path: newPath,
            value: obj1[i]
          });
        } else {
          diff.push(...getDiff(obj1[i], obj2[i], newPath));
        }
      }
    } else if (obj1 !== obj2) {
      diff.push({
        type: "changed",
        path,
        from: obj1,
        to: obj2
      });
    }

    return diff;
  };

  const renderDiffItem = (item: any, index: number) => {
    const getIcon = () => {
      switch (item.type) {
        case "added": return <Plus className="text-green-600" size={14} />;
        case "removed": return <Minus className="text-red-600" size={14} />;
        case "changed": return <GitCompare className="text-blue-600" size={14} />;
        default: return <Equal className="text-slate-400" size={14} />;
      }
    };

    const getBadgeVariant = () => {
      switch (item.type) {
        case "added": return "bg-green-100 text-green-800";
        case "removed": return "bg-red-100 text-red-800";
        case "changed": return "bg-blue-100 text-blue-800";
        default: return "bg-slate-100 text-slate-800";
      }
    };

    return (
      <div key={index} className="border rounded-lg p-3 space-y-2">
        <div className="flex items-center space-x-2">
          {getIcon()}
          <Badge className={getBadgeVariant()}>{item.type}</Badge>
          <span className="font-mono text-sm text-slate-600">{item.path}</span>
        </div>
        
        {item.type === "changed" && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-red-600 font-medium mb-1">From:</p>
              <pre className="bg-red-50 p-2 rounded text-xs overflow-auto">
                {JSON.stringify(item.from, null, 2)}
              </pre>
            </div>
            <div>
              <p className="text-green-600 font-medium mb-1">To:</p>
              <pre className="bg-green-50 p-2 rounded text-xs overflow-auto">
                {JSON.stringify(item.to, null, 2)}
              </pre>
            </div>
          </div>
        )}
        
        {(item.type === "added" || item.type === "removed") && (
          <pre className={`p-2 rounded text-xs overflow-auto ${
            item.type === "added" ? "bg-green-50" : "bg-red-50"
          }`}>
            {JSON.stringify(item.value, null, 2)}
          </pre>
        )}
      </div>
    );
  };

  const diff = response1 && response2 ? getDiff(response1.data, response2.data) : [];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <GitCompare className="mr-2 text-blue-600" size={20} />
            Response Comparison
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                First Response
              </label>
              <Select value={selectedResponse1} onValueChange={setSelectedResponse1}>
                <SelectTrigger>
                  <SelectValue placeholder="Select response" />
                </SelectTrigger>
                <SelectContent>
                  {responses.map((response) => (
                    <SelectItem key={response.id} value={response.id}>
                      {response.method} {response.url} - {response.timestamp.toLocaleTimeString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Second Response
              </label>
              <Select value={selectedResponse2} onValueChange={setSelectedResponse2}>
                <SelectTrigger>
                  <SelectValue placeholder="Select response" />
                </SelectTrigger>
                <SelectContent>
                  {responses.map((response) => (
                    <SelectItem key={response.id} value={response.id}>
                      {response.method} {response.url} - {response.timestamp.toLocaleTimeString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {response1 && response2 && (
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-slate-900">Differences Found</h4>
                <Badge variant="outline">{diff.length} changes</Badge>
              </div>
              
              {diff.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Equal size={24} className="mx-auto mb-2" />
                  <p>No differences found between responses</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-auto">
                  {diff.map(renderDiffItem)}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}