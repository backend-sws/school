/**
 * Student Show Page — polymorphic, config-driven field definitions.
 *
 * Every section on the student detail page is driven by a config array.
 * Each entry maps a label + icon + data-path so the page component
 * simply iterates configs via <Each> — zero hardcoded field JSX.
 *
 * Scope-type–aware labels (Class vs Stream etc.) are resolved at runtime
 * via getStudentProfileDisplayConfig().
 */

import {
  Mail,
  Phone,
  Hash,
  GraduationCap,
  BookOpen,
  Calendar,
  User,
  Droplets,
  CreditCard,
  ShieldCheck,
  Users,
  MapPin,
  Building2,
  Pencil,
  Wallet,
  Mail as MailIcon,
  Copy,
  Power,
  UserPlus,
  Bus,
  Bed,
  type LucideIcon,
} from "lucide-react";
import {
  getStudentProfileDisplayConfig,
  formatStudentProfileFieldValue,
  type ScopeTypeDisplayConfig,
} from "@/constants/scopeTypeDisplay";

// ─── Field configuration types ───────────────────────────────────────────────

export interface FieldConfig {
  key: string;
  label: string;
  icon: LucideIcon;
  /** Dot-path into student or profile object. Prefix "profile." to read from student_profile. */
  path: string;
  mono?: boolean;
  /** Optional formatter. Receives raw value, returns display string. */
  format?: (value: any, scopeType?: string | null) => string | null;
  /** If true, only show when value is truthy */
  showWhen?: (value: any) => boolean;
  /** If true, span full width in a 2-col grid */
  fullWidth?: boolean;
}

export interface SectionConfig {
  key: string;
  title: string;
  icon: LucideIcon;
  fields: FieldConfig[];
  /** "grid" = 2-col grid, "list" = single column with separators, "address" = special address rendering */
  layout: "grid" | "list" | "address";
  /** Optional: grid column span for the section itself. Default 1 in a 2-col parent. */
  gridSpan?: 1 | 2;
}

export interface ActionConfig {
  key: string;
  label: string;
  icon: LucideIcon;
  variant: "default" | "outline" | "ghost" | "destructive";
  /** Permission required. Null = always visible. */
  permission?: string;
  /** "primary" = top row, "secondary" = bottom toolbar */
  tier: "primary" | "secondary";
  /** If true, only show when student is unverified */
  showWhenUnverified?: boolean;
  /** If true, only show when student is verified */
  showWhenVerified?: boolean;
  /** Generic condition to show the action */
  showWhen?: (student: Record<string, any>, profile: Record<string, any> | null) => boolean;
  /** Custom class overrides */
  className?: string;
}

export interface HeroInfoPill {
  key: string;
  label: string;
  path: string;
  mono?: boolean;
  icon?: LucideIcon;
  /** "muted" | "primary" | "dashed" — controls the pill styling */
  variant: "muted" | "primary" | "dashed";
}

// ─── Hero info pills ─────────────────────────────────────────────────────────

export function getHeroInfoPills(
  displayConfig: ScopeTypeDisplayConfig
): HeroInfoPill[] {
  return [
    { key: "reg_no", label: "Reg", path: "profile.reg_no", mono: true, variant: "muted" },
    { key: "roll_no", label: "Roll", path: "profile.roll_no", mono: true, variant: "muted" },
    {
      key: "stream",
      label: displayConfig.fieldLabels.stream,
      path: "profile.stream.name",
      icon: GraduationCap,
      variant: "primary",
    },
    {
      key: "session",
      label: "",
      path: "profile.session.name",
      icon: Calendar,
      variant: "dashed",
    },
    {
      key: "transport",
      label: "Transport",
      path: "profile.transport_status_text",
      icon: Bus,
      variant: "muted",
    },
    {
      key: "hostel",
      label: "Hostel",
      path: "profile.hostel_status_text",
      icon: Bed,
      variant: "muted",
    },
  ];
}

// ─── Action bar config ───────────────────────────────────────────────────────

