import React, { useState } from 'react';
import { X, Lock, Key, ChevronRight, User } from 'lucide-react';

interface LoginOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export const LoginOverlay = React.memo(function LoginOverlay({ isOpen, onClose }: LoginOverlayProps) {
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const [isInserting, setIsInserting] = useState(false);

    if (!isOpen) return null;

    const handleSimulatedAuth = (e: React.FormEvent) => {
        e.preventDefault();
        setIsInserting(true);
        // Simulate "reading card"
        setTimeout(() => {
            setIsInserting(false);
            onClose();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            {/* The Device */}
            <div
                className="relative w-full max-w-md bg-metal-dark border-4 border-[#2A2B24] rounded-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
                role="dialog"
                aria-modal="true"
                aria-labelledby="auth-title"
            >
                {/* Screws */}
                <div className="absolute top-4 left-4 w-3 h-3 bg-zinc-700 rounded-full shadow-inner flex items-center justify-center"><div className="w-full h-[1px] bg-black rotate-45" /></div>
                <div className="absolute top-4 right-4 w-3 h-3 bg-zinc-700 rounded-full shadow-inner flex items-center justify-center"><div className="w-full h-[1px] bg-black rotate-45" /></div>
                <div className="absolute bottom-4 left-4 w-3 h-3 bg-zinc-700 rounded-full shadow-inner flex items-center justify-center"><div className="w-full h-[1px] bg-black rotate-45" /></div>
                <div className="absolute bottom-4 right-4 w-3 h-3 bg-zinc-700 rounded-full shadow-inner flex items-center justify-center"><div className="w-full h-[1px] bg-black rotate-45" /></div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-8 p-1 text-zinc-500 hover:text-red-400 transition-colors z-50"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Screen Area */}
                <div className="p-12 relative">
                    {/* Security Badge Header */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-[#111] rounded-full border border-[#333] flex items-center justify-center shadow-inner mb-4 relative">
                            <div className={`absolute top-0 right-0 w-3 h-3 rounded-full ${isInserting ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'} led-glow`} />
                            <Lock className="w-8 h-8 text-[#A8977A]" aria-hidden="true" />
                        </div>
                        <h2 id="auth-title" className="text-xl font-bold text-[#F2E8DC] uppercase tracking-widest">Access Control</h2>
                        <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-1">
                            Restricted Area // Auth Required
                        </p>
                    </div>

                    {/* The "Slot" Form */}
                    <form onSubmit={handleSimulatedAuth} className="space-y-4 relative">
                        {isInserting && (
                            <div className="absolute inset-0 bg-metal-dark/90 flex flex-col items-center justify-center z-20 backdrop-blur-sm rounded-sm border border-[#333]">
                                <div className="text-[#A8977A] font-mono text-xs uppercase animate-pulse mb-2">Reading Credentials...</div>
                                <div className="w-32 h-1 bg-[#111] rounded-full overflow-hidden">
                                    <div className="h-full bg-[#A8977A] w-full animate-[shimmer_1s_infinite]" />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-zinc-500 ml-1">Identity Key (Email)</label>
                            <div className="bg-[#111] border-2 border-[#333] rounded-sm p-3 shadow-inner flex items-center gap-3 focus-within:border-[#A8977A] transition-colors">
                                <User className="w-4 h-4 text-zinc-600" />
                                <input
                                    type="email"
                                    placeholder="USER@SINGSCAPE.LAB"
                                    className="bg-transparent border-none outline-none text-[#F2E8DC] text-sm w-full font-mono placeholder:text-zinc-700"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-zinc-500 ml-1">Access Code (Password)</label>
                            <div className="bg-[#111] border-2 border-[#333] rounded-sm p-3 shadow-inner flex items-center gap-3 focus-within:border-[#A8977A] transition-colors">
                                <Key className="w-4 h-4 text-zinc-600" />
                                <input
                                    type="password"
                                    placeholder="••••••••••••"
                                    className="bg-transparent border-none outline-none text-[#F2E8DC] text-sm w-full font-mono placeholder:text-zinc-700"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full btn-tactile py-4 mt-6 text-[#161711] font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 group"
                        >
                            {mode === 'signin' ? 'Insert Keycard' : 'Issue New Badge'}
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    {/* Toggle Mode (Metallic Switch) */}
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                            className="text-[10px] uppercase font-bold text-zinc-600 hover:text-[#A8977A] transition-colors border-b border-transparent hover:border-[#A8977A] pb-0.5"
                        >
                            {mode === 'signin' ? 'Request New Clearance?' : 'Already have clearance?'}
                        </button>
                    </div>
                </div>

                {/* Bottom Status Bar */}
                <div className="bg-[#111] py-2 px-4 border-t border-[#333] flex justify-between items-center">
                    <span className="text-[10px] text-zinc-700 font-mono">SECURE CONNECTION</span>
                    <div className="flex gap-1">
                        <div className="w-1 h-1 bg-green-900 rounded-full" />
                        <div className="w-1 h-1 bg-green-900 rounded-full" />
                        <div className="w-1 h-1 bg-green-500 rounded-full shadow-[0_0_5px_lime]" />
                    </div>
                </div>
            </div>
        </div>
    );
});
