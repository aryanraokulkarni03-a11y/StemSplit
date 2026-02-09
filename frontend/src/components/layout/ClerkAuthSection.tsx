'use client';

import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

// Desktop Auth Section with Clerk components
export function ClerkAuthSection() {
    return (
        <>
            <SignedOut>
                <SignInButton mode="modal">
                    <button className="btn-tactile px-6 py-2 text-xs font-bold uppercase tracking-widest text-[#161711] rounded-[2px] hover:brightness-110 active:scale-[0.98]">
                        Power On
                    </button>
                </SignInButton>
            </SignedOut>
            <SignedIn>
                <UserButton afterSignOutUrl="/" />
            </SignedIn>
        </>
    );
}

// Mobile Auth Section with Clerk components
export function ClerkMobileAuthSection() {
    return (
        <>
            <SignedOut>
                <SignInButton mode="modal">
                    <button className="btn-tactile w-full py-4 text-center text-sm font-bold uppercase tracking-widest text-[#161711]">
                        Initialize System
                    </button>
                </SignInButton>
            </SignedOut>
            <SignedIn>
                <div className="flex justify-center p-4">
                    <UserButton afterSignOutUrl="/" />
                </div>
            </SignedIn>
        </>
    );
}
