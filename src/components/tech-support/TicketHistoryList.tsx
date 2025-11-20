import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, Filter } from "lucide-react";
import TicketCard from "./TicketCard";

interface TicketHistoryListProps {
  tickets: any[];
  onViewDetails: (ticket: any) => void;
}

export default function TicketHistoryList({ tickets, onViewDetails }: TicketHistoryListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [errorTypeFilter, setErrorTypeFilter] = useState("all");

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = 
      ticket.app_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.problem_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ticket.page_name && ticket.page_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesErrorType = errorTypeFilter === "all" || ticket.error_type === errorTypeFilter;

    return matchesSearch && matchesStatus && matchesErrorType;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search
          </Label>
          <Input
            id="search"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status-filter" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Status
          </Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger id="status-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="analyzing">Analyzing</SelectItem>
              <SelectItem value="solved">Solved</SelectItem>
              <SelectItem value="needs_more_info">Needs More Info</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="error-filter" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Error Type
          </Label>
          <Select value={errorTypeFilter} onValueChange={setErrorTypeFilter}>
            <SelectTrigger id="error-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="runtime_error">Runtime Error</SelectItem>
              <SelectItem value="build_error">Build Error</SelectItem>
              <SelectItem value="ui_issue">UI Issue</SelectItem>
              <SelectItem value="database_error">Database Error</SelectItem>
              <SelectItem value="integration_error">Integration Error</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredTickets.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">No tickets found</p>
          <p className="text-sm">Try adjusting your filters or search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTickets.map((ticket) => (
            <TicketCard 
              key={ticket.id} 
              ticket={ticket} 
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}

      <div className="text-sm text-muted-foreground text-center">
        Showing {filteredTickets.length} of {tickets.length} tickets
      </div>
    </div>
  );
}