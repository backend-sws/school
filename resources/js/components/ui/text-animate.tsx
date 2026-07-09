"use client";

import React, { useMemo } from "react";
import { motion, type Variants, type Variant } from "framer-motion";
import { cn } from "@/lib/utils";

type AnimationVariant =
    | "fadeIn"
    | "blurIn"
    | "blurInUp"
    | "blurInDown"
    | "slideUp"
    | "slideDown"
    | "slideLeft"
    | "slideRight"
    | "scaleUp"
    | "scaleDown";

type SegmentType = "text" | "word" | "character" | "line";

interface AnimationPreset {
    hidden: Variant;
    visible: Variant;
}

interface TextAnimateProps {
    children: string;
    className?: string;
    segmentClassName?: string;
    delay?: number;
    duration?: number;
    variants?: AnimationPreset;
    as?: "article" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "li" | "p" | "section" | "span";
    by?: SegmentType;
    startOnView?: boolean;
    once?: boolean;
    animation?: AnimationVariant;
}

const STAGGER_TIMES: Record<SegmentType, number> = {
    text: 0.06,
    word: 0.05,
    character: 0.03,
    line: 0.08,
};

const ANIMATION_PRESETS: Record<AnimationVariant, AnimationPreset> = {
    fadeIn: {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    },
    blurIn: {
        hidden: { opacity: 0, filter: "blur(12px)" },
        visible: { opacity: 1, filter: "blur(0px)" },
    },
    blurInUp: {
        hidden: { opacity: 0, filter: "blur(12px)", y: 12 },
        visible: { opacity: 1, filter: "blur(0px)", y: 0 },
    },
    blurInDown: {
        hidden: { opacity: 0, filter: "blur(12px)", y: -12 },
        visible: { opacity: 1, filter: "blur(0px)", y: 0 },
    },
    slideUp: {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    },
    slideDown: {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
    },
    slideLeft: {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
    },
    slideRight: {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
    },
    scaleUp: {
        hidden: { opacity: 0, scale: 0.5 },
        visible: { opacity: 1, scale: 1 },
    },
    scaleDown: {
        hidden: { opacity: 0, scale: 1.5 },
        visible: { opacity: 1, scale: 1 },
    },
};

function splitSegments(text: string, by: SegmentType): string[] {
    if (by === "line") return text.split("\n");
    if (by === "word") return text.split(/(\s+)/);
    if (by === "character") return text.split("");
    return [text];
}

export function TextAnimate({
    children,
    className,
    segmentClassName,
    delay = 0,
    duration = 0.3,
    variants: customVariants,
    as: Tag = "p",
    by = "word",
    startOnView = true,
    once = false,
    animation = "fadeIn",
}: TextAnimateProps) {
    const MotionTag = motion.create(Tag);

    const segments = useMemo(() => splitSegments(children, by), [children, by]);

    const preset = customVariants ?? ANIMATION_PRESETS[animation];

    const containerVariants: Variants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: STAGGER_TIMES[by],
                delayChildren: delay,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: preset.hidden as Variants["hidden"],
        visible: {
            ...(preset.visible as object),
            transition: { duration },
        },
    };

    return (
        <MotionTag
            className={cn("whitespace-pre-wrap", className)}
            initial="hidden"
            {...(startOnView
                ? { whileInView: "visible", viewport: { once, amount: 0.3 } }
                : { animate: "visible" })}
            variants={containerVariants}
        >
            {/* Screen-reader accessible text */}
            <span className="sr-only">{children}</span>

            {segments.map((segment, i) => (
                <motion.span
                    key={`${segment}-${i}`}
                    variants={itemVariants}
                    className={cn(
                        by === "line" ? "block" : "inline-block",
                        segmentClassName,
                    )}
                    aria-hidden
                >
                    {segment === " " ? "\u00A0" : segment}
                </motion.span>
            ))}
        </MotionTag>
    );
}
