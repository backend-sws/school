import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import lmsApi from "@/lib/api/lmsApi";
import Each from "@/components/Each";
import { Button } from "@/components/ui/button";
import {
    Plus,
    Trash2,
    Zap,
    Trophy,
    Clock,
    CheckCircle2,
    Save,
    ChevronRight,
    Copy,
    FileText,
    List,
    HelpCircle
} from "lucide-react";
import { useForm, type Resolver, useFieldArray, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LmsTestQuestionSchema, type LmsTestQuestionFormValues } from "@/lib/validations/lms";
import { FORM_TYPE } from "@/constants/shared/form";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ImmersiveBuilderLayout, ImmersiveBuilderStat } from "../shared/ImmersiveBuilderLayout";

/**
 * Utility to strip HTML tags from a string
 */
function stripHtml(html: string) {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, '');
}

interface LmsTestQuestionManagerProps {
    open: boolean;
    onClose: () => void;
    classId: string | number;
    testId: string | number;
    testTitle: string;
}

/**
 * Question List Item Component
 */
interface QuestionListItemProps {
    question: any;
    index: number;
    isSelected: boolean;
    onClick: () => void;
    onDuplicate: (q: any) => void;
    onDelete: (id: number) => void;
}

const QuestionListItem = ({ question, index, isSelected, onClick, onDuplicate, onDelete }: QuestionListItemProps) => (
    <div
        className={cn(
            "group relative px-5 py-5 cursor-pointer transition-all duration-300 border-b border-border/50",
            isSelected
                ? "bg-primary/[0.04] border-l-4 border-primary"
                : "border-l-4 border-transparent hover:bg-muted/30"
        )}
        onClick={onClick}
    >
        <div className="flex items-start gap-4">
            <span className={cn(
                "size-7 rounded-xl flex items-center justify-center text-[10px] font-black shrink-0 transition-all duration-300",
                isSelected
                    ? "bg-primary text-primary-foreground rotate-3"
                    : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
            )}>
                {index + 1}
            </span>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] font-black uppercase tracking-tighter text-primary/70 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/10">
                        {question.type}
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-tighter text-muted-foreground opacity-50">
                        {question.points} pts
                    </span>
                </div>
                <p className={cn(
                    "text-[13px] font-bold leading-relaxed line-clamp-2 transition-colors",
                    isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                )}>
                    {stripHtml(question.question_text) || "Untitled Question"}
                </p>
            </div>
            <ChevronRight className={cn(
                "size-4 shrink-0 mt-1.5 transition-all duration-300",
                isSelected ? "translate-x-0 opacity-100 text-primary" : "-translate-x-2 opacity-0"
            )} />
        </div>

        {/* Quick Actions overlay */}
        <div className={cn(
            "absolute right-4 bottom-3 flex items-center gap-2 transition-all duration-300 translate-y-2 opacity-0 pointer-events-none group-hover:translate-y-0 group-hover:opacity-100 group-hover:pointer-events-auto",
            isSelected && "translate-y-0 opacity-100 pointer-events-auto"
        )}>
            <Button
                variant="ghost"
                size="icon"
                className="size-7 rounded-xl hover:bg-primary/10 hover:text-primary bg-background/50 backdrop-blur-sm border border-border/50"
                onClick={(e) => { e.stopPropagation(); onDuplicate(question); }}
            >
                <Copy className="size-3.5" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="size-7 rounded-xl hover:bg-destructive/10 hover:text-destructive bg-background/50 backdrop-blur-sm border border-border/50"
                onClick={(e) => { e.stopPropagation(); onDelete(question.id); }}
            >
                <Trash2 className="size-3.5" />
            </Button>
        </div>
    </div>
);

/**
 * Choice Editor for MCQ
 */
interface ChoiceEditorProps {
    control: Control<LmsTestQuestionFormValues>;
    fields: any[];
    onAdd: () => void;
    onRemove: (index: number) => void;
    options: { key: string; text: string }[];
}

