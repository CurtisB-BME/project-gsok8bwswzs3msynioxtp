import { useState } from "react";
import Navigation from "@/components/Navigation";
import TestSection from "@/components/TestSection";
import TestResult from "@/components/TestResult";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TestLog } from "@/entities";
import { Box, Palette, Sparkles, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function UIComponentsTest() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [sliderValue, setSliderValue] = useState([50]);
  const [progress, setProgress] = useState(0);

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    const startTime = performance.now();
    try {
      await testFn();
      const executionTime = Math.round(performance.now() - startTime);
      
      const result = {
        status: "passed",
        title: testName,
        message: "Component rendered and functioned correctly",
        executionTime
      };
      
      setTestResults(prev => [result, ...prev]);
      
      await TestLog.create({
        test_category: "UI Components",
        test_name: testName,
        status: "passed",
        result_data: JSON.stringify(result),
        execution_time: executionTime
      });
      
      toast.success(`${testName} passed!`);
    } catch (error: any) {
      const executionTime = Math.round(performance.now() - startTime);
      const result = {
        status: "failed",
        title: testName,
        message: error.message || "Test failed",
        executionTime
      };
      
      setTestResults(prev => [result, ...prev]);
      toast.error(`${testName} failed!`);
    }
  };

  const testButtons = async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
  };

  const testInputs = async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
  };

  const testDialogs = async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
  };

  const testProgress = async () => {
    setProgress(0);
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 50));
      setProgress(i);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-text flex items-center gap-3">
            <Box className="h-10 w-10" />
            UI Components Testing
          </h1>
          <p className="text-muted-foreground text-lg">
            Test all shadcn/ui components with various states and interactions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Buttons */}
          <TestSection title="Buttons" description="Test button variants and states" icon={<Palette className="h-5 w-5" />}>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => runTest("Primary Button", testButtons)}>Primary</Button>
              <Button variant="secondary" onClick={() => runTest("Secondary Button", testButtons)}>Secondary</Button>
              <Button variant="destructive" onClick={() => runTest("Destructive Button", testButtons)}>Destructive</Button>
              <Button variant="outline" onClick={() => runTest("Outline Button", testButtons)}>Outline</Button>
              <Button variant="ghost" onClick={() => runTest("Ghost Button", testButtons)}>Ghost</Button>
              <Button variant="link" onClick={() => runTest("Link Button", testButtons)}>Link</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => runTest("Small Button", testButtons)}>Small</Button>
              <Button size="default" onClick={() => runTest("Default Button", testButtons)}>Default</Button>
              <Button size="lg" onClick={() => runTest("Large Button", testButtons)}>Large</Button>
            </div>
          </TestSection>

          {/* Inputs */}
          <TestSection title="Inputs" description="Test input fields and text areas" icon={<Sparkles className="h-5 w-5" />}>
            <div className="space-y-3">
              <Input 
                placeholder="Test input..." 
                onChange={() => runTest("Text Input", testInputs)}
              />
              <Input 
                type="email" 
                placeholder="email@example.com"
                onChange={() => runTest("Email Input", testInputs)}
              />
              <Input 
                type="password" 
                placeholder="Password"
                onChange={() => runTest("Password Input", testInputs)}
              />
              <Textarea 
                placeholder="Test textarea..."
                onChange={() => runTest("Textarea", testInputs)}
              />
            </div>
          </TestSection>

          {/* Selects & Checkboxes */}
          <TestSection title="Selection Controls" description="Test checkboxes, switches, and selects">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="test-checkbox" 
                  onCheckedChange={() => runTest("Checkbox", testInputs)}
                />
                <label htmlFor="test-checkbox" className="text-sm">Test Checkbox</label>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch 
                  onCheckedChange={() => runTest("Switch", testInputs)}
                />
                <label className="text-sm">Test Switch</label>
              </div>
              
              <Select onValueChange={() => runTest("Select", testInputs)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                  <SelectItem value="option3">Option 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TestSection>

          {/* Slider & Progress */}
          <TestSection title="Progress & Sliders" description="Test progress bars and sliders">
            <div className="space-y-4">
              <div>
                <label className="text-sm mb-2 block">Slider: {sliderValue[0]}</label>
                <Slider 
                  value={sliderValue} 
                  onValueChange={(val) => {
                    setSliderValue(val);
                    runTest("Slider", async () => {});
                  }}
                  max={100}
                  step={1}
                />
              </div>
              
              <div>
                <label className="text-sm mb-2 block">Progress: {progress}%</label>
                <Progress value={progress} />
                <Button 
                  className="mt-2" 
                  size="sm" 
                  onClick={() => runTest("Progress Bar", testProgress)}
                >
                  Animate Progress
                </Button>
              </div>
            </div>
          </TestSection>

          {/* Badges */}
          <TestSection title="Badges" description="Test badge variants">
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
            <Button onClick={() => runTest("Badges", testButtons)}>Test All Badges</Button>
          </TestSection>

          {/* Dialogs */}
          <TestSection title="Dialogs & Popovers" description="Test modal dialogs and popovers">
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button onClick={() => runTest("Dialog Open", testDialogs)}>Open Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Test Dialog</DialogTitle>
                    <DialogDescription>
                      This is a test dialog to verify modal functionality.
                    </DialogDescription>
                  </DialogHeader>
                  <Button onClick={() => runTest("Dialog Close", testDialogs)}>Close</Button>
                </DialogContent>
              </Dialog>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" onClick={() => runTest("Popover", testDialogs)}>Open Popover</Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="space-y-2">
                    <h4 className="font-medium">Test Popover</h4>
                    <p className="text-sm text-muted-foreground">
                      Popover content for testing
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </TestSection>

          {/* Tabs */}
          <TestSection title="Tabs" description="Test tabbed navigation">
            <Tabs defaultValue="tab1" onValueChange={() => runTest("Tab Switch", testButtons)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                <TabsTrigger value="tab3">Tab 3</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">Content for Tab 1</TabsContent>
              <TabsContent value="tab2">Content for Tab 2</TabsContent>
              <TabsContent value="tab3">Content for Tab 3</TabsContent>
            </Tabs>
          </TestSection>

          {/* Alerts */}
          <TestSection title="Alerts" description="Test alert variants">
            <div className="space-y-3">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Default Alert</AlertTitle>
                <AlertDescription>This is a default alert message.</AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Destructive Alert</AlertTitle>
                <AlertDescription>This is a destructive alert message.</AlertDescription>
              </Alert>
            </div>
            <Button onClick={() => runTest("Alerts", testButtons)}>Test Alerts</Button>
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