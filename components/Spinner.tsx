/**
 * Follicia — Loading Spinner (Framer Motion powered)
 * Used during AI-processing states and page transitions.
 */
"use client";

import { motion } from "framer-motion";

interface SpinnerProps {
    size?: number;
    label?: string;
}

export function Spinner({ size = 40, label = "Loading..." }: SpinnerProps) {
    return (
        <div
            role="status"
            aria-label={label}
            className="flex flex-col items-center justify-center gap-4"
        >
            <motion.div
                style={{
                    width: size,
                    height: size,
                    borderRadius: "50%",
                    border: `3px solid #E8C5B0`,
                    borderTopColor: "#B5604B",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
            {label && (
                <motion.p
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="text-sm font-medium"
                    style={{ color: "#8A8A8A" }}
                >
                    {label}
                </motion.p>
            )}
        </div>
    );
}
