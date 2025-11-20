import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Upload, Code2, Image as ImageIcon, Loader2, MessageSquare } from "lucide-react";
import { uploadFile } from "@/integrations/core";
import { toast } from "sonner";

interface SupportRequestFormProps {
  onSubmit: (data: any) => void;
  isAnalyzing: boolean;
}

export default function SupportRequestForm({ onSubmit, isAnalyzing }: SupportRequestFormProps) {
  const [appName, setAppName] = useState("");
  const [pageName, setPageName] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [expectedBehavior, setExpectedBehavior] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [chatHistory, setChatHistory] = useState("");
  const [errorType, setErrorType] = useState("");
  const [priority, setPriority] = useState("medium");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const result = await uploadFile({ file });
        return result.file_url;
      });

      const urls = await Promise.all(uploadPromises);
      setUploadedImages((prev) => [...prev, ...urls]);
      toast.success(`${files.length} image(s) uploaded successfully`);
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload images");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!appName || !problemDescription || !errorType) {
      toast.error("Please fill in all required fields");
      return;
    }

    onSubmit({
      app_name: appName,
      page_name: pageName,
      problem_description: problemDescription,
      expected_behavior: expectedBehavior,
      code_snippet: codeSnippet,
      chat_history: chatHistory,
      image_urls: uploadedImages.join(","),
      error_type: errorType,
      priority,
      status: "analyzing"
    });
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-primary" />
          Submit Support Request
        </CardTitle>
        <CardDescription>
          Provide detailed information about the issue you're experiencing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="app-name">App Name *</Label>
              <Input
                id="app-name"
                placeholder="e.g., TaskMaster CRM"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="page-name">Page/Feature</Label>
              <Input
                id="page-name"
                placeholder="e.g., Contact form, Dashboard"
                value={pageName}
                onChange={(e) => setPageName(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="error-type">Error Type *</Label>
              <Select value={errorType} onValueChange={setErrorType} required>
                <SelectTrigger id="error-type">
                  <SelectValue placeholder="Select error type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="runtime_error">Runtime Error</SelectItem>
                  <SelectItem value="build_error">Build Error</SelectItem>
                  <SelectItem value="ui_issue">UI Issue</SelectItem>
                  <SelectItem value="database_error">Database Error</SelectItem>
                  <SelectItem value="integration_error">Integration Error</SelectItem>
                  <SelectItem value="performance">Performance Issue</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="problem">Problem Description *</Label>
            <Textarea
              id="problem"
              placeholder="Describe what's happening in detail..."
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expected">Expected Behavior</Label>
            <Textarea
              id="expected"
              placeholder="What should happen instead?"
              value={expectedBehavior}
              onChange={(e) => setExpectedBehavior(e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="chat-history" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat History (Highly Recommended)
            </Label>
            <Textarea
              id="chat-history"
              placeholder="Paste your full Buildy chat conversation here... This helps us understand what you asked for and what was built."
              value={chatHistory}
              onChange={(e) => setChatHistory(e.target.value)}
              rows={8}
              className="text-sm"
            />
            <p className="text-xs text-muted-foreground">
              💡 <strong>Why this helps:</strong> The chat history shows what you asked Buildy to build, what changes were made, and when. 
              This context is incredibly valuable for diagnosing issues quickly and accurately.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="code" className="flex items-center gap-2">
              <Code2 className="h-4 w-4" />
              Code Snippet / Error Message
            </Label>
            <Textarea
              id="code"
              placeholder="Paste error messages, stack traces, or relevant code..."
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              rows={6}
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="images" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Screenshots
            </Label>
            <div className="flex items-center gap-3">
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={isUploading}
                className="cursor-pointer"
              />
              {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
            </div>
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {uploadedImages.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Screenshot ${idx + 1}`}
                    className="w-full h-24 object-cover rounded border border-border"
                  />
                ))}
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={isAnalyzing || isUploading}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Problem...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Submit & Analyze
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}