const ChoiceEditor = ({ control, fields, onAdd, onRemove, options }: ChoiceEditorProps) => {
    const choiceOptions = useMemo(() =>
        options.map(opt => ({
            key: opt.key,
            text: opt.text ? `${opt.key}: ${opt.text}` : `Option ${opt.key}`,
            value: opt.key
        })).filter(opt => !!opt.key),
        [options]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-500 bg-card/40 p-6 sm:p-8 rounded-[32px] border border-border/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none rotate-12">
                <List className="size-24" />
            </div>

            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                    <div className="size-10 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground">
                        <List className="size-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest leading-none">Options & Answers</h3>
                        <p className="text-[10px] font-bold text-muted-foreground mt-1.5 uppercase tracking-wider opacity-60">Define possible responses</p>
                    </div>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onAdd}
                    className="rounded-xl border-dashed border-primary/30 text-primary hover:bg-primary/5 hover:border-primary px-4"
                >
                    <Plus className="size-3.5 mr-2" /> Add Option
                </Button>
            </div>

            <div className="grid gap-4 relative z-10">
                {fields.map((field, index) => (
                    <div key={field.id} className="group flex items-center gap-4 animate-in slide-in-from-left-4 duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                        <div className="size-10 rounded-2xl bg-muted/50 flex items-center justify-center text-[10px] font-black shrink-0 border border-border group-focus-within:border-primary/40 group-focus-within:bg-primary/5 group-focus-within:text-primary transition-all duration-300">
                            {String.fromCharCode(65 + index)}
                        </div>
                        <div className="flex-1">
                            <ControlledFormComponent
                                name={`options.${index}.text`}
                                type={FORM_TYPE.TEXT}
                                control={control}
                                placeholder={`Enter option text for ${String.fromCharCode(65 + index)}...`}
                                className="border-none bg-transparent focus-visible:ring-0 px-2 h-10 font-bold text-sm placeholder:font-medium"
                            />
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onRemove(index)}
                            className="size-9 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive shrink-0"
                        >
                            <Trash2 className="size-4" />
                        </Button>
                    </div>
                ))}
            </div>

            <div className="pt-6 mt-2 border-t border-border/50 relative z-10">
                <ControlledFormComponent
                    name="correct_answer"
                    label="Mark Correct Answer"
                    type={FORM_TYPE.SELECT}
                    control={control}
                    options={choiceOptions}
                    placeholder="Select correct option"
                    className="rounded-2xl border-border focus:border-primary bg-background h-12"
                    searchable
                    required
                />
            </div>
        </div>
    );
};

/**
 * Question Editor Workspace
 */
interface QuestionEditorProps {
    selectedQuestion: any;
    isCreating: boolean;
    control: Control<LmsTestQuestionFormValues>;
    handleSubmit: any;
    onSave: (data: LmsTestQuestionFormValues) => void;
    onDelete: (id: number) => void;
    isSaving: boolean;
    isDirty: boolean;
    questionType: string;
    fields: any[];
    appendOption: (val: any) => void;
    removeOption: (index: number) => void;
    options: any[];
}

