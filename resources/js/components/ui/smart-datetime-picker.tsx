"use client"

import * as React from "react"
import { format, setHours, setMinutes, setSeconds, getYear, getMonth, setYear, setMonth, startOfYear, startOfMonth, addMonths, subMonths, parse, isValid, isDate } from "date-fns"
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, X } from "lucide-react"
import { Input } from "@/components/ui/input"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

export type DateTimeMode = "date" | "time" | "datetime" | "year" | "month"

interface SmartDateTimePickerProps {
    value?: Date
    onChange: (date?: Date) => void
    mode?: DateTimeMode
    placeholder?: string
    disabled?: boolean
    className?: string
    /** Current locale for formatting, defaults to users locale */
    locale?: any
    /** Show seconds in time-related modes */
    showSeconds?: boolean
    /** Size of the trigger button */
    size?: "default" | "sm" | "lg" | "icon"
    onBlur?: (e: any) => void
}

export function SmartDateTimePicker({
    value,
    onChange,
    mode = "date",
    placeholder,
    disabled,
    className,
    locale,
    showSeconds = false,
    size = "default",
    onBlur,
}: SmartDateTimePickerProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    const [view, setView] = React.useState<"day" | "month" | "year">(
        mode === "year" ? "year" : (mode === "month" ? "month" : "day")
    )
    const [viewDate, setViewDate] = React.useState<Date>(value || new Date())
    const [inputValue, setInputValue] = React.useState("")

    const getFormat = (m: DateTimeMode) => {
        switch (m) {
            case "time": return showSeconds ? "HH:mm:ss" : "HH:mm"
            case "datetime": return showSeconds ? "dd/MM/yyyy HH:mm:ss" : "dd/MM/yyyy HH:mm"
            case "year": return "yyyy"
            case "month": return "MM/yyyy"
            default: return "dd/MM/yyyy"
        }
    }

    // Update input text when value changes from outside (calendar selection)
    React.useEffect(() => {
        if (value && isDate(value) && isValid(value)) {
            setInputValue(format(value, getFormat(mode), { locale }))
        } else if (!value) {
            setInputValue("")
        }
    }, [value, mode, locale])

    // Update view and viewDate when isOpen changes
    React.useEffect(() => {
        if (isOpen) {
            setView(mode === "year" ? "year" : (mode === "month" ? "month" : "day"))
            setViewDate(value && isValid(value) ? value : new Date())
        }
    }, [isOpen, mode, value])

    const handleTypedInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value

        // Basic numeric masking for date/month modes
        if (mode === "date") {
            // Remove non-numeric
            val = val.replace(/\D/g, "")
            if (val.length > 8) val = val.slice(0, 8)

            // Format as dd/mm/yyyy
            let formatted = ""
            if (val.length > 0) formatted += val.slice(0, 2)
            if (val.length > 2) formatted += "/" + val.slice(2, 4)
            if (val.length > 4) formatted += "/" + val.slice(4, 8)
            val = formatted
        } else if (mode === "month") {
            val = val.replace(/\D/g, "")
            if (val.length > 6) val = val.slice(0, 6)

            let formatted = ""
            if (val.length > 0) formatted += val.slice(0, 2)
            if (val.length > 2) formatted += "/" + val.slice(2, 6)
            val = formatted
        } else if (mode === "year") {
            val = val.replace(/\D/g, "")
            if (val.length > 4) val = val.slice(0, 4)
        }

        setInputValue(val)

        // Try to parse the date if length is complete
        if (mode === "date" && val.length === 10) {
            const parsed = parse(val, "dd/MM/yyyy", new Date())
            if (isValid(parsed)) {
                onChange(parsed)
            }
        } else if (mode === "month" && val.length === 7) {
            const parsed = parse(val, "MM/yyyy", new Date())
            if (isValid(parsed)) {
                onChange(parsed)
            }
        } else if (mode === "year" && val.length === 4) {
            const parsed = parse(val, "yyyy", new Date())
            if (isValid(parsed)) {
                onChange(parsed)
            }
        } else if (val === "") {
            onChange(undefined)
        }
    }

    const handleSelect = (date: Date | undefined) => {
        if (!date) {
            onChange(undefined)
            return
        }

        let newDate = date
        if (value && (mode === "date" || mode === "datetime")) {
            // Preserve time if switching dates
            newDate = setHours(newDate, value.getHours())
            newDate = setMinutes(newDate, value.getMinutes())
            newDate = setSeconds(newDate, value.getSeconds())
        }
        onChange(newDate)
        if (mode === "date" || mode === "year" || mode === "month") {
            setIsOpen(false)
        }
    }

    const handleTimeChange = (type: "hours" | "minutes" | "seconds", val: number) => {
        const baseDate = value || new Date()
        let newDate = baseDate
        if (type === "hours") newDate = setHours(baseDate, val)
        if (type === "minutes") newDate = setMinutes(baseDate, val)
        if (type === "seconds") newDate = setSeconds(baseDate, val)
        onChange(newDate)
    }

    const getDisplayValue = () => {
        if (!value) return placeholder || (
            mode === "time" ? "Pick time" :
                mode === "year" ? "Pick year" :
                    mode === "month" ? "Pick month" : "Pick date"
        )

        try {
            switch (mode) {
                case "time":
                    return format(value, showSeconds ? "HH:mm:ss" : "HH:mm", { locale })
                case "datetime":
                    return format(value, showSeconds ? "PPP HH:mm:ss" : "PPP HH:mm", { locale })
                case "year":
                    return format(value, "yyyy", { locale })
                case "month":
                    return format(value, "MMMM yyyy", { locale })
                default:
                    return format(value, "PPP", { locale })
            }
        } catch (e) {
            return "Invalid Date"
        }
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <div className={cn("w-full", className)}>
                <Input
                    type="text"
                    value={inputValue}
                    onChange={handleTypedInputChange}
                    placeholder={placeholder || (
                        mode === "time" ? "HH:mm" :
                            mode === "year" ? "YYYY" :
                                mode === "month" ? "MM/YYYY" : "DD/MM/YYYY"
                    )}
                    disabled={disabled}
                    className={cn(
                        "pr-14", // Extra padding for two icons
                        !value && "text-muted-foreground",
                        size === "sm" && "h-9",
                        size === "default" && "h-10",
                    )}
                    onBlur={(e) => {
                        if (!value || isNaN(value.getTime())) {
                            setInputValue("")
                            onChange(undefined)
                        } else {
                            setInputValue(format(value, getFormat(mode), { locale }))
                        }
                        if (onBlur) onBlur(e)
                    }}
                    rightElement={
                        <div className="flex items-center gap-0.5 pointer-events-auto">
                            {value && !disabled && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="p-1 h-7 w-7 hover:bg-muted rounded text-muted-foreground/60 hover:text-foreground transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onChange(undefined)
                                        setInputValue("")
                                    }}
                                >
                                    <X className="h-3.5 w-3.5" />
                                </Button>
                            )}
                            <PopoverTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="p-1.5 h-8 w-8 hover:bg-muted rounded text-muted-foreground/60 hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={disabled}
                                >
                                    {mode === "time" ? (
                                        <Clock className="h-4 w-4" />
                                    ) : (
                                        <CalendarIcon className="h-4 w-4" />
                                    )}
                                </Button>
                            </PopoverTrigger>
                        </div>
                    }
                />
            </div>
            <PopoverContent className="w-auto p-0 border-input shadow-none" align="start">
                <div className="flex flex-col sm:flex-row">
                    {(mode === "date" || mode === "datetime") && (
                        <div className="p-3">
                            {view === "day" && (
                                <div className="animate-in fade-in duration-200">
                                    <div className="flex items-center justify-between mb-2 px-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 opacity-50 hover:opacity-100 transition-opacity"
                                            onClick={() => setViewDate(prev => subMonths(prev, 1))}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                className="h-8 px-2 font-bold text-sm hover:bg-muted/50 transition-colors"
                                                onClick={() => setView("month")}
                                            >
                                                {format(viewDate, "MMMM", { locale })}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                className="h-8 px-2 font-bold text-sm hover:bg-muted/50 transition-colors"
                                                onClick={() => setView("year")}
                                            >
                                                {format(viewDate, "yyyy", { locale })}
                                            </Button>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 opacity-50 hover:opacity-100 transition-opacity"
                                            onClick={() => setViewDate(prev => addMonths(prev, 1))}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <Calendar
                                        mode="single"
                                        selected={value}
                                        onSelect={handleSelect}
                                        month={viewDate}
                                        onMonthChange={setViewDate}
                                        initialFocus
                                        classNames={{
                                            caption_label: "hidden",
                                            month_caption: "hidden",
                                        }}
                                        components={{
                                            Nav: () => <div className="hidden" />,
                                        }}
                                    />
                                </div>
                            )}
                            {view === "month" && (
                                <MonthGrid
                                    selectedDate={viewDate}
                                    onSelect={(month) => {
                                        setViewDate(setMonth(viewDate, month))
                                        setView("day")
                                    }}
                                    onClose={() => setView("day")}
                                />
                            )}
                            {view === "year" && (
                                <YearGrid
                                    selectedYear={getYear(viewDate)}
                                    onSelect={(year) => {
                                        setViewDate(setYear(viewDate, year))
                                        setView("day")
                                    }}
                                    onClose={() => setView("day")}
                                />
                            )}
                        </div>
                    )}

                    {(mode === "time" || mode === "datetime") && (
                        <div className={cn(
                            "flex flex-col border-t sm:border-t-0 sm:border-l border-input p-3 min-w-[120px]",
                            mode === "datetime" && "max-h-[350px]"
                        )}>
                            <div className="flex items-center justify-center gap-2 mb-3 px-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Time</span>
                            </div>
                            <div className="flex gap-2 justify-center">
                                <TimeColumn
                                    max={24}
                                    value={value?.getHours() || 0}
                                    onChange={(v) => handleTimeChange("hours", v)}
                                    label="Hours"
                                />
                                <TimeColumn
                                    max={60}
                                    value={value?.getMinutes() || 0}
                                    onChange={(v) => handleTimeChange("minutes", v)}
                                    label="Min"
                                />
                                {showSeconds && (
                                    <TimeColumn
                                        max={60}
                                        value={value?.getSeconds() || 0}
                                        onChange={(v) => handleTimeChange("seconds", v)}
                                        label="Sec"
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {mode === "year" && (
                        <YearGrid
                            selectedYear={value ? getYear(value) : getYear(new Date())}
                            onSelect={(year) => {
                                const base = value || new Date()
                                handleSelect(setYear(startOfYear(base), year))
                            }}
                        />
                    )}

                    {mode === "month" && (
                        <MonthGrid
                            selectedDate={value || new Date()}
                            onSelect={(month, year) => {
                                let date = setYear(new Date(), year ?? getYear(new Date()))
                                date = setMonth(date, month)
                                handleSelect(startOfMonth(date))
                            }}
                        />
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}

function TimeColumn({ max, value, onChange, label }: { max: number, value: number, onChange: (v: number) => void, label: string }) {
    return (
        <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] text-muted-foreground font-medium uppercase">{label}</span>
            <ScrollArea className="h-48 w-12 rounded-md border border-input bg-muted/20">
                <div className="p-1">
                    {Array.from({ length: max }).map((_, i) => (
                        <Button
                            key={i}
                            variant={i === value ? "default" : "ghost"}
                            className={cn(
                                "flex h-8 w-full items-center justify-center rounded-sm text-sm transition-colors p-0",
                                i === value
                                    ? "bg-primary text-primary-foreground font-bold"
                                    : "hover:bg-accent hover:text-accent-foreground text-foreground"
                            )}
                            onClick={() => onChange(i)}
                        >
                            {i.toString().padStart(2, "0")}
                        </Button>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}

function YearGrid({ selectedYear, onSelect, onClose }: { selectedYear: number, onSelect: (year: number) => void, onClose?: () => void }) {
    const [viewYear, setViewYear] = React.useState(selectedYear)
    const years = Array.from({ length: 12 }, (_, i) => viewYear - 5 + i)

    return (
        <div className="p-3 w-[280px] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4 px-1">
                <Button variant="ghost" size="icon" className="h-7 w-7 opacity-50 hover:opacity-100" onClick={() => setViewYear(v => v - 12)}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm font-bold bg-accent/50 px-2 py-0.5 rounded-md">
                    {years[0]} - {years[11]}
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 opacity-50 hover:opacity-100" onClick={() => setViewYear(v => v + 12)}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
            <div className="grid grid-cols-3 gap-2">
                {years.map((year) => (
                    <Button
                        key={year}
                        variant={year === selectedYear ? "default" : "outline"}
                        className={cn(
                            "h-10 text-sm shadow-none focus-visible:ring-1 focus-visible:ring-ring border-input transition-all",
                            year === selectedYear ? "font-bold scale-105" : "hover:bg-muted/50 font-normal"
                        )}
                        onClick={() => onSelect(year)}
                    >
                        {year}
                    </Button>
                ))}
            </div>
            {onClose && (
                <Button variant="ghost" className="w-full mt-4 h-8 text-xs text-muted-foreground hover:text-foreground" onClick={onClose}>
                    Back to Calendar
                </Button>
            )}
        </div>
    )
}

function MonthGrid({ selectedDate, onSelect, onClose }: { selectedDate: Date, onSelect: (month: number, year?: number) => void, onClose?: () => void }) {
    const [viewYear, setViewYear] = React.useState(getYear(selectedDate))
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]

    return (
        <div className="p-3 w-[280px] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4 px-1">
                <Button variant="ghost" size="icon" className="h-7 w-7 opacity-50 hover:opacity-100" onClick={() => setViewYear(v => v - 1)}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm font-bold bg-accent/50 px-2 py-0.5 rounded-md">
                    {viewYear}
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 opacity-50 hover:opacity-100" onClick={() => setViewYear(v => v + 1)}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
            <div className="grid grid-cols-3 gap-2">
                {months.map((month, i) => {
                    const isSelected = getMonth(selectedDate) === i && getYear(selectedDate) === viewYear
                    return (
                        <Button
                            key={month}
                            variant={isSelected ? "default" : "outline"}
                            className={cn(
                                "h-10 text-sm shadow-none focus-visible:ring-1 focus-visible:ring-ring border-input transition-all",
                                isSelected ? "font-bold scale-105" : "hover:bg-muted/50 font-normal"
                            )}
                            onClick={() => onSelect(i, viewYear)}
                        >
                            {month}
                        </Button>
                    )
                })}
            </div>
            {onClose && (
                <Button variant="ghost" className="w-full mt-4 h-8 text-xs text-muted-foreground hover:text-foreground" onClick={onClose}>
                    Back to Calendar
                </Button>
            )}
        </div>
    )
}
