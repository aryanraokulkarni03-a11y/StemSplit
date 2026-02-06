'use client';

import React from 'react';
import Link from 'next/link';
import { Music2, Github, Menu, X } from 'lucide-react';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                            <Music2 className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
                            StemSplit
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="#features" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                            Features
                        </Link>
                        <Link href="#how-it-works" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                            How It Works
                        </Link>
                        <a
                            href="https://github.com/aryanraokulkarni03-a11y/StemSplit"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-foreground/70 hover:text-foreground transition-colors flex items-center gap-1"
                        >
                            <Github className="w-4 h-4" />
                            GitHub
                        </a>
                        <Link
                            href="#upload"
                            className="px-4 py-2 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 text-white text-sm font-medium hover:opacity-90 transition-opacity"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-white/10">
                        <div className="flex flex-col gap-4">
                            <Link href="#features" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                                Features
                            </Link>
                            <Link href="#how-it-works" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                                How It Works
                            </Link>
                            <a
                                href="https://github.com/aryanraokulkarni03-a11y/StemSplit"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-foreground/70 hover:text-foreground transition-colors flex items-center gap-1"
                            >
                                <Github className="w-4 h-4" />
                                GitHub
                            </a>
                            <Link
                                href="#upload"
                                className="px-4 py-2 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 text-white text-sm font-medium text-center hover:opacity-90 transition-opacity"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}

export function Footer() {
    return (
        <footer className="border-t border-white/10 py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Music2 className="w-5 h-5 text-sky-500" />
                        <span className="text-sm text-foreground/70">
                            © 2026 StemSplit. AI-Powered Audio Separation.
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <a
                            href="https://github.com/aryanraokulkarni03-a11y/StemSplit"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-foreground/50 hover:text-foreground transition-colors"
                        >
                            GitHub
                        </a>
                        <span className="text-sm text-foreground/50">
                            Made for Music Education
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
