import { CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface TestResultProps {
  status: "passed" | "failed" | "pending" | "warning";
  title: string;
  message: string;
  executionTime?: number;
}

export default function TestResult({ status, title, message, executionTime }: TestResultProps) {
  const icons = {
    passed: <CheckCircle2 className="h-4 w-4" />,
    failed: <XCircle className="h-4 w-4" />,
    pending: <Clock className="h-4 w-4" />,
    warning: <AlertCircle className="h-4 w-4" />
  };

  const variants = {
    passed: "default",
    failed: "destructive",
    pending: "default",
    warning: "default"
  };

  const bgColors = {
    passed: "bg-green-500/10 border-green-500/50",
    failed: "bg-red-500/10 border-red-500/50",
    pending: "bg-blue-500/10 border-blue-500/50",
    warning: "bg-yellow-500/10 border-yellow-500/50"
  };

  return (
    <Alert className={`${bgColors[status]} animate-slide-up`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{icons[status]}</div>
        <div className="flex-1">
          <AlertTitle className="font-semibold">{title}</AlertTitle>
          <AlertDescription className="text-sm mt-1">{message}</AlertDescription>
          {executionTime && (
            <div className="text-xs text-muted-foreground mt-2">
              Execution time: {executionTime}ms
            </div>
          )}
        </div>
      </div>
    </Alert>
  );
}