import { Head, useForm } from "@inertiajs/react";
import { GRADING_SCALES_BREADCRUMBS } from "@/constants/examination/breadcrumbs";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings2, Plus, Trash } from "lucide-react";
import { FormEventHandler } from "react";

export default function GradingScaleCreate() {
  const { data, setData, post, processing, errors } = useForm<{
    name: string;
    description: string;
    rules: { grade: string; min_percentage: number; max_percentage: number; grade_point: number; description: string; }[];
  }>({
    name: "",
    description: "",
    rules: [
      { grade: "A1", min_percentage: 91, max_percentage: 100, grade_point: 10, description: "Outstanding" },
    ],
  });

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    post('/examination/grading-scales');
  };

  const addRule = () => {
    setData("rules", [
      ...data.rules,
      { grade: "", min_percentage: 0, max_percentage: 0, grade_point: 0, description: "" }
    ]);
  };

  const removeRule = (index: number) => {
    setData("rules", data.rules.filter((_, i) => i !== index));
  };

  const updateRule = (index: number, field: string, value: string | number) => {
    const newRules = [...data.rules];
    (newRules[index] as Record<string, unknown>)[field] = value;
    setData("rules", newRules);
  };

  return (
    <>
      <Head title="Create Grading Scale" />
      <div className="space-y-6">
        <MainPageHeader
          breadcrumbs={[
            ...GRADING_SCALES_BREADCRUMBS,
            { title: "Create", href: "#" }
          ]}
          icon={Settings2}
          title="CREATE GRADING SCALE"
        />
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Scale Details</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Scale Name</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  placeholder="e.g. CBSE 10 Point Scale"
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={data.description}
                  onChange={(e) => setData("description", e.target.value)}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="text-lg font-medium">Grading Rules</h3>
              <Button type="button" variant="outline" size="sm" onClick={addRule}>
                <Plus className="size-4 mr-2" /> Add Rule
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.rules.map((rule, index) => (
                  <div key={index} className="flex gap-4 items-end border p-4 rounded-md bg-muted/20">
                    <div className="space-y-2 flex-1">
                      <Label>Grade</Label>
                      <Input value={rule.grade} onChange={(e) => updateRule(index, 'grade', e.target.value)} placeholder="A, B, C..." />
                      {/* Note: Inertia errors for array fields look like errors['rules.0.grade'] */}
                    </div>
                    <div className="space-y-2 flex-1">
                      <Label>Min %</Label>
                      <Input type="number" value={rule.min_percentage} onChange={(e) => updateRule(index, 'min_percentage', e.target.value)} />
                    </div>
                    <div className="space-y-2 flex-1">
                      <Label>Max %</Label>
                      <Input type="number" value={rule.max_percentage} onChange={(e) => updateRule(index, 'max_percentage', e.target.value)} />
                    </div>
                    <div className="space-y-2 flex-1">
                      <Label>Grade Point</Label>
                      <Input type="number" value={rule.grade_point} onChange={(e) => updateRule(index, 'grade_point', e.target.value)} />
                    </div>
                    <div className="space-y-2 flex-2">
                      <Label>Description</Label>
                      <Input value={rule.description} onChange={(e) => updateRule(index, 'description', e.target.value)} placeholder="e.g. Excellent" />
                    </div>
                    <Button type="button" variant="ghost" className="text-destructive" onClick={() => removeRule(index)} disabled={data.rules.length === 1}>
                      <Trash className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="pt-6 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => window.history.back()}>Cancel</Button>
                <Button type="submit" disabled={processing}>Save Scale</Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </>
  );
}
