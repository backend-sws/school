import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Each from "@/components/Each";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { PageContainer } from "@/components/shared/page/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Head, Link } from "@inertiajs/react";
import { Gamepad2, ArrowLeft, Check, X, RotateCcw } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import QuestionBankApi from "@/lib/api/questionBankApi";
import { QuestionBankQueryKeys } from "@/lib/querykey/questionBank";
import {
    QUESTION_BANK_PRACTICE_BREADCRUMBS,
    DIFFICULTY_OPTIONS,
    QUESTION_TYPE_OPTIONS,
    DIFFICULTY_BADGE_VARIANT,
    TYPE_LABELS,
} from "@/constants/page/admin/questionBank";
import { FORM_TYPE } from "@/constants/shared/form";

const PRACTICE_FORM_FIELDS = [
    {
        name: "difficulty",
        label: "Difficulty",
        type: FORM_TYPE.SELECT,
        placeholder: "Any difficulty",
        options: DIFFICULTY_OPTIONS,
    },
    {
        name: "type",
        label: "Question Type",
        type: FORM_TYPE.SELECT,
        placeholder: "Any type",
        options: QUESTION_TYPE_OPTIONS,
    },
    {
        name: "count",
        label: "Number of Questions",
        type: FORM_TYPE.NUMBER,
        placeholder: "10",
    },
];

