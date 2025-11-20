import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, Lightbulb, AlertTriangle, Code2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Solution {
  title: string;
  description: string;
  code?: string;
  likelihood: "high" | "medium" | "low";
}

interface AnalysisResultsProps {
  analysis: string;
  solutions: Solution[];
  errorType: string;
  ticketId: string;
}

export default function AnalysisResults({ analysis, solutions, errorType, ticketId }: AnalysisResultsProps) {
  const getLikelihoodColor = (likelihood: string) => {
    switch (likelihood) {
      case "high":
        return "bg-green-500/10 text-green-500 border-green-500/50";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/50";
      case "low":
        return "bg-blue-500/10 text-blue-500 border-blue-500/50";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/50";
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <Alert className="border-green-500/50 bg-green-500/10">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
        <AlertTitle>Analysis Complete</AlertTitle>
        <AlertDescription>
          Your issue has been analyzed. Here are the findings and suggested solutions.
        </AlertDescription>
      </Alert>

      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Problem Analysis
          </CardTitle>
          <CardDescription>
            <Badge variant="outline">{errorType.replace(/_/g, " ").toUpperCase()}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none text-foreground">
            <p className="whitespace-pre-wrap">{analysis}</p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-primary" />
          Suggested Solutions
        </h3>
        {solutions.map((solution, idx) => (
          <Card 
            key={idx} 
            className="border-border/50 bg-card/50 backdrop-blur hover:border-primary/50 transition-all"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">
                  Solution #{idx + 1}: {solution.title}
                </CardTitle>
                <Badge className={getLikelihoodColor(solution.likelihood)}>
                  {solution.likelihood} likelihood
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{solution.description}</p>
              {solution.code && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Code2 className="h-4 w-4" />
                    Code Example:
                  </div>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm">{solution.code}</code>
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-primary/50 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="font-medium mb-2">Need More Help?</p>
              <p className="text-sm text-muted-foreground mb-3">
                If these solutions don't resolve your issue, try providing more details like:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Full error stack trace from the browser console</li>
                <li>Network tab errors (failed requests)</li>
                <li>Steps to reproduce the issue</li>
                <li>Recent changes made before the error appeared</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}