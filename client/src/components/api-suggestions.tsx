import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Database, Cloud, Zap } from "lucide-react";

interface ApiSuggestion {
  name: string;
  description: string;
  baseUrl: string;
  category: string;
  icon: React.ElementType;
  popular: boolean;
  config: {
    method: string;
    endpoint: string;
    headers?: Record<string, string>;
    params?: Record<string, string>;
  };
}

interface ApiSuggestionsProps {
  onSelect: (suggestion: ApiSuggestion) => void;
}

const suggestions: ApiSuggestion[] = [
  {
    name: "OpenWeather API",
    description: "Get current weather data for any location",
    baseUrl: "https://api.openweathermap.org",
    category: "Weather",
    icon: Cloud,
    popular: true,
    config: {
      method: "GET",
      endpoint: "/data/2.5/weather?q=London&appid=demo_key",
      params: { q: "London", appid: "demo_key" }
    }
  },
  {
    name: "JSONPlaceholder",
    description: "Fake REST API for testing and prototyping",
    baseUrl: "https://jsonplaceholder.typicode.com",
    category: "Testing",
    icon: Database,
    popular: true,
    config: {
      method: "GET",
      endpoint: "/posts/1"
    }
  },
  {
    name: "REST Countries",
    description: "Get information about countries",
    baseUrl: "https://restcountries.com",
    category: "Geography",
    icon: Globe,
    popular: true,
    config: {
      method: "GET",
      endpoint: "/v3.1/name/canada"
    }
  },
  {
    name: "Random User API",
    description: "Generate random user data",
    baseUrl: "https://randomuser.me",
    category: "Testing",
    icon: Database,
    popular: false,
    config: {
      method: "GET",
      endpoint: "/api/?results=1"
    }
  },
  {
    name: "CoinGecko API",
    description: "Cryptocurrency prices and market data",
    baseUrl: "https://api.coingecko.com",
    category: "Finance",
    icon: Zap,
    popular: true,
    config: {
      method: "GET",
      endpoint: "/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
    }
  },
  {
    name: "GitHub API",
    description: "Access GitHub repositories and user data",
    baseUrl: "https://api.github.com",
    category: "Development",
    icon: Database,
    popular: true,
    config: {
      method: "GET",
      endpoint: "/users/octocat",
      headers: { "User-Agent": "API-Playground" }
    }
  }
];

export function ApiSuggestions({ onSelect }: ApiSuggestionsProps) {
  const popularSuggestions = suggestions.filter(s => s.popular);
  const otherSuggestions = suggestions.filter(s => !s.popular);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium text-slate-900 mb-3">Popular APIs</h3>
        <div className="space-y-2">
          {popularSuggestions.map((suggestion) => (
            <Card key={suggestion.name} className="cursor-pointer hover:bg-slate-50 transition-colors">
              <CardContent className="p-3" onClick={() => onSelect(suggestion)}>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <suggestion.icon size={16} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-medium text-sm text-slate-900">{suggestion.name}</p>
                      <Badge variant="secondary" className="text-xs">{suggestion.category}</Badge>
                    </div>
                    <p className="text-xs text-slate-600">{suggestion.description}</p>
                    <p className="text-xs text-slate-500 mt-1 truncate">{suggestion.config.method} {suggestion.baseUrl}{suggestion.config.endpoint}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-slate-900 mb-3">More APIs</h3>
        <div className="space-y-2">
          {otherSuggestions.map((suggestion) => (
            <Card key={suggestion.name} className="cursor-pointer hover:bg-slate-50 transition-colors">
              <CardContent className="p-3" onClick={() => onSelect(suggestion)}>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <suggestion.icon size={16} className="text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-medium text-sm text-slate-900">{suggestion.name}</p>
                      <Badge variant="outline" className="text-xs">{suggestion.category}</Badge>
                    </div>
                    <p className="text-xs text-slate-600">{suggestion.description}</p>
                    <p className="text-xs text-slate-500 mt-1 truncate">{suggestion.config.method} {suggestion.baseUrl}{suggestion.config.endpoint}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}