const PracticeIndex = () => {
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [showResults, setShowResults] = useState(false);

    const { control, handleSubmit } = useForm({
        defaultValues: {
            difficulty: "",
            type: "",
            count: 10,
            category_id: undefined as number | undefined,
        },
    });

    const { data: categoriesData } = useQuery({
        queryKey: QuestionBankQueryKeys.categories(),
        queryFn: () => QuestionBankApi.categories(),
    });

    const categoryOptions = [
        { value: "", label: "All Categories" },
        ...(categoriesData?.data ?? []).map((c: any) => ({
            value: String(c.id),
            label: c.name,
        })),
    ];

    const practiceMutation = useMutation({
        mutationFn: (data: any) => QuestionBankApi.practice(data),
        onSuccess: () => {
            setAnswers({});
            setShowResults(false);
        },
    });

    const questions = (practiceMutation.data?.data ?? []) as any[];

    const handleAnswer = (questionId: number, answer: string) => {
        if (showResults) return;
        setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    };

    const handleCheckAnswers = () => setShowResults(true);

    const handleRetry = () => {
        setAnswers({});
        setShowResults(false);
    };

    const score = questions.reduce((acc, q) => {
        if (answers[q.id] === q.correct_answer) return acc + 1;
        return acc;
    }, 0);

    return (
        <>
            <Head title="Practice Mode" />
            <PageContainer maxWidth="full">
                <div className="space-y-6">
                    <MainPageHeader
                        id="practice-header"
                        breadcrumbs={QUESTION_BANK_PRACTICE_BREADCRUMBS}
                        icon={Gamepad2}
                        title="Practice Mode"
                        subtitle="Practice with randomized questions from your question bank."
                    />

                    <div className="flex items-center gap-2">
                        <Link href="/question-bank">
                            <Button variant="outline" size="sm" className="gap-1.5">
                                <ArrowLeft className="size-4" />
                                Back to Question Bank
                            </Button>
                        </Link>
                    </div>

                    {/* Config panel */}
                    {questions.length === 0 && (
                        <Card className="max-w-xl mx-auto">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Gamepad2 className="size-5 text-blue-500" />
                                    Practice Settings
                                </CardTitle>
                                <CardDescription>
                                    Choose what to practice. Leave fields empty for random selection.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={handleSubmit((data) =>
                                        practiceMutation.mutate(data)
                                    )}
                                    className="space-y-4"
                                >
                                    <ControlledFormComponent
                                        control={control}
                                        name="category_id"
                                        label="Category"
                                        type={FORM_TYPE.SELECT}
                                        placeholder="All Categories"
                                        options={categoryOptions}
                                    />
                                    <Each
                                        of={PRACTICE_FORM_FIELDS}
                                        render={(field: any) => (
                                            <ControlledFormComponent
                                                key={field.name}
                                                control={control}
                                                {...field}
                                            />
                                        )}
                                    />
                                    <Button
                                        type="submit"
                                        className="w-full gap-2"
                                        disabled={practiceMutation.isPending}
                                    >
                                        <Gamepad2 className="size-4" />
                                        {practiceMutation.isPending
                                            ? "Loading questions..."
                                            : "Start Practice"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {/* Questions */}
                    {questions.length > 0 && (
                        <div className="space-y-4">
                            {/* Score banner */}
                            {showResults && (
                                <Card className="p-4 border-2 border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-800">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                                                Score: {score} / {questions.length}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {score === questions.length
                                                    ? "Perfect! 🎉"
                                                    : score > questions.length / 2
                                                      ? "Good job! 👍"
                                                      : "Keep practicing! 💪"}
                                            </p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-1.5"
                                            onClick={handleRetry}
                                        >
                                            <RotateCcw className="size-4" />
                                            Retry
                                        </Button>
                                    </div>
                                </Card>
                            )}

                            <Each
                                of={questions}
                                render={(q: any, index: number) => {
                                    const userAnswer = answers[q.id];
                                    const isCorrect = userAnswer === q.correct_answer;
                                    const hasAnswered = userAnswer !== undefined;

                                    return (
                                        <Card
                                            key={q.id}
                                            className={`transition-colors ${showResults ? (isCorrect ? "border-emerald-300 dark:border-emerald-700" : "border-red-300 dark:border-red-700") : ""}`}
                                        >
                                            <CardContent className="pt-6 space-y-3">
                                                <div className="flex items-start justify-between gap-3">
                                                    <p className="font-medium">
                                                        <span className="text-muted-foreground mr-2">
                                                            Q{index + 1}.
                                                        </span>
                                                        {q.question_text}
                                                    </p>
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <span
                                                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${DIFFICULTY_BADGE_VARIANT[q.difficulty] ?? ""}`}
                                                        >
                                                            {q.difficulty}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {TYPE_LABELS[q.type] ?? q.type}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* MCQ options */}
                                                {q.type === "mcq" && q.options && (
                                                    <div className="grid gap-2">
                                                        <Each
                                                            of={
                                                                typeof q.options === "string"
                                                                    ? JSON.parse(q.options)
                                                                    : q.options
                                                            }
                                                            render={(opt: any, optIdx: number) => {
                                                                const isSelected = userAnswer === opt.text;
                                                                const isCorrectOption = opt.is_correct;

                                                                return (
                                                                    <button
                                                                        key={optIdx}
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleAnswer(q.id, opt.text)
                                                                        }
                                                                        className={`text-left px-4 py-2.5 rounded-lg border text-sm transition-all
                                                                            ${isSelected && !showResults ? "border-blue-400 bg-blue-50 dark:bg-blue-950/30" : ""}
                                                                            ${showResults && isCorrectOption ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30" : ""}
                                                                            ${showResults && isSelected && !isCorrectOption ? "border-red-400 bg-red-50 dark:bg-red-950/30" : ""}
                                                                            ${!showResults && !isSelected ? "hover:border-muted-foreground/30 hover:bg-muted/50" : ""}
                                                                        `}
                                                                    >
                                                                        <span className="flex items-center gap-2">
                                                                            {showResults && isCorrectOption && (
                                                                                <Check className="size-4 text-emerald-500" />
                                                                            )}
                                                                            {showResults && isSelected && !isCorrectOption && (
                                                                                <X className="size-4 text-red-500" />
                                                                            )}
                                                                            {opt.text}
                                                                        </span>
                                                                    </button>
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                )}

                                                {/* True/False */}
                                                {q.type === "true_false" && (
                                                    <div className="flex gap-2">
                                                        {["True", "False"].map(
                                                            (val) => {
                                                                const isSelected = userAnswer === val;
                                                                const isCorrectVal = q.correct_answer === val;
                                                                return (
                                                                    <button
                                                                        key={val}
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleAnswer(q.id, val)
                                                                        }
                                                                        className={`px-6 py-2 rounded-lg border text-sm font-medium transition-all
                                                                            ${isSelected && !showResults ? "border-blue-400 bg-blue-50 dark:bg-blue-950/30" : ""}
                                                                            ${showResults && isCorrectVal ? "border-emerald-400 bg-emerald-50" : ""}
                                                                            ${showResults && isSelected && !isCorrectVal ? "border-red-400 bg-red-50" : ""}
                                                                            ${!showResults && !isSelected ? "hover:bg-muted/50" : ""}
                                                                        `}
                                                                    >
                                                                        {val}
                                                                    </button>
                                                                );
                                                            }
                                                        )}
                                                    </div>
                                                )}

                                                {/* Free text answer */}
                                                {["short_answer", "long_answer", "fill_in_blank"].includes(q.type) && (
                                                    <div>
                                                        <input
                                                            type="text"
                                                            placeholder="Type your answer..."
                                                            className="w-full border rounded-lg px-4 py-2 text-sm bg-background"
                                                            value={userAnswer ?? ""}
                                                            onChange={(e) =>
                                                                handleAnswer(q.id, e.target.value)
                                                            }
                                                            disabled={showResults}
                                                        />
                                                        {showResults && (
                                                            <p className="text-xs text-emerald-600 mt-1">
                                                                <strong>Correct answer:</strong>{" "}
                                                                {q.correct_answer}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Explanation */}
                                                {showResults && q.explanation && (
                                                    <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
                                                        <strong>Explanation:</strong> {q.explanation}
                                                    </p>
                                                )}
                                            </CardContent>
                                        </Card>
                                    );
                                }}
                            />

                            {/* Action bar */}
                            {!showResults && questions.length > 0 && (
                                <div className="flex justify-center pt-4">
                                    <Button
                                        size="lg"
                                        className="gap-2"
                                        onClick={handleCheckAnswers}
                                        disabled={Object.keys(answers).length === 0}
                                    >
                                        <Check className="size-4" />
                                        Check Answers ({Object.keys(answers).length}/{questions.length})
                                    </Button>
                                </div>
                            )}

                            {showResults && (
                                <div className="flex justify-center gap-3 pt-4">
                                    <Button
                                        variant="outline"
                                        className="gap-1.5"
                                        onClick={handleRetry}
                                    >
                                        <RotateCcw className="size-4" />
                                        Retry Same
                                    </Button>
                                    <Button
                                        className="gap-1.5"
                                        onClick={() => {
                                            practiceMutation.reset();
                                            setAnswers({});
                                            setShowResults(false);
                                        }}
                                    >
                                        New Quiz
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </PageContainer>
        </>
    );
};

export default PracticeIndex;
