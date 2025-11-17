import { useState } from "react";
import Navigation from "@/components/Navigation";
import ErrorTrigger from "@/components/ErrorTrigger";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Bug, Code, Database, Plug, RefreshCw } from "lucide-react";
import { TestLog } from "@/entities";
import { invokeLLM } from "@/integrations/core";
import { toast } from "sonner";

export default function ErrorTest() {
  const [errorCount, setErrorCount] = useState(0);

  const resetPage = () => {
    window.location.reload();
  };

  const triggerUndefinedError = () => {
    setErrorCount(prev => prev + 1);
    const obj: any = undefined;
    console.log(obj.property.nested);
  };

  const triggerNullError = () => {
    setErrorCount(prev => prev + 1);
    const obj: any = null;
    console.log(obj.someMethod());
  };

  const triggerTypeError = () => {
    setErrorCount(prev => prev + 1);
    const notAFunction: any = "I am a string";
    notAFunction();
  };

  const triggerReferenceError = () => {
    setErrorCount(prev => prev + 1);
    // @ts-ignore
    console.log(thisVariableDoesNotExist);
  };

  const triggerDatabaseError = async () => {
    setErrorCount(prev => prev + 1);
    try {
      await TestLog.query()
        // @ts-ignore
        .where("invalid_field", "nonexistent_operator", "value")
        .exec();
    } catch (error: any) {
      console.error("Database error triggered:", error);
      toast.error("Database error triggered: " + error.message);
      throw error;
    }
  };

  const triggerIntegrationError = async () => {
    setErrorCount(prev => prev + 1);
    try {
      // @ts-ignore
      await invokeLLM({
        prompt: "test",
        response_json_schema: { invalid: "schema", type: "not_a_valid_type" }
      });
    } catch (error: any) {
      console.error("Integration error triggered:", error);
      toast.error("Integration error triggered: " + error.message);
      throw error;
    }
  };

  const triggerArrayError = () => {
    setErrorCount(prev => prev + 1);
    const arr = [1, 2, 3];
    const item = arr[999];
    // @ts-ignore
    console.log(item.toString().toUpperCase());
  };

  const triggerJsonError = () => {
    setErrorCount(prev => prev + 1);
    const invalidJson = "{ this is not valid json }";
    JSON.parse(invalidJson);
  };

  const triggerStackError = () => {
    setErrorCount(prev => prev + 1);
    const recursiveFunction: any = () => {
      return recursiveFunction();
    };
    recursiveFunction();
  };

  const triggerPromiseError = async () => {
    setErrorCount(prev => prev + 1);
    await new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Promise rejected intentionally")), 100);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-text flex items-center gap-3">
            <Bug className="h-10 w-10" />
            Error Fixing Testing
          </h1>
          <p className="text-muted-foreground text-lg">
            Intentionally trigger errors to test if the "try to fix" button works properly
          </p>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              How to Use This Page
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-2">
              <p><strong>Step 1:</strong> Click any "Trigger Error" button below</p>
              <p><strong>Step 2:</strong> Wait for the error to appear on screen</p>
              <p><strong>Step 3:</strong> Look for the "try to fix" or similar button</p>
              <p><strong>Step 4:</strong> Click it and verify it attempts to fix the error</p>
              <p><strong>Step 5:</strong> Use the "Reset Page" button below to clear errors and try another test</p>
            </div>
            <div className="pt-4 flex gap-3">
              <Button onClick={resetPage} variant="outline" className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Page
              </Button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                Errors triggered: <Badge variant="destructive">{errorCount}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Code className="h-6 w-6 text-destructive" />
            Runtime Errors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ErrorTrigger
              title="Undefined Property Access"
              description="Attempts to access a property on an undefined object. Common error that should trigger the fix prompt."
              errorType="TypeError"
              onTrigger={triggerUndefinedError}
              icon={<Code className="h-5 w-5 text-destructive" />}
            />
            
            <ErrorTrigger
              title="Null Method Call"
              description="Tries to call a method on a null object. Tests how the fixer handles null reference errors."
              errorType="TypeError"
              onTrigger={triggerNullError}
              icon={<Code className="h-5 w-5 text-destructive" />}
            />
            
            <ErrorTrigger
              title="Invalid Function Call"
              description="Attempts to call a variable that isn't a function. Tests type error handling."
              errorType="TypeError"
              onTrigger={triggerTypeError}
              icon={<Code className="h-5 w-5 text-destructive" />}
            />
            
            <ErrorTrigger
              title="Undefined Variable"
              description="References a variable that doesn't exist. Tests reference error detection."
              errorType="ReferenceError"
              onTrigger={triggerReferenceError}
              icon={<Code className="h-5 w-5 text-destructive" />}
            />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Database className="h-6 w-6 text-destructive" />
            Data & Parse Errors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ErrorTrigger
              title="Array Index Error"
              description="Accesses an array index that doesn't exist. Tests undefined handling in arrays."
              errorType="TypeError"
              onTrigger={triggerArrayError}
              icon={<Database className="h-5 w-5 text-destructive" />}
            />
            
            <ErrorTrigger
              title="JSON Parse Error"
              description="Tries to parse invalid JSON. Tests syntax error handling."
              errorType="SyntaxError"
              onTrigger={triggerJsonError}
              icon={<Database className="h-5 w-5 text-destructive" />}
            />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Plug className="h-6 w-6 text-destructive" />
            Async & Integration Errors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ErrorTrigger
              title="Database Query Error"
              description="Executes an invalid database query. Tests async error handling with entities."
              errorType="QueryError"
              onTrigger={triggerDatabaseError}
              icon={<Database className="h-5 w-5 text-destructive" />}
            />
            
            <ErrorTrigger
              title="Integration Error"
              description="Makes an invalid API call to invokeLLM. Tests integration error handling."
              errorType="IntegrationError"
              onTrigger={triggerIntegrationError}
              icon={<Plug className="h-5 w-5 text-destructive" />}
            />
            
            <ErrorTrigger
              title="Promise Rejection"
              description="Creates an unhandled promise rejection. Tests async error catching."
              errorType="UnhandledRejection"
              onTrigger={triggerPromiseError}
              icon={<Plug className="h-5 w-5 text-destructive" />}
            />
          </div>
        </div>

        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Extreme Error (Use with Caution)
            </CardTitle>
            <CardDescription>
              This error will cause a stack overflow and may freeze your browser. Only use if needed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ErrorTrigger
              title="Stack Overflow Error"
              description="Creates infinite recursion. Will crash the page - use reset after!"
              errorType="RangeError"
              onTrigger={triggerStackError}
              icon={<AlertTriangle className="h-5 w-5 text-destructive" />}
            />
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur mt-8">
          <CardHeader>
            <CardTitle>Testing Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• <strong>Start with simple errors</strong> like "Undefined Property Access" first</li>
              <li>• <strong>Check the browser console</strong> for additional error details</li>
              <li>• <strong>Test one error at a time</strong> and reset between tests</li>
              <li>• <strong>Verify the fix button appears</strong> - it should show up automatically</li>
              <li>• <strong>If nothing happens</strong> when clicking "try to fix", that confirms the bug you found</li>
              <li>• <strong>Document which errors</strong> show the fix button and which don't</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}