import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Calendar, ExternalLink } from "lucide-react";
import { format } from "date-fns";

interface TicketCardProps {
  ticket: any;
  onViewDetails: (ticket: any) => void;
}

export default function TicketCard({ ticket, onViewDetails }: TicketCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "solved":
        return "bg-green-500/10 text-green-500 border-green-500/50";
      case "analyzing":
        return "bg-blue-500/10 text-blue-500 border-blue-500/50";
      case "needs_more_info":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/50";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/50";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "destructive";
      case "high":
        return "default";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur hover:border-primary/50 transition-all">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-primary" />
              {ticket.app_name}
              {ticket.page_name && <span className="text-muted-foreground text-sm">/ {ticket.page_name}</span>}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 text-xs">
              <Calendar className="h-3 w-3" />
              {format(new Date(ticket.created_at), "MMM dd, yyyy 'at' h:mm a")}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge className={getStatusColor(ticket.status)}>
              {ticket.status.replace(/_/g, " ")}
            </Badge>
            <Badge variant={getPriorityColor(ticket.priority)}>
              {ticket.priority}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Badge variant="outline" className="mb-2">
            {ticket.error_type.replace(/_/g, " ")}
          </Badge>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {ticket.problem_description}
          </p>
        </div>
        
        {ticket.image_urls && (
          <div className="flex gap-2">
            {ticket.image_urls.split(",").slice(0, 3).map((url: string, idx: number) => (
              <img
                key={idx}
                src={url}
                alt={`Screenshot ${idx + 1}`}
                className="w-16 h-16 object-cover rounded border border-border"
              />
            ))}
          </div>
        )}

        <Button 
          onClick={() => onViewDetails(ticket)} 
          variant="outline" 
          className="w-full"
          size="sm"
        >
          View Details & Solutions
          <ExternalLink className="h-3 w-3 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}