import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import AsyncReactSelect from "react-select/async";
import type { StylesConfig, GroupBase, SingleValue, MultiValue } from "react-select";
import { cn } from "@/lib/utils";
import { FieldError } from "@/components/ui/field-error";
import type { AsyncSelectConfig } from "@/types";
import { debounce } from "@/lib/helpers";

// ─── Types ────────────────────────────────────────────
interface AsyncSelectFieldProps {
  asyncConfig: AsyncSelectConfig;
  value: any;
  onChange: (value: any, option?: any) => void;
  onBlur?: (e: any) => void;
  disabled?: boolean;
  placeholder?: string;
  error?: string;
  className?: string;
  variant?: "default" | "premium";
  icon?: React.ReactNode;
  label?: string;
  menuPortalTarget?: HTMLElement | null;
}

interface OptionType {
  label: string;
  value: any;
  raw: Record<string, any>;
}

// ─── Helpers ──────────────────────────────────────────
const DEFAULT_PER_PAGE = 15;

/** Extract items array from various API response shapes (Axios / Laravel paginated / plain array). */
function extractItems(response: any): Record<string, any>[] {
  const data = response?.data ?? response;
  if (Array.isArray(data)) return data;
  if (data?.data && Array.isArray(data.data)) return data.data;
  return [];
}

function toOptions(
  items: Record<string, any>[],
  labelKey: string,
  valueKey: string,
): OptionType[] {
  return items.map((item) => {
    let label = String(item[labelKey] ?? "");
    
    // If it's a student user and has a student profile, append Class & Reg No
    const sp = item.student_profile || item.studentProfile;
    if (sp) {
      const classInfo = sp.stream?.name || "";
      const regNo = sp.reg_no ? `Reg: ${sp.reg_no}` : "";
      const extra = [classInfo, regNo].filter(Boolean).join(" | ");
      if (extra) {
        label = `${label} (${extra})`;
      }
    }

    return {
      label,
      value: item[valueKey],
      raw: item,
    };
  });
}

/**
 * Helper: reference a CSS custom-property directly.
 * Our design tokens use oklch() values, so we must NOT wrap them in hsl().
 */
const cssVar = (name: string) => `var(${name})`;

// ─── Custom Styles (shadcn-compatible, oklch-safe) ───
function buildStyles(hasError?: boolean, isPremium?: boolean): StylesConfig<OptionType, boolean, GroupBase<OptionType>> {
  return {
    control: (base, state) => ({
      ...base,
      minHeight: isPremium ? "2.25rem" : "2.75rem",
      borderRadius: isPremium ? "0.75rem" : "0.75rem",
      borderWidth: isPremium ? "0" : "1px",
      borderStyle: "solid",
      borderColor: state.isFocused
        ? cssVar("--ring")
        : hasError
          ? cssVar("--destructive")
          : cssVar("--border"),
      backgroundColor: isPremium 
        ? "transparent" 
        : state.isDisabled
          ? cssVar("--muted")
          : cssVar("--background"),
      boxShadow: "none",
      fontSize: "0.875rem",
      cursor: state.isDisabled ? "not-allowed" : "pointer",
      transition: "all 0.2s ease",
      "&:hover": {
        borderColor: state.isFocused
          ? cssVar("--ring")
          : hasError
            ? cssVar("--destructive")
            : cssVar("--border"),
        backgroundColor: isPremium ? "rgba(var(--muted), 0.1)" : base.backgroundColor,
      },
      padding: isPremium ? "0" : base.padding,
    }),

    valueContainer: (base) => ({
        ...base,
        padding: isPremium ? "0 4px" : "2px 12px",
    }),

    singleValue: (base) => ({
        ...base,
        color: cssVar("--foreground"),
        fontWeight: isPremium ? 700 : 500,
        fontSize: isPremium ? "0.75rem" : "0.875rem",
    }),

    dropdownIndicator: (base, state) => ({
        ...base,
        color: cssVar("--muted-foreground"),
        padding: "0 4px",
        opacity: 0.4,
        transition: "transform 0.2s, color 0.2s",
        transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : undefined,
        "&:hover": { color: cssVar("--foreground") },
        display: isPremium ? "flex" : base.display,
    }),

    placeholder: (base) => ({
      ...base,
      color: cssVar("--muted-foreground"),
      fontSize: "0.875rem",
    }),



    menu: (base) => ({
      ...base,
      borderRadius: "0.75rem",
      backgroundColor: cssVar("--popover"),
      border: `1px solid ${cssVar("--border")}`,
      boxShadow:
        "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
      overflow: "hidden",
      zIndex: 50,
      marginTop: "4px",
    }),

    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
      pointerEvents: "auto",
    }),

    menuList: (base) => ({
      ...base,
      padding: "4px",
      maxHeight: "260px",
    }),

    option: (base, state) => ({
      ...base,
      borderRadius: "0.5rem",
      padding: "8px 12px",
      backgroundColor: state.isSelected
        ? cssVar("--primary")
        : state.isFocused
          ? cssVar("--accent")
          : "transparent",
      color: state.isSelected
        ? cssVar("--primary-foreground")
        : cssVar("--foreground"),
      fontSize: "0.875rem",
      fontWeight: state.isSelected ? 600 : 400,
      cursor: "pointer",
      transition: "background-color 0.15s ease",
      "&:active": {
        backgroundColor: cssVar("--accent"),
      },
    }),

    indicatorSeparator: () => ({ display: "none" }),



    clearIndicator: (base) => ({
      ...base,
      color: cssVar("--muted-foreground"),
      padding: "0 4px",
      "&:hover": { color: cssVar("--destructive") },
    }),

    loadingIndicator: (base) => ({
      ...base,
      color: cssVar("--primary"),
    }),

    noOptionsMessage: (base) => ({
      ...base,
      color: cssVar("--muted-foreground"),
      fontSize: "0.875rem",
      padding: "1rem",
    }),

    loadingMessage: (base) => ({
      ...base,
      color: cssVar("--muted-foreground"),
      fontSize: "0.875rem",
    }),

    multiValue: (base) => ({
      ...base,
      backgroundColor: `color-mix(in oklch, ${cssVar("--primary")} 10%, transparent)`,
      borderRadius: "0.375rem",
    }),

    multiValueLabel: (base) => ({
      ...base,
      color: cssVar("--primary"),
      fontWeight: 500,
      fontSize: "0.8125rem",
    }),

    multiValueRemove: (base) => ({
      ...base,
      color: cssVar("--primary"),
      "&:hover": {
        backgroundColor: `color-mix(in oklch, ${cssVar("--destructive")} 10%, transparent)`,
        color: cssVar("--destructive"),
      },
    }),

    input: (base) => ({
      ...base,
      color: cssVar("--foreground"),
      caretColor: cssVar("--primary"),
      "& input": {
        boxShadow: "none !important",
        outline: "none !important",
        border: "none !important",
      },
    }),


  };
}