export const STUDENT_SHOW_ACTIONS: ActionConfig[] = [
  {
    key: "edit",
    label: "Edit Profile",
    icon: Pencil,
    variant: "default",
    permission: "update_users",
    tier: "primary",
  },
  {
    key: "fee_ledger",
    label: "Fee Ledger",
    icon: Wallet,
    variant: "outline",
    tier: "primary",
  },
  {
    key: "stop_services",
    label: "Stop Service (Transport/Hostel)",
    icon: Power,
    variant: "ghost",
    tier: "secondary",
    showWhen: (student, profile) => !!profile?.is_transport_stoppable || !!profile?.is_hostel_stoppable,
    className: "hover:text-destructive hover:bg-destructive/10 text-destructive/80",
  },
  {
    key: "resend_verification",
    label: "Resend Verification",
    icon: MailIcon,
    variant: "outline",
    tier: "primary",
    showWhenUnverified: true,
    className: "text-primary border-primary/20 hover:bg-primary/10 hover:text-primary",
  },
  {
    key: "readmit",
    label: "Re-Admit",
    icon: UserPlus,
    variant: "outline",
    permission: "create_readmissions",
    tier: "primary",
    className: "text-primary border-primary/20 hover:bg-primary/10 hover:text-primary",
  },
  {
    key: "copy_link",
    label: "Copy Link",
    icon: Copy,
    variant: "outline",
    tier: "primary",
    showWhenUnverified: true,
    className: "text-primary border-primary/20 hover:bg-primary/10 hover:text-primary",
  },
  {
    key: "toggle_status",
    label: "Deactivate",
    icon: Power,
    variant: "ghost",
    permission: "delete_users",
    tier: "secondary",
    className: "hover:text-destructive hover:bg-destructive/10",
  },
];

// ─── Section configs ─────────────────────────────────────────────────────────

export function getContactFields(): FieldConfig[] {
  return [
    { key: "email", label: "Email", icon: Mail, path: "student.email" },
    { key: "mobile", label: "Mobile", icon: Phone, path: "student.mobile" },
    { key: "reg_no", label: "Reg. No", icon: Hash, path: "profile.reg_no", mono: true },
    { key: "roll_no", label: "Roll No", icon: Hash, path: "profile.roll_no", mono: true },
  ];
}

export function getAcademicFields(displayConfig: ScopeTypeDisplayConfig): FieldConfig[] {
  return [
    {
      key: "stream",
      label: displayConfig.fieldLabels.stream,
      icon: GraduationCap,
      path: "profile.stream.name",
    },
    {
      key: "session",
      label: displayConfig.fieldLabels.session,
      icon: BookOpen,
      path: "profile.session.name",
    },
    {
      key: "subject",
      label: displayConfig.fieldLabels.subject,
      icon: BookOpen,
      path: "profile.subject.name",
    },
    {
      key: "current_semester",
      label: displayConfig.fieldLabels.current_semester,
      icon: Hash,
      path: "profile.current_semester",
      format: (value, scopeType) =>
        formatStudentProfileFieldValue(scopeType, "current_semester", value),
    },
    { key: "admission_date", label: "Admission Date", icon: Calendar, path: "profile.admission_date", format: (v) => formatDateValue(v) },
  ];
}

export function getPreviousAcademicFields(): FieldConfig[] {
  return [
    { key: "previous_school_name", label: "Previous School", icon: Building2, path: "profile.previous_school_name", fullWidth: true },
    { key: "previous_board", label: "Previous Board", icon: BookOpen, path: "profile.previous_board" },
    { key: "previous_roll_no", label: "Previous Roll No", icon: Hash, path: "profile.previous_roll_no", mono: true },
    { key: "previous_marks", label: "Previous Marks/Grade", icon: GraduationCap, path: "profile.previous_marks" },
    {
      key: "has_tc",
      label: "Transfer Certificate (TC) Submitted",
      icon: ShieldCheck,
      path: "profile.has_tc",
      format: (v) => v ? "Yes" : "No",
    },
  ];
}

export function getPersonalFields(): FieldConfig[] {
  return [
    { key: "dob", label: "Date of birth", icon: Calendar, path: "profile.dob", format: (v) => formatDateValue(v) },
    { key: "gender", label: "Gender", icon: User, path: "profile.gender" },
    { key: "blood_group", label: "Blood group", icon: Droplets, path: "profile.blood_group" },
    { key: "aadhar_no", label: "Aadhaar", icon: CreditCard, path: "profile.aadhar_no", mono: true },
    { key: "category", label: "Category", icon: ShieldCheck, path: "profile.category" },
    { key: "caste", label: "Caste", icon: ShieldCheck, path: "profile.caste" },
    { key: "nationality", label: "Nationality", icon: ShieldCheck, path: "profile.nationality" },
    { key: "religion", label: "Religion", icon: ShieldCheck, path: "profile.religion" },
    { key: "abc_no", label: "ABC ID", icon: Hash, path: "profile.abc_no", mono: true },
    { key: "apaar_id", label: "APAAR ID", icon: Hash, path: "profile.apaar_id", mono: true },
    { key: "has_government_portal", label: "Govt Portal Details", icon: BookOpen, path: "profile", format: (p) => p?.has_government_portal ? `Registered (${p.government_portal_name || 'Yes'})` : "Not Registered", fullWidth: true },
    {
      key: "differently_abled",
      label: "Differently abled",
      icon: ShieldCheck,
      path: "profile",
      showWhen: (p) => p?.is_differently_abled != null && p?.is_differently_abled === true,
      format: (p) => p?.disability_type ? `Yes (${p.disability_type})` : "Yes",
      fullWidth: true,
    },
  ];
}

