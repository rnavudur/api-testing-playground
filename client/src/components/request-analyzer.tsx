import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  Zap, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Activity,
  FileText,
  Globe
} from "lucide-react";
import type { ApiResponse } from "@/lib/api-client";

interface RequestAnalysis {
  performance: {
    responseTime: number;
    sizeBytes: number;
    rating: "excellent" | "good" | "average" | "slow";
  };
  security: {
    httpsUsed: boolean;
    suspiciousHeaders: string[];
    score: number;
  };
  data: {
    format: string;
    structure: "simple" | "nested" | "complex";
    arrayCount: number;
    objectCount: number;
  };
  suggestions: string[];
}

interface RequestAnalyzerProps {
  response: ApiResponse | null;
  requestUrl: string;
  requestHeaders: Record<string, string>;
}

export function RequestAnalyzer({ response, requestUrl, requestHeaders }: RequestAnalyzerProps) {
  const [analysis, setAnalysis] = useState<RequestAnalysis | null>(null);

  useEffect(() => {
    if (!response || !requestUrl) {
      setAnalysis(null);
      return;
    }

    const analyzeRequest = (): RequestAnalysis => {
      // Performance analysis
      const responseTimeMs = parseInt(response.responseTime) || 0;
      const jsonString = JSON.stringify(response.data);
      const sizeBytes = new Blob([jsonString]).size;
      
      let performanceRating: RequestAnalysis["performance"]["rating"] = "excellent";
      if (responseTimeMs > 2000) performanceRating = "slow";
      else if (responseTimeMs > 1000) performanceRating = "average";
      else if (responseTimeMs > 500) performanceRating = "good";

      // Security analysis
      const httpsUsed = requestUrl.startsWith("https://");
      const suspiciousHeaders: string[] = [];
      const responseHeaders = response.headers || {};
      
      if (!responseHeaders["x-frame-options"]) suspiciousHeaders.push("Missing X-Frame-Options");
      if (!responseHeaders["x-content-type-options"]) suspiciousHeaders.push("Missing X-Content-Type-Options");
      if (requestHeaders["authorization"] && !httpsUsed) suspiciousHeaders.push("Auth over HTTP");
      
      const securityScore = Math.max(0, 100 - (suspiciousHeaders.length * 20) - (httpsUsed ? 0 : 30));

      // Data structure analysis
      const analyzeStructure = (obj: any, depth = 0): { arrays: number; objects: number; maxDepth: number } => {
        let arrays = 0;
        let objects = 0;
        let maxDepth = depth;

        if (Array.isArray(obj)) {
          arrays = 1;
          obj.forEach(item => {
            const result = analyzeStructure(item, depth + 1);
            arrays += result.arrays;
            objects += result.objects;
            maxDepth = Math.max(maxDepth, result.maxDepth);
          });
        } else if (obj && typeof obj === "object") {
          objects = 1;
          Object.values(obj).forEach(value => {
            const result = analyzeStructure(value, depth + 1);
            arrays += result.arrays;
            objects += result.objects;
            maxDepth = Math.max(maxDepth, result.maxDepth);
          });
        }

        return { arrays, objects, maxDepth };
      };

      const structureInfo = analyzeStructure(response.data);
      let structure: RequestAnalysis["data"]["structure"] = "simple";
      if (structureInfo.maxDepth > 3) structure = "complex";
      else if (structureInfo.maxDepth > 1) structure = "nested";

      // Generate suggestions
      const suggestions: string[] = [];
      if (responseTimeMs > 1000) suggestions.push("Consider caching for better performance");
      if (!httpsUsed) suggestions.push("Use HTTPS for secure communication");
      if (sizeBytes > 100000) suggestions.push("Large response - consider pagination");
      if (response.status >= 400) suggestions.push("Check API documentation for error details");
      if (!response.headers["cache-control"]) suggestions.push("API doesn't specify caching headers");

      return {
        performance: {
          responseTime: responseTimeMs,
          sizeBytes,
          rating: performanceRating
        },
        security: {
          httpsUsed,
          suspiciousHeaders,
          score: securityScore
        },
        data: {
          format: "JSON", // Assuming JSON for now
          structure,
          arrayCount: structureInfo.arrays,
          objectCount: structureInfo.objects
        },
        suggestions
      };
    };

    setAnalysis(analyzeRequest());
  }, [response, requestUrl, requestHeaders]);

  if (!analysis || !response) {
    return (
      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-slate-700 flex items-center">
            <Activity className="mr-2" size={16} />
            Request Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center text-slate-500 py-8">
          <Info size={24} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">Make a request to see detailed analysis</p>
        </CardContent>
      </Card>
    );
  }

  const getPerformanceColor = (rating: string) => {
    switch (rating) {
      case "excellent": return "text-green-600";
      case "good": return "text-blue-600";
      case "average": return "text-yellow-600";
      case "slow": return "text-red-600";
      default: return "text-slate-600";
    }
  };

  const getSecurityColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-slate-700 flex items-center">
          <Activity className="mr-2" size={16} />
          Request Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Performance Metrics */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock size={14} className="text-slate-500" />
              <span className="text-sm font-medium">Performance</span>
            </div>
            <Badge 
              variant="secondary" 
              className={`${getPerformanceColor(analysis.performance.rating)} border-current`}
            >
              {analysis.performance.rating}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-slate-600">Response Time</span>
              <p className="font-mono font-medium">{analysis.performance.responseTime}ms</p>
            </div>
            <div>
              <span className="text-slate-600">Size</span>
              <p className="font-mono font-medium">
                {analysis.performance.sizeBytes > 1024 
                  ? `${(analysis.performance.sizeBytes / 1024).toFixed(1)} KB`
                  : `${analysis.performance.sizeBytes} bytes`
                }
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Security Analysis */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield size={14} className="text-slate-500" />
              <span className="text-sm font-medium">Security</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${getSecurityColor(analysis.security.score)}`}>
                {analysis.security.score}/100
              </span>
              <Progress value={analysis.security.score} className="w-16 h-2" />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">HTTPS</span>
              <div className="flex items-center space-x-1">
                {analysis.security.httpsUsed ? (
                  <CheckCircle size={14} className="text-green-600" />
                ) : (
                  <AlertTriangle size={14} className="text-red-600" />
                )}
                <span className={analysis.security.httpsUsed ? "text-green-600" : "text-red-600"}>
                  {analysis.security.httpsUsed ? "Secure" : "Insecure"}
                </span>
              </div>
            </div>
            
            {analysis.security.suspiciousHeaders.length > 0 && (
              <div className="text-xs text-amber-600 space-y-1">
                {analysis.security.suspiciousHeaders.map((header, i) => (
                  <div key={i} className="flex items-center space-x-1">
                    <AlertTriangle size={12} />
                    <span>{header}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Data Structure */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <FileText size={14} className="text-slate-500" />
            <span className="text-sm font-medium">Data Structure</span>
          </div>
          
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <span className="text-slate-600">Type</span>
              <p className="font-medium capitalize">{analysis.data.structure}</p>
            </div>
            <div>
              <span className="text-slate-600">Arrays</span>
              <p className="font-medium">{analysis.data.arrayCount}</p>
            </div>
            <div>
              <span className="text-slate-600">Objects</span>
              <p className="font-medium">{analysis.data.objectCount}</p>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        {analysis.suggestions.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Zap size={14} className="text-slate-500" />
                <span className="text-sm font-medium">Suggestions</span>
              </div>
              <div className="space-y-1">
                {analysis.suggestions.map((suggestion, i) => (
                  <div key={i} className="text-xs text-slate-600 flex items-start space-x-2">
                    <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}