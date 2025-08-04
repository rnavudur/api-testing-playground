import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Globe, Database, Cloud, Zap } from "lucide-react";

interface RequestTemplate {
  name: string;
  description: string;
  category: string;
  icon: React.ElementType;
  config: {
    method: string;
    url: string;
    headers?: Record<string, string>;
    body?: string;
  };
}

interface RequestTemplatesProps {
  onSelect: (template: RequestTemplate) => void;
}

const templates: RequestTemplate[] = [
  {
    name: "REST API GET",
    description: "Basic GET request with common headers",
    category: "REST",
    icon: Globe,
    config: {
      method: "GET",
      url: "https://api.example.com/users/1",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "API-Playground/1.0"
      }
    }
  },
  {
    name: "REST API POST",
    description: "POST request with JSON body",
    category: "REST",
    icon: Database,
    config: {
      method: "POST",
      url: "https://api.example.com/users",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_TOKEN"
      },
      body: JSON.stringify({
        name: "John Doe",
        email: "john@example.com"
      }, null, 2)
    }
  },
  {
    name: "GraphQL Query",
    description: "GraphQL query with variables",
    category: "GraphQL",
    icon: Zap,
    config: {
      method: "POST",
      url: "https://api.example.com/graphql",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_TOKEN"
      },
      body: JSON.stringify({
        query: `query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
  }
}`,
        variables: {
          id: "1"
        }
      }, null, 2)
    }
  },
  {
    name: "Form Data POST",
    description: "POST with form data",
    category: "Forms",
    icon: FileText,
    config: {
      method: "POST",
      url: "https://api.example.com/upload",
      headers: {
        "Content-Type": "multipart/form-data"
      },
      body: "file=@example.jpg&title=My Image"
    }
  },
  {
    name: "Weather API",
    description: "OpenWeatherMap API call",
    category: "APIs",
    icon: Cloud,
    config: {
      method: "GET",
      url: "https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_API_KEY",
      headers: {
        "User-Agent": "API-Playground/1.0"
      }
    }
  },
  {
    name: "Authenticated DELETE",
    description: "DELETE request with authentication",
    category: "REST",
    icon: Database,
    config: {
      method: "DELETE",
      url: "https://api.example.com/users/1",
      headers: {
        "Authorization": "Bearer YOUR_TOKEN",
        "Content-Type": "application/json"
      }
    }
  }
];

export function RequestTemplates({ onSelect }: RequestTemplatesProps) {
  const categories = Array.from(new Set(templates.map(t => t.category)));

  return (
    <div className="space-y-4">
      {categories.map(category => (
        <div key={category}>
          <h3 className="font-medium text-slate-900 mb-3">{category} Templates</h3>
          <div className="space-y-2">
            {templates
              .filter(template => template.category === category)
              .map((template) => (
                <Card key={template.name} className="cursor-pointer hover:bg-slate-50 transition-colors">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <template.icon size={16} className="text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="font-medium text-sm text-slate-900">{template.name}</p>
                            <Badge variant="outline" className="text-xs">{template.config.method}</Badge>
                          </div>
                          <p className="text-xs text-slate-600 mb-2">{template.description}</p>
                          <p className="text-xs text-slate-500 font-mono truncate">
                            {template.config.url}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSelect(template)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 ml-2"
                      >
                        Use
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}