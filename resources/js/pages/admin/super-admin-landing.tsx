import { ChartBarDefault } from "@/components/charts/bar-chart";
import { ChartLineDefault } from "@/components/charts/line-chart";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { StatCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Each from "@/components/Each";
import { Head, Link, useForm } from "@inertiajs/react";
import {
  Building2,
  Building,
  History,
  Shield,
  Users,
  GraduationCap,
  IndianRupee,
  ClipboardList,
  Plus,
  Globe,
  Lock,
  UserCheck,
  Zap,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/api";
import { DASHBOARD_STATS_DATA } from "@/constants";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface Summary {
  institutions_count: number;
  organizations_count: number;
  active_trials: number;
  monthly_revenue: number;
  tier_breakdown: Record<string, number>;
}

interface OrganizationData {
  id: number;
  name: string;
  tier: string;
  status: string;
  ends_at: string | null;
  institutions_count: number;
}

interface InstitutionData {
  id: number;
  name: string;
  type: string;
  status: string;
  udise_code: string | null;
  org_name: string;
  domain: string;
}

interface SuperAdminLandingProps {
  summary?: Summary;
  organizations?: OrganizationData[];
  institutions?: InstitutionData[];
}

const BREADCRUMBS = [{ title: "Super Admin", href: "/super-admin" }];

const BRAND_THEMES = [
  { value: "nature", label: "Nature (Green)" },
  { value: "royal", label: "Royal (Blue)" },
  { value: "vibrant", label: "Vibrant (Purple)" },
  { value: "heritage", label: "Heritage (Brown)" },
  { value: "intelligence", label: "Intelligence (Indigo)" },
  { value: "serenity", label: "Serenity (Teal)" },
  { value: "energy", label: "Energy (Orange)" },
  { value: "oxford", label: "Oxford (Navy)" },
  { value: "crimson", label: "Crimson (Red)" },
  { value: "pdseducation", label: "PDS Education (Gold)" },
];

export default function SuperAdminLandingPage({
  summary = { institutions_count: 0, organizations_count: 0, active_trials: 0, monthly_revenue: 0, tier_breakdown: {} },
  organizations = [],
  institutions = [],
}: SuperAdminLandingProps) {
  const [openOnboardModal, setOpenOnboardModal] = useState(false);
  const [formStep, setFormStep] = useState(1);

  const { data, setData, post, processing, errors, reset } = useForm({
    org_name: "",
    plan_key: "professional",
    billing_cycle: "monthly",
    inst_name: "",
    inst_type: "school",
    slug: "",
    udise_code: "",
    brand_theme: "nature",
    admin_name: "",
    admin_email: "",
    admin_mobile: "",
    admin_password: "",
  });

  const { data: analytics } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await api.get<{
        data?: {
          widgets?: {
            total_students?: number;
            admission_stats?: { total?: number };
            total_fee_collection?: number;
            pending_tasks?: number;
          };
          admission_breakdown_chart?: Array<{
            month: string;
            new_admissions?: number;
            re_admissions?: number;
          }>;
          fee_trend_chart?: Array<{ month: string; total?: number }>;
          date_range?: { from: string; to: string };
        };
      }>("/dashboard-stats");
      return res?.data ?? null;
    },
  });

  const widgets = analytics?.widgets;
  const admissionChart = analytics?.admission_breakdown_chart ?? [];
  const feeTrendChart = analytics?.fee_trend_chart ?? [];
  const dateRange = analytics?.date_range;

  const formatCurrency = (n: number) => {
    if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(1)}Cr`;
    if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(1)}L`;
    if (n >= 1_000) return `₹${(n / 1_000).toFixed(1)}K`;
    return `₹${n}`;
  };

  const admissionChartData =
    admissionChart.length > 0
      ? admissionChart.map((d) => ({
        month: d.month,
        admissions: (d.new_admissions ?? 0) + (d.re_admissions ?? 0),
      }))
      : DASHBOARD_STATS_DATA.totalAdmissions;

  const feeChartData =
    feeTrendChart.length > 0
      ? feeTrendChart.map((d) => ({ month: d.month, feescount: Number(d.total ?? 0) }))
      : DASHBOARD_STATS_DATA.totalFees;

  const stats = [
    {
      title: "Institutions",
      value: String(summary.institutions_count ?? 0),
      description: "Registered schools/colleges",
      icon: <Building2 className="text-primary" />,
    },
    {
      title: "Organisations",
      value: String(summary.organizations_count ?? 0),
      description: "Parent groups",
      icon: <Building className="text-violet-500" />,
    },
    {
      title: "Active Trials",
      value: String(summary.active_trials ?? 0),
      description: "Trial period",
      icon: <Zap className="text-yellow-500" />,
      trend: "up" as const,
    },
    {
      title: "Monthly Revenue",
      value: formatCurrency(summary.monthly_revenue ?? 0),
      description: "Estimated MRR",
      icon: <IndianRupee className="text-green-500" />,
      trend: "up" as const,
    },
  ];

  const handleOnboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/super-admin/onboard", {
      onSuccess: () => {
        toast.success("School and parent organization onboarded successfully!");
        setOpenOnboardModal(false);
        setFormStep(1);
        reset();
      },
      onError: (errs) => {
        toast.error("Failed to onboard school. Please check validation errors.");
        // Auto-switch to step with errors
        if (errs.org_name || errs.plan_key || errs.billing_cycle) {
          setFormStep(1);
        } else if (errs.inst_name || errs.inst_type || errs.slug || errs.udise_code || errs.brand_theme) {
          setFormStep(2);
        } else {
          setFormStep(3);
        }
      }
    });
  };

  const generateRandomPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setData("admin_password", password);
    toast.success("Random password generated & copied to input!");
  };

  return (
    <>
      <Head title="Super Admin Dashboard" />

      <div className="flex flex-col gap-4 p-4 md:p-6">
        <MainPageHeader
          breadcrumbs={BREADCRUMBS}
          icon={Shield}
          title="Super Admin Control Center"
          subtitle="System-wide management, subscription monitoring and schools onboarding."
          guidance="Add new schools/institutions to your network, monitor live signups, and keep track of financial plans."
        >
          <div className="flex gap-2">
            <Dialog open={openOnboardModal} onOpenChange={(val) => {
              setOpenOnboardModal(val);
              if (!val) {
                setFormStep(1);
                reset();
              }
            }}>
              <DialogTrigger asChild>
                <Button variant="default" className="shadow-md hover:scale-[1.02] transition-transform flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Onboard New School
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    School Onboarding Wizard
                  </DialogTitle>
                  <DialogDescription>
                    Onboard a brand new school, configure its billing tier, and initialize its administrator portal.
                  </DialogDescription>
                </DialogHeader>

                {/* Onboarding Steps Indicators */}
                <div className="flex items-center justify-between border-b pb-4 mb-4">
                  <button
                    type="button"
                    onClick={() => setFormStep(1)}
                    className={`flex items-center gap-2 text-sm font-semibold pb-1 border-b-2 transition-all ${
                      formStep === 1 ? "border-primary text-primary" : "border-transparent text-muted-foreground"
                    }`}
                  >
                    <Zap className="h-4 w-4" /> Step 1: Organisation
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormStep(2)}
                    className={`flex items-center gap-2 text-sm font-semibold pb-1 border-b-2 transition-all ${
                      formStep === 2 ? "border-primary text-primary" : "border-transparent text-muted-foreground"
                    }`}
                  >
                    <Building className="h-4 w-4" /> Step 2: School Setup
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormStep(3)}
                    className={`flex items-center gap-2 text-sm font-semibold pb-1 border-b-2 transition-all ${
                      formStep === 3 ? "border-primary text-primary" : "border-transparent text-muted-foreground"
                    }`}
                  >
                    <UserCheck className="h-4 w-4" /> Step 3: Admin Account
                  </button>
                </div>

                <form onSubmit={handleOnboardSubmit} className="space-y-4">
                  {/* STEP 1: ORGANIZATION DETAILS */}
                  {formStep === 1 && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div className="space-y-2">
                        <Label htmlFor="org_name" className="text-sm font-semibold">Organisation Name</Label>
                        <Input
                          id="org_name"
                          placeholder="e.g. Springfield Education Trust"
                          value={data.org_name}
                          onChange={(e) => setData("org_name", e.target.value)}
                          required
                        />
                        {errors.org_name && <p className="text-xs text-destructive">{errors.org_name}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="plan_key" className="text-sm font-semibold">Subscription Tier</Label>
                          <select
                            id="plan_key"
                            value={data.plan_key}
                            onChange={(e) => setData("plan_key", e.target.value)}
                            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          >
                            <option value="starter">Starter Plan (Single School)</option>
                            <option value="professional">Professional (Multi-School Standard)</option>
                            <option value="enterprise">Enterprise (Unlimited Campus)</option>
                            <option value="plus">Premium Plus (Dedicated Support)</option>
                          </select>
                          {errors.plan_key && <p className="text-xs text-destructive">{errors.plan_key}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="billing_cycle" className="text-sm font-semibold">Billing Cycle</Label>
                          <select
                            id="billing_cycle"
                            value={data.billing_cycle}
                            onChange={(e) => setData("billing_cycle", e.target.value)}
                            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          >
                            <option value="monthly">Monthly Billing</option>
                            <option value="annual">Annual Billing (20% Save)</option>
                          </select>
                          {errors.billing_cycle && <p className="text-xs text-destructive">{errors.billing_cycle}</p>}
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <Button type="button" onClick={() => setFormStep(2)}>
                          Next: School Details
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: SCHOOL DETAILS */}
                  {formStep === 2 && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="inst_name" className="text-sm font-semibold">School Name</Label>
                          <Input
                            id="inst_name"
                            placeholder="e.g. Springfield High School"
                            value={data.inst_name}
                            onChange={(e) => setData("inst_name", e.target.value)}
                            required
                          />
                          {errors.inst_name && <p className="text-xs text-destructive">{errors.inst_name}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="inst_type" className="text-sm font-semibold">Institution Type</Label>
                          <select
                            id="inst_type"
                            value={data.inst_type}
                            onChange={(e) => setData("inst_type", e.target.value)}
                            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          >
                            <option value="school">School (K-12)</option>
                            <option value="college">College (Higher Secondary)</option>
                            <option value="university">University</option>
                            <option value="coaching">Coaching / Training Center</option>
                          </select>
                          {errors.inst_type && <p className="text-xs text-destructive">{errors.inst_type}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="slug" className="text-sm font-semibold">Subdomain / Domain Prefix</Label>
                          <div className="flex items-center rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                            <span className="bg-muted px-3 py-2 text-xs font-medium text-muted-foreground border-r">https://</span>
                            <input
                              id="slug"
                              placeholder="springfield"
                              value={data.slug}
                              onChange={(e) => setData("slug", e.target.value)}
                              className="flex-1 h-9 px-3 bg-transparent text-sm focus:outline-none"
                              required
                            />
                          </div>
                          <p className="text-[10px] text-muted-foreground">This prefix acts as the tenant route URL.</p>
                          {errors.slug && <p className="text-xs text-destructive">{errors.slug}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="brand_theme" className="text-sm font-semibold">UI Brand Palette Theme</Label>
                          <select
                            id="brand_theme"
                            value={data.brand_theme}
                            onChange={(e) => setData("brand_theme", e.target.value)}
                            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          >
                            <Each
                              of={BRAND_THEMES}
                              render={(theme) => (
                                <option key={theme.value} value={theme.value}>{theme.label}</option>
                              )}
                            />
                          </select>
                          {errors.brand_theme && <p className="text-xs text-destructive">{errors.brand_theme}</p>}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="udise_code" className="text-sm font-semibold">UDISE Code (Optional)</Label>
                        <Input
                          id="udise_code"
                          placeholder="e.g. 09123456789"
                          value={data.udise_code}
                          onChange={(e) => setData("udise_code", e.target.value)}
                        />
                        {errors.udise_code && <p className="text-xs text-destructive">{errors.udise_code}</p>}
                      </div>

                      <div className="flex justify-between pt-4">
                        <Button type="button" variant="outline" onClick={() => setFormStep(1)}>
                          Back
                        </Button>
                        <Button type="button" onClick={() => setFormStep(3)}>
                          Next: Admin Details
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: ADMINISTRATOR ACCOUNT DETAILS */}
                  {formStep === 3 && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div className="space-y-2">
                        <Label htmlFor="admin_name" className="text-sm font-semibold">Admin Name</Label>
                        <Input
                          id="admin_name"
                          placeholder="e.g. Principal John Miller"
                          value={data.admin_name}
                          onChange={(e) => setData("admin_name", e.target.value)}
                          required
                        />
                        {errors.admin_name && <p className="text-xs text-destructive">{errors.admin_name}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="admin_email" className="text-sm font-semibold">Admin Email Address</Label>
                          <Input
                            id="admin_email"
                            type="email"
                            placeholder="principal@springfield.com"
                            value={data.admin_email}
                            onChange={(e) => setData("admin_email", e.target.value)}
                            required
                          />
                          {errors.admin_email && <p className="text-xs text-destructive">{errors.admin_email}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="admin_mobile" className="text-sm font-semibold">Admin Mobile Number</Label>
                          <Input
                            id="admin_mobile"
                            placeholder="+919876543210"
                            value={data.admin_mobile}
                            onChange={(e) => setData("admin_mobile", e.target.value)}
                          />
                          {errors.admin_mobile && <p className="text-xs text-destructive">{errors.admin_mobile}</p>}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="admin_password" className="text-sm font-semibold">Portal Password</Label>
                        <div className="flex gap-2">
                          <Input
                            id="admin_password"
                            type="text"
                            placeholder="Enter secure password"
                            value={data.admin_password}
                            onChange={(e) => setData("admin_password", e.target.value)}
                            required
                          />
                          <Button type="button" variant="outline" onClick={generateRandomPassword}>
                            Generate
                          </Button>
                        </div>
                        {errors.admin_password && <p className="text-xs text-destructive">{errors.admin_password}</p>}
                      </div>

                      <div className="flex justify-between pt-6 border-t mt-6">
                        <Button type="button" variant="outline" onClick={() => setFormStep(2)}>
                          Back
                        </Button>
                        <Button type="submit" variant="default" disabled={processing} className="px-6 flex items-center gap-2">
                          {processing ? "Provisioning..." : "Onboard School & Launch Portal"}
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              </DialogContent>
            </Dialog>

            <Button asChild size="default" variant="outline">
              <Link href="/admin/audit-logs" className="inline-flex items-center gap-2">
                <History className="size-4" />
                View Audit Logs
              </Link>
            </Button>
          </div>
        </MainPageHeader>

        {/* Stats system overview */}
        <section aria-label="Key metrics">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Each
              of={stats}
              render={(stat, index) => (
                <StatCard {...stat} delay={index * 0.05} />
              )}
            />
          </div>
        </section>

        {/* Tabs for Organizations and Registered Schools */}
        <Tabs defaultValue="schools" className="w-full bg-card rounded-xl border p-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Tenant Directory Management
            </h3>
            <TabsList>
              <TabsTrigger value="schools" className="font-semibold">Registered Schools ({institutions.length})</TabsTrigger>
              <TabsTrigger value="orgs" className="font-semibold">Organizations ({organizations.length})</TabsTrigger>
            </TabsList>
          </div>

          {/* Registered Schools Tab */}
          <TabsContent value="schools">
            {institutions.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <Building className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                No schools or colleges registered yet. Click &quot;Onboard New School&quot; to get started.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/60">
                    <tr>
                      <th className="px-4 py-3 border-b">School/College Name</th>
                      <th className="px-4 py-3 border-b">Domain Route</th>
                      <th className="px-4 py-3 border-b">Type</th>
                      <th className="px-4 py-3 border-b">Parent Group</th>
                      <th className="px-4 py-3 border-b">UDISE Code</th>
                      <th className="px-4 py-3 border-b">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <Each
                      of={institutions}
                      render={(inst) => (
                        <tr key={inst.id} className="hover:bg-muted/20 transition-colors group">
                          <td className="px-4 py-4 font-bold text-foreground">{inst.name}</td>
                           <td className="px-4 py-4">
                            {(() => {
                              if (!inst.domain || inst.domain === 'N/A') return <span className="text-muted-foreground">N/A</span>;
                              
                              const isCustomDomain = inst.domain.includes('.');
                              const currentHost = window.location.host;
                              let url = '';
                              let label = '';

                              if (isCustomDomain) {
                                url = window.location.protocol + '//' + inst.domain;
                                label = inst.domain;
                              } else {
                                let baseDomain = currentHost;
                                if (currentHost.includes('localhost')) {
                                  url = `http://${inst.domain}.localhost:8000`;
                                  label = `${inst.domain}.localhost:8000`;
                                } else {
                                  const parts = currentHost.split('.');
                                  if (parts.length > 2) {
                                    baseDomain = parts.slice(-2).join('.');
                                  }
                                  url = `${window.location.protocol}//${inst.domain}.${baseDomain}`;
                                  label = `${inst.domain}.${baseDomain}`;
                                }
                              }

                              return (
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="font-medium text-primary hover:underline flex items-center gap-1.5"
                                >
                                  <Globe className="h-3.5 w-3.5" />
                                  {label}
                                </a>
                              );
                            })()}
                          </td>
                          <td className="px-4 py-4">
                            <Badge variant="outline" className="capitalize text-[10px] tracking-tight font-semibold">
                              {inst.type}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 text-muted-foreground font-medium">{inst.org_name}</td>
                          <td className="px-4 py-4 font-mono text-xs">{inst.udise_code || "N/A"}</td>
                          <td className="px-4 py-4">
                            <Badge className="bg-success text-success-foreground hover:bg-success/80">
                              {inst.status}
                            </Badge>
                          </td>
                        </tr>
                      )}
                    />
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          {/* Organizations Tab */}
          <TabsContent value="orgs">
            {organizations.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                No organizations registered yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/60">
                    <tr>
                      <th className="px-4 py-3 border-b">Organization Group</th>
                      <th className="px-4 py-3 border-b">Subscription Tier</th>
                      <th className="px-4 py-3 border-b">Institutions Connected</th>
                      <th className="px-4 py-3 border-b">Expiry Date</th>
                      <th className="px-4 py-3 border-b">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <Each
                      of={organizations}
                      render={(org) => (
                        <tr key={org.id} className="hover:bg-muted/20 transition-colors group">
                          <td className="px-4 py-4 font-bold text-foreground">{org.name}</td>
                          <td className="px-4 py-4">
                            <Badge variant="outline" className="capitalize font-bold text-[10px] tracking-tighter">
                              {org.tier}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 font-mono font-bold">{org.institutions_count}</td>
                          <td className="px-4 py-4 text-muted-foreground font-medium">
                            {org.ends_at || "N/A"}
                          </td>
                          <td className="px-4 py-4">
                            <Badge
                              variant={org.status === "Active" ? "default" : "destructive"}
                              className={org.status === "Active" ? "bg-success hover:bg-success/90 text-success-foreground" : ""}
                            >
                              {org.status}
                            </Badge>
                          </td>
                        </tr>
                      )}
                    />
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Charts */}
        <section aria-label="Analytics charts">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <article className="rounded-xl border border-border bg-card overflow-hidden">
              <ChartBarDefault
                chartData={admissionChartData}
                xAxisKey="month"
                yAxisKey="admissions"
                title="System New Admissions"
                subText={dateRange ? `${dateRange.from} – ${dateRange.to}` : "By month"}
              />
            </article>
            <article className="rounded-xl border border-border bg-card overflow-hidden">
              <ChartBarDefault
                chartData={feeChartData}
                xAxisKey="month"
                yAxisKey="feescount"
                title="System Fee Collection"
                subText={dateRange ? `${dateRange.from} – ${dateRange.to}` : "By month"}
              />
            </article>
            <article className="rounded-xl border border-border bg-card overflow-hidden md:col-span-2 lg:col-span-1">
              <ChartLineDefault />
            </article>
          </div>
        </section>
      </div>
    </>
  );
}
