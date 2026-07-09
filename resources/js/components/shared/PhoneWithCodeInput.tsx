import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Search } from "lucide-react";
import { FieldError } from "@/components/ui/field-error";
import { FORM_FIELD_LAYOUT } from "@/constants";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Each from "@/components/Each";

// ── Country data (curated list — extend as needed) ──────────────────────
interface CountryCode {
  code: string;
  name: string;
  dial: string;
  flag: string;
  maxLength: number;
}

const COUNTRY_CODES: CountryCode[] = [
  { code: "IN", name: "India",          dial: "+91",  flag: "🇮🇳", maxLength: 10 },
  { code: "US", name: "United States",  dial: "+1",   flag: "🇺🇸", maxLength: 10 },
  { code: "GB", name: "United Kingdom", dial: "+44",  flag: "🇬🇧", maxLength: 11 },
  { code: "AE", name: "UAE",            dial: "+971", flag: "🇦🇪", maxLength: 9  },
  { code: "SA", name: "Saudi Arabia",   dial: "+966", flag: "🇸🇦", maxLength: 9  },
  { code: "CA", name: "Canada",         dial: "+1",   flag: "🇨🇦", maxLength: 10 },
  { code: "AU", name: "Australia",      dial: "+61",  flag: "🇦🇺", maxLength: 9  },
  { code: "SG", name: "Singapore",      dial: "+65",  flag: "🇸🇬", maxLength: 8  },
  { code: "NP", name: "Nepal",          dial: "+977", flag: "🇳🇵", maxLength: 10 },
  { code: "BD", name: "Bangladesh",     dial: "+880", flag: "🇧🇩", maxLength: 10 },
  { code: "LK", name: "Sri Lanka",      dial: "+94",  flag: "🇱🇰", maxLength: 9  },
  { code: "PK", name: "Pakistan",       dial: "+92",  flag: "🇵🇰", maxLength: 10 },
  { code: "DE", name: "Germany",        dial: "+49",  flag: "🇩🇪", maxLength: 11 },
  { code: "FR", name: "France",         dial: "+33",  flag: "🇫🇷", maxLength: 9  },
  { code: "JP", name: "Japan",          dial: "+81",  flag: "🇯🇵", maxLength: 10 },
  { code: "KR", name: "South Korea",    dial: "+82",  flag: "🇰🇷", maxLength: 11 },
  { code: "CN", name: "China",          dial: "+86",  flag: "🇨🇳", maxLength: 11 },
  { code: "MY", name: "Malaysia",       dial: "+60",  flag: "🇲🇾", maxLength: 10 },
  { code: "ZA", name: "South Africa",   dial: "+27",  flag: "🇿🇦", maxLength: 9  },
  { code: "NG", name: "Nigeria",        dial: "+234", flag: "🇳🇬", maxLength: 10 },
];

const DEFAULT_COUNTRY = COUNTRY_CODES[0]; // India

// ── Props ───────────────────────────────────────────────────────────────
interface PhoneWithCodeInputProps {
  value?: string;
  onChange: (value: string) => void;
  onBlur?: (e: any) => void;
  disabled?: boolean;
  placeholder?: string;
  error?: string;
  className?: string;
  defaultCountryCode?: string;
}

