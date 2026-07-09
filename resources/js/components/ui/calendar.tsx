import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("p-3 w-full", className)}
            classNames={{
                months: "flex flex-col w-full",
                month: "w-full space-y-3",
                month_caption: "flex items-center justify-between w-full px-1 mb-1",
                caption_label: "text-sm font-bold",
                nav: "flex items-center gap-1",
                button_previous: cn(
                    buttonVariants({ variant: "ghost" }),
                    "size-8 bg-transparent p-0 opacity-60 hover:opacity-100"
                ),
                button_next: cn(
                    buttonVariants({ variant: "ghost" }),
                    "size-8 bg-transparent p-0 opacity-60 hover:opacity-100"
                ),
                month_grid: "w-full border-collapse",
                weekdays: "grid grid-cols-7 w-full mb-1",
                weekday: "text-muted-foreground w-full text-center font-medium text-[0.7rem]",
                week: "grid grid-cols-7 w-full",
                day: "flex items-center justify-center p-0.5",
                day_button: cn(
                    buttonVariants({ variant: "ghost" }),
                    "size-9 p-0 font-normal aria-selected:opacity-100 rounded-full transition-all"
                ),
                selected:
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                today: "bg-accent text-accent-foreground font-semibold",
                outside:
                    "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                disabled: "text-muted-foreground opacity-50",
                range_middle:
                    "aria-selected:bg-accent aria-selected:text-accent-foreground",
                hidden: "invisible",
                ...classNames,
            }}
            components={{
                Chevron: ({ ...props }) => {
                    if (props.orientation === "left") {
                        return <ChevronLeft className="size-4" />;
                    }
                    return <ChevronRight className="size-4" />;
                },
            }}
            {...props}
        />
    );
}
Calendar.displayName = "Calendar"

export { Calendar }
