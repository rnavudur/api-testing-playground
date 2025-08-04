import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Cloud, 
  Globe, 
  Rocket, 
  Zap, 
  MapPin, 
  Star,
  Database,
  Image,
  Music,
  BookOpen
} from "lucide-react";

interface ApiSuggestion {
  name: string;
  description: string;
  url: string;
  method: "GET" | "POST";
  category: string;
  icon: any;
  headers?: Record<string, string>;
  queryParams?: Record<string, string>;
  body?: string;
  requiresAuth: boolean;
}

const apiSuggestions: ApiSuggestion[] = [
  {
    name: "OpenWeather",
    description: "Get current weather data for any city",
    url: "https://api.openweathermap.org/data/2.5/weather",
    method: "GET",
    category: "Weather",
    icon: Cloud,
    queryParams: { q: "London", appid: "your-api-key" },
    requiresAuth: true
  },
  {
    name: "SpaceX Launches",
    description: "Latest SpaceX rocket launch information",
    url: "https://api.spacexdata.com/v4/launches/latest",
    method: "GET",
    category: "Space",
    icon: Rocket,
    requiresAuth: false
  },
  {
    name: "Lorem Picsum",
    description: "Random placeholder images",
    url: "https://picsum.photos/v2/list",
    method: "GET",
    category: "Images",
    icon: Image,
    queryParams: { limit: "10" },
    requiresAuth: false
  },
  {
    name: "REST Countries",
    description: "Information about countries worldwide",
    url: "https://restcountries.com/v3.1/name/france",
    method: "GET",
    category: "Geography",
    icon: Globe,
    requiresAuth: false
  },
  {
    name: "JSONPlaceholder",
    description: "Fake online REST API for testing",
    url: "https://jsonplaceholder.typicode.com/posts",
    method: "GET",
    category: "Testing",
    icon: Database,
    requiresAuth: false
  },
  {
    name: "Cat Facts",
    description: "Random cat facts API",
    url: "https://catfact.ninja/fact",
    method: "GET",
    category: "Fun",
    icon: Star,
    requiresAuth: false
  },
  {
    name: "GitHub User",
    description: "GitHub user profile information",
    url: "https://api.github.com/users/octocat",
    method: "GET",
    category: "Developer",
    icon: BookOpen,
    headers: { "User-Agent": "API-Playground" },
    requiresAuth: false
  },
  {
    name: "IP Geolocation",
    description: "Get location info for any IP address",
    url: "https://ipapi.co/8.8.8.8/json/",
    method: "GET",
    category: "Network",
    icon: MapPin,
    requiresAuth: false
  }
];

interface ApiSuggestionsProps {
  onSelectApi: (suggestion: ApiSuggestion) => void;
}

export function ApiSuggestions({ onSelectApi }: ApiSuggestionsProps) {
  const categories = Array.from(new Set(apiSuggestions.map(api => api.category)));

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Popular APIs to Try</h3>
        <p className="text-sm text-slate-600">Click any API below to auto-fill the request configuration</p>
      </div>

      {categories.map(category => (
        <div key={category} className="space-y-3">
          <h4 className="text-sm font-medium text-slate-700 flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            {category}
          </h4>
          <div className="grid grid-cols-1 gap-3">
            {apiSuggestions
              .filter(api => api.category === category)
              .map((api) => {
                const IconComponent = api.icon;
                return (
                  <Card 
                    key={api.name}
                    className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-blue-300"
                    onClick={() => onSelectApi(api)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <IconComponent className="text-blue-600" size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h5 className="font-medium text-slate-900 text-sm">{api.name}</h5>
                              <Badge 
                                variant={api.method === "GET" ? "secondary" : "default"}
                                className="text-xs"
                              >
                                {api.method}
                              </Badge>
                              {api.requiresAuth && (
                                <Badge variant="outline" className="text-xs text-orange-600 border-orange-300">
                                  API Key
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 mb-2">{api.description}</p>
                            <p className="text-xs font-mono text-slate-500 truncate">{api.url}</p>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="text-blue-600 hover:text-blue-800 text-xs px-2"
                        >
                          Try It
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}