import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Head, Link } from "@inertiajs/react";
import { Building } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import OrganizationApi from "@/lib/api/organizationApi";
import { omitBy } from "@/lib/helpers";
import { toast } from "sonner";
import { useState } from "react";

const BREADCRUMBS = [
  { title: "My Organisation", href: "/my-organisation" },
  { title: "Organisations", href: "/my-organisation" },
  { title: "Create Organisation", href: "/my-organisation/create" },
];

const initialForm = {
  name: "",
  code: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  phone: "",
  email: "",
  website: "",
};

export default function MyOrganisationCreate() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(initialForm);

  const createMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => OrganizationApi.store(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success("Organisation created successfully.");
      window.location.href = "/my-organisation";
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message ?? "Failed to create organisation.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Record<string, unknown> = {
      name: formData.name.trim(),
      code: formData.code.trim() || undefined,
      address: formData.address.trim() || undefined,
      city: formData.city.trim() || undefined,
      state: formData.state.trim() || undefined,
      pincode: formData.pincode.trim() || undefined,
      phone: formData.phone.trim() || undefined,
      email: formData.email.trim() || undefined,
      website: formData.website.trim() || undefined,
    };
    const cleaned = omitBy(payload as Record<string, unknown>, (v: unknown) => v === undefined);
    createMutation.mutate(cleaned);
  };

  const setData = (field: keyof typeof initialForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Head title="Create Organisation" />

      <div className="space-y-6">
        <MainPageHeader
          breadcrumbs={BREADCRUMBS}
          icon={Building}
          title="Create Organisation"
          subtitle="Add a new organisation. You can assign institutions to it later."
        />

        <Card className="max-w-2xl">
          <CardHeader>
            <h2 className="text-lg font-semibold">Organisation details</h2>
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
                    placeholder="e.g. Demo Education Trust"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Code</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setData("code", e.target.value)}
                    placeholder="e.g. DEMO-ET"
                  />
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
                <Button type="submit" disabled={createMutation.isPending || !formData.name.trim()}>
                  {createMutation.isPending ? "Creating…" : "Create Organisation"}
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
