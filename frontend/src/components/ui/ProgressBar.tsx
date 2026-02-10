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
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="w-full bg-zinc-900/50 rounded-lg p-8">
            {/* Progress Bar */}
            <Progress.Root className="w-full" value={progress}>
                <Progress.Indicator className="h-2 w-full rounded-full bg-zinc-800 relative overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full transition-all duration-500 ease-out" />
                </Progress.Indicator>
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

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'tactile';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    icon?: React.ReactNode;
}

export const ButtonComponent = React.memo(function Button({
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

ButtonComponent.displayName = 'Button';
export const Button = ButtonComponent;