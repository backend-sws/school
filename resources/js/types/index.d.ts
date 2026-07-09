import { InertiaLinkProps } from "@inertiajs/react";
import { LucideIcon } from "lucide-react";

export interface Role {
  key: string;
  name: string;
  scope_type?: string | null;
  scope_id?: number | null;
}

export interface PortalConfig {
  portal_menu_permission?: string;
  parent_dashboard_permission?: string;
}

export interface Auth {
  user: User;
  /** When parent is viewing as a linked student, the student's profile for display (name, avatar). One linked parent account; each context has its own profile. */
  effective_user?: User | null;
  /** True when this user's email is shared by more than one user (e.g. parent + student). Show Switch so they can link and switch. */
  has_multiple_users_same_email?: boolean;
  role: string;
  roles: Role[];
  permissions: string[];
  current_institution_id?: number | null;
  current_organization_id?: number | null;
  current_organization_name?: string | null;
  portal_config?: PortalConfig;
}

export interface BreadcrumbItem {
  title: string;
  href: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface NavItem {
  title: string;
  href: NonNullable<InertiaLinkProps["href"]>;
  icon?: LucideIcon | null;
  isActive?: boolean;
}

export interface AuthPanelFeature {
  label: string;
  href: string;
}

export interface AuthPanelConfig {
  quote: { message: string | null; author: string | null };
  features: AuthPanelFeature[];
}

export interface InstitutionProfile {
  // From institutions table
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  website: string;
  logo_url: string | null;
  type?: string;
  type_label?: string;
  profile_settings_title?: string;
  // Extra from settings table
  short_name: string;
  motto: string;
  established: string;
  is_brand?: boolean;
  // Brand tokens (per-institution theming)
  brand_theme?: string | null;
  brand_font?: string | null;
  brand_color?: string | null;
  brand_motif?: string | null;
  // Auth panel (login left side): config per institution
  auth_panel?: AuthPanelConfig;
}

export interface SubscriptionMetric {
  used: number;
  max: number;
}

export interface SubscriptionStorage {
  used_mb: number;
  max_mb: number;
}

export interface SubscriptionData {
  tier: string;
  tier_label: string;
  institutions: SubscriptionMetric;
  users: SubscriptionMetric;
  staff: SubscriptionMetric;
  emails: SubscriptionMetric;
  storage: SubscriptionStorage;
  modules: string[];
  add_ons: string[];
  billing_cycle: string;
  subscription_start: string | null;
  subscription_end: string | null;
  trial_ends_at: string | null;
  is_trial: boolean;
  is_active: boolean;
}

export interface Branding {
  powered_by: string;
  powered_by_url: string;
  designed_by: string;
  designed_by_url: string;
  copyright_by: string;
  site_url: string;
  brand_name: string;
  default_brand_theme: string;
}


export interface SharedData {
  name: string;
  app_url: string;
  quote: { message: string; author: string };
  auth: Auth;
  institution: InstitutionProfile;
  sidebarOpen: boolean;
  subscription: SubscriptionData | null;
  branding: Branding;
  [key: string]: unknown;
}

export interface AsyncSelectConfig {
  /** API call function, receives { page, search, ...extraParams } */
  queryFn: (params: Record<string, any>) => Promise<any>;
  /** Base query key array from query key module (e.g. DepartmentQueryKeys.all) */
  queryKey: readonly string[];
  /** Field name to display as option text (e.g. "name") */
  labelKey: string;
  /** Field name to use as option value (e.g. "id") */
  valueKey: string;
  /** API param name for search term (default: "search") */
  searchKey?: string;
  /** Items per page (default: 20) */
  perPage?: number;
  /** Static extra params merged into every request */
  extraParams?: Record<string, any>;
  /** Enable multi-select mode with badges (default: false) */
  multiple?: boolean;
  /** Whether the query is enabled (default: true) */
  enabled?: boolean;
}


export { };

declare global {
  var route: any;
}

export interface IdCardTemplate {
  id: number;
  institution_id: number;
  name: string;
  card_type: "student" | "staff" | "temporary";
  front_layout: Record<string, unknown> | null;
  back_layout: Record<string, unknown> | null;
  background_color: string;
  background_image_url: string | null;
  logo_url: string | null;
  color_scheme: { primary?: string; secondary?: string; text?: string; bg?: string } | null;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface IdCard {
  id: number;
  institution_id: number;
  template_id: number;
  user_id: number;
  session_id: number;
  card_type: "student" | "staff" | "temporary";
  verification_token: string;
  snapshot_data: {
    reg_no: string;
    name: string;
    roll_no?: string;
    stream?: string;
    department?: string;
    dob?: string;
    blood_group?: string;
    father_name?: string;
    [key: string]: unknown;
  };
  photo_url: string | null;
  pdf_path: string | null;
  status: "generated" | "printed" | "revoked" | "expired";
  valid_from: string;
  valid_until: string;
  generated_at: string | null;
  printed_at: string | null;
  created_at: string;
  updated_at: string;
  user?: { id: number; name: string; reg_no: string };
  template?: IdCardTemplate;
  session?: { id: number; name: string };
  institution?: { id: number; name: string; logo?: string };
}

export interface IdCardVerification {
  reg_no: string;
  name: string;
  photo_url: string | null;
  stream: string | null;
  department: string | null;
  session: string | null;
  card_type: string;
  status: string;
  valid_from: string;
  valid_until: string;
  institution: { name: string; logo: string | null };
}
