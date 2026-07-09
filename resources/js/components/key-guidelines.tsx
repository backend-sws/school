import { Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface KeyGuidelinesProps {
    title?: string;
    guidelines: string[];
}

export function KeyGuidelines({ title = "Key Guidelines", guidelines }: KeyGuidelinesProps) {
    if (!guidelines || guidelines.length === 0) return null;

    return (
        <Card className="bg-muted/30 border-muted">
            <CardContent className="py-4">
                <div className="flex items-start gap-3">
                    <Info className="size-5 text-primary mt-0.5 shrink-0" />
                    <div className="space-y-1">
                        <h3 className="text-sm font-medium text-foreground">{title}</h3>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            {guidelines.map((guideline, index) => (
                                <li key={index}>• {guideline}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
