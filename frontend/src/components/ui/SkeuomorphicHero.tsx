'use client';

import React from 'react';
import { CheckCircle2, Shield, Download, Zap, Sparkles } from 'lucide-react';

interface SkeuomorphicHeroProps {
    title?: string;
    subtitle?: string;
    children?: React.ReactNode;
}

export const SkeuomorphicHero = React.memo(function SkeuomorphicHero({
    title = "Professional Audio Stem Separation",
    subtitle = "AI-powered processing for musicians and producers",
    children
}: SkeuomorphicHeroProps) {
    return (
        <div className="relative bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 py-24 px-6 text-center overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03]">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyBsaWVnLW5ZyI=')] bg-cover bg-center bg-no-repeat" />
            </div>

            <div className="relative max-w-7xl mx-auto text-center">
                <div className="space-y-8">
                    {/* Main Content */}
                    <div>
                        <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight mb-4">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                                {subtitle}
                            </p>
                        )}

                        {children}
                    </div>

                    {/* Icons Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 my-16">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                <Zap className="w-8 h-8 text-primary" />
                            </div>
                            <p className="text-sm font-medium">AI-Powered</p>
                        </div>

                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                            </div>
                            <p className="text-sm font-medium">High Quality</p>
                        </div>

                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="w-16 h-16 rounded-full bg-sky-500/10 flex items-center justify-center">
                                <Shield className="w-8 h-8 text-sky-500" />
                            </div>
                            <p className="text-sm font-medium">Secure & Private</p>
                        </div>

                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center">
                                <Download className="w-8 h-8 text-amber-500" />
                            </div>
                            <p className="text-sm font-medium">Easy Downloads</p>
                        </div>

                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center">
                                <Sparkles className="w-8 h-8 text-purple-500" />
                            </div>
                            <p className="text-sm font-medium">Professional Results</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

SkeuomorphicHero.displayName = 'SkeuomorphicHero';