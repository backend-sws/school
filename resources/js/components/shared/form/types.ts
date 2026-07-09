import { ReactNode } from "react";

export interface FieldOption {
  key: string;
  text: string;
  value: any;
}

export interface StyleConfig {
  labelColor?: string;
  [key: string]: string | number | undefined;
}

export interface BaseFieldProps {
  type: string;
  placeholder?: string;
  style?: StyleConfig;
  maxLength?: number;
  error?: string;
  helperText?: string;
  forgotPasswordHref?: string;
  value?: any;
  onChange: (value: any) => void;
  onBlur?: (e: any) => void;
  onKeyDown?: (e: any) => void;
  disabled?: boolean;
  className?: string;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  // Shared props used by multiple renderers
  options?: readonly FieldOption[];
  fileMode?: string;
  maxFiles?: number;
  accept?: string;
  maxItems?: number;
  maxTags?: number;
  predefinedTags?: string[];
  defaultPhoneCode?: string;
  institution?: any;
  variant?: "default" | "premium";
  icon?: ReactNode;
  label?: ReactNode;
  control?: any;
}

export const PREMIUM_INPUT_CLASSES = "rounded-xl border-border bg-background transition-all duration-300 focus-visible:ring-0 focus-visible:border-primary h-11 text-[15px] shadow-none hover:border-primary/30 placeholder:text-muted-foreground/40 dark:bg-card/20 outline-none";
export const PREMIUM_LABEL_CLASSES = "text-[11px] font-black text-muted-foreground/80 flex items-center gap-[var(--space-1-5,0.375rem)] mb-[var(--space-1)] tracking-wider uppercase";
