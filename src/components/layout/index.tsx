'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Music2, Github, Menu, X, User } from 'lucide-react';

// Check if Clerk is configured
const isClerkConfigured = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Dev mode fallback user icon
function DevModeUserIcon() {
    return (
        <div className="w-8 h-8 rounded-full bg-[#A8977A] flex items-center justify-center" title="Dev Mode - No Auth">
            <User className="w-4 h-4 text-[#161711]" />
        </div>
    );
}

// Dynamically import Clerk-based auth section only when Clerk is configured
const ClerkAuthSection = isClerkConfigured
    ? dynamic(() => import('./ClerkAuthSection').then(mod => mod.ClerkAuthSection), {
        ssr: false,
        loading: () => <DevModeUserIcon />
    })
    : null;

const ClerkMobileAuthSection = isClerkConfigured
    ? dynamic(() => import('./ClerkAuthSection').then(mod => mod.ClerkMobileAuthSection), {
        ssr: false,
        loading: () => <div className="flex justify-center p-4"><DevModeUserIcon /></div>
    })
    : null;

// Auth section that renders dev mode fallback or Clerk components
function AuthSection() {
    if (!isClerkConfigured || !ClerkAuthSection) {
        return <DevModeUserIcon />;
    }
    return <ClerkAuthSection />;
}

function MobileAuthSection() {
    if (!isClerkConfigured || !ClerkMobileAuthSection) {
        return (
            <div className="flex justify-center p-4">
                <DevModeUserIcon />
            </div>
        );
    }
    return <ClerkMobileAuthSection />;
}

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-metal-dark border-b-4 border-black shadow-2xl">
            {/* Screw Heads (Top Corners) */}
            <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-zinc-700 shadow-[inset_0_1px_1px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.1)] flex items-center justify-center z-50"><div className="w-full h-[1px] bg-black/60 rotate-45" /></div>
            <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-zinc-700 shadow-[inset_0_1px_1px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.1)] flex items-center justify-center z-50"><div className="w-full h-[1px] bg-black/60 rotate-45" /></div>

            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="flex items-center justify-between h-20">

                    {/* Logo (Metal Badge) */}
                    <Link href="/" className="flex items-center gap-4 group relative">
                        <div className="absolute inset-0 bg-black/50 rounded-md transform translate-y-1 translate-x-1 blur-[1px]" />
                        <div className="relative w-12 h-12 bg-gradient-to-br from-[#333] to-[#111] border border-[#555] rounded-md shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] flex items-center justify-center transition-transform hover:-translate-y-[1px] active:translate-y-[1px]">
                            <Music2 className="w-6 h-6 text-[#A8977A] drop-shadow-[0_0_5px_rgba(168,151,122,0.5)]" />
                            <div className="absolute top-1 left-1 w-1 h-1 bg-[#222] rounded-full shadow-[inset_0_0_1px_black]" />
                            <div className="absolute bottom-1 right-1 w-1 h-1 bg-[#222] rounded-full shadow-[inset_0_0_1px_black]" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold text-[#F2E8DC] tracking-[0.2em] uppercase font-outfit" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                                StemSplit
                            </span>
                            <span className="text-[10px] text-[#A8977A] tracking-wider uppercase font-mono">Analog Audio Lab</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6 bg-[#111] p-1 rounded-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_1px_0_rgba(255,255,255,0.1)] border-b border-white/5">
                        <NavLink href="#features" label="Specs" />
                        <NavLink href="#how-it-works" label="Manual" />
                        <a
                            href="https://github.com/aryanraokulkarni03-a11y/Singscape"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-[2px] text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-[#A8977A] hover:bg-[#222] transition-all flex items-center gap-2 border border-transparent hover:border-[#333]"
                        >
                            <Github className="w-4 h-4" />
                            Source
                        </a>
                        <div className="w-[1px] h-6 bg-zinc-800 mx-2" />
                        <AuthSection />
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-3 bg-[#222] rounded-sm border border-[#333] shadow-[0_2px_4px_rgba(0,0,0,0.5)] active:translate-y-[2px] transition-all"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? (
                            <X className="w-5 h-5 text-[#A8977A]" />
                        ) : (
                            <Menu className="w-5 h-5 text-[#A8977A]" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation Panel */}
                {isMenuOpen && (
                    <div className="md:hidden border-t-2 border-black bg-metal-dark relative shadow-[inset_0_10px_20px_rgba(0,0,0,0.5)] p-4">
                        <div className="flex flex-col gap-4">
                            <NavLink href="#features" label="System Specs" mobile />
                            <NavLink href="#how-it-works" label="User Manual" mobile />
                            <a
                                href="https://github.com/aryanraokulkarni03-a11y/StemSplit"
                                className="px-4 py-3 bg-[#111] border border-[#333] text-zinc-400 font-mono uppercase text-xs tracking-wider flex items-center gap-2 shadow-inner"
                            >
                                <Github className="w-4 h-4" />
                                Source Code
                            </a>
                            <MobileAuthSection />
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}

function NavLink({ href, label, mobile }: { href: string; label: string; mobile?: boolean }) {
    return (
        <Link
            href={href}
            className={`
                ${mobile ? 'w-full py-3 bg-[#111] border border-[#333] shadow-inner text-center' : 'px-4 py-2 hover:bg-[#222] border border-transparent hover:border-[#333]'}
                rounded-[2px] text-xs font-bold uppercase tracking-wider text-zinc-400 
                hover:text-[#A8977A] hover:shadow-[0_0_10px_rgba(168,151,122,0.1)] 
                transition-all duration-200 active:scale-[0.98]
            `}
        >
            {label}
        </Link>
    );
}

export function Footer() {
    return (
        <footer className="border-t-4 border-black bg-metal-dark py-12 mt-auto relative shadow-[inset_0_10px_30px_rgba(0,0,0,0.8)]">
            <div className="absolute top-4 left-4 w-4 h-4 rounded-full bg-zinc-800 shadow-inner flex items-center justify-center"><div className="w-full h-[1px] bg-black rotate-45" /></div>
            <div className="absolute top-4 right-4 w-4 h-4 rounded-full bg-zinc-800 shadow-inner flex items-center justify-center"><div className="w-full h-[1px] bg-black rotate-45" /></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-[#111] border border-[#333] rounded-sm flex items-center justify-center shadow-inner">
                            <Music2 className="w-4 h-4 text-[#45362C]" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-[#A8977A] uppercase tracking-widest">
                                StemSplit Audio Lab
                            </span>
                            <span className="text-[10px] text-zinc-600 font-mono">
                                EST. 2026 // MODEL NO. SS-01
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-2 bg-black/40 rounded-sm border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-green-900" />
                        <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
                            System Nominal
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
