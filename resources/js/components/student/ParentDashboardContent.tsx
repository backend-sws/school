import { Link, router } from "@inertiajs/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import GuardianApi, { type GuardianStudent } from "@/lib/api/guardianApi";
import { type BreadcrumbItem } from "@/types";
import {
  LayoutGrid,
  Users,
  ChevronRight,
  Receipt,
  FileText,
  BookOpen,
  TicketCheck,
} from "lucide-react";
import { toast } from "sonner";

const BREADCRUMBS: BreadcrumbItem[] = [
  { title: "My Portal", href: "/student-portal/dashboard" },
  { title: "Parent Dashboard", href: "/student-portal/dashboard" },
];

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const formatDate = () =>
  new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export function ParentDashboardContent() {
  const queryClient = useQueryClient();
  const { data: meData } = useQuery({
    queryKey: ["guardian-me"],
    queryFn: () => GuardianApi.me(),
  });

  const setActiveMutation = useMutation({
    mutationFn: ({ userId, redirectTo }: { userId: number; redirectTo?: string }) =>
      GuardianApi.setActiveStudent(userId).then(() => redirectTo),
    onSuccess: (redirectTo) => {
      queryClient.invalidateQueries({ queryKey: ["guardian-me"] });
      toast.success("Viewing this student.");
      router.visit(redirectTo ?? "/student-portal/dashboard");
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message ?? "Could not switch student.");
    },
  });

  const { data: studentsData, isLoading } = useQuery({
    queryKey: ["guardian-my-students"],
    queryFn: async () => {
      const res = await GuardianApi.myStudents();
      const raw = res as { data?: { students?: GuardianStudent[] }; success?: boolean };
      return raw?.data?.students ?? [];
    },
  });

  const students: GuardianStudent[] = studentsData ?? [];
  const userName = meData?.data?.guardians?.[0]?.name ?? "Parent";

  return (
    <>
      <MainPageHeader
        breadcrumbs={BREADCRUMBS}
        icon={LayoutGrid}
        title={`${getGreeting()}, ${userName.split(" ")[0] ?? "Parent"}`}
        subtitle={`${formatDate()} — Overview of your linked students and quick actions.`}
        guidance="Select a student below to view their dashboard, fees, certificates, or open a support ticket on their behalf."
      />

      {/* Linked students summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-5" />
            Linked students
          </CardTitle>
          <CardDescription>
            {students.length === 0 && !isLoading
              ? "No students linked yet. Use My Students to link your account with the contact details from admission."
              : "Click an action to view that student's portal data."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading…</div>
          ) : students.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              <p className="mb-3">You don't have any linked students yet.</p>
              <Button asChild variant="default">
                <Link href="/student-portal/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          ) : (
            <ul className="divide-y rounded-lg border">
              {students.map((s) => (
                <li
                  key={s.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4"
                >
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {[s.reg_no, s.stream, s.session].filter(Boolean).join(" · ") ||
                        (s.email ?? s.mobile ?? "—")}
                    </p>
                    {s.institution && (
                      <p className="text-xs text-muted-foreground">{s.institution}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => setActiveMutation.mutate({ userId: s.id })}
                      disabled={setActiveMutation.isPending}
                      className="inline-flex items-center"
                    >
                      Dashboard
                      <ChevronRight className="ml-1 size-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setActiveMutation.mutate({ userId: s.id, redirectTo: "/student-portal/fees" })
                      }
                      disabled={setActiveMutation.isPending}
                      className="inline-flex items-center gap-1"
                    >
                      <Receipt className="size-4" />
                      Fees
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setActiveMutation.mutate({
                          userId: s.id,
                          redirectTo: "/student-portal/my-certificates",
                        })
                      }
                      disabled={setActiveMutation.isPending}
                      className="inline-flex items-center gap-1"
                    >
                      <FileText className="size-4" />
                      Certificates
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setActiveMutation.mutate({
                          userId: s.id,
                          redirectTo: "/student-portal/my-classes",
                        })
                      }
                      disabled={setActiveMutation.isPending}
                      className="inline-flex items-center gap-1"
                    >
                      <BookOpen className="size-4" />
                      Classes
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setActiveMutation.mutate({
                          userId: s.id,
                          redirectTo: "/student-portal/tickets",
                        })
                      }
                      disabled={setActiveMutation.isPending}
                      className="inline-flex items-center gap-1"
                    >
                      <TicketCheck className="size-4" />
                      Support
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button asChild variant="secondary">
          <Link href="/student-portal/dashboard" className="inline-flex items-center gap-1">
            <Users className="size-4" />
            Dashboard
          </Link>
        </Button>
      </div>
    </>
  );
}
