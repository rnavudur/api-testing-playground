import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { KeyValueEditor } from "@/components/key-value-editor";
import { JsonViewer } from "@/components/json-viewer";
import { ApiSuggestions } from "@/components/api-suggestions";
import { RequestAnalyzer } from "@/components/request-analyzer";
import { RequestTemplates } from "@/components/request-templates";
import { ResponseDiff } from "@/components/response-diff";
// API response type definition
interface ApiResponse {
  id: string;
  data: any;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  responseTime: string;
}
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { ApiRequestConfig, ApiRequest } from "@shared/schema";

import { 
  FlaskConical, 
  Send, 
  Copy, 
  History, 
  Save, 
  X, 
  Clock,
  Plus,
  Wand2,
  Sparkles,
  BookOpen,
  BarChart3,
  GitCompare,
  Lightbulb,
  LogOut,
  User,
  Settings
} from "lucide-react";

export default function Home() {
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  
  // Debug logging
  console.log('Home component - user:', user);
  console.log('Home component - authLoading:', authLoading);
  
  // UI State
  const [showSidebar, setShowSidebar] = useState(true);
  const [sidebarTab, setSidebarTab] = useState("suggestions");
  const [activeTab, setActiveTab] = useState("headers");
  const [responseTab, setResponseTab] = useState("body");
  
  // Request Configuration
  const [method, setMethod] = useState<ApiRequestConfig["method"]>("GET");
  const [url, setUrl] = useState("https://api.openweathermap.org/data/2.5/weather");
  
  // Log URL state after initialization
  console.log('URL initialized to:', url);
  const [headers, setHeaders] = useState([
    { key: "Authorization", value: "Bearer your-api-key-here", enabled: true },
    { key: "Content-Type", value: "application/json", enabled: true },
    { key: "", value: "", enabled: true }
  ]);
  const [queryParams, setQueryParams] = useState([
    { key: "q", value: "London", enabled: true },
    { key: "", value: "", enabled: true }
  ]);
  const [body, setBody] = useState(`{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 25
}`);
  
  // Response State
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load request history
  const { data: history = [] } = useQuery<ApiRequest[]>({
    queryKey: ["/api/history"],
  });

  // Make API request function
  async function makeApiRequest(config: ApiRequestConfig) {
    const response = await apiRequest("POST", "/api/proxy", config);
    return response.json();
  }

  // Make API request mutation
  const apiMutation = useMutation({
    mutationFn: makeApiRequest,
    onSuccess: (data) => {
      setResponse(data);
      setError(null);
      queryClient.invalidateQueries({ queryKey: ["/api/history"] });
      toast({
        title: "Request successful",
        description: `${data.status} ${data.statusText} in ${data.responseTime}`,
      });
    },
    onError: (err: any) => {
      setError(err.message || "Request failed");
      setResponse(null);
      toast({
        title: "Request failed",
        description: err.message || "An error occurred while making the request",
        variant: "destructive",
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/auth/logout", {});
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.clear();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Logout failed",
        description: error.message || "Could not log out",
        variant: "destructive",
      });
    },
  });

  const handleSendRequest = () => {
    // Build headers and query params objects
    const headersObj = headers.reduce((acc, { key, value, enabled }) => {
      if (key && value && enabled) acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    const queryParamsObj = queryParams.reduce((acc, { key, value, enabled }) => {
      if (key && value && enabled) acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    const config: ApiRequestConfig = {
      method,
      url,
      headers: headersObj,
      queryParams: queryParamsObj,
      body: body.trim() ? body : undefined,
    };

    apiMutation.mutate(config);
  };

  const loadHistoryItem = (item: ApiRequest) => {
    setMethod(item.method as ApiRequestConfig["method"]);
    setUrl(item.url);
    
    // Convert headers object to key-value pairs
    const headerPairs = Object.entries(item.headers || {}).map(([key, value]) => ({ key, value }));
    headerPairs.push({ key: "", value: "" });
    setHeaders(headerPairs);
    
    // Convert query params object to key-value pairs
    const paramPairs = Object.entries(item.queryParams || {}).map(([key, value]) => ({ key, value }));
    paramPairs.push({ key: "", value: "" });
    setQueryParams(paramPairs);
    
    setBody(item.body || "");
    
    // Load response if available
    if (item.response) {
      setResponse({
        id: item.id,
        data: item.response,
        status: parseInt(item.statusCode || "200"),
        statusText: item.status || "OK",
        headers: item.responseHeaders || {},
        responseTime: item.responseTime || "0ms",
      });
    }
  };

  const copyResponse = async () => {
    if (response) {
      try {
        await navigator.clipboard.writeText(JSON.stringify(response.data, null, 2));
        toast({
          title: "Copied to clipboard",
          description: "Response data has been copied",
        });
      } catch (err) {
        toast({
          title: "Copy failed",
          description: "Could not copy to clipboard",
          variant: "destructive",
        });
      }
    }
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(body);
      setBody(JSON.stringify(parsed, null, 2));
    } catch (err) {
      toast({
        title: "Invalid JSON",
        description: "Could not format the JSON body",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "bg-green-500/20 text-green-400";
    if (status >= 300 && status < 400) return "bg-yellow-500/20 text-yellow-400";
    return "bg-red-500/20 text-red-400";
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET": return "bg-green-100 text-green-800";
      case "POST": return "bg-blue-100 text-blue-800";
      case "PUT": return "bg-yellow-100 text-yellow-800";
      case "DELETE": return "bg-red-100 text-red-800";
      case "PATCH": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getResponseSize = (data: any) => {
    const jsonString = JSON.stringify(data);
    const bytes = new Blob([jsonString]).size;
    return bytes > 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${bytes} bytes`;
  };

  // Handlers for unique features
  const handleSelectApiSuggestion = (suggestion: any) => {
    setMethod(suggestion.config.method);
    setUrl(suggestion.config.url);
    
    // Convert headers to key-value pairs
    const headerPairs = Object.entries(suggestion.config.headers || {}).map(([key, value]) => ({ key, value: String(value), enabled: true }));
    headerPairs.push({ key: "", value: "", enabled: true });
    setHeaders(headerPairs);
    
    // Convert query params to key-value pairs
    const paramPairs = Object.entries(suggestion.config.queryParams || {}).map(([key, value]) => ({ key, value: String(value), enabled: true }));
    paramPairs.push({ key: "", value: "", enabled: true });
    setQueryParams(paramPairs);
    
    if (suggestion.config.body) {
      setBody(suggestion.config.body);
    }

    toast({
      title: "API loaded",
      description: `${suggestion.name} configuration has been applied`,
    });
  };

  const handleSelectTemplate = (template: any, variables: Record<string, string>) => {
    // Replace variables in the template
    const replaceVariables = (text: string): string => {
      let result = text;
      Object.entries(variables).forEach(([key, value]) => {
        result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
      });
      return result;
    };

    setMethod(template.config.method);
    setUrl(replaceVariables(template.config.url));
    
    // Process headers
    const processedHeaders = Object.entries(template.config.headers || {}).map(([key, value]) => ({
      key,
      value: replaceVariables(String(value)),
      enabled: true
    }));
    processedHeaders.push({ key: "", value: "", enabled: true });
    setHeaders(processedHeaders);
    
    // Process query params
    const processedParams = Object.entries(template.config.queryParams || {}).map(([key, value]) => ({
      key,
      value: replaceVariables(String(value)),
      enabled: true
    }));
    processedParams.push({ key: "", value: "", enabled: true });
    setQueryParams(processedParams);
    
    if (template.config.body) {
      setBody(replaceVariables(template.config.body));
    }

    toast({
      title: "Template applied",
      description: `${template.name} template has been configured`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 animate-gradient-x">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center animate-float">
              <FlaskConical className="text-white" size={16} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">API Playground</h1>
              <p className="text-sm text-slate-500">Test any public API without coding</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              onClick={() => setShowSidebar(!showSidebar)}
              className="text-slate-600 hover:text-slate-900"
            >
              <Sparkles className="mr-2" size={16} />
              AI Tools
            </Button>
            
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 text-slate-600 hover:text-slate-900">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm">
                      {user?.firstName?.[0] || user?.username?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline font-medium">
                    {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.username || 'User'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-sm text-slate-500">
                  {user?.email}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {logoutMutation.isPending ? "Signing out..." : "Sign out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-81px)]">
        {/* Intelligent Sidebar */}
        {showSidebar && (
          <div className="w-96 bg-white border-r border-slate-200 flex flex-col">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-medium text-slate-900 flex items-center">
                  <Sparkles className="mr-2 text-blue-600" size={18} />
                  AI-Powered Tools
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSidebar(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X size={16} />
                </Button>
              </div>
              
              {/* Sidebar Tabs */}
              <Tabs value={sidebarTab} onValueChange={setSidebarTab} className="w-full">
                <TabsList className="grid grid-cols-4 w-full bg-slate-100">
                  <TabsTrigger 
                    value="suggestions" 
                    className="text-xs data-[state=active]:bg-white"
                  >
                    <Lightbulb size={12} className="mr-1" />
                    APIs
                  </TabsTrigger>
                  <TabsTrigger 
                    value="templates" 
                    className="text-xs data-[state=active]:bg-white"
                  >
                    <BookOpen size={12} className="mr-1" />
                    Templates
                  </TabsTrigger>
                  <TabsTrigger 
                    value="analysis" 
                    className="text-xs data-[state=active]:bg-white"
                  >
                    <BarChart3 size={12} className="mr-1" />
                    Analysis
                  </TabsTrigger>
                  <TabsTrigger 
                    value="history" 
                    className="text-xs data-[state=active]:bg-white"
                  >
                    <History size={12} className="mr-1" />
                    History
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-hidden">
              <Tabs value={sidebarTab} onValueChange={setSidebarTab} className="h-full">
                <TabsContent value="suggestions" className="h-full m-0 p-4 overflow-y-auto">
                  <ApiSuggestions onSelect={handleSelectApiSuggestion} />
                </TabsContent>
                
                <TabsContent value="templates" className="h-full m-0 p-4 overflow-y-auto">
                  <RequestTemplates onSelect={(template) => handleSelectTemplate(template, {})} />
                </TabsContent>
                
                <TabsContent value="analysis" className="h-full m-0 p-4 overflow-y-auto space-y-4">
                  <RequestAnalyzer 
                    url={url}
                    method={method}
                    headers={headers.reduce((acc, h) => h.key && h.value ? {...acc, [h.key]: h.value} : acc, {})}
                    responseTime={response?.responseTime ? parseInt(String(response.responseTime).replace('ms', '')) : undefined}
                    statusCode={response?.status || undefined}
                  />
                  <ResponseDiff 
                    responses={history.map(item => ({
                      id: item.id,
                      url: item.url,
                      method: item.method,
                      timestamp: item.createdAt || new Date(),
                      data: item.response,
                      status: parseInt(item.statusCode || '200')
                    }))}
                  />
                </TabsContent>
                
                <TabsContent value="history" className="h-full m-0 p-4 overflow-y-auto space-y-2">
                  {history.map((item) => (
                    <Card
                      key={item.id}
                      className="cursor-pointer hover:bg-slate-50 transition-colors"
                      onClick={() => loadHistoryItem(item)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={getMethodColor(item.method)}>
                            {item.method}
                          </Badge>
                          <span className="text-xs text-slate-500 flex items-center">
                            <Clock size={12} className="mr-1" />
                            {item.createdAt ? new Date(item.createdAt).toLocaleString() : "Unknown"}
                          </span>
                        </div>
                        <p className="text-sm font-mono text-slate-700 truncate">{item.url}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Status: {item.statusCode} {item.status}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                  {history.length === 0 && (
                    <div className="text-center text-slate-500 py-8">
                      <p className="text-sm">No requests yet</p>
                      <p className="text-xs mt-1">Make your first API request to see history</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* LARGE URL INPUT SECTION - This should be very visible */}
          <div className="bg-white border-b-2 border-blue-200 p-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                🚀 API Testing Playground
              </h2>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-blue-300">
                <label className="block text-lg font-semibold text-slate-700 mb-3">
                  Enter API URL to Test:
                </label>
                <div className="flex space-x-4">
                  <Select value={method} onValueChange={(value: any) => setMethod(value)}>
                    <SelectTrigger className="w-32 h-12 text-lg font-bold bg-white border-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="url"
                    placeholder="Type URL here: https://jsonplaceholder.typicode.com/posts/1"
                    className="flex-1 h-12 text-lg px-4 bg-white border-2 border-blue-300 focus:border-blue-500"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <Button
                    onClick={handleSendRequest}
                    disabled={apiMutation.isPending}
                    className="h-12 px-8 text-lg bg-blue-500 hover:bg-blue-600 font-bold"
                  >
                    <Send className="mr-2" size={20} />
                    {apiMutation.isPending ? "Sending..." : "SEND REQUEST"}
                  </Button>
                </div>
                <p className="text-sm text-slate-600 mt-3 text-center">
                  Try: https://jsonplaceholder.typicode.com/posts/1 or https://restcountries.com/v3.1/name/usa
                </p>
              </div>
            </div>
          </div>

          {/* Request Panel */}
          <div className="flex-1 flex">
            <div className="flex-1 flex flex-col bg-white">
            {/* Request Configuration Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <div className="border-b border-slate-200">
                <TabsList className="bg-transparent h-auto p-0 px-6">
                  <TabsTrigger 
                    value="headers" 
                    className="px-4 py-3 text-sm font-medium data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none"
                  >
                    Headers
                    <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-600">
                      {headers.filter(h => h.key && h.value).length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="params" 
                    className="px-4 py-3 text-sm font-medium data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none"
                  >
                    Query Params
                    <Badge variant="secondary" className="ml-2 bg-slate-100 text-slate-600">
                      {queryParams.filter(p => p.key && p.value).length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="body" 
                    className="px-4 py-3 text-sm font-medium data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none"
                  >
                    Body
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-hidden">
                <TabsContent value="headers" className="h-full m-0 p-6">
                  <KeyValueEditor
                    pairs={headers}
                    onChange={setHeaders}
                    keyPlaceholder="Header key"
                    valuePlaceholder="Header value"
                  />
                </TabsContent>

                <TabsContent value="params" className="h-full m-0 p-6">
                  <KeyValueEditor
                    pairs={queryParams}
                    onChange={setQueryParams}
                    keyPlaceholder="Parameter key"
                    valuePlaceholder="Parameter value"
                  />
                </TabsContent>

                <TabsContent value="body" className="h-full m-0 p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <label className="text-sm font-medium text-slate-700">Body Type:</label>
                      <Select defaultValue="json">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="json">JSON</SelectItem>
                          <SelectItem value="form">Form Data</SelectItem>
                          <SelectItem value="raw">Raw Text</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={formatJson}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Wand2 className="mr-2" size={16} />
                      Format JSON
                    </Button>
                  </div>
                  <Textarea
                    className="flex-1 resize-none font-mono text-sm"
                    placeholder="Enter request body..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Response Panel */}
          <div className="flex-1 flex flex-col bg-slate-800 border-l border-slate-300">
            {/* Response Header */}
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Response</h2>
                <div className="flex items-center space-x-3">
                  {response && (
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(response.status)}>
                        {response.status} {response.statusText}
                      </Badge>
                      <span className="text-slate-400 text-sm">{response.responseTime}</span>
                    </div>
                  )}
                  {error && (
                    <Badge className="bg-red-500/20 text-red-400">
                      Error
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyResponse}
                    disabled={!response}
                    className="bg-slate-700 text-slate-300 hover:bg-slate-600"
                  >
                    <Copy className="mr-2" size={16} />
                    Copy
                  </Button>
                </div>
              </div>
            </div>

            {/* Response Tabs */}
            <Tabs value={responseTab} onValueChange={setResponseTab} className="flex-1 flex flex-col">
              <div className="border-b border-slate-700">
                <TabsList className="bg-transparent h-auto p-0 px-6">
                  <TabsTrigger 
                    value="body" 
                    className="px-4 py-3 text-sm font-medium text-slate-400 data-[state=active]:text-blue-400 data-[state=active]:border-b-2 data-[state=active]:border-blue-400 data-[state=active]:bg-transparent rounded-none"
                  >
                    Body
                  </TabsTrigger>
                  <TabsTrigger 
                    value="headers" 
                    className="px-4 py-3 text-sm font-medium text-slate-400 data-[state=active]:text-blue-400 data-[state=active]:border-b-2 data-[state=active]:border-blue-400 data-[state=active]:bg-transparent rounded-none"
                  >
                    Headers
                  </TabsTrigger>
                  <TabsTrigger 
                    value="raw" 
                    className="px-4 py-3 text-sm font-medium text-slate-400 data-[state=active]:text-blue-400 data-[state=active]:border-b-2 data-[state=active]:border-blue-400 data-[state=active]:bg-transparent rounded-none"
                  >
                    Raw
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-y-auto">
                <TabsContent value="body" className="h-full m-0 p-6">
                  {apiMutation.isPending ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-slate-400 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p>Sending request...</p>
                      </div>
                    </div>
                  ) : error ? (
                    <div className="text-red-400 font-mono text-sm">
                      <p className="font-semibold mb-2">Error:</p>
                      <p>{error}</p>
                    </div>
                  ) : response ? (
                    <JsonViewer data={response.data} />
                  ) : (
                    <div className="text-slate-400 text-center py-12">
                      <p>No response yet</p>
                      <p className="text-sm mt-1">Send a request to see the response</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="headers" className="h-full m-0 p-6">
                  {response ? (
                    <JsonViewer data={response.headers} />
                  ) : (
                    <div className="text-slate-400 text-center py-12">
                      <p>No response headers yet</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="raw" className="h-full m-0 p-6">
                  {response ? (
                    <pre className="text-sm font-mono text-slate-300 whitespace-pre-wrap">
                      {JSON.stringify(response.data, null, 2)}
                    </pre>
                  ) : (
                    <div className="text-slate-400 text-center py-12">
                      <p>No raw response yet</p>
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>

            {/* Response Footer */}
            {response && (
              <div className="p-4 border-t border-slate-700 bg-slate-900">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Size: {getResponseSize(response.data)}</span>
                  <span className="text-slate-400">Time: {response.responseTime}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
