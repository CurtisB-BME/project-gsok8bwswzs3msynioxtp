import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Navigation from "@/components/Navigation";
import TestSection from "@/components/TestSection";
import TestResult from "@/components/TestResult";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TestLog } from "@/entities";
import { FileText, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const basicFormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  age: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 18, "Must be 18 or older")
});

const advancedFormSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email"),
  role: z.string().min(1, "Please select a role"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  terms: z.boolean().refine((val) => val === true, "You must accept the terms"),
  notifications: z.enum(["all", "important", "none"])
});

export default function FormsTest() {
  const [testResults, setTestResults] = useState<any[]>([]);

  const basicForm = useForm<z.infer<typeof basicFormSchema>>({
    resolver: zodResolver(basicFormSchema),
    defaultValues: {
      username: "",
      email: "",
      age: ""
    }
  });

  const advancedForm = useForm<z.infer<typeof advancedFormSchema>>({
    resolver: zodResolver(advancedFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      role: "",
      bio: "",
      terms: false,
      notifications: "all"
    }
  });

  const runTest = async (testName: string, data: any) => {
    const startTime = performance.now();
    try {
      const executionTime = Math.round(performance.now() - startTime);
      
      const testResult = {
        status: "passed",
        title: testName,
        message: `Form validated and submitted successfully`,
        executionTime
      };
      
      setTestResults(prev => [testResult, ...prev]);
      
      await TestLog.create({
        test_category: "Forms",
        test_name: testName,
        status: "passed",
        result_data: JSON.stringify(data),
        execution_time: executionTime
      });
      
      toast.success(`${testName} passed!`);
    } catch (error: any) {
      const executionTime = Math.round(performance.now() - startTime);
      const testResult = {
        status: "failed",
        title: testName,
        message: error.message || "Form validation failed",
        executionTime
      };
      
      setTestResults(prev => [testResult, ...prev]);
      toast.error(`${testName} failed!`);
    }
  };

  const onBasicSubmit = (data: z.infer<typeof basicFormSchema>) => {
    runTest("Basic Form Validation", data);
  };

  const onAdvancedSubmit = (data: z.infer<typeof advancedFormSchema>) => {
    runTest("Advanced Form Validation", data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-text flex items-center gap-3">
            <FileText className="h-10 w-10" />
            Forms & Validation Testing
          </h1>
          <p className="text-muted-foreground text-lg">
            Test various form types, validation patterns, and submission handling
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Form */}
          <TestSection 
            title="Basic Form" 
            description="Test simple form validation with text and email inputs"
            icon={<FileText className="h-5 w-5" />}
          >
            <Form {...basicForm}>
              <form onSubmit={basicForm.handleSubmit(onBasicSubmit)} className="space-y-4">
                <FormField
                  control={basicForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe" {...field} />
                      </FormControl>
                      <FormDescription>Min 3 characters</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={basicForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={basicForm.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="25" {...field} />
                      </FormControl>
                      <FormDescription>Must be 18+</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Test Basic Form
                </Button>
              </form>
            </Form>
          </TestSection>

          {/* Advanced Form */}
          <TestSection 
            title="Advanced Form" 
            description="Test complex form with multiple input types and validation"
            icon={<FileText className="h-5 w-5" />}
          >
            <Form {...advancedForm}>
              <form onSubmit={advancedForm.handleSubmit(onAdvancedSubmit)} className="space-y-4">
                <FormField
                  control={advancedForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={advancedForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={advancedForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="developer">Developer</SelectItem>
                          <SelectItem value="designer">Designer</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={advancedForm.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Tell us about yourself..." {...field} rows={3} />
                      </FormControl>
                      <FormDescription>Min 10 characters</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={advancedForm.control}
                  name="notifications"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Notifications</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="all" />
                            </FormControl>
                            <FormLabel className="font-normal">All notifications</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="important" />
                            </FormControl>
                            <FormLabel className="font-normal">Important only</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="none" />
                            </FormControl>
                            <FormLabel className="font-normal">None</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={advancedForm.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Accept terms and conditions</FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Test Advanced Form
                </Button>
              </form>
            </Form>
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