// ── Component ───────────────────────────────────────────────────────────
export function PhoneWithCodeInput({
  value = "",
  onChange,
  onBlur,
  disabled,
  placeholder,
  error,
  className,
  defaultCountryCode = "IN",
}: PhoneWithCodeInputProps) {
  // Parse existing value to extract country code
  const parseValue = useCallback(
    (val: string) => {
      if (!val) {
        const defaultC =
          COUNTRY_CODES.find((c) => c.code === defaultCountryCode) ??
          DEFAULT_COUNTRY;
        return { country: defaultC, phone: "" };
      }
      // Try to match a known dial code prefix
      for (const c of COUNTRY_CODES) {
        if (val.startsWith(c.dial)) {
          return { country: c, phone: val.slice(c.dial.length).trim() };
        }
      }
      // No match — treat entire value as phone with default country
      const defaultC =
        COUNTRY_CODES.find((c) => c.code === defaultCountryCode) ??
        DEFAULT_COUNTRY;
      return { country: defaultC, phone: val };
    },
    [defaultCountryCode],
  );

  const parsed = useMemo(() => parseValue(value), [value, parseValue]);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(
    parsed.country,
  );
  const [phoneNumber, setPhoneNumber] = useState(parsed.phone);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync internal state when external value changes (e.g. session storage hydration, form reset, step navigation)
  useEffect(() => {
    setSelectedCountry(parsed.country);
    setPhoneNumber(parsed.phone);
  }, [parsed.country, parsed.phone]);

  const filteredCountries = useMemo(
    () =>
      search.trim()
        ? COUNTRY_CODES.filter(
            (c) =>
              c.name.toLowerCase().includes(search.toLowerCase()) ||
              c.dial.includes(search) ||
              c.code.toLowerCase().includes(search.toLowerCase()),
          )
        : COUNTRY_CODES,
    [search],
  );

  const emitValue = useCallback(
    (country: CountryCode, phone: string) => {
      const cleaned = phone.replace(/\D/g, "");
      onChange(cleaned ? `${country.dial}${cleaned}` : "");
    },
    [onChange],
  );

  const handleCountrySelect = (country: CountryCode) => {
    setSelectedCountry(country);
    setOpen(false);
    setSearch("");
    emitValue(country, phoneNumber);
    // Focus the input after selection
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    const limited = raw.slice(0, selectedCountry.maxLength);
    setPhoneNumber(limited);
    emitValue(selectedCountry, limited);
  };

  const errorClassName = error
    ? "border-destructive focus-within:ring-destructive/20"
    : "";

  return (
    <div className="w-full">
      <div
        className={cn(
          "flex items-stretch rounded-xl border border-border bg-background/50 backdrop-blur-sm transition-all duration-300 dark:bg-card/20",
          "focus-within:ring-4 focus-within:ring-primary/15 focus-within:border-primary h-11 overflow-hidden hover:border-primary/30",
          errorClassName,
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
      >
        {/* Country Code Selector */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild disabled={disabled}>
            <button
              type="button"
              className={cn(
                "flex items-center gap-2 px-3 border-r border-border/50",
                "text-[13px] font-bold text-foreground/80 hover:bg-white/5",
                "transition-colors shrink-0",
                "focus:outline-none",
                disabled && "pointer-events-none",
              )}
              aria-label="Select country code"
            >
              <span className="text-base leading-none">{selectedCountry.flag}</span>
              <span className="text-[11px] font-bold text-muted-foreground/60 tracking-tight">{selectedCountry.dial}</span>
              <ChevronDown className="size-3.5 text-muted-foreground/40" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-64 p-0 rounded-2xl shadow-2xl border-border bg-card backdrop-blur-xl ring-1 ring-white/10"
            align="start"
            sideOffset={4}
          >
            {/* Search */}
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border/50 bg-white/5">
              <Search className="size-3.5 text-muted-foreground/40 shrink-0" />
              <input
                type="text"
                placeholder="Search country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-[13px] font-medium outline-none placeholder:text-muted-foreground/30 text-foreground"
                autoFocus
              />
            </div>
            {/* List */}
            <div className="max-h-[240px] overflow-y-auto py-1 custom-scrollbar">
              <Each
                of={filteredCountries}
                keyExtractor={(c) => c.code}
                render={(country) => (
                  <button
                    type="button"
                    onClick={() => handleCountrySelect(country)}
                    className={cn(
                      "flex items-center gap-3 w-full px-3 py-2.5 text-[13px] text-left transition-colors",
                      "hover:bg-white/5 focus:bg-white/5 focus:outline-none",
                      country.code === selectedCountry.code &&
                        "bg-primary text-primary-foreground font-black",
                    )}
                  >
                    <span className="text-lg leading-none">{country.flag}</span>
                    <span className="flex-1 truncate text-foreground/80 font-medium">{country.name}</span>
                    <span className="text-[11px] text-muted-foreground/40 font-bold tracking-tighter">
                      {country.dial}
                    </span>
                  </button>
                )}
              />
              {filteredCountries.length === 0 && (
                <p className="text-[11px] text-muted-foreground/30 font-black uppercase tracking-widest text-center py-6">
                  No countries found
                </p>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Phone Number Input */}
        <input
          ref={inputRef}
          type="tel"
          inputMode="numeric"
          value={phoneNumber}
          onChange={handlePhoneChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder || "Enter phone number"}
          maxLength={selectedCountry.maxLength}
          className={cn(
            "flex-1 bg-transparent px-4 text-[15px] font-medium text-foreground",
            "outline-none border-0 ring-0 shadow-none",
            "placeholder:text-muted-foreground/30",
            "disabled:cursor-not-allowed",
          )}
        />

        {/* Character count */}
        <div className="flex items-center pr-4">
          <span className="text-[10px] text-muted-foreground/50 font-black tabular-nums tracking-[0.15em] bg-white/5 px-2 py-1 rounded-lg border border-border/50">
            {phoneNumber.length}/{selectedCountry.maxLength}
          </span>
        </div>
      </div>

      {/* Helper row */}
      <div className={FORM_FIELD_LAYOUT.HELPER_ROW_CLASS}>
        <FieldError message={error ?? ""} />
      </div>
    </div>
  );
}