export function getMedicalFields(): FieldConfig[] {
  return [
    { key: "medical_condition", label: "Medical Condition", icon: Droplets, path: "profile.medical_condition", fullWidth: true },
    { key: "allergy", label: "Allergies", icon: ShieldCheck, path: "profile.allergy", fullWidth: true },
  ];
}

export function getGuardianFields(): FieldConfig[] {
  return [
    { key: "father_name", label: "Father's name", icon: User, path: "profile.father_name" },
    { key: "father_mobile", label: "Father's mobile", icon: Phone, path: "profile.father_mobile", mono: true },
    { key: "father_qualification", label: "Father's qualification", icon: BookOpen, path: "profile.father_qualification" },
    { key: "father_occupation", label: "Father's occupation", icon: BookOpen, path: "profile.father_occupation" },
    { key: "mother_name", label: "Mother's name", icon: User, path: "profile.mother_name" },
    { key: "local_guardian_name", label: "Local Guardian Name", icon: User, path: "profile.guardian_snapshot.local_guardian.name" },
    { key: "local_guardian_phone", label: "Local Guardian Phone", icon: Phone, path: "profile.guardian_snapshot.local_guardian.phone", mono: true },
    { key: "emergency_name", label: "Emergency Contact", icon: User, path: "profile.guardian_snapshot.emergency_contact.name", variant: "destructive" },
    { key: "emergency_mobile", label: "Emergency Phone", icon: Phone, path: "profile.guardian_snapshot.emergency_contact.mobile", mono: true, variant: "destructive" },
  ];
}

// ─── Full section map ────────────────────────────────────────────────────────

export function getStudentShowSections(
  displayConfig: ScopeTypeDisplayConfig
): SectionConfig[] {
  return [
    {
      key: "contact",
      title: "Contact & identity",
      icon: Mail,
      fields: getContactFields(),
      layout: "list",
    },
    {
      key: "academic",
      title: displayConfig.sectionTitles.academic,
      icon: GraduationCap,
      fields: getAcademicFields(displayConfig),
      layout: "list",
    },
    {
      key: "personal",
      title: "Personal details",
      icon: User,
      fields: getPersonalFields(),
      layout: "grid",
      gridSpan: 2,
    },
    {
      key: "medical",
      title: "Medical Information",
      icon: Droplets,
      fields: getMedicalFields(),
      layout: "grid",
      gridSpan: 2,
    },
    {
      key: "previous_academic",
      title: "Previous School & Academics",
      icon: Building2,
      fields: getPreviousAcademicFields(),
      layout: "grid",
      gridSpan: 2,
    },
    {
      key: "guardian",
      title: "Guardian & family",
      icon: Users,
      fields: getGuardianFields(),
      layout: "grid",
      gridSpan: 2,
    },
    {
      key: "permanent_address",
      title: "Permanent address",
      icon: MapPin,
      fields: [],
      layout: "address",
    },
    {
      key: "correspondence_address",
      title: "Correspondence address",
      icon: Building2,
      fields: [],
      layout: "address",
    },
  ];
}

// ─── Breadcrumbs ─────────────────────────────────────────────────────────────

export const STUDENT_SHOW_BREADCRUMBS = [
  { title: "Student Hub", href: "/students/manage" },
  { title: "Student List", href: "/students/manage" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDateValue(val: string | number | Date | null | undefined): string {
  if (val == null) return "—";
  const d = typeof val === "string" || typeof val === "number" ? new Date(val) : val;
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

/** Resolve a dot-path value from the student + profile data bag */
export function resolveFieldValue(
  path: string,
  student: Record<string, any>,
  profile: Record<string, any> | null | undefined
): any {
  const parts = path.split(".");
  let source: any;

  if (parts[0] === "student") {
    source = student;
    parts.shift();
  } else if (parts[0] === "profile") {
    source = profile;
    parts.shift();
  } else {
    source = { ...student, profile };
  }

  for (const p of parts) {
    if (source == null) return undefined;
    source = source[p];
  }
  return source;
}