const QuestionEditor = ({
    selectedQuestion,
    isCreating,
    control,
    onDelete,
    questionType,
    fields,
    appendOption,
    removeOption,
    options
}: QuestionEditorProps) => (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-10 pb-32">
        {/* Workspace Sticky Header */}
        <div className="sticky top-0 z-10 -mx-4 sm:-mx-10 px-4 sm:px-10 py-5 mb-10 bg-background/80 backdrop-blur-xl border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="size-11 rounded-[18px] bg-primary/10 flex items-center justify-center text-primary border border-primary/10">
                    <FileText className="size-5" />
                </div>
                <div>
                    <h2 className="text-base font-black uppercase tracking-widest leading-none">
                        {isCreating ? "New Question" : "Edit Question"}
                    </h2>
                    <p className="text-[10px] font-bold text-muted-foreground mt-1.5 uppercase tracking-wider opacity-60">
                        {isCreating ? "Defining your assessment" : "Reviewing current item"}
                    </p>
                </div>
            </div>
            {!isCreating && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10 rounded-xl px-4 font-bold h-10 border border-transparent hover:border-destructive/20"
                    onClick={() => onDelete(selectedQuestion!.id)}
                >
                    <Trash2 className="size-4 mr-2" /> Delete Item
                </Button>
            )}
        </div>

        <div className="space-y-16 animate-in slide-in-from-bottom-6 duration-700">
            {/* Main Content Group */}
            <div className="space-y-6">
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-4 w-1 bg-primary rounded-full" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Core Content</h3>
                    </div>
                    <ControlledFormComponent
                        name="question_text"
                        label="Define your question"
                        type={FORM_TYPE.EDITOR}
                        control={control}
                        required
                    />
                </div>
            </div>

            {/* Config & Meta Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                <div className="space-y-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-4 w-1 bg-primary rounded-full" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Meta Configuration</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                        <ControlledFormComponent
                            name="type"
                            label="Evaluation Type"
                            type={FORM_TYPE.SELECT}
                            control={control}
                            options={[
                                { key: "mcq", text: "Multiple Choice", value: "mcq" },
                                { key: "true_false", text: "True / False", value: "true_false" },
                                { key: "short_answer", text: "Short Answer", value: "short_answer" },
                                { key: "essay", text: "Essay / Case Study", value: "essay" },
                            ]}
                            className="rounded-2xl border-border focus:border-primary h-12 bg-background font-bold text-sm"
                            required
                        />
                        <ControlledFormComponent
                            name="points"
                            label="Score Pool"
                            type={FORM_TYPE.NUMBER_TEXT}
                            control={control}
                            className="rounded-2xl border-border focus:border-primary h-12 bg-background font-black text-center"
                        />
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-4 w-1 bg-primary rounded-full" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Workspace Order</h3>
                    </div>
                    <ControlledFormComponent
                        name="sort_order"
                        label="Display Priority"
                        type={FORM_TYPE.NUMBER_TEXT}
                        control={control}
                        className="rounded-2xl border-border focus:border-primary h-12 bg-background font-black text-center"
                    />
                </div>
            </div>

            {/* Specialized Editors */}
            <div className="pt-4">
                {questionType === "mcq" && (
                    <ChoiceEditor
                        control={control}
                        fields={fields}
                        onAdd={() => appendOption({ key: String.fromCharCode(65 + fields.length), text: "" })}
                        onRemove={removeOption}
                        options={options}
                    />
                )}

                {questionType === "true_false" && (
                    <div className="bg-card/40 p-10 rounded-[40px] border border-border/50 animate-in fade-in zoom-in-95 duration-500 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none rotate-12">
                            <CheckCircle2 className="size-32" />
                        </div>
                        <div className="flex items-center gap-3 mb-8 relative z-10">
                            <div className="h-4 w-1 bg-primary rounded-full" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Validation Model</h3>
                        </div>
                        <ControlledFormComponent
                            name="correct_answer"
                            label="Designate Truth Value"
                            type={FORM_TYPE.SELECT}
                            control={control}
                            options={[
                                { key: "true", text: "True", value: "true" },
                                { key: "false", text: "False", value: "false" },
                            ]}
                            className="rounded-2xl border-border focus:border-primary bg-background h-12"
                        />
                    </div>
                )}
            </div>
        </div>
    </div>
);

/**
 * Main Assessment Builder Manager
 */
