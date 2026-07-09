import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Head, Link } from "@inertiajs/react";
import { Building2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import InstitutionApi from "@/lib/api/institutionApi";
import { omitBy } from "@/lib/helpers";
import { toast } from "sonner";
import { useState } from "react";
import Each from '@/components/Each';

const INSTITUTION_TYPES = [
  { value: "school", label: "School" },
  { value: "college", label: "College" },
  { value: "coaching", label: "Coaching" },
  { value: "university", label: "University" },
];

interface CreateInstitutionProps {
  organization_id: number;
  organization_name: string;
}

const initialForm = {
  name: "",
  code: "",
  type: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  phone: "",
  email: "",
  website: "",
};

export default function CreateInstitutionPage({
  organization_id,
  organization_name,
}: CreateInstitutionProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(initialForm);

  const createMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => InstitutionApi.store(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({
        queryKey: ["organizations", organization_id, "institutions"],
      });
      toast.success("Institution created successfully.");
      window.location.href = "/my-organisation";
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(
        err?.response?.data?.message ?? "Failed to create institution."
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Record<string, unknown> = {
      name: formData.name.trim(),
      code: formData.code.trim() || undefined,
      type: formData.type || undefined,
      address: formData.address.trim() || undefined,
      city: formData.city.trim() || undefined,
      state: formData.state.trim() || undefined,
      pincode: formData.pincode.trim() || undefined,
      phone: formData.phone.trim() || undefined,
      email: formData.email.trim() || undefined,
      website: formData.website.trim() || undefined,
    };
    payload.organization_id = organization_id;
    const cleaned = omitBy(payload as Record<string, unknown>, (v: unknown) => v === undefined);
    createMutation.mutate(cleaned);
  };

  const setData = (field: keyof typeof initialForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const breadcrumbs = [
    { title: "My Organisation", href: "/my-organisation" },
    { title: "Organisations", href: "/my-organisation" },
    {
      title: "Create Institution",
      href: `/my-organisation/institutions/create?organization_id=${organization_id}`,
    },
  ];

  return (
    <>
      <Head title="Create Institution" />

      <div className="space-y-6">
        <MainPageHeader
          breadcrumbs={breadcrumbs}
          icon={Building2}
          title="Create Institution"
          subtitle={`Add an institution under "${organization_name}".`}
        />

        <p className="text-sm text-muted-foreground rounded-md bg-muted/50 px-3 py-2">
          This institution will be created inside the organisation above.
        </p>

        <Card className="max-w-2xl">
          <CardHeader>
            <h2 className="text-lg font-semibold">Institution details</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setData("name", e.target.value)}
                    placeholder="e.g. Demo Public School"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Code</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setData("code", e.target.value)}
                    placeholder="e.g. DEMOSCH"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={formData.type || undefined}
                    onValueChange={(v) => setData("type", v)}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <Each
                          of={INSTITUTION_TYPES}
                          keyExtractor={(t) => String(t.value)}
                          render={(t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      )}
                      />
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setData("city", e.target.value)}
                    placeholder="City"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setData("state", e.target.value)}
                    placeholder="State"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setData("address", e.target.value)}
                    placeholder="Full address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => setData("pincode", e.target.value)}
                    placeholder="Pincode"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setData("phone", e.target.value)}
                    placeholder="Phone"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setData("email", e.target.value)}
                    placeholder="Email"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setData("website", e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={
                    createMutation.isPending || !formData.name.trim()
                  }
                >
                  {createMutation.isPending
                    ? "Creating…"
                    : "Create Institution"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/my-organisation">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
