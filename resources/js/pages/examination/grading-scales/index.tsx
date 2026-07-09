import { Head, Link } from "@inertiajs/react";
import { EXAM_BASE_BREADCRUMBS } from "@/constants/examination/breadcrumbs";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableCell, TableRow, Table, TableHeader, TableHead, TableBody } from "@/components/ui/table";
import { Settings2, Plus, Pencil } from "lucide-react";

interface GradingScaleIndexProps {
  scales: (Record<string, unknown> & {
    id: number;
    name: string;
    description?: string;
    rules?: unknown[];
  })[];
}

export default function GradingScaleIndex({ scales }: GradingScaleIndexProps) {
  return (
    <>
      <Head title="Grading Scales" />
      <div className="space-y-6">
        <MainPageHeader
          breadcrumbs={[
            ...EXAM_BASE_BREADCRUMBS,
            { title: "Grading Scales", href: "#" }
          ]}
          icon={Settings2}
          title="GRADING SCALES"
          subtitle="Manage grading scales and rules"
        />
        <div className="flex justify-end gap-2">
          <Link href="/examination/grading-scales/create">
            <Button>
              <Plus className="size-4 mr-2" />
              Add Grading Scale
            </Button>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium">All Grading Scales</h3>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Rules Count</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No grading scales found. Create one to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  scales.map((scale) => (
                    <TableRow key={scale.id}>
                      <TableCell className="font-medium">{scale.name}</TableCell>
                      <TableCell>{scale.description ?? "—"}</TableCell>
                      <TableCell>{scale.rules?.length ?? 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/examination/grading-scales/${scale.id}/edit`}>
                            <Button size="icon-sm" variant="ghost"><Pencil className="size-4" /></Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