export function LmsTestQuestionManager({ open, onClose, classId, testId, testTitle }: LmsTestQuestionManagerProps) {
    const queryClient = useQueryClient();
    const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
    const [isCreating, setIsCreating] = useState(false);

    // --- Fetching Questions ---
    const { data: questionsRes, isLoading } = useQuery({
        queryKey: ["lms-questions", classId, testId],
        queryFn: () => lmsApi.tests.questions(classId, testId),
        enabled: !!testId && open,
    });

    const questions = (questionsRes as any)?.data ?? [];

    // --- Stats Calculation ---
    const totalPoints = useMemo(() => questions.reduce((sum: number, q: any) => sum + (Number(q.points) || 0), 0), [questions]);

    // --- Form Setup ---
    const { handleSubmit, control, reset, watch, formState: { isDirty } } = useForm<LmsTestQuestionFormValues>({
        resolver: zodResolver(LmsTestQuestionSchema) as any,
        defaultValues: {
            question_text: "",
            type: "mcq",
            options: [{ key: "A", text: "" }, { key: "B", text: "" }],
            correct_answer: "",
            points: 1,
            sort_order: 0,
        },
        mode: "onChange",
    });

    const { fields, append, remove } = useFieldArray({ control, name: "options" });
    const questionType = watch("type");
    const optionsWatch = watch("options") as { key: string; text: string }[];

    // Sync form with selection
    useEffect(() => {
        if (selectedQuestion) {
            reset({
                ...selectedQuestion,
                question_text: selectedQuestion.question_text || "",
                type: selectedQuestion.type || "mcq",
                options: selectedQuestion.options || [],
                correct_answer: selectedQuestion.correct_answer || "",
                points: selectedQuestion.points || 1,
                sort_order: selectedQuestion.sort_order || 0
            });
            setIsCreating(false);
        } else if (isCreating) {
            reset({
                question_text: "",
                type: "mcq",
                options: [{ key: "A", text: "" }, { key: "B", text: "" }],
                correct_answer: "",
                points: 1,
                sort_order: questions.length,
            });
        }
    }, [selectedQuestion, isCreating, reset, questions.length]);

    // --- Mutations ---
    const saveMutation = useMutation({
        mutationFn: (data: LmsTestQuestionFormValues) =>
            selectedQuestion
                ? lmsApi.tests.updateQuestion(classId, testId, selectedQuestion.id, data)
                : lmsApi.tests.storeQuestion(classId, testId, data),
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["lms-questions", classId, testId] });
            toast.success(selectedQuestion ? "Question updated" : "Question created");
            if (!selectedQuestion) {
                setIsCreating(false);
                setSelectedQuestion(res.data);
            }
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Something went wrong");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => lmsApi.tests.destroyQuestion(classId, testId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lms-questions", classId, testId] });
            toast.success("Question removed");
            setSelectedQuestion(null);
            setIsCreating(false);
        },
    });

    const duplicateMutation = useMutation({
        mutationFn: (q: any) => lmsApi.tests.storeQuestion(classId, testId, {
            ...q,
            question_text: `${q.question_text} (Copy)`,
            sort_order: questions.length
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lms-questions", classId, testId] });
            toast.success("Question duplicated");
        }
    });

    // --- Handlers ---
    const handleAdd = () => {
        if (isDirty && !confirm("Discard unsaved changes?")) return;
        setSelectedQuestion(null);
        setIsCreating(true);
    };

    const handleSelect = (q: any) => {
        if (isDirty && !confirm("Discard unsaved changes?")) return;
        setSelectedQuestion(q);
        setIsCreating(false);
    };

    const stats: ImmersiveBuilderStat[] = [
        { label: "Total Score Pool", value: `${totalPoints} Points`, icon: Trophy, iconClassName: "bg-amber-500/10 text-amber-600" },
        { label: "Evaluation Items", value: `${questions.length} Questions`, icon: Clock, iconClassName: "bg-primary/10 text-primary" },
    ];

    const sidebarContent = (
        <div className="flex flex-col h-full overflow-hidden bg-card">
            <div className="p-6 shrink-0 border-b border-border/10">
                <Button
                    onClick={handleAdd}
                    className="w-full rounded-[24px] bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-[10px] h-14"
                >
                    <Plus className="size-4 mr-2" /> New Assessment Item
                </Button>
            </div>

            <div className="px-6 py-4 flex items-center justify-between shrink-0 bg-muted/5">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Question List</h3>
                <Badge variant="outline" className="text-[9px] font-black px-2 py-0.5 rounded-lg border-primary/10 text-primary">
                    {questions.length} Items
                </Badge>
            </div>

            <div className="flex-1 overflow-y-auto px-1 pb-40">
                <Each
                    of={questions}
                    keyExtractor={(q) => q.id}
                    nodatafound={
                        !isLoading && (
                            <div className="text-center py-32 px-10">
                                <HelpCircle className="size-16 mx-auto text-primary/5 mb-6" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/20 leading-loose">
                                    No questions designed for this assessment yet.
                                </p>
                            </div>
                        )
                    }
                    render={(q, index) => (
                        <QuestionListItem
                            question={q}
                            index={index}
                            isSelected={selectedQuestion?.id === q.id}
                            onClick={() => handleSelect(q)}
                            onDuplicate={(question) => duplicateMutation.mutate(question)}
                            onDelete={(id) => confirm("Permanently remove this item?") && deleteMutation.mutate(id)}
                        />
                    )}
                />
                {isLoading && (
                    <div className="p-6 space-y-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-32 rounded-[24px] bg-muted/20 animate-pulse border border-border/50" />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <ImmersiveBuilderLayout
            open={open}
            onClose={onClose}
            title="Assessment Pro"
            subtitle={testTitle}
            icon={Zap}
            stats={stats}
            sidebarContent={sidebarContent}
            actions={
                (selectedQuestion || isCreating) ? (
                    <Button
                        onClick={handleSubmit(data => saveMutation.mutate(data as LmsTestQuestionFormValues))}
                        disabled={saveMutation.isPending || !isDirty}
                        className="rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-[10px] h-10 px-8 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <span className="hidden sm:inline">{saveMutation.isPending ? "Syncing..." : "Sync Changes"}</span>
                        <Save className="size-4 sm:ml-2" />
                    </Button>
                ) : null
            }
        >
            {(selectedQuestion || isCreating) ? (
                <QuestionEditor
                    selectedQuestion={selectedQuestion}
                    isCreating={isCreating}
                    control={control as any}
                    handleSubmit={handleSubmit}
                    onSave={(data) => saveMutation.mutate(data)}
                    onDelete={(id) => confirm("Permanently remove this item?") && deleteMutation.mutate(id)}
                    isSaving={saveMutation.isPending}
                    isDirty={isDirty}
                    questionType={questionType}
                    fields={fields}
                    appendOption={append}
                    removeOption={remove}
                    options={optionsWatch || []}
                />
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 min-h-[50vh] sm:min-h-[70vh] animate-in fade-in zoom-in-95 duration-700">
                    <div className="relative mb-12">
                        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
                        <div className="size-28 rounded-[40px] bg-card flex items-center justify-center text-primary relative border border-border rotate-3 transition-transform hover:rotate-0 duration-500">
                            <CheckCircle2 className="size-14" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-black text-foreground tracking-tight mb-4">Assessment Flow Ready</h3>
                    <p className="text-sm font-bold text-muted-foreground/40 max-w-xs uppercase tracking-[0.2em] leading-loose text-center">
                        Initialize your first item to begin architecting the assessment logic.
                    </p>
                    <Button
                        onClick={handleAdd}
                        className="mt-12 rounded-[24px] bg-primary hover:bg-primary/90 text-primary-foreground h-16 px-12 font-black uppercase tracking-widest text-[11px] transition-all hover:-translate-y-1 active:scale-95"
                    >
                        <Plus className="size-5 mr-3" /> Get Started Now
                    </Button>
                </div>
            )}
        </ImmersiveBuilderLayout>
    );
}
