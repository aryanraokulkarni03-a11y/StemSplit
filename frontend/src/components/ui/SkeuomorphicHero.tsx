'use client';

import React, { useState, useEffect } from 'react';
import { Power, Zap } from 'lucide-react';
// Button removed as it was unused

export const SkeuomorphicHero = React.memo(function SkeuomorphicHero() {
    // Physics State
    const [isOn, setIsOn] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [speed, setSpeed] = useState(0); // 0 to 1 (1 = 33rpm)

    // Inertia Loop
    useEffect(() => {
        let animationFrame: number;

        const updatePhysics = () => {
            // Target speed based on isOn state
            const targetSpeed = isOn ? 1 : 0;

            // Accelerate / Decelerate (Physics simulation)
            if (speed < targetSpeed) {
                setSpeed(s => Math.min(s + 0.02, targetSpeed)); // Spin up
            } else if (speed > targetSpeed) {
                setSpeed(s => Math.max(s - 0.01, targetSpeed)); // Spin down friction
            }

            if (speed > 0) {
                setRotation(r => (r + (speed * 2)) % 360); // 2 degrees per frame at full speed
            }

            animationFrame = requestAnimationFrame(updatePhysics);
        };

        animationFrame = requestAnimationFrame(updatePhysics);
        return () => cancelAnimationFrame(animationFrame);
    }, [isOn, speed]);

    const scrollToUpload = () => {
        document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative py-20 overflow-hidden transform-gpu bg-leather">
            <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">

                {/* Left: Copy & CTA */}
                <div className="relative z-10 text-left">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#2A2B24] border border-[#45362C] mb-8 shadow-sm">
                        <div className={`w-2 h-2 rounded-full ${isOn && speed > 0.9 ? 'bg-primary led-glow' : 'bg-[#45362C]'} transition-all duration-300`} />
                        <span className="text-xs tracking-[0.2em] font-bold text-[#A8977A] uppercase">
                            {isOn ? (speed > 0.9 ? "System Ready" : "Spooling Up...") : "Standby"}
                        </span>
                    </div>

                    <h1 className="text-5xl sm:text-7xl font-bold mb-6 tracking-tight leading-none text-[#F2E8DC] glow-text">
                        Split Audio <br />
                        <span className="text-primary italic font-serif">Analog Style.</span>
                    </h1>

                    <p className="text-lg text-[#D4C5A9]/80 mb-10 max-w-xl leading-relaxed font-light">
                        Separate vocals and music with the warmth of analog design and the precision of AI.
                        No sign-up required. Just pure, isolated sound.
                    </p>

                    <div className="flex items-center gap-6">
                        <button
                            onClick={scrollToUpload}
                            className="btn-tactile px-8 py-4 text-[#161711] font-bold text-lg rounded-sm uppercase tracking-wider flex items-center gap-3 active:scale-95"
                        >
                            <Zap className="w-5 h-5 fill-current" />
                            Start Separation
                        </button>

                        <div className="flex gap-4">
                            {/* Decorative Knobs */}
                            <div className="flex flex-col items-center gap-2 group">
                                <div className="w-12 h-12 rounded-full bg-metal-dark knob-shadow border border-[#45362C] relative transform transition-transform group-hover:rotate-45">
                                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-3 bg-white/50 rounded-full" />
                                </div>
                                <span className="text-[10px] uppercase tracking-widest text-[#45362C]">Gain</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 group">
                                <div className="w-12 h-12 rounded-full bg-metal-dark knob-shadow border border-[#45362C] relative transform transition-transform group-hover:-rotate-45">
                                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-3 bg-white/50 rounded-full" />
                                </div>
                                <span className="text-[10px] uppercase tracking-widest text-[#45362C]">Freq</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: The Physical Device */}
                <div className="relative z-0 lg:h-[600px] flex items-center justify-center">
                    {/* The Device Chassis */}
                    <div className="relative w-full max-w-md aspect-square bg-metal-dark rounded-sm border-8 border-[#2A2B24] shadow-2xl p-8 flex flex-col items-center justify-center">

                        {/* Metallic Screw details */}
                        <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-zinc-700 shadow-inner flex items-center justify-center"><div className="w-full h-[1px] bg-black rotate-45" /></div>
                        <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-zinc-700 shadow-inner flex items-center justify-center"><div className="w-full h-[1px] bg-black rotate-45" /></div>
                        <div className="absolute bottom-4 left-4 w-3 h-3 rounded-full bg-zinc-700 shadow-inner flex items-center justify-center"><div className="w-full h-[1px] bg-black rotate-45" /></div>
                        <div className="absolute bottom-4 right-4 w-3 h-3 rounded-full bg-zinc-700 shadow-inner flex items-center justify-center"><div className="w-full h-[1px] bg-black rotate-45" /></div>

                        {/* Vinyl Platter */}
                        <div className="relative w-64 h-64 rounded-full bg-zinc-900 border-4 border-[#111] shadow-2xl flex items-center justify-center"
                            style={{ transform: `rotate(${rotation}deg)` }}
                        >
                            {/* Strobe Dots (Visual) */}
                            <div className="absolute inset-2 rounded-full border border-dashed border-zinc-700/50" />

                            {/* Real Vinyl Texture */}
                            <div className="absolute inset-0 rounded-full vinyl-grooves opacity-90" />

                            {/* Anisotropic Reflection (Static relative to light, but we rotate the disc) 
                                Actually, for vinyl, reflection moves. We'll simulate a 'shine' overlay that stays static
                                but the texture moves. */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" style={{ transform: `rotate(-${rotation}deg)` }} />

                            {/* Label */}
                            <div className="w-24 h-24 rounded-full bg-primary border-4 border-[#161711] flex items-center justify-center shadow-inner z-10 relative">
                                <span className="font-outfit font-bold text-[#161711] text-xs tracking-widest uppercase" style={{ transform: `rotate(${rotation}deg)` }}>StemSplit</span>
                                {/* Spindle */}
                                <div className="absolute w-2 h-2 bg-zinc-300 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-sm" />
                            </div>
                        </div>

                        {/* Tonearm (Physics movement) */}
                        <div className={`absolute top-10 right-10 w-4 h-32 bg-[#45362C] origin-top rounded-full shadow-xl transition-transform duration-[2000ms] border border-[#2A2B24] z-20 ease-out`}
                            style={{ transform: isOn ? 'rotate(25deg)' : 'rotate(0deg)' }}
                        >
                            {/* Head shell */}
                            <div className="absolute bottom-0 w-8 h-12 bg-metal-brushed -left-2 rounded-md shadow-md border border-zinc-600" />
                            {/* Counterweight */}
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-8 bg-zinc-400 rounded-sm shadow-md" />
                        </div>

                        {/* Controls Panel */}
                        <div className="absolute bottom-8 w-full px-12 flex justify-between items-center z-30">
                            <div className="flex flex-col items-center gap-1">
                                <div className={`w-3 h-3 rounded-full ${isOn ? 'bg-red-500 led-glow' : 'bg-red-900'} transition-colors`} />
                                <span className="text-[10px] font-mono text-zinc-500">REC</span>
                            </div>

                            <button
                                onClick={() => setIsOn(!isOn)}
                                className="w-16 h-16 rounded-full bg-metal-brushed border-4 border-[#2A2B24] flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                            >
                                <Power className={`w-6 h-6 ${isOn ? 'text-primary' : 'text-zinc-600'} drop-shadow-md`} />
                            </button>

                            <div className="flex flex-col items-center gap-1">
                                <div className={`w-3 h-3 rounded-full ${isOn ? 'bg-green-500 led-glow' : 'bg-green-900'} transition-colors`} />
                                <span className="text-[10px] font-mono text-zinc-500">PWR</span>
                            </div>
                        </div>
                    </div>

                    {/* Background decorations */}
                    <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 blur-3xl rounded-full" />
                </div>
            </div>
        </section>
    );
});