// ============================================================================
// AsyncSelectField — clean architecture, no caching
// ============================================================================
export function AsyncSelectField({
  asyncConfig,
  value,
  onChange,
  onBlur,
  disabled,
  placeholder = "Search...",
  error,
  className,
  variant = "default",
  icon,
  label,
  menuPortalTarget = typeof document !== "undefined" ? document.body : undefined,
}: AsyncSelectFieldProps) {
  const isPremium = variant === "premium";
  const {
    queryFn,
    labelKey = "name",
    valueKey = "id",
    searchKey = "search",
    perPage = DEFAULT_PER_PAGE,
    extraParams = {},
    multiple = false,
    enabled = true,
  } = asyncConfig;

  // Keep queryFn in a ref to avoid dependency-related refetches when inline queryFn reference changes
  const queryFnRef = useRef(queryFn);
  useEffect(() => {
    queryFnRef.current = queryFn;
  }, [queryFn]);

  // ── State ────────────────────────────────────────────
  // All fetched options (merged across initial load + searches) for label resolution
  const [optionPool, setOptionPool] = useState<OptionType[]>([]);
  // Options shown as defaultOptions in the dropdown
  const [defaultOptions, setDefaultOptions] = useState<OptionType[]>([]);
  // Loading state for initial fetch
  const [isLoading, setIsLoading] = useState(false);
  // Counter to force AsyncReactSelect remount AFTER data is fetched
  const [renderKey, setRenderKey] = useState(0);

  // ── Stable identity for extraParams ──────────────────
  const extraParamsKey = useMemo(() => JSON.stringify(extraParams), [extraParams]);

  // ── Core fetch function (no caching, always fresh) ───
  const fetchItems = useCallback(
    async (search: string): Promise<OptionType[]> => {
      if (!enabled) return [];
      try {
        const params: Record<string, any> = {
          page: 1,
          per_page: perPage,
          ...extraParams,
        };
        if (search) params[searchKey] = search;

        const response = await queryFnRef.current(params);
        const items = extractItems(response);
        return toOptions(items, labelKey, valueKey);
      } catch {
        return [];
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [enabled, labelKey, valueKey, searchKey, perPage, extraParamsKey],
  );

  // ── Merge new options into pool (for label resolution) ─
  const mergeIntoPool = useCallback((newOptions: OptionType[]) => {
    setOptionPool((prev) => {
      const map = new Map(prev.map((o) => [String(o.value), o]));
      newOptions.forEach((o) => map.set(String(o.value), o));
      return Array.from(map.values());
    });
  }, []);

  // ── Initial load: fetch on mount + whenever extraParams change ──
  useEffect(() => {
    // Skip if disabled
    if (!enabled) {
      setDefaultOptions([]);
      return;
    }

    setIsLoading(true);
    fetchItems("").then((opts) => {
      setDefaultOptions(opts);
      mergeIntoPool(opts);
      setIsLoading(false);
      // Force AsyncReactSelect to remount AFTER options are ready
      // so it picks up the populated defaultOptions on its fresh mount
      setRenderKey((k) => k + 1);
    });
  }, [enabled, extraParamsKey, fetchItems, mergeIntoPool]);

  // ── Search handler (debounced, always hits API fresh) ──
  const loadOptions = useMemo(
    () =>
      debounce((inputValue: string, callback: (options: OptionType[]) => void) => {
        fetchItems(inputValue).then((opts) => {
          mergeIntoPool(opts);
          callback(opts);
        });
      }, 300),
    [fetchItems, mergeIntoPool],
  );

  // ── Resolve selected value → option with proper label ──
  const selectedOption = useMemo(() => {
    if (value == null || value === "") return null;

    if (multiple && Array.isArray(value)) {
      return value.map((v) => {
        const found = optionPool.find((o) => String(o.value) === String(v));
        // If not in pool yet, show a loading placeholder — not the raw ID
        return found ?? { label: "", value: v, raw: {} };
      });
    }

    const found = optionPool.find((o) => String(o.value) === String(value));
    return found ?? { label: "Loading…", value, raw: {} };
  }, [value, multiple, optionPool]);

  // ── If value exists but not in pool, fetch the full list to resolve it ──
  const hasUnresolvedValue = useMemo(() => {
    if (value == null || value === "") return false;
    if (multiple && Array.isArray(value)) {
      return value.some((v) => !optionPool.find((o) => String(o.value) === String(v)));
    }
    return !optionPool.find((o) => String(o.value) === String(value));
  }, [value, multiple, optionPool]);

  // Fetch to resolve unresolved values (e.g., page reload with value from sessionStorage)
  useEffect(() => {
    if (!hasUnresolvedValue || !enabled) return;
    fetchItems("").then((opts) => {
      mergeIntoPool(opts);
      setDefaultOptions((prev) => {
        const map = new Map(prev.map((o) => [String(o.value), o]));
        opts.forEach((o) => map.set(String(o.value), o));
        return Array.from(map.values());
      });
    });
  }, [hasUnresolvedValue, enabled, fetchItems, mergeIntoPool]);

  // ── Change handler ─────────────────────────────────
  const handleChange = useCallback(
    (selected: SingleValue<OptionType> | MultiValue<OptionType>) => {
      if (multiple) {
        const arr = selected as MultiValue<OptionType>;
        onChange(
          arr ? arr.map((s) => s.value) : [],
          arr ? arr.map((s) => ({ label: s.label, value: s.value, raw: s.raw })) : [],
        );
      } else {
        const single = selected as SingleValue<OptionType>;
        onChange(
          single ? single.value : "",
          single ? { label: single.label, value: single.value, raw: single.raw } : undefined,
        );
      }
    },
    [multiple, onChange],
  );

  const styles = useMemo(() => buildStyles(!!error, isPremium), [error, isPremium]);

  return (
    <div className={cn("w-full", isPremium ? "h-10 flex flex-col justify-center px-3 py-1 rounded-xl hover:bg-muted/10 transition-all min-w-[140px]" : "", className)}>
      {isPremium && (
        <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 leading-none mb-0.5">
          {icon}
          {label || placeholder}
        </span>
      )}
      <AsyncReactSelect<OptionType, boolean>
        key={renderKey}
        defaultOptions={defaultOptions}
        loadOptions={loadOptions}
        value={selectedOption}
        onChange={handleChange}
        isDisabled={disabled || !enabled}
        isLoading={isLoading}
        isMulti={multiple}
        placeholder={placeholder}
        isClearable
        styles={styles}
        noOptionsMessage={({ inputValue }) =>
          inputValue ? "No results found" : "Type to search…"
        }
        loadingMessage={() => "Loading…"}
        classNamePrefix="rs"
        menuPlacement="auto"
        menuPortalTarget={menuPortalTarget}
      />
      {error && <FieldError message={error} />}
    </div>
  );
}
