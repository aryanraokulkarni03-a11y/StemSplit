'use client';

import React from 'react';
import Link from 'next/link';
import { Music2, Github, Menu, X } from 'lucide-react';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-zinc-800">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo (Brutalist Badge) */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-primary flex items-center justify-center transition-transform hover:-translate-y-1 hover:shadow-[4px_4px_0px_white]">
                            <Music2 className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white tracking-widest uppercase font-outfit">
                            Singscape
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="#features" className="text-sm font-bold text-zinc-400 hover:text-primary uppercase tracking-wide transition-colors">
                            Features
                        </Link>
                        <Link href="#how-it-works" className="text-sm font-bold text-zinc-400 hover:text-primary uppercase tracking-wide transition-colors">
                            How It Works
                        </Link>
                        <a
                            href="https://github.com/aryanraokulkarni03-a11y/Singscape"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-bold text-zinc-400 hover:text-primary uppercase tracking-wide transition-colors flex items-center gap-2"
                        >
                            <Github className="w-4 h-4" />
                            GitHub
                        </a>
                        <Link
                            href="#upload"
                            className="brutalist-button px-6 py-2 text-sm"
                        >
                            Start Splitting
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-white hover:text-primary transition-colors"
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
                    <div className="md:hidden py-4 border-t border-zinc-800 bg-black">
                        <div className="flex flex-col gap-4">
                            <Link href="#features" className="text-sm font-bold text-white hover:text-primary uppercase">
                                Features
                            </Link>
                            <Link href="#how-it-works" className="text-sm font-bold text-white hover:text-primary uppercase">
                                How It Works
                            </Link>
                            <a
                                href="https://github.com/aryanraokulkarni03-a11y/Singscape"
                                className="text-sm font-bold text-white hover:text-primary uppercase flex items-center gap-2"
                            >
                                <Github className="w-4 h-4" />
                                GitHub
                            </a>
                            <Link
                                href="#upload"
                                className="brutalist-button w-full py-3 text-center"
                            >
                                Start Splitting
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
        <footer className="border-t border-zinc-800 py-12 mt-auto bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-zinc-800 flex items-center justify-center">
                            <Music2 className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm font-bold text-zinc-400 uppercase tracking-wider">
                            © 2026 Singscape
                        </span>
                    </div>

                    <div className="flex items-center gap-8">
                        <span className="text-xs font-mono text-zinc-600 uppercase">
                            AI Audio Separation v1.0
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

