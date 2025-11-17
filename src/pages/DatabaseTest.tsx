import { useState } from "react";
import Navigation from "@/components/Navigation";
import TestSection from "@/components/TestSection";
import TestResult from "@/components/TestResult";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TestLog } from "@/entities";
import { Database, Plus, Trash2, Edit, Search } from "lucide-react";
import { toast } from "sonner";

export default function DatabaseTest() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [testData, setTestData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    const startTime = performance.now();
    try {
      const result = await testFn();
      const executionTime = Math.round(performance.now() - startTime);
      
      const testResult = {
        status: "passed",
        title: testName,
        message: `Successfully executed. Result: ${JSON.stringify(result).substring(0, 100)}`,
        executionTime
      };
      
      setTestResults(prev => [testResult, ...prev]);
      
      await TestLog.create({
        test_category: "Database",
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

  const testCreate = async () => {
    const result = await runTest("Create Record", async () => {
      const record = await TestLog.create({
        test_category: "Database Test",
        test_name: "Sample Test " + Date.now(),
        status: "passed",
        result_data: JSON.stringify({ sample: true }),
        execution_time: 100
      });
      return record;
    });
    if (result) {
      setTestData(prev => [result, ...prev]);
    }
  };

  const testBulkCreate = async () => {
    const result = await runTest("Bulk Create Records", async () => {
      const records = await TestLog.bulkCreate([
        {
          test_category: "Bulk Test",
          test_name: "Bulk Test 1",
          status: "passed",
          result_data: "{}",
          execution_time: 50
        },
        {
          test_category: "Bulk Test",
          test_name: "Bulk Test 2",
          status: "passed",
          result_data: "{}",
          execution_time: 75
        },
        {
          test_category: "Bulk Test",
          test_name: "Bulk Test 3",
          status: "passed",
          result_data: "{}",
          execution_time: 60
        }
      ]);
      return records;
    });
    if (result) {
      setTestData(prev => [...result, ...prev]);
    }
  };

  const testList = async () => {
    const result = await runTest("List Records", async () => {
      const records = await TestLog.list("-created_at", 10);
      return records;
    });
    if (result) {
      setTestData(result);
    }
  };

  const testFilter = async () => {
    await runTest("Filter Records", async () => {
      const records = await TestLog.filter(
        { test_category: "Database Test" },
        "-created_at",
        5
      );
      setTestData(records);
      return records;
    });
  };

  const testQuery = async () => {
    await runTest("Advanced Query", async () => {
      const records = await TestLog.query()
        .where("status", "passed")
        .sort("-created_at")
        .limit(5)
        .exec();
      setTestData(records);
      return records;
    });
  };

  const testUpdate = async () => {
    if (testData.length === 0) {
      toast.error("No records to update. Create some first!");
      return;
    }
    
    const record = testData[0];
    await runTest("Update Record", async () => {
      const updated = await TestLog.update(record.id, {
        test_name: record.test_name + " (Updated)"
      });
      setTestData(prev => prev.map(r => r.id === record.id ? updated : r));
      return updated;
    });
  };

  const testDelete = async () => {
    if (testData.length === 0) {
      toast.error("No records to delete. Create some first!");
      return;
    }
    
    const record = testData[0];
    await runTest("Delete Record", async () => {
      await TestLog.delete(record.id);
      setTestData(prev => prev.filter(r => r.id !== record.id));
      return { deleted: record.id };
    });
  };

  const testSearch = async () => {
    if (!searchTerm) {
      toast.error("Enter a search term first!");
      return;
    }
    
    await runTest("Search Records", async () => {
      const records = await TestLog.query()
        .where("test_name", searchTerm)
        .exec();
      setTestData(records);
      return records;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-text flex items-center gap-3">
            <Database className="h-10 w-10" />
            Database Operations Testing
          </h1>
          <p className="text-muted-foreground text-lg">
            Test CRUD operations, filtering, queries, and bulk operations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create Operations */}
          <TestSection 
            title="Create Operations" 
            description="Test creating records" 
            icon={<Plus className="h-5 w-5" />}
          >
            <div className="space-y-2">
              <Button onClick={testCreate} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Single Record
              </Button>
              <Button onClick={testBulkCreate} variant="secondary" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Bulk Create (3 Records)
              </Button>
            </div>
          </TestSection>

          {/* Read Operations */}
          <TestSection 
            title="Read Operations" 
            description="Test listing and filtering records"
            icon={<Search className="h-5 w-5" />}
          >
            <div className="space-y-2">
              <Button onClick={testList} className="w-full">
                List All Records
              </Button>
              <Button onClick={testFilter} variant="secondary" className="w-full">
                Filter by Category
              </Button>
              <Button onClick={testQuery} variant="outline" className="w-full">
                Advanced Query
              </Button>
            </div>
          </TestSection>

          {/* Update & Delete */}
          <TestSection 
            title="Update & Delete" 
            description="Test modifying and removing records"
            icon={<Edit className="h-5 w-5" />}
          >
            <div className="space-y-2">
              <Button onClick={testUpdate} className="w-full">
                <Edit className="h-4 w-4 mr-2" />
                Update First Record
              </Button>
              <Button onClick={testDelete} variant="destructive" className="w-full">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete First Record
              </Button>
            </div>
          </TestSection>

          {/* Search */}
          <TestSection 
            title="Search" 
            description="Test searching records"
            icon={<Search className="h-5 w-5" />}
          >
            <div className="space-y-2">
              <Input 
                placeholder="Search term..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button onClick={testSearch} className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Search Records
              </Button>
            </div>
          </TestSection>
        </div>

        {/* Data Display */}
        {testData.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Current Data ({testData.length} records)</h2>
            <div className="space-y-2">
              {testData.map((record) => (
                <div key={record.id} className="p-4 rounded-lg bg-card border border-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">{record.test_name}</div>
                      <div className="text-sm text-muted-foreground">{record.test_category}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        ID: {record.id} • Status: {record.status} • Time: {record.execution_time}ms
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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