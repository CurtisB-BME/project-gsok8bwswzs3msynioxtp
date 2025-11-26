import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import UIComponentsTest from "./pages/UIComponentsTest";
import DatabaseTest from "./pages/DatabaseTest";
import IntegrationsTest from "./pages/IntegrationsTest";
import FormsTest from "./pages/FormsTest";
import TemplatesLibrary from "./pages/TemplatesLibrary";
import ModeTest from "./pages/ModeTest";
import ErrorTest from "./pages/ErrorTest";
import TechSupport from "./pages/TechSupport";
import TechSupportHistory from "./pages/TechSupportHistory";
import SapienceTest from "./pages/SapienceTest";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ui-components" element={<UIComponentsTest />} />
          <Route path="/database" element={<DatabaseTest />} />
          <Route path="/integrations" element={<IntegrationsTest />} />
          <Route path="/forms" element={<FormsTest />} />
          <Route path="/templates" element={<TemplatesLibrary />} />
          <Route path="/mode-test" element={<ModeTest />} />
          <Route path="/error-test" element={<ErrorTest />} />
          <Route path="/tech-support" element={<TechSupport />} />
          <Route path="/tech-support/history" element={<TechSupportHistory />} />
          <Route path="/sapience-test" element={<SapienceTest />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;