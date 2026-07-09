import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import lmsApi from "@/lib/api/lmsApi";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Timer, CheckCircle, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import Each from "@/components/Each";

interface LmsTestTakingViewProps {
    open: boolean;
    onClose: () => void;
    classId: string | number;
    testId: string | number;
}

export function LmsTestTakingView({ open, onClose, classId, testId }: LmsTestTakingViewProps) {
    const queryClient = useQueryClient();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, any>>({});
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    const { data: testSessionRes, isLoading, isError } = useQuery({
        queryKey: ["lms-test-session", classId, testId],
        queryFn: () => lmsApi.tests.startAttempt(classId, testId),
        enabled: !!open && !!testId,
        retry: false,
    });

    const session = testSessionRes?.data;
    const questions = session?.questions ?? [];
    const test = session?.test;
    const attempt = session?.attempt;

    const currentQuestion = questions[currentQuestionIndex];

    useEffect(() => {
        if (test?.duration_minutes) {
            setTimeLeft(test.duration_minutes * 60);
        }
    }, [test]);

    useEffect(() => {
        if (timeLeft !== null && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft((t) => (t !== null ? t - 1 : null)), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0) {
            handleSubmit();
        }
    }, [timeLeft]);

    const submitMutation = useMutation({
        mutationFn: () => lmsApi.tests.submitAttempt(classId, testId, attempt.id, { answers }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lms-class-tests", classId] });
            toast.success("Test submitted successfully!");
            onClose();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to submit test");
        },
    });

    const handleAnswerChange = (questionId: number, answer: any) => {
        setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    };

    const handleSubmit = () => {
        if (Object.keys(answers).length < questions.length) {
            if (!confirm("You haven't answered all questions. Submit anyway?")) return;
        }
        submitMutation.mutate();
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    if (isLoading) return null; // Or a loader

    if (isError) {
        return (
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-md">
                    <div className="text-center py-10">
                        <AlertCircle className="size-12 text-destructive mx-auto mb-4" />
                        <p className="text-lg font-semibold">Cannot start test</p>
                        <p className="text-sm text-muted-foreground mt-2">Maximum attempts reached or test is unavailable.</p>
                        <Button onClick={onClose} className="mt-6">Close</Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <div className={cn(
            "fixed inset-0 z-50 bg-background overflow-y-auto transition-opacity",
            open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold">{test?.title}</h1>
                        <p className="text-sm text-muted-foreground">Class Assessment</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {timeLeft !== null && (
                            <div className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-full font-mono font-bold border",
                                timeLeft < 60 ? "text-destructive border-destructive bg-destructive/5 animate-pulse" : "border-border bg-muted/50"
                            )}>
                                <Timer className="size-4" />
                                {formatTime(timeLeft)}
                            </div>
                        )}
                        <Button variant="destructive" size="sm" onClick={onClose}>Exit</Button>
                    </div>
                </div>

                {/* Progress */}
                <div className="mb-10 space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                        <span>{Math.round(((Object.keys(answers).length) / questions.length) * 100)}% Complete</span>
                    </div>
                    <Progress value={(currentQuestionIndex / (questions.length - 1)) * 100} className="h-1.5" />
                </div>

                {/* Question Area */}
                {currentQuestion && (
                    <div className="bg-card border border-border/60 rounded-3xl p-6 sm:p-10 mb-8 min-h-[400px] flex flex-col shadow-sm">
                        <div className="space-y-6 flex-1">
                            <div className="flex gap-4">
                                <span className="flex-shrink-0 size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                                    {currentQuestionIndex + 1}
                                </span>
                                <p className="text-xl font-medium leading-relaxed pt-0.5">
                                    {currentQuestion.question_text}
                                </p>
                            </div>

                            {/* MCQ Options */}
                            {currentQuestion.type === "mcq" && (
                                <div className="grid gap-3 mt-8">
                                    <Each
                                        of={currentQuestion.options || []}
                                        keyExtractor={(opt) => opt.key}
                                        render={(opt) => (
                                            <Button
                                                key={opt.key}
                                                variant="ghost"
                                                onClick={() => handleAnswerChange(currentQuestion.id, opt.key)}
                                                className={cn(
                                                    "flex items-start justify-start gap-4 p-5 rounded-2xl border-2 text-left transition-all h-auto w-full",
                                                    answers[currentQuestion.id] === opt.key
                                                        ? "border-primary bg-primary/5 ring-1 ring-primary/20 hover:bg-primary/5 hover:border-primary"
                                                        : "border-border/60 hover:border-primary/20 hover:bg-muted/50"
                                                )}
                                            >
                                                <span className={cn(
                                                    "flex-shrink-0 size-6 rounded-full border-2 flex items-center justify-center text-xs font-bold mt-0.5",
                                                    answers[currentQuestion.id] === opt.key ? "border-primary bg-primary text-white" : "border-muted-foreground/30 text-muted-foreground/50"
                                                )}>
                                                    {opt.key}
                                                </span>
                                                <p className="text-base font-medium">{opt.text}</p>
                                            </Button>
                                        )}
                                    />
                                </div>
                            )}

                            {/* True/False */}
                            {currentQuestion.type === "true_false" && (
                                <div className="flex gap-4 mt-8">
                                    {["true", "false"].map((val) => (
                                        <Button
                                            key={val}
                                            variant="ghost"
                                            onClick={() => handleAnswerChange(currentQuestion.id, val)}
                                            className={cn(
                                                "flex-1 py-4 rounded-2xl border-2 font-bold capitalize transition-all h-auto",
                                                answers[currentQuestion.id] === val
                                                    ? "border-primary bg-primary/5 text-primary hover:bg-primary/5 hover:border-primary"
                                                    : "border-border/60 hover:bg-muted/50"
                                            )}
                                        >
                                            {val}
                                        </Button>
                                    ))}
                                </div>
                            )}

                            {/* Short Answer */}
                            {currentQuestion.type === "short_answer" && (
                                <div className="mt-8">
                                    <textarea
                                        className="w-full bg-muted/30 border border-border/60 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/30"
                                        placeholder="Type your answer here..."
                                        rows={4}
                                        value={answers[currentQuestion.id] || ""}
                                        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between mt-12 pt-8 border-t border-border/40">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentQuestionIndex((i) => i - 1)}
                                disabled={currentQuestionIndex === 0}
                                className="rounded-xl px-6"
                            >
                                <ChevronLeft className="size-4 mr-2" /> Previous
                            </Button>

                            {currentQuestionIndex === questions.length - 1 ? (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={submitMutation.isPending}
                                    className="rounded-xl px-8 bg-primary hover:bg-primary/90 font-bold"
                                >
                                    <CheckCircle className="size-4 mr-2" />
                                    {submitMutation.isPending ? "Submitting..." : "Finish Test"}
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => setCurrentQuestionIndex((i) => i + 1)}
                                    className="rounded-xl px-8"
                                >
                                    Next <ChevronRight className="size-4 ml-2" />
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
