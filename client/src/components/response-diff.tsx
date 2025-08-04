import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GitCompare, ChevronDown, ChevronRight, Plus, Minus, Equal } from "lucide-react";
import type { ApiRequest } from "@shared/schema";

interface DiffItem {
  path: string;
  type: "added" | "removed" | "changed" | "unchanged";
  oldValue?: any;
  newValue?: any;
}

interface ResponseDiffProps {
  currentResponse: any;
  historyRequests: ApiRequest[];
}

export function ResponseDiff({ currentResponse, historyRequests }: ResponseDiffProps) {
  const [selectedHistoryId, setSelectedHistoryId] = useState<string>("");
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());

  const selectedHistoryItem = historyRequests.find(item => item.id === selectedHistoryId);

  const diff = useMemo(() => {
    if (!currentResponse || !selectedHistoryItem?.response) {
      return [];
    }

    const findDifferences = (current: any, previous: any, path = ""): DiffItem[] => {
      const differences: DiffItem[] = [];

      const currentKeys = current && typeof current === "object" ? Object.keys(current) : [];
      const previousKeys = previous && typeof previous === "object" ? Object.keys(previous) : [];
      const allKeys = Array.from(new Set([...currentKeys, ...previousKeys]));

      if (path === "" && JSON.stringify(current) === JSON.stringify(previous)) {
        return [{ path: "root", type: "unchanged", oldValue: previous, newValue: current }];
      }

      for (const key of allKeys) {
        const currentPath = path ? `${path}.${key}` : key;
        const currentValue = current?.[key];
        const previousValue = previous?.[key];

        if (!(key in (current || {}))) {
          differences.push({
            path: currentPath,
            type: "removed",
            oldValue: previousValue
          });
        } else if (!(key in (previous || {}))) {
          differences.push({
            path: currentPath,
            type: "added",
            newValue: currentValue
          });
        } else if (JSON.stringify(currentValue) !== JSON.stringify(previousValue)) {
          if (currentValue && previousValue && typeof currentValue === "object" && typeof previousValue === "object") {
            differences.push(...findDifferences(currentValue, previousValue, currentPath));
          } else {
            differences.push({
              path: currentPath,
              type: "changed",
              oldValue: previousValue,
              newValue: currentValue
            });
          }
        }
      }

      return differences;
    };

    return findDifferences(currentResponse, selectedHistoryItem.response);
  }, [currentResponse, selectedHistoryItem]);

  const togglePath = (path: string) => {
    const newExpanded = new Set(expandedPaths);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedPaths(newExpanded);
  };

  const formatValue = (value: any): string => {
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    if (typeof value === "string") return `"${value}"`;
    if (typeof value === "object") return JSON.stringify(value, null, 2);
    return String(value);
  };

  const getDiffIcon = (type: DiffItem["type"]) => {
    switch (type) {
      case "added": return <Plus size={14} className="text-green-600" />;
      case "removed": return <Minus size={14} className="text-red-600" />;
      case "changed": return <GitCompare size={14} className="text-yellow-600" />;
      case "unchanged": return <Equal size={14} className="text-slate-400" />;
    }
  };

  const getDiffColor = (type: DiffItem["type"]) => {
    switch (type) {
      case "added": return "bg-green-50 border-green-200";
      case "removed": return "bg-red-50 border-red-200";
      case "changed": return "bg-yellow-50 border-yellow-200";
      case "unchanged": return "bg-slate-50 border-slate-200";
    }
  };

  const getTypeColor = (type: DiffItem["type"]) => {
    switch (type) {
      case "added": return "bg-green-100 text-green-800";
      case "removed": return "bg-red-100 text-red-800";
      case "changed": return "bg-yellow-100 text-yellow-800";
      case "unchanged": return "bg-slate-100 text-slate-800";
    }
  };

  if (historyRequests.length === 0) {
    return (
      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-slate-700 flex items-center">
            <GitCompare className="mr-2" size={16} />
            Response Comparison
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center text-slate-500 py-8">
          <p className="text-sm">No history available for comparison</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-slate-700 flex items-center">
          <GitCompare className="mr-2" size={16} />
          Response Comparison
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-600">Compare with previous request:</label>
          <Select value={selectedHistoryId} onValueChange={setSelectedHistoryId}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Select a previous request..." />
            </SelectTrigger>
            <SelectContent>
              {historyRequests.slice(0, 10).map((request) => (
                <SelectItem key={request.id} value={request.id}>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {request.method}
                    </Badge>
                    <span className="font-mono text-xs truncate max-w-48">
                      {request.url}
                    </span>
                    <span className="text-xs text-slate-500">
                      {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : ""}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedHistoryItem && diff.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">
                Changes detected: {diff.filter(d => d.type !== "unchanged").length}
              </span>
              <div className="flex space-x-1">
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                  +{diff.filter(d => d.type === "added").length}
                </Badge>
                <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700">
                  ~{diff.filter(d => d.type === "changed").length}
                </Badge>
                <Badge variant="outline" className="text-xs bg-red-50 text-red-700">
                  -{diff.filter(d => d.type === "removed").length}
                </Badge>
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2">
              {diff.slice(0, 20).map((item, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${getDiffColor(item.type)}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getDiffIcon(item.type)}
                      <span className="font-mono text-xs text-slate-700">{item.path}</span>
                    </div>
                    <Badge variant="outline" className={`text-xs ${getTypeColor(item.type)}`}>
                      {item.type}
                    </Badge>
                  </div>

                  {item.type === "changed" && (
                    <div className="space-y-2">
                      <div className="bg-red-50 border-l-4 border-red-300 p-2 rounded">
                        <div className="text-xs text-red-600 font-medium mb-1">Before:</div>
                        <code className="text-xs text-red-800 break-all">
                          {formatValue(item.oldValue)}
                        </code>
                      </div>
                      <div className="bg-green-50 border-l-4 border-green-300 p-2 rounded">
                        <div className="text-xs text-green-600 font-medium mb-1">After:</div>
                        <code className="text-xs text-green-800 break-all">
                          {formatValue(item.newValue)}
                        </code>
                      </div>
                    </div>
                  )}

                  {item.type === "added" && (
                    <div className="bg-green-50 border-l-4 border-green-300 p-2 rounded">
                      <div className="text-xs text-green-600 font-medium mb-1">Added:</div>
                      <code className="text-xs text-green-800 break-all">
                        {formatValue(item.newValue)}
                      </code>
                    </div>
                  )}

                  {item.type === "removed" && (
                    <div className="bg-red-50 border-l-4 border-red-300 p-2 rounded">
                      <div className="text-xs text-red-600 font-medium mb-1">Removed:</div>
                      <code className="text-xs text-red-800 break-all">
                        {formatValue(item.oldValue)}
                      </code>
                    </div>
                  )}
                </div>
              ))}

              {diff.length > 20 && (
                <div className="text-center text-slate-500 text-xs py-2">
                  ... and {diff.length - 20} more changes
                </div>
              )}
            </div>
          </div>
        )}

        {selectedHistoryItem && diff.length === 0 && (
          <div className="text-center text-slate-500 py-4">
            <Equal size={24} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No differences found</p>
            <p className="text-xs">Responses are identical</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}