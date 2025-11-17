import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TestSectionProps {
  title: string;
  description: string;
  children: ReactNode;
  icon?: ReactNode;
}

export default function TestSection({ title, description, children, icon }: TestSectionProps) {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur hover:border-primary/50 transition-all duration-300">
      <CardHeader>
        <div className="flex items-center gap-3">
          {icon && <div className="text-primary">{icon}</div>}
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription className="text-muted-foreground">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  );
}