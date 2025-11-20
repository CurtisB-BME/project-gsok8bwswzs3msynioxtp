import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import SupportRequestForm from "@/components/tech-support/SupportRequestForm";
import AnalysisResults from "@/components/tech-support/AnalysisResults";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HeadphonesIcon, History, Sparkles } from "lucide-react";
import { SupportTicket } from "@/entities";
import { invokeLLM } from "@/integrations/core";
import { toast } from "sonner";

export default function TechSupport() {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [currentTicketId, setCurrentTicketId] = useState<string | null>(null);

  const analyzeIssue = async (ticketData: any) => {
    setIsAnalyzing(true);
    setAnalysisResults(null);

    try {
      // Create the support ticket first
      const ticket = await SupportTicket.create(ticketData);
      setCurrentTicketId(ticket.id);

      // Build comprehensive prompt for AI analysis
      const chatHistorySection = ticketData.chat_history 
        ? `\n**Chat History (Conversation between user and Buildy):**\n${ticketData.chat_history}\n\n**IMPORTANT:** Use this chat history to understand:
- What the user originally asked Buildy to build
- What code and features were generated
- Any modifications or corrections made along the way
- The sequence of changes that led to the current state\n`
        : '\n**Chat History:** Not provided\n';

      const prompt = `You are an expert debugging assistant for Buildy apps (React, Vite, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query).

**App Context:**
- App Name: ${ticketData.app_name}
- Page/Feature: ${ticketData.page_name || "Not specified"}
- Error Type: ${ticketData.error_type}
- Priority: ${ticketData.priority}
${chatHistorySection}
**Problem Description:**
${ticketData.problem_description}

**Expected Behavior:**
${ticketData.expected_behavior || "Not specified"}

**Code/Error Messages:**
${ticketData.code_snippet || "No code provided"}

**Task:**
1. Analyze this issue and identify the most likely root causes${ticketData.chat_history ? ' (use the chat history to understand the development context)' : ''}
2. Provide 3-4 ranked solutions (high/medium/low likelihood)
3. For each solution, include specific code examples when applicable
4. Consider common Buildy patterns: routing, entity usage, integrations, React hooks
${ticketData.chat_history ? '5. Reference specific parts of the chat history that may have introduced the issue\n' : ''}
**Return format:**
{
  "analysis": "Detailed analysis of the problem and likely causes (2-3 paragraphs)${ticketData.chat_history ? '. If chat history is provided, reference specific requests or changes that may have caused the issue.' : ''}",
  "solutions": [
    {
      "title": "Short solution title",
      "description": "Detailed explanation of the solution",
      "code": "Code example if applicable (optional)",
      "likelihood": "high|medium|low"
    }
  ]
}`;

      console.log("Analyzing issue with AI...");
      const result = await invokeLLM({
        prompt,
        add_context_from_internet: false,
        response_json_schema: {
          type: "object",
          properties: {
            analysis: { type: "string" },
            solutions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  code: { type: "string" },
                  likelihood: { type: "string" }
                }
              }
            }
          }
        }
      });

      console.log("AI analysis result:", result);

      // Update ticket with analysis results
      await SupportTicket.update(ticket.id, {
        analysis_result: result.analysis,
        solutions: JSON.stringify(result.solutions),
        status: "solved"
      });

      setAnalysisResults({
        analysis: result.analysis,
        solutions: result.solutions,
        errorType: ticketData.error_type,
        ticketId: ticket.id
      });

      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze issue. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 gradient-text flex items-center gap-3">
              <HeadphonesIcon className="h-10 w-10" />
              Buildy Tech Support Assistant
            </h1>
            <p className="text-muted-foreground text-lg">
              AI-powered debugging for your Buildy apps
            </p>
          </div>
          <Button onClick={() => navigate("/tech-support/history")} variant="outline">
            <History className="h-4 w-4 mr-2" />
            View History
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                AI-Powered Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Get instant analysis and solutions based on error patterns and best practices
              </p>
            </CardContent>
          </Card>
          <Card className="border-secondary/50 bg-secondary/5">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <History className="h-4 w-4 text-secondary" />
                Searchable History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                All tickets are saved so you can reference past solutions anytime
              </p>
            </CardContent>
          </Card>
          <Card className="border-accent/50 bg-accent/5">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <HeadphonesIcon className="h-4 w-4 text-accent" />
                Multi-App Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Debug issues across all your Buildy apps in one place
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <SupportRequestForm 
              onSubmit={analyzeIssue} 
              isAnalyzing={isAnalyzing}
            />
          </div>
          
          <div>
            {isAnalyzing && (
              <Card className="border-primary/50 bg-primary/5 animate-pulse">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-primary animate-spin" />
                    <div>
                      <p className="font-medium">Analyzing your issue...</p>
                      <p className="text-sm text-muted-foreground">
                        AI is reviewing the problem and generating solutions
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {analysisResults && (
              <AnalysisResults {...analysisResults} />
            )}

            {!isAnalyzing && !analysisResults && (
              <Card className="border-border/50 bg-card/30 backdrop-blur">
                <CardContent className="pt-6">
                  <div className="text-center py-12 text-muted-foreground">
                    <HeadphonesIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Submit a support request</p>
                    <p className="text-sm">
                      Fill out the form and get instant AI-powered analysis
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}