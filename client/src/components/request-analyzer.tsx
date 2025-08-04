import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, Clock, Zap, AlertTriangle, CheckCircle, BarChart3, Lightbulb } from "lucide-react";

interface RequestAnalyzerProps {
  url?: string;
  method?: string;
  headers?: Record<string, string>;
  responseTime?: number;
  statusCode?: number;
}

export function RequestAnalyzer({ url, method, headers, responseTime, statusCode }: RequestAnalyzerProps) {
  // Security score calculation
  const calculateSecurityScore = (): number => {
    let score = 100;
    
    if (!url?.startsWith('https://')) score -= 30;
    if (!headers?.['Authorization']) score -= 20;
    if (!headers?.['User-Agent']) score -= 10;
    if (headers?.['Access-Control-Allow-Origin'] === '*') score -= 15;
    
    return Math.max(0, score);
  };

  const securityScore = calculateSecurityScore();
  const performanceScore = responseTime ? Math.max(0, 100 - (responseTime / 50)) : 0;

  const getStatusBadge = () => {
    if (!statusCode) return null;
    
    if (statusCode >= 200 && statusCode < 300) {
      return <Badge className="bg-green-100 text-green-800">Success</Badge>;
    } else if (statusCode >= 400 && statusCode < 500) {
      return <Badge className="bg-red-100 text-red-800">Client Error</Badge>;
    } else if (statusCode >= 500) {
      return <Badge className="bg-red-100 text-red-800">Server Error</Badge>;
    } else {
      return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getRecommendations = (): string[] => {
    const recommendations: string[] = [];
    
    if (!url?.startsWith('https://')) {
      recommendations.push('Use HTTPS for secure communication');
    }
    
    if (!headers?.['Authorization']) {
      recommendations.push('Consider adding authentication headers');
    }
    
    if (!headers?.['User-Agent']) {
      recommendations.push('Add a User-Agent header for better API compatibility');
    }
    
    if (responseTime && responseTime > 2000) {
      recommendations.push('Response time is high - consider caching or optimization');
    }

    if (method === 'GET' && !headers?.['Cache-Control']) {
      recommendations.push('Add Cache-Control headers for better performance');
    }

    return recommendations;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <BarChart3 className="mr-2 text-blue-600" size={20} />
            Request Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status */}
          {statusCode && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Status</span>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm">{statusCode}</span>
                {getStatusBadge()}
              </div>
            </div>
          )}

          {/* Performance */}
          {responseTime && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 flex items-center">
                  <Clock className="mr-1" size={14} />
                  Response Time
                </span>
                <span className="text-sm font-medium">{responseTime}ms</span>
              </div>
              <Progress value={performanceScore} className="h-2" />
              <p className="text-xs text-slate-500">
                {performanceScore > 80 ? 'Excellent' : performanceScore > 60 ? 'Good' : 'Needs Improvement'}
              </p>
            </div>
          )}

          {/* Security Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 flex items-center">
                <Shield className="mr-1" size={14} />
                Security Score
              </span>
              <span className="text-sm font-medium">{securityScore}/100</span>
            </div>
            <Progress value={securityScore} className="h-2" />
            <p className="text-xs text-slate-500">
              {securityScore > 80 ? 'Secure' : securityScore > 60 ? 'Moderate' : 'Needs Attention'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Lightbulb className="mr-2 text-yellow-600" size={20} />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {getRecommendations().length > 0 ? (
            <div className="space-y-2">
              {getRecommendations().map((rec, index) => (
                <div key={index} className="flex items-start space-x-2 text-sm">
                  <AlertTriangle className="mt-0.5 text-yellow-600 flex-shrink-0" size={14} />
                  <span className="text-slate-700">{rec}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-sm text-green-700">
              <CheckCircle size={14} />
              <span>No recommendations - request looks good!</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}