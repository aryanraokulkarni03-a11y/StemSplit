'use client';

import React from 'react';
import * as Progress from '@radix-ui/react-progress';
import { Loader2, CheckCircle2, AlertCircle, Music } from 'lucide-react';
import { ProcessingStatus as ProcessingStatusType } from '@/types/audio';

interface ProgressBarProps {
    status: ProcessingStatusType;
    onCancel?: () => void;
}

export const ProgressBar = React.memo(function ProgressBar({ status, onCancel }: ProgressBarProps) {
    const { stage, progress, message, estimatedTimeRemaining } = status;

    const formatTime = (seconds: number): string => {
        const rounded = Math.round(seconds);
        if (rounded < 60) return `${rounded}s`;
        const mins = Math.floor(rounded / 60);
        const secs = rounded % 60;
        return `${mins}m ${secs}s`;
    };

    const getStageIcon = () => {
        switch (stage) {
            case 'complete':
                return <CheckCircle2 className="w-6 h-6 text-emerald-500" />;
            case 'error':
                return <AlertCircle className="w-6 h-6 text-red-500" />;
            default:
                return <Loader2 className="w-6 h-6 text-sky-500 animate-spin" />;
        }
    };

    const getProgressColor = () => {
        switch (stage) {
            case 'complete':
                return 'bg-emerald-500';
            case 'error':
                return 'bg-red-500';
            default:
                return 'bg-gradient-to-r from-sky-500 to-emerald-500';
        }
    };

    if (stage === 'idle') return null;

    return (
        <div className="w-full max-w-2xl mx-auto p-6 rounded-2xl bg-white/5 border border-white/10">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    {getStageIcon()}
                    <div>
                        <p className="font-medium">{message}</p>
                        {estimatedTimeRemaining && stage === 'processing' && (
                            <p className="text-sm text-foreground/60">
                                ~{formatTime(estimatedTimeRemaining)} remaining
                            </p>
                        )}
                    </div>
                </div>
                {stage !== 'complete' && stage !== 'error' && onCancel && (
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                        Cancel
                    </button>
                )}
            </div>

            {/* Progress Bar */}
            <Progress.Root
                className="relative h-3 overflow-hidden rounded-full bg-white/10"
                value={progress}
            >
                <Progress.Indicator
                    className={`h-full transition-all duration-500 ease-out ${getProgressColor()}`}
                    style={{ width: `${progress}%` }}
                />
            </Progress.Root>

            {/* Progress Percentage */}
            <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-foreground/60 tabular-nums" aria-live="polite">
                    {Math.round(progress)}% complete
                </p>
                {stage === 'processing' && (
                    <div className="flex items-center gap-2 text-sm text-foreground/60">
                        <Music className="w-4 h-4" />
                        <span>Processing audio...</span>
                    </div>
                )}
            </div>
        </div>
    );
});

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    icon?: React.ReactNode;
}

export const Button = React.memo(function Button({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-gradient-to-r from-sky-500 to-emerald-500 text-white hover:opacity-90 active:scale-[0.98] rounded-full',
        secondary: 'bg-white/10 text-foreground hover:bg-white/20 active:scale-[0.98] rounded-full',
        ghost: 'text-foreground/70 hover:text-foreground hover:bg-white/10 rounded-full',
        tactile: 'btn-tactile rounded-sm',
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : icon ? (
                icon
            ) : null}
            {children}
        </button>
    );
});
