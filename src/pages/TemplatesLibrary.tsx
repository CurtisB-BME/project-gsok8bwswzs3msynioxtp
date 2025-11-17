import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookTemplate, Copy, Code } from "lucide-react";
import { toast } from "sonner";

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  prompt: string;
  mode: "plan" | "build";
}

const templates: Template[] = [
  {
    id: "landing-page",
    title: "Landing Page",
    description: "Create a beautiful landing page with hero, features, pricing, and contact sections",
    category: "Web",
    prompt: "Create a landing page for a SaaS product called 'TaskMaster' that helps teams manage projects. Include a hero section with CTA, features section with 4 key features, pricing section with 3 tiers, testimonials from 3 customers, and a contact form.",
    mode: "build"
  },
  {
    id: "crud-app",
    title: "CRUD Application",
    description: "Build a complete CRUD app with database operations",
    category: "Database",
    prompt: "Create a task management app with full CRUD operations. Include a form to create tasks with title, description, status (todo/in-progress/done), and due date. Show a list of all tasks with filtering by status and ability to edit/delete tasks.",
    mode: "build"
  },
  {
    id: "dashboard",
    title: "Analytics Dashboard",
    description: "Create a dashboard with charts and statistics",
    category: "Data",
    prompt: "Build an analytics dashboard showing key metrics. Include 4 stat cards at the top (total users, revenue, conversion rate, growth), a line chart showing monthly trends, a pie chart for user segments, and a table of recent transactions.",
    mode: "build"
  },
  {
    id: "ai-chat",
    title: "AI Chat Interface",
    description: "Build a chat interface using LLM integration",
    category: "AI",
    prompt: "Create an AI chat interface where users can have conversations with an AI assistant. Include a message history display, input field for new messages, and use the invokeLLM integration to get responses. Style it like a modern chat app.",
    mode: "build"
  },
  {
    id: "form-builder",
    title: "Multi-Step Form",
    description: "Create a complex multi-step form with validation",
    category: "Forms",
    prompt: "Build a 3-step registration form. Step 1: Personal info (name, email, phone). Step 2: Account details (username, password, confirm password). Step 3: Preferences (role, notifications, newsletter). Include validation for each step and a progress indicator.",
    mode: "build"
  },
  {
    id: "file-manager",
    title: "File Management System",
    description: "Build a file upload and management interface",
    category: "Storage",
    prompt: "Create a file management system. Users can upload files (using uploadFile integration), see a list of uploaded files with preview thumbnails, download files, and delete files. Include drag-and-drop upload functionality.",
    mode: "build"
  },
  {
    id: "plan-ecommerce",
    title: "E-commerce Plan",
    description: "Plan an e-commerce application structure",
    category: "Planning",
    prompt: "I want to build an e-commerce platform for selling handmade crafts. Plan out the key features, pages, and database structure I'll need. Include product catalog, shopping cart, checkout process, user accounts, and order management.",
    mode: "plan"
  },
  {
    id: "plan-crm",
    title: "CRM System Plan",
    description: "Plan a customer relationship management system",
    category: "Planning",
    prompt: "Help me plan a CRM system for a small sales team. What features should I include? What database entities do I need? Plan out the user interface and workflow for managing contacts, deals, and follow-ups.",
    mode: "plan"
  },
  {
    id: "integration-test",
    title: "Integration Testing Suite",
    description: "Test all built-in integrations",
    category: "Testing",
    prompt: "Create a page to test all integrations: 1) invokeLLM with a simple prompt, 2) generateImage with a test prompt, 3) uploadFile with file picker, 4) sendEmail with a test form. Display the results of each test.",
    mode: "build"
  },
  {
    id: "responsive-layout",
    title: "Responsive Layout",
    description: "Build a fully responsive multi-page layout",
    category: "Design",
    prompt: "Create a responsive website layout with a navigation header (with mobile menu), sidebar on desktop that collapses on mobile, main content area, and footer. Include 3 sample pages: Home, About, and Services. Make it beautiful with gradients and animations.",
    mode: "build"
  }
];

export default function TemplatesLibrary() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyPrompt = (template: Template) => {
    navigator.clipboard.writeText(template.prompt);
    setCopiedId(template.id);
    toast.success("Template copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categories = Array.from(new Set(templates.map(t => t.category)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-text flex items-center gap-3">
            <BookTemplate className="h-10 w-10" />
            Testing Templates Library
          </h1>
          <p className="text-muted-foreground text-lg">
            Pre-built templates for common testing scenarios. Copy and use these prompts to quickly test different features.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="pb-2">
              <CardDescription>Total Templates</CardDescription>
              <CardTitle className="text-3xl">{templates.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="pb-2">
              <CardDescription>Build Mode</CardDescription>
              <CardTitle className="text-3xl text-purple-500">
                {templates.filter(t => t.mode === "build").length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="pb-2">
              <CardDescription>Plan Mode</CardDescription>
              <CardTitle className="text-3xl text-blue-500">
                {templates.filter(t => t.mode === "plan").length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Templates by Category */}
        {categories.map(category => {
          const categoryTemplates = templates.filter(t => t.category === category);
          
          return (
            <div key={category} className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Code className="h-6 w-6 text-primary" />
                {category}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryTemplates.map(template => (
                  <Card key={template.id} className="border-border/50 bg-card/50 backdrop-blur hover:border-primary/50 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{template.title}</CardTitle>
                          <CardDescription>{template.description}</CardDescription>
                        </div>
                        <Badge variant={template.mode === "build" ? "default" : "secondary"}>
                          {template.mode}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted/30 rounded-lg p-3 mb-3">
                        <div className="text-xs font-medium text-muted-foreground mb-1">Prompt:</div>
                        <div className="text-sm line-clamp-3">{template.prompt}</div>
                      </div>
                      <Button 
                        onClick={() => copyPrompt(template)}
                        className="w-full"
                        variant={copiedId === template.id ? "secondary" : "default"}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        {copiedId === template.id ? "Copied!" : "Copy Template"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}

        {/* Instructions */}
        <Card className="border-border/50 bg-card/50 backdrop-blur mt-8">
          <CardHeader>
            <CardTitle>How to Use Templates</CardTitle>
            <CardDescription>Quick guide to testing with templates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">1</div>
              <div>
                <div className="font-medium">Choose a Template</div>
                <div className="text-sm text-muted-foreground">Browse the templates and find one that matches what you want to test</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">2</div>
              <div>
                <div className="font-medium">Copy the Prompt</div>
                <div className="text-sm text-muted-foreground">Click the "Copy Template" button to copy the prompt to your clipboard</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">3</div>
              <div>
                <div className="font-medium">Test in Chat</div>
                <div className="text-sm text-muted-foreground">Paste the prompt in the Buildy chat and watch it build or plan!</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}