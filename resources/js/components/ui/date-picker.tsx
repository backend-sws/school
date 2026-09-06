"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Matcher } from "react-day-picker"

interface DatePickerProps {
    date?: Date
    setDate: (date?: Date) => void
    placeholder?: string
    disabled?: boolean
    className?: string
    disabledDays?: Matcher | Matcher[]
    dateFormat?: string
}

export function DatePicker({
    date,
    setDate,
    placeholder = "Pick a date",
    disabled,
    className,
    disabledDays,
    dateFormat = "dd MMM yyyy",
}: DatePickerProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal h-9 shadow-none overflow-hidden px-3",
                        !date && "text-muted-foreground",
                        className
                    )}
                    disabled={disabled}
                    title={date ? format(date, dateFormat) : placeholder}
                >
                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate flex-1 min-w-0">
                        {date ? format(date, dateFormat) : placeholder}
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={disabledDays || disabled}
                />
            </PopoverContent>
        </Popover>
    )
}
