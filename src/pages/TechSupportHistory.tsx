import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import TicketHistoryList from "@/components/tech-support/TicketHistoryList";
import AnalysisResults from "@/components/tech-support/AnalysisResults";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, History as HistoryIcon, Loader2, MessageSquare } from "lucide-react";
import { SupportTicket } from "@/entities";
import { toast } from "sonner";

export default function TechSupportHistory() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    setIsLoading(true);
    try {
      const allTickets = await SupportTicket.list("-created_at", 100);
      setTickets(allTickets);
    } catch (error) {
      console.error("Failed to load tickets:", error);
      toast.error("Failed to load support ticket history");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (ticket: any) => {
    setSelectedTicket(ticket);
    setShowDetails(true);
  };

  const parsedSolutions = selectedTicket?.solutions 
    ? JSON.parse(selectedTicket.solutions) 
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 gradient-text flex items-center gap-3">
              <HistoryIcon className="h-10 w-10" />
              Support Ticket History
            </h1>
            <p className="text-muted-foreground text-lg">
              View and search all your past support requests
            </p>
          </div>
          <Button onClick={() => navigate("/tech-support")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            New Request
          </Button>
        </div>

        {isLoading ? (
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Loading tickets...</span>
              </div>
            </CardContent>
          </Card>
        ) : tickets.length === 0 ? (
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardContent className="pt-6">
              <div className="text-center py-12 text-muted-foreground">
                <HistoryIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No support tickets yet</p>
                <p className="text-sm mb-4">
                  Submit your first support request to start building your history
                </p>
                <Button onClick={() => navigate("/tech-support")}>
                  Create First Ticket
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <TicketHistoryList 
            tickets={tickets} 
            onViewDetails={handleViewDetails}
          />
        )}

        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {selectedTicket?.app_name}
                {selectedTicket?.page_name && ` / ${selectedTicket.page_name}`}
              </DialogTitle>
            </DialogHeader>
            
            {selectedTicket && (
              <div className="space-y-6 mt-4">
                <div>
                  <h3 className="font-semibold mb-2">Problem Description</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedTicket.problem_description}
                  </p>
                </div>

                {selectedTicket.expected_behavior && (
                  <div>
                    <h3 className="font-semibold mb-2">Expected Behavior</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedTicket.expected_behavior}
                    </p>
                  </div>
                )}

                {selectedTicket.chat_history && (
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      Chat History
                    </h3>
                    <div className="bg-muted p-4 rounded-lg max-h-64 overflow-y-auto">
                      <pre className="text-xs whitespace-pre-wrap font-mono">
                        {selectedTicket.chat_history}
                      </pre>
                    </div>
                  </div>
                )}

                {selectedTicket.code_snippet && (
                  <div>
                    <h3 className="font-semibold mb-2">Code / Error Messages</h3>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                      {selectedTicket.code_snippet}
                    </pre>
                  </div>
                )}

                {selectedTicket.image_urls && (
                  <div>
                    <h3 className="font-semibold mb-2">Screenshots</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedTicket.image_urls.split(",").map((url: string, idx: number) => (
                        <img
                          key={idx}
                          src={url}
                          alt={`Screenshot ${idx + 1}`}
                          className="w-full rounded border border-border"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {selectedTicket.analysis_result && parsedSolutions.length > 0 && (
                  <AnalysisResults
                    analysis={selectedTicket.analysis_result}
                    solutions={parsedSolutions}
                    errorType={selectedTicket.error_type}
                    ticketId={selectedTicket.id}
                  />
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}