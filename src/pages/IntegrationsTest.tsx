import { useState } from "react";
import Navigation from "@/components/Navigation";
import TestSection from "@/components/TestSection";
import TestResult from "@/components/TestResult";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { invokeLLM, generateImage, uploadFile, sendEmail } from "@/integrations/core";
import { TestLog } from "@/entities";
import { Plug, Brain, Image as ImageIcon, Upload, Mail } from "lucide-react";
import { toast } from "sonner";

export default function IntegrationsTest() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [llmPrompt, setLlmPrompt] = useState("What is 2+2? Respond in JSON format.");
  const [llmResponse, setLlmResponse] = useState("");
  const [imagePrompt, setImagePrompt] = useState("A beautiful sunset over mountains");
  const [generatedImage, setGeneratedImage] = useState("");
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("Test Email");
  const [emailBody, setEmailBody] = useState("This is a test email from Buildy Test Suite.");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    const startTime = performance.now();
    try {
      const result = await testFn();
      const executionTime = Math.round(performance.now() - startTime);
      
      const testResult = {
        status: "passed",
        title: testName,
        message: "Integration executed successfully",
        executionTime
      };
      
      setTestResults(prev => [testResult, ...prev]);
      
      await TestLog.create({
        test_category: "Integrations",
        test_name: testName,
        status: "passed",
        result_data: JSON.stringify(result),
        execution_time: executionTime
      });
      
      toast.success(`${testName} passed!`);
      return result;
    } catch (error: any) {
      const executionTime = Math.round(performance.now() - startTime);
      const testResult = {
        status: "failed",
        title: testName,
        message: error.message || "Test failed",
        executionTime
      };
      
      setTestResults(prev => [testResult, ...prev]);
      toast.error(`${testName} failed: ${error.message}`);
      throw error;
    }
  };

  const testLLMBasic = async () => {
    const result = await runTest("LLM Basic Call", async () => {
      const response = await invokeLLM({
        prompt: llmPrompt
      });
      setLlmResponse(JSON.stringify(response, null, 2));
      return response;
    });
  };

  const testLLMWithJSON = async () => {
    const result = await runTest("LLM with JSON Schema", async () => {
      const response = await invokeLLM({
        prompt: "Give me information about three popular programming languages",
        response_json_schema: {
          type: "object",
          properties: {
            languages: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  year_created: { type: "number" },
                  popularity: { type: "string" }
                }
              }
            }
          }
        }
      });
      setLlmResponse(JSON.stringify(response, null, 2));
      return response;
    });
  };

  const testLLMWithWeb = async () => {
    const result = await runTest("LLM with Web Context", async () => {
      const response = await invokeLLM({
        prompt: "What's the current weather in New York?",
        add_context_from_internet: true
      });
      setLlmResponse(JSON.stringify(response, null, 2));
      return response;
    });
  };

  const testGenerateImage = async () => {
    const result = await runTest("Generate Image", async () => {
      const response = await generateImage({
        prompt: imagePrompt,
        quality: "fast",
        image_size: "square"
      });
      setGeneratedImage(response.url);
      return response;
    });
  };

  const testUploadFile = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first!");
      return;
    }

    const result = await runTest("Upload File", async () => {
      const response = await uploadFile({
        file: selectedFile
      });
      setUploadedFileUrl(response.file_url);
      return response;
    });
  };

  const testSendEmail = async () => {
    if (!emailTo) {
      toast.error("Please enter an email address!");
      return;
    }

    await runTest("Send Email", async () => {
      const response = await sendEmail({
        to: emailTo,
        subject: emailSubject,
        body: emailBody
      });
      return response;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-text flex items-center gap-3">
            <Plug className="h-10 w-10" />
            Integrations Testing
          </h1>
          <p className="text-muted-foreground text-lg">
            Test LLM, image generation, file upload, and email integrations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LLM Integration */}
          <TestSection 
            title="LLM Integration" 
            description="Test AI language model calls"
            icon={<Brain className="h-5 w-5" />}
          >
            <div className="space-y-3">
              <Textarea 
                placeholder="Enter your prompt..."
                value={llmPrompt}
                onChange={(e) => setLlmPrompt(e.target.value)}
                rows={3}
              />
              <div className="space-y-2">
                <Button onClick={testLLMBasic} className="w-full">
                  Test Basic LLM Call
                </Button>
                <Button onClick={testLLMWithJSON} variant="secondary" className="w-full">
                  Test LLM with JSON Schema
                </Button>
                <Button onClick={testLLMWithWeb} variant="outline" className="w-full">
                  Test LLM with Web Context
                </Button>
              </div>
              {llmResponse && (
                <div className="mt-3">
                  <div className="text-sm font-medium mb-2">Response:</div>
                  <pre className="p-3 rounded-lg bg-muted text-xs overflow-auto max-h-40">
                    {llmResponse}
                  </pre>
                </div>
              )}
            </div>
          </TestSection>

          {/* Image Generation */}
          <TestSection 
            title="Image Generation" 
            description="Test AI image generation"
            icon={<ImageIcon className="h-5 w-5" />}
          >
            <div className="space-y-3">
              <Input 
                placeholder="Image prompt..."
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
              />
              <Button onClick={testGenerateImage} className="w-full">
                <ImageIcon className="h-4 w-4 mr-2" />
                Generate Image
              </Button>
              {generatedImage && (
                <div className="mt-3">
                  <img 
                    src={generatedImage} 
                    alt="Generated" 
                    className="w-full rounded-lg border border-border"
                  />
                </div>
              )}
            </div>
          </TestSection>

          {/* File Upload */}
          <TestSection 
            title="File Upload" 
            description="Test file upload to storage"
            icon={<Upload className="h-5 w-5" />}
          >
            <div className="space-y-3">
              <Input 
                type="file"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
              <Button onClick={testUploadFile} className="w-full" disabled={!selectedFile}>
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
              {uploadedFileUrl && (
                <div className="mt-3">
                  <div className="text-sm font-medium mb-2">Uploaded File URL:</div>
                  <a 
                    href={uploadedFileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline break-all"
                  >
                    {uploadedFileUrl}
                  </a>
                </div>
              )}
            </div>
          </TestSection>

          {/* Email */}
          <TestSection 
            title="Send Email" 
            description="Test email sending"
            icon={<Mail className="h-5 w-5" />}
          >
            <div className="space-y-3">
              <Input 
                type="email"
                placeholder="Recipient email..."
                value={emailTo}
                onChange={(e) => setEmailTo(e.target.value)}
              />
              <Input 
                placeholder="Subject..."
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
              <Textarea 
                placeholder="Email body..."
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                rows={3}
              />
              <Button onClick={testSendEmail} className="w-full" disabled={!emailTo}>
                <Mail className="h-4 w-4 mr-2" />
                Send Test Email
              </Button>
            </div>
          </TestSection>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Test Results</h2>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <TestResult key={index} {...result} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}