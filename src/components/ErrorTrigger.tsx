import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Lock } from "lucide-react";

interface ErrorTriggerProps {
    title: string;
    description: string;
    errorType: string;
    onTrigger: () => void;
    icon?: ReactNode;
    disabled?: boolean;
}

export default function ErrorTrigger({ 
    title, 
    description, 
    errorType, 
    onTrigger,
    icon,
    disabled = false
}: ErrorTriggerProps) {
    return (
        <Card className={`border-border/50 bg-card/50 backdrop-blur transition-all duration-300 ${
            disabled ? 'opacity-60' : 'hover:border-destructive/50'
        }`}>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        {icon || <AlertTriangle className="h-5 w-5 text-destructive" />}
                        <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                                {title}
                                {disabled && <Lock className="h-4 w-4 text-muted-foreground" />}
                            </CardTitle>
                            <Badge variant="destructive" className="mt-2">{errorType}</Badge>
                        </div>
                    </div>
                </div>
                <CardDescription className="mt-2">{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <Button 
                    onClick={onTrigger}
                    variant="destructive"
                    className="w-full"
                    disabled={disabled}
                >
                    {disabled ? "Locked - Enable Above" : "Trigger Error"}
                </Button>
            </CardContent>
        </Card>
    );
}