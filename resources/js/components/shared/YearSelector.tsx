import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";

interface YearSelectorProps {
    selectedYear: number;
    onYearChange: (year: number) => void;
    yearRange?: number;
    disabled?: boolean;
    className?: string;
    showIcon?: boolean;
}

/**
 * YearSelector - Reusable year selector component
 * Generates a dropdown for selecting years
 */
export const YearSelector = ({
    selectedYear,
    onYearChange,
    yearRange = 5,
    disabled = false,
    className,
    showIcon = true,
}: YearSelectorProps) => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: yearRange }, (_, i) => currentYear - i);

    return (
        <div className={className}>
            {showIcon && <Calendar className="size-4 text-muted-foreground inline-block mr-2" />}
            <Select
                value={selectedYear.toString()}
                onValueChange={(value) => onYearChange(Number(value))}
                disabled={disabled}
            >
                <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                    {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                            {year}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};
