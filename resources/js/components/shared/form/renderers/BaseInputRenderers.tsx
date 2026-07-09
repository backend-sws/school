import React from "react";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { FORM_TYPE, FORM_FIELD_LAYOUT } from "@/constants";
import { applyInlineStyles, cn, formatCardNumber, formatExpiry } from "@/lib/utils";
import { BaseFieldProps, PREMIUM_INPUT_CLASSES } from "../types";
import { NumberTextInput } from "@/components/shared/NumberTextInput";
import { FieldError } from "@/components/ui/field-error";
import { CreditCard as CreditCardIcon, Lock as LockIcon, Globe } from "lucide-react";

export const BaseInputRenderers = (props: BaseFieldProps & { institution?: any; domainSuffix?: string }) => {
  const {
    type,
    value,
    onChange,
    onBlur,
    onKeyDown,
    disabled,
    placeholder,
    className,
    style,
    maxLength,
    error,
    leftElement,
    rightElement,
    institution,
    domainSuffix: domainSuffixProp,
  } = props;

  const domainSuffix = domainSuffixProp || institution?.domain_suffix || institution?.slug;

  const getNativeInputType = (t: string) =>
    t === FORM_TYPE.PHONE ? "tel" : t;

  const commonProps = {
    onBlur,
    onKeyDown,
    disabled,
    error: error ? String(error) : undefined, // Cast to string if component expects it
  };

  switch (type) {
    case FORM_TYPE.TEXTAREA: {
      const textareaValue = (value as string) || "";
      const showCharCount = maxLength != null;
      return (
        <div className="w-full relative">
          <textarea
            {...commonProps}
            value={textareaValue}
            onChange={(e) => onChange(e.target.value)}
            style={applyInlineStyles(style as Record<string, string | number>)}
            placeholder={placeholder}
            maxLength={maxLength}
            className={cn(PREMIUM_INPUT_CLASSES, className, "flex min-h-[100px] w-full px-(--space-4) py-(--space-3) text-[15px] resize-none leading-relaxed", error && "border-destructive focus-visible:ring-destructive/10 hover:border-destructive/50")}
          />
          <div className={FORM_FIELD_LAYOUT.HELPER_ROW_CLASS}>
            <div className="min-w-0 flex-1 text-left">
              {error && <FieldError message={error} />}
            </div>
            <div className="shrink-0 text-right">
              {showCharCount && (
                <p className="text-xs leading-none text-muted-foreground">
                  {textareaValue.length}/{maxLength}
                </p>
              )}
            </div>
          </div>
        </div>
      );
    }

    case FORM_TYPE.PASSWORD:
      return (
        <PasswordInput
          {...commonProps}
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          style={applyInlineStyles(style as Record<string, string | number>)}
          placeholder={placeholder}
          className={cn(PREMIUM_INPUT_CLASSES, className, "h-(--space-11,2.75rem)")}
        />
      );

    case FORM_TYPE.NUMBER:
      return (
        <Input
          {...commonProps}
          type="number"
          value={value !== null && value !== undefined ? String(value) : ""}
          onChange={(e) => {
            const val = e.target.value;
            onChange(val === "" ? undefined : Number(val));
          }}
          style={applyInlineStyles(style as Record<string, string | number>)}
          placeholder={placeholder}
          className={cn(PREMIUM_INPUT_CLASSES, className, "h-(--space-11,2.75rem)")}
        />
      );

    case FORM_TYPE.NUMBER_TEXT:
      return (
        <NumberTextInput
          {...commonProps}
          value={value}
          onChange={(val) => onChange(val === "" ? "" : val)}
          style={style as Record<string, string | number>}
          placeholder={placeholder}
          error={error ? String(error) : undefined}
        />
      );

    case FORM_TYPE.CARD_NUMBER:
      return (
        <Input
          {...commonProps}
          type="text"
          inputMode="numeric"
          value={(value as string) || ""}
          onChange={(e) => onChange(formatCardNumber(e.target.value))}
          placeholder={placeholder || "1234 5678 9012 3456"}
          className={cn(PREMIUM_INPUT_CLASSES, className, "h-(--space-11,2.75rem) font-mono tracking-wider")}
          maxLength={19}
          leftElement={<CreditCardIcon className="w-4 h-4" />}
        />
      );

    case FORM_TYPE.CARD_EXPIRY:
      return (
        <Input
          {...commonProps}
          type="text"
          inputMode="numeric"
          value={(value as string) || ""}
          onChange={(e) => onChange(formatExpiry(e.target.value))}
          placeholder={placeholder || "MM/YY"}
          className={cn(PREMIUM_INPUT_CLASSES, className, "h-(--space-11,2.75rem) font-mono tracking-wider")}
          maxLength={5}
        />
      );

    case FORM_TYPE.CARD_CVV:
      return (
        <Input
          {...commonProps}
          type="password"
          inputMode="numeric"
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 4))}
          placeholder={placeholder || "•••"}
          className={cn(PREMIUM_INPUT_CLASSES, className, "h-(--space-11,2.75rem) font-mono tracking-wider")}
          maxLength={4}
          leftElement={<LockIcon className="w-4 h-4" />}
        />
      );

    case FORM_TYPE.DOMAIN_SLUG:
      return (
        <div className="w-full space-y-(--space-2)">
          <Input
            {...commonProps}
            type="text"
            value={(value as string) || ""}
            onChange={(e) => {
              const slug = e.target.value
                .toLowerCase()
                .replace(/[^a-z0-9-]/g, "")
                .replace(/--+/g, "-");
              onChange(slug);
            }}
            placeholder={placeholder || "your-school"}
            className={cn(PREMIUM_INPUT_CLASSES, className, "h-(--space-11,2.75rem) font-mono tracking-wide")}
            maxLength={maxLength || 30}
            rightElement={
              domainSuffix ? (
                <span className="text-[11px] font-bold text-muted-foreground/40 tracking-tight pr-1">
                  .{domainSuffix}
                </span>
              ) : undefined
            }
          />
          {domainSuffix && (
            <div className="flex items-center gap-(--space-3) p-(--space-3) bg-white/5 rounded-xl border border-border transition-colors hover:bg-white/10">
              <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center shrink-0 border border-primary/20">
                <Globe className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">
                  Workspace URL
                </p>
                <p className="text-[13px] font-semibold text-foreground truncate">
                  <span className={(value as string) ? "text-primary" : "text-muted-foreground/30"}>
                    {(value as string) || "your-school"}
                  </span>
                  <span className="text-muted-foreground/40">.{domainSuffix}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      );

    default:
      return (
        <Input
          {...commonProps}
          type={getNativeInputType(type)}
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          style={applyInlineStyles(style as Record<string, string | number>)}
          placeholder={
            type === FORM_TYPE.PHONE ? placeholder || "+91 0000 000 000" : placeholder
          }
          className={cn(PREMIUM_INPUT_CLASSES, className, "h-(--space-11,2.75rem)")}
          leftElement={leftElement}
          rightElement={rightElement}
        />
      );
  }
};
