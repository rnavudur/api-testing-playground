import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FlaskConical, 
  Sparkles, 
  Zap, 
  Shield, 
  BarChart3, 
  GitCompare,
  ArrowRight,
  Play,
  Globe,
  Rocket,
  Code,
  CheckCircle,
  Star
} from "lucide-react";

export default function Landing() {
  const [demoStep, setDemoStep] = useState(0);

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Suggestions",
      description: "Smart API recommendations with one-click configuration for popular services like OpenWeather, SpaceX, and GitHub.",
      color: "bg-blue-500"
    },
    {
      icon: Code,
      title: "Request Templates",
      description: "Pre-built templates with variable substitution for common patterns like user creation, authentication, and data fetching.",
      color: "bg-purple-500"
    },
    {
      icon: BarChart3,
      title: "Live Performance Analysis",
      description: "Real-time metrics including response time, security scoring, and optimization suggestions for every request.",
      color: "bg-green-500"
    },
    {
      icon: GitCompare,
      title: "Response Comparison",
      description: "Advanced diff tool to compare responses between different API calls and spot changes instantly.",
      color: "bg-orange-500"
    },
    {
      icon: Shield,
      title: "Security Insights",
      description: "Automatic security analysis with HTTPS validation, header inspection, and vulnerability detection.",
      color: "bg-red-500"
    },
    {
      icon: Zap,
      title: "Instant Testing",
      description: "Test any public API without coding. Support for all HTTP methods with syntax-highlighted responses.",
      color: "bg-yellow-500"
    }
  ];

  const popularAPIs = [
    { name: "OpenWeather", category: "Weather", usage: "12M+ requests" },
    { name: "SpaceX", category: "Space Data", usage: "8M+ requests" },
    { name: "GitHub", category: "Developer", usage: "15M+ requests" },
    { name: "REST Countries", category: "Geography", usage: "5M+ requests" },
    { name: "JSONPlaceholder", category: "Testing", usage: "20M+ requests" },
    { name: "Cat Facts", category: "Fun", usage: "3M+ requests" }
  ];

  const demoSteps = [
    "Click 'AI Tools' to open intelligent sidebar",
    "Select from 8+ pre-configured popular APIs",
    "Watch as configuration auto-fills",
    "Send request and view analysis",
    "Compare with previous responses"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FlaskConical className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  API Playground
                </h1>
                <p className="text-xs text-slate-500">AI-Powered Testing</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/login">
                <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-100">
              <Sparkles className="mr-2" size={14} />
              Next-Generation API Testing
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-tight">
              Test APIs with
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                AI Intelligence
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              The first API testing playground powered by AI. Get smart suggestions, instant analysis, 
              and comprehensive insights for every request. No coding required.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/signup">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 text-lg">
                  <Play className="mr-2" size={20} />
                  Start Testing APIs
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-slate-300 hover:bg-slate-50">
                <Globe className="mr-2" size={20} />
                View Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">50M+</div>
                <div className="text-slate-600">API Requests Tested</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">100+</div>
                <div className="text-slate-600">Pre-configured APIs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">99.9%</div>
                <div className="text-slate-600">Uptime Reliability</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Features that make the difference
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Everything you need to test, analyze, and optimize your API interactions with intelligent automation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="border-slate-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardHeader className="pb-4">
                    <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                      <IconComponent className="text-white" size={24} />
                    </div>
                    <CardTitle className="text-xl text-slate-900">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular APIs Section */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Popular APIs Ready to Test
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Start testing immediately with pre-configured popular APIs. No setup required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularAPIs.map((api, index) => (
              <Card key={index} className="border-slate-200 hover:shadow-md transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-900">{api.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {api.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{api.usage}</p>
                  <div className="flex items-center text-blue-600 text-sm font-medium">
                    <Rocket size={14} className="mr-1" />
                    One-click setup
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              How it works
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Get started in seconds with our intuitive workflow
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {demoSteps.map((step, index) => (
                <div key={index} className="flex items-center space-x-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-lg text-slate-800">{step}</p>
                  </div>
                  <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to supercharge your API testing?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who trust API Playground for intelligent API testing and analysis.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold">
                Get Started Free
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FlaskConical className="text-white" size={16} />
            </div>
            <span className="text-xl font-bold text-white">API Playground</span>
          </div>
          <p className="text-slate-400 mb-6">
            The intelligent way to test and analyze APIs
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm">
            <Star className="text-yellow-400" size={16} />
            <span>Built with intelligence and precision</span>
          </div>
        </div>
      </footer>
    </div>
  );
}