import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Box, Database, Plug, FileText, BookTemplate, TestTube, Activity, CheckCircle2, Brain } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { TestLog } from "@/entities";

const testCategories = [
  {
    title: "AI Sapience Tests",
    description: "Test AI consciousness and emotional intelligence",
    icon: Brain,
    path: "/sapience-test",
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "UI Components",
    description: "Test all shadcn/ui components with various states",
    icon: Box,
    path: "/ui-components",
    color: "from-purple-500 to-blue-500"
  },
  {
    title: "Database Operations",
    description: "Test CRUD operations, filtering, and queries",
    icon: Database,
    path: "/database",
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Integrations",
    description: "Test LLM, image generation, file upload, and email",
    icon: Plug,
    path: "/integrations",
    color: "from-cyan-500 to-teal-500"
  },
  {
    title: "Forms & Validation",
    description: "Test various form types and validation patterns",
    icon: FileText,
    path: "/forms",
    color: "from-teal-500 to-green-500"
  },
  {
    title: "Template Library",
    description: "Pre-built templates for common testing scenarios",
    icon: BookTemplate,
    path: "/templates",
    color: "from-green-500 to-yellow-500"
  },
  {
    title: "Mode Testing",
    description: "Test plan mode vs build mode capabilities",
    icon: TestTube,
    path: "/mode-test",
    color: "from-yellow-500 to-orange-500"
  }
];

export default function Dashboard() {
  const { data: recentTests } = useQuery({
    queryKey: ["recent-tests"],
    queryFn: async () => {
      try {
        return await TestLog.list("-created_at", 5);
      } catch (error) {
        console.error("Error fetching recent tests:", error);
        return [];
      }
    }
  });

  const passedTests = recentTests?.filter(t => t.status === "passed").length || 0;
  const totalTests = recentTests?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center relative">
          <div className="absolute inset-0 test-grid-bg opacity-30" />
          <div className="relative">
            <div className="inline-block p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 mb-4">
              <Activity className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-4 gradient-text">
              Buildy Test Suite
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive testing tools for all Buildy features. Test UI components, database operations, integrations, forms, and more!
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="pb-2">
              <CardDescription>Total Tests Run</CardDescription>
              <CardTitle className="text-3xl">{totalTests}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="pb-2">
              <CardDescription>Passed Tests</CardDescription>
              <CardTitle className="text-3xl text-green-500">{passedTests}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="pb-2">
              <CardDescription>Success Rate</CardDescription>
              <CardTitle className="text-3xl">
                {totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0}%
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Test Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {testCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.path} to={category.path}>
                <Card className="border-border/50 bg-card/50 backdrop-blur hover:scale-105 transition-all duration-300 h-full group">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:animate-pulse-glow`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" className="w-full">
                      Start Testing →
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Recent Tests */}
        {recentTests && recentTests.length > 0 && (
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Recent Test Results
              </CardTitle>
              <CardDescription>Last 5 tests executed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTests.map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        test.status === "passed" ? "bg-green-500" : 
                        test.status === "failed" ? "bg-red-500" : "bg-yellow-500"
                      }`} />
                      <div>
                        <div className="font-medium">{test.test_name}</div>
                        <div className="text-sm text-muted-foreground">{test.test_category}</div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {test.execution_time}ms
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}