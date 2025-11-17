import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TestTube, Lightbulb, Code, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const planModeTests = [
  {
    title: "Simple Feature Planning",
    prompt: "I want to add a contact form to my website. What should I include?",
    description: "Tests basic planning capabilities"
  },
  {
    title: "Complex System Planning",
    prompt: "Help me plan a social media platform. What features, pages, and database structure do I need?",
    description: "Tests comprehensive system architecture planning"
  },
  {
    title: "Integration Planning",
    prompt: "I need to integrate payment processing and email notifications. What's the best approach?",
    description: "Tests planning for third-party integrations"
  },
  {
    title: "Performance Planning",
    prompt: "Plan how to optimize my app for 10,000 concurrent users. What should I consider?",
    description: "Tests planning for scale and performance"
  }
];

const buildModeTests = [
  {
    title: "Quick Component Build",
    prompt: "Build a contact form with name, email, and message fields",
    description: "Tests immediate component creation"
  },
  {
    title: "Database Operations",
    prompt: "Create a todo list app with the ability to add, edit, delete, and mark tasks as complete",
    description: "Tests CRUD operations and database setup"
  },
  {
    title: "Integration Implementation",
    prompt: "Build a page that uses the invokeLLM integration to answer user questions",
    description: "Tests integration usage in build mode"
  },
  {
    title: "Full Feature Build",
    prompt: "Build a user profile page with editable fields, avatar upload, and save functionality",
    description: "Tests complete feature implementation"
  }
];

export default function ModeTest() {
  const copyPrompt = (prompt: string, mode: string) => {
    navigator.clipboard.writeText(prompt);
    toast.success(`${mode} mode test copied to clipboard!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-text flex items-center gap-3">
            <TestTube className="h-10 w-10" />
            Mode Testing
          </h1>
          <p className="text-muted-foreground text-lg">
            Test the differences between Plan Mode and Build Mode capabilities
          </p>
        </div>

        {/* Mode Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle>Plan Mode</CardTitle>
                  <Badge variant="secondary">Strategy & Planning</Badge>
                </div>
              </div>
              <CardDescription>
                In Plan Mode, I create detailed strategies and architectures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                  <span>Provides comprehensive feature breakdown</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                  <span>Suggests database structures and relationships</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                  <span>Outlines user flows and wireframes</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                  <span>Recommends tech stack and integrations</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                  <span>Waits for approval before implementing</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle>Build Mode</CardTitle>
                  <Badge>Implementation</Badge>
                </div>
              </div>
              <CardDescription>
                In Build Mode, I immediately create working features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-0.5 text-purple-500 flex-shrink-0" />
                  <span>Writes actual code and creates files</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-0.5 text-purple-500 flex-shrink-0" />
                  <span>Sets up database entities immediately</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-0.5 text-purple-500 flex-shrink-0" />
                  <span>Creates working UI components</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-0.5 text-purple-500 flex-shrink-0" />
                  <span>Implements integrations and functionality</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-0.5 text-purple-500 flex-shrink-0" />
                  <span>Delivers immediately usable features</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Plan Mode Tests */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-blue-500" />
            Plan Mode Test Prompts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {planModeTests.map((test, index) => (
              <Card key={index} className="border-border/50 bg-card/50 backdrop-blur hover:border-blue-500/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">{test.title}</CardTitle>
                  <CardDescription>{test.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/30 rounded-lg p-3 mb-3">
                    <div className="text-sm italic">{test.prompt}</div>
                  </div>
                  <Button 
                    onClick={() => copyPrompt(test.prompt, "Plan")}
                    variant="outline"
                    className="w-full"
                  >
                    Copy Test Prompt
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Build Mode Tests */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Code className="h-6 w-6 text-purple-500" />
            Build Mode Test Prompts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {buildModeTests.map((test, index) => (
              <Card key={index} className="border-border/50 bg-card/50 backdrop-blur hover:border-purple-500/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">{test.title}</CardTitle>
                  <CardDescription>{test.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/30 rounded-lg p-3 mb-3">
                    <div className="text-sm italic">{test.prompt}</div>
                  </div>
                  <Button 
                    onClick={() => copyPrompt(test.prompt, "Build")}
                    className="w-full"
                  >
                    Copy Test Prompt
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Usage Instructions */}
        <Card className="border-border/50 bg-card/50 backdrop-blur mt-8">
          <CardHeader>
            <CardTitle>How to Test Different Modes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="font-medium mb-2 flex items-center gap-2">
                <Badge variant="secondary">Plan Mode</Badge>
                <span>Testing Strategy</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Switch to Plan Mode in settings, then copy and paste one of the plan mode test prompts. 
                You should receive a detailed plan without any code being written. The response will outline 
                features, architecture, and recommendations that you can review before asking for implementation.
              </p>
            </div>
            <div>
              <div className="font-medium mb-2 flex items-center gap-2">
                <Badge>Build Mode</Badge>
                <span>Testing Strategy</span>
              </div>
              <p className="text-sm text-muted-foreground">
                In Build Mode (default), copy and paste one of the build mode test prompts. You should see 
                immediate implementation with files being created, code being written, and features becoming 
                functional right away. The response will include what was built and how to use it.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}