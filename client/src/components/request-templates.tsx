import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  FileText as Template, 
  Plus, 
  Search, 
  User, 
  ShoppingCart, 
  MessageSquare, 
  Mail,
  FileText,
  Database,
  Bookmark
} from "lucide-react";
import type { ApiRequestConfig } from "@shared/schema";

interface RequestTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: any;
  config: ApiRequestConfig;
  variables?: string[];
}

const builtInTemplates: RequestTemplate[] = [
  {
    id: "user-profile",
    name: "User Profile",
    description: "Get user profile information",
    category: "Authentication",
    icon: User,
    config: {
      method: "GET",
      url: "https://api.example.com/users/{{userId}}",
      headers: {
        "Authorization": "Bearer {{token}}",
        "Content-Type": "application/json"
      },
      queryParams: {},
      body: undefined
    },
    variables: ["userId", "token"]
  },
  {
    id: "create-user",
    name: "Create User",
    description: "Register a new user account",
    category: "Authentication",
    icon: User,
    config: {
      method: "POST",
      url: "https://api.example.com/users",
      headers: {
        "Content-Type": "application/json"
      },
      queryParams: {},
      body: JSON.stringify({
        "name": "{{name}}",
        "email": "{{email}}",
        "password": "{{password}}"
      }, null, 2)
    },
    variables: ["name", "email", "password"]
  },
  {
    id: "list-products",
    name: "List Products",
    description: "Get paginated list of products",
    category: "E-commerce",
    icon: ShoppingCart,
    config: {
      method: "GET",
      url: "https://api.example.com/products",
      headers: {
        "Content-Type": "application/json"
      },
      queryParams: {
        "page": "{{page}}",
        "limit": "{{limit}}",
        "category": "{{category}}"
      }
    },
    variables: ["page", "limit", "category"]
  },
  {
    id: "send-message",
    name: "Send Message",
    description: "Send a message or notification",
    category: "Communication",
    icon: MessageSquare,
    config: {
      method: "POST",
      url: "https://api.example.com/messages",
      headers: {
        "Authorization": "Bearer {{token}}",
        "Content-Type": "application/json"
      },
      queryParams: {},
      body: JSON.stringify({
        "to": "{{recipient}}",
        "subject": "{{subject}}",
        "body": "{{message}}"
      }, null, 2)
    },
    variables: ["token", "recipient", "subject", "message"]
  },
  {
    id: "upload-file",
    name: "Upload File",
    description: "Upload a file to the server",
    category: "Files",
    icon: FileText,
    config: {
      method: "POST",
      url: "https://api.example.com/upload",
      headers: {
        "Authorization": "Bearer {{token}}",
        "Content-Type": "multipart/form-data"
      },
      queryParams: {},
      body: "Form data with file field"
    },
    variables: ["token"]
  },
  {
    id: "search-query",
    name: "Search Query",
    description: "Search through database records",
    category: "Search",
    icon: Search,
    config: {
      method: "GET",
      url: "https://api.example.com/search",
      headers: {
        "Content-Type": "application/json"
      },
      queryParams: {
        "q": "{{query}}",
        "type": "{{type}}",
        "sort": "{{sort}}"
      }
    },
    variables: ["query", "type", "sort"]
  }
];

interface RequestTemplatesProps {
  onSelectTemplate: (template: RequestTemplate, variables: Record<string, string>) => void;
}

export function RequestTemplates({ onSelectTemplate }: RequestTemplatesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<RequestTemplate | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredTemplates = builtInTemplates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = Array.from(new Set(builtInTemplates.map(t => t.category)));

  const handleTemplateSelect = (template: RequestTemplate) => {
    setSelectedTemplate(template);
    setIsDialogOpen(true);
    
    // Initialize variables with empty values
    const initialVars: Record<string, string> = {};
    template.variables?.forEach(varName => {
      initialVars[varName] = "";
    });
    setVariables(initialVars);
  };

  const handleApplyTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate, variables);
      setIsDialogOpen(false);
      setSelectedTemplate(null);
      setVariables({});
    }
  };

  const replaceVariables = (text: string, vars: Record<string, string>): string => {
    let result = text;
    Object.entries(vars).forEach(([key, value]) => {
      result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
    });
    return result;
  };

  return (
    <>
      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-slate-700 flex items-center">
            <Template className="mr-2" size={16} />
            Request Templates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {categories.map(category => {
              const categoryTemplates = filteredTemplates.filter(t => t.category === category);
              if (categoryTemplates.length === 0) return null;

              return (
                <div key={category} className="space-y-2">
                  <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    {category}
                  </h4>
                  <div className="space-y-2">
                    {categoryTemplates.map(template => {
                      const IconComponent = template.icon;
                      return (
                        <div
                          key={template.id}
                          className="p-3 border border-slate-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 transition-all"
                          onClick={() => handleTemplateSelect(template)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <IconComponent className="text-slate-600" size={14} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h5 className="font-medium text-slate-900 text-sm">{template.name}</h5>
                                <Badge variant="outline" className="text-xs">
                                  {template.config.method}
                                </Badge>
                              </div>
                              <p className="text-xs text-slate-600 mb-2">{template.description}</p>
                              {template.variables && template.variables.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {template.variables.map(variable => (
                                    <Badge key={variable} variant="secondary" className="text-xs">
                                      {variable}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Template Configuration Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Template size={18} />
              <span>Configure Template</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedTemplate && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <h4 className="font-medium text-sm mb-1">{selectedTemplate.name}</h4>
                <p className="text-xs text-slate-600">{selectedTemplate.description}</p>
              </div>

              {selectedTemplate.variables && selectedTemplate.variables.length > 0 && (
                <div className="space-y-3">
                  <h5 className="text-sm font-medium text-slate-700">Variables</h5>
                  {selectedTemplate.variables.map(variable => (
                    <div key={variable}>
                      <label className="text-xs text-slate-600 mb-1 block">
                        {variable}
                      </label>
                      <Input
                        placeholder={`Enter ${variable}...`}
                        value={variables[variable] || ""}
                        onChange={(e) => setVariables(prev => ({
                          ...prev,
                          [variable]: e.target.value
                        }))}
                        className="text-sm"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <h5 className="text-sm font-medium text-slate-700">Preview</h5>
                <div className="p-3 bg-slate-900 rounded-lg text-slate-300 font-mono text-xs max-h-32 overflow-y-auto">
                  <div className="mb-2">
                    <span className="text-blue-400">{selectedTemplate.config.method}</span>{" "}
                    <span className="text-green-400">
                      {replaceVariables(selectedTemplate.config.url, variables)}
                    </span>
                  </div>
                  {selectedTemplate.config.body && (
                    <div className="text-yellow-400">
                      {replaceVariables(selectedTemplate.config.body, variables)}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleApplyTemplate}
                  className="flex-1"
                >
                  Apply Template
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}