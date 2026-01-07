"use client";

import { MapPin } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";

export default function DarkPatternFlow() {
    const [step, setStep] = useState(0);
    const [chaosActive, setChaosActive] = useState(false);
    const [crashed, setCrashed] = useState(false);

    const nextStep = () => {
        setStep((prev) => prev + 1);
    };

    // Sequence:
    // 0: Cookie Consent
    // 1: Mobile App Prompt
    // 2: Fake Login Gate (New)
    // 3: Newsletter Trap
    // 4: Derek Calling (Fake Call)
    // 5: Course Offer (Urgency)
    // 6: Location Request
    // -- User clicks Allow/Block on Location --
    // 7: "Freedom" + Chaos starts immediately
    // -- 2 seconds later --
    // 8: Cloudflare Crash

    const handleLocationDecision = () => {
        // 1. Close Location Popup
        setStep(7);

        // 2. Start Chaos immediately
        setChaosActive(true);

        // 3. Schedule Crash
        setTimeout(() => {
            setCrashed(true);
        }, 2500); // 2.5 seconds of chaos before death
    };

    // If step is < 7, we show the backdrop. 
    // Once step is 7, we remove backdrop so user sees the site (while chaos ensues).
    const isOverlayActive = step < 7;

    if (crashed) {
        return <CloudflareCrash />;
    }

    return (
        <div className="relative min-h-screen font-sans overflow-hidden">
            {/* Main Content (Always visible) */}
            <MainContent />

            {/* Global Backdrop Overlay - Blocks interaction until Step 7 */}
            <div
                className={`fixed inset-0 z-40 transition-all duration-500 ease-in-out ${isOverlayActive ? "bg-black/60 backdrop-blur-sm pointer-events-auto" : "bg-transparent pointer-events-none"
                    }`}
            />

            {/* Chaos Layer (Notifications & Random Popups) - Only visible during Step 7 */}
            {chaosActive && <ChaosOverlay />}

            {/* Popups Layer - Linear Sequence */}
            <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
                {step === 0 && <CookiePopup onNext={nextStep} />}
                {step === 1 && <MobileAppPopup onNext={nextStep} />}
                {step === 2 && <FakeLoginGate onNext={nextStep} />}
                {step === 3 && <NewsletterPopup onNext={nextStep} />}
                {step === 4 && <DerekCallingPopup onNext={nextStep} />}
                {step === 5 && <CourseOfferPopup onNext={nextStep} />}
                {step === 6 && <LocationPopup onNext={handleLocationDecision} />}
            </div>
        </div>
    );
}

function ChaosOverlay() {
    const [toasts, setToasts] = useState<Array<{ id: number, text: string, color: string }>>([]);
    const [showSignUp, setShowSignUp] = useState(false);

    useEffect(() => {
        const messages = [
            "Ramya just signed up",
            "Mark bought the course",
            "Derek says fork you",
            "Newsletter service down",
            "Server CPU at 99%",
            "Someone is typing...",
            "New login from North Korea",
            "Credit card declined",
            "Free trial expired",
            "Downloading malware.exe..."
        ];

        const colors = ["bg-blue-600", "bg-green-600", "bg-red-600", "bg-yellow-500"];

        let count = 0;
        const interval = setInterval(() => {
            const id = count++;
            const text = messages[id % messages.length];
            const color = colors[id % colors.length];

            // Add new toast to the end
            setToasts(prev => [...prev, { id, text, color }]);

            // Trigger sign up popup halfway through
            if (count === 6) {
                setShowSignUp(true);
            }
        }, 200);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {/* Dimming Overlay - Visible but allows clicks through to main site (scrolling works) */}
            <div className="fixed inset-0 z-[55] bg-black/40 pointer-events-none transition-opacity duration-300"></div>

            {/* Notifications Stack - Bottom Left */}
            <div className="fixed bottom-4 left-4 z-[60] flex flex-col gap-2 pointer-events-none max-h-[80vh] overflow-hidden justify-end pb-safe">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`px-4 py-3 rounded shadow-xl text-white font-medium text-sm animate-popup flex items-center gap-2 ${t.color}`}
                    >
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        {t.text}
                    </div>
                ))}
            </div>

            {/* Sign Up Popup - Center Screen (Interactive) */}
            {showSignUp && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center pointer-events-auto">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl border-4 border-blue-600 animate-popup hover:scale-105 transition-transform max-w-sm mx-4">
                        <h2 className="text-4xl font-black mb-4 text-center">SIGN UP NOW!</h2>
                        <p className="mb-4 text-center text-gray-600">Don't miss out on nothing!</p>
                        <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl text-xl">
                            YES, SIGN ME UP
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
function CloudflareCrash() {
    return (
        <>
            {/* Desktop View - Dark "Hmmm... can't reach this page" */}
            <div className="hidden md:flex fixed inset-0 z-[9999] bg-[#202124] text-white flex-col items-center justify-center font-sans p-8">
                <div className="max-w-2xl w-full">
                    <div className="mb-10">
                        {/* Cloud Icon */}
                        {/* <svg viewBox="0 0 48 48" className="w-20 h-20 fill-[#969696]">
                            <path d="M12 40q-3.3 0-5.65-2.35Q4 35.3 4 32q0-2.8 1.8-5.05Q7.6 24.7 10.3 24q.75-5.3 4.85-8.65Q19.25 12 24 12q6.3 0 10.8 4.05Q39.3 20.1 40 26.4q2.95.8 4.975 3.25Q47 32.1 47 35.5q0 3.95-2.775 6.725Q41.45 45 37.5 45h-25.5Zm0-3h25.5q2.7 0 4.6-1.9 1.9-1.9 1.9-4.6 0-2.5-1.75-4.35-1.75-1.85-4.25-2.05l-2.6-.2-1.05-2.4q-1.15-2.75-3.65-4.475Q28.3 15.3 25.45 15.3q-4.15 0-7.25 2.575-3.1 2.575-3.75 6.675l-.55 3.3-3.25.35q-2.55.25-4.275 2.1Q4.65 31.95 4.65 34.5q0 2.3 1.6 3.9 1.6 1.6 3.9 1.6Zm-2.3 0Zm8.1-13.05q.65 0 1.075-.425.425-.425.425-1.075 0-.65-.425-1.075-.425-.425-1.075-.425-.65 0-1.075.425Q16.3 22.8 16.3 23.45q0 .65.425 1.075.425.425 1.075.425Zm8.4-1.9q.65 0 1.075-.425.425-.425.425-1.075 0-.65-.425-1.075-.425-.425-1.075-.425-.65 0-1.075.425Q23.65 20.9 23.65 21.55q0 .65.425 1.075.425.425 1.075.425Zm8.1 3.55q.65 0 1.075-.425.425-.425.425-1.075 0-.65-.425-1.075-.425-.425-1.075-.425-.65 0-1.075.425Q30.65 22.5 30.65 23.15q0 .65.425 1.075.425.425 1.075.425Z" />
                        </svg> */}
                        <Image src="/cloud-lol.webp" alt="Cloud" className="w-30 h-30 fill-[#969696]" height={30} width={30} />
                    </div>

                    <h1 className="text-3xl font-medium mb-4 text-white">Hmmm… can't reach this page</h1>

                    <p className="text-white text-[15px] mb-4">
                        Check if there is a typo in patturns.netlify.app
                    </p>

                    <p className="text-white text-[15px] mb-4">
                        Search the web for <a href="#" className="text-[#8ab4f8] hover:underline">patturns.netlify.app</a>
                    </p>

                    <p className="text-[#646464] text-xs uppercase mb-4 font-medium tracking-wide">
                        DNS_PROBE_FINISHED_NXDOMAIN
                    </p>

                    <button
                        className="genuine-button px-6 py-2 bg-[#8ab4f8] text-[#202124] font-medium text-sm hover:bg-[#7baaf7] transition-colors"
                        onClick={() => window.location.reload()}
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {/* Mobile View - Light "This page isn't working" */}
            <div className="md:hidden fixed inset-0 z-[9999] bg-white text-[#202124] flex flex-col p-6 pt-20 font-sans">
                <div className="mb-6">
                    {/* Clean Sad File Icon */}
                    <svg viewBox="0 0 24 24" className="w-16 h-16 fill-[#5f6368]">
                        {/* File Base */}
                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
                        {/* Dead Eyes */}
                        <circle cx="9" cy="13" r="1.2" />
                        <circle cx="15" cy="13" r="1.2" />
                        {/* Frown */}
                        <path d="M16 17c-0.5-1.5-2.5-2-4-2s-3.5 0.5-4 2" fill="none" stroke="#5f6368" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </div>

                <h1 className="text-xl font-bold mb-3">This page isn’t working</h1>
                <p className="text-[#5f6368] text-sm mb-6 leading-relaxed">
                    <span className="font-bold text-[#202124]">patturns.netlify.app</span> is currently unable to handle this request.
                </p>

                <p className="text-[#5f6368] text-xs uppercase mb-8 font-medium">
                    HTTP ERROR 500
                </p>

                <div>
                    <button
                        className="genuine-button px-6 py-2.5 bg-[#1a73e8] text-white font-medium text-sm hover:bg-[#1557b0] transition-colors shadow-sm"
                        onClick={() => window.location.reload()}
                    >
                        Reload
                    </button>
                </div>
            </div>
        </>
    );
}

// Reuse existing MainContent and Popups, Location Popup uses updated handler

function MainContent() {
    return (
        <div className="min-h-screen bg-white text-gray-900 pointer-events-none select-none">
            <header className="fixed w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-10 top-0">
                <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
                    <div className="font-semibold text-xl tracking-tight">DevMastery</div>
                    <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-500">
                        <span>Features</span>
                        <span>Curriculum</span>
                        <span>Testimonials</span>
                        <span>Pricing</span>
                    </nav>
                    <div className="flex gap-4">
                        <span className="text-sm font-medium text-gray-500 py-2">Log in</span>
                        <span className="text-sm font-medium bg-black text-white px-4 py-2 rounded-full">Sign up</span>
                    </div>
                </div>
            </header>

            <main className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <div className="inline-block px-3 py-1 mb-6 rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
                        v2.0 is live
                    </div>
                    <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-8 text-gray-900">
                        Build software <br /> like a pro.
                    </h1>
                    <p className="text-xl text-gray-500 mb-8 font-light max-w-2xl mx-auto">
                        The complete platform for learning modern web development.
                        From zero to production-ready engineer in 12 weeks.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button className="bg-black text-white px-8 py-4 font-medium hover:bg-gray-800 transition shadow-lg shadow-gray-200/50">
                            Start Learning
                        </button>
                        <button className="bg-white border border-gray-200 text-gray-900 px-8 py-4 font-medium hover:bg-gray-50 transition">
                            View Curriculum
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl mb-6">
                                {i === 1 ? '⚡' : i === 2 ? '🛡️' : '🚀'}
                            </div>
                            <h3 className="font-bold text-lg mb-2">Feature {i}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
                            </p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

// --- POPUP COMPONENTS ---

const PopupWrapper = ({ children, position = "center" }: { children: React.ReactNode, position?: "center" | "bottom" | "top" }) => {
    const positionClasses = {
        center: "items-center justify-center",
        bottom: "items-end justify-center pb-0 md:pb-8",
        top: "items-start justify-center pt-20"
    };

    return (
        <div className={`pointer-events-auto absolute inset-0 flex ${positionClasses[position]} p-4`}>
            {children}
        </div>
    );
};

function CookiePopup({ onNext }: { onNext: () => void }) {
    return (
        <PopupWrapper position="bottom">
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-gray-100 p-6 md:p-8 animate-popup flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Cookie Preferences</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        We use essential cookies to make our site work. With your consent, we may also use non-essential cookies to improve user experience and analyze website traffic.
                    </p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button onClick={onNext} className="flex-1 md:flex-none px-5 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
                        Customize
                    </button>
                    <button onClick={onNext} className="flex-1 md:flex-none px-6 py-2.5 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition shadow-lg shadow-gray-200">
                        Accept All
                    </button>
                </div>
            </div>
        </PopupWrapper>
    );
}

function FakeLoginGate({ onNext }: { onNext: () => void }) {
    return (
        <PopupWrapper>
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 animate-popup relative border border-gray-100">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-black rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">D</div>
                    <h2 className="text-2xl font-bold text-gray-900">Sign in to DevMastery</h2>
                    <p className="text-gray-500 text-sm mt-2">Unlock your full potential today.</p>
                </div>

                <div className="space-y-3 mb-6">
                    <button className="w-full py-2.5 border border-gray-300 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition text-sm font-medium relative group">
                        <span className="text-lg"></span> Continue with Google
                        <div className="absolute inset-0 bg-white/50 hidden group-active:block"></div>
                        {/* Fake click handler that does nothing or shows error, but here we just want it to be a dead end mostly */}
                        <div className="absolute inset-0 z-10" onClick={() => alert("Connection Timeout: Google Auth is not responding.")}></div>
                    </button>

                    <button className="w-full py-2.5 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition text-sm relative">
                        Sign in with Email
                        <div className="absolute inset-0 z-10" onClick={() => alert("Please use Google Auth for better security.")}></div>
                    </button>
                </div>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500 text-xs uppercase">Or</span>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-xs text-gray-400 mb-4">
                        By continuing, you simply agree. There is no alternative.
                    </p>
                    {/* The escape hatch */}
                    <button
                        onClick={onNext}
                        className="text-gray-300 text-[10px] hover:text-gray-500 underline decoration-dotted"
                    >
                        Continue as Guest (Limited View)
                    </button>
                </div>
            </div>
        </PopupWrapper>
    );
}

function MobileAppPopup({ onNext }: { onNext: () => void }) {
    return (
        <PopupWrapper>
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 animate-popup text-center relative overflow-hidden">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">📱</div>
                <h2 className="text-xl font-semibold mb-3">Continue in App?</h2>
                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                    The experience is better in the DevMastery app. View offline courses, get notifications, and more.
                </p>
                <div className="space-y-3">
                    <button onClick={onNext} className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 transition shadow-md shadow-blue-100">
                        Open in App
                    </button>
                    <button onClick={onNext} className="w-full py-3 text-gray-400 font-medium text-sm hover:text-gray-600 transition">
                        Pass (Stay on Web)
                    </button>
                </div>
            </div>
        </PopupWrapper>
    );
}

function NewsletterPopup({ onNext }: { onNext: () => void }) {
    return (
        <PopupWrapper>
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-popup">
                <div className="bg-gray-900 p-8 text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">Wait!</h2>
                    <p className="text-gray-300 text-sm">Don't miss out on our weekly engineering tips.</p>
                </div>
                <div className="p-8">
                    <input
                        type="email"
                        placeholder="you@company.com"
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-black focus:outline-none transition mb-4"
                    />
                    <button onClick={onNext} className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition mb-4 shadow-lg">
                        Subscribe & Continue
                    </button>
                    <button onClick={onNext} className="w-full text-center text-xs text-gray-400 hover:text-gray-600 transition underline">
                        No thanks, I prefer debugging alone
                    </button>
                </div>
            </div>
        </PopupWrapper>
    );
}

function DerekCallingPopup({ onNext }: { onNext: () => void }) {
    return (
        <div className="pointer-events-auto fixed inset-0 z-[100] flex flex-col justify-between py-20 px-8 text-white animate-fade-in">
            <div className="absolute inset-0 z-[-1]">
                {/* Mimic a blurred wallpaper background */}
                <div className="absolute inset-0 bg-gray-800"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/90"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center pt-10">
                <div className="w-24 h-24 rounded-full bg-gray-500 mb-6 overflow-hidden border-2 border-white/10 shadow-2xl flex items-center justify-center text-4xl font-light">
                    D
                </div>
                <h2 className="text-3xl font-medium mb-1">Derek</h2>
                <p className="text-white/60 text-lg">DevMastery Sales</p>
            </div>

            <div className="relative z-10 w-full max-w-sm mx-auto">
                <div className="flex justify-between items-center px-6 mb-16">
                    {/* Standard iOS call buttons roughly */}
                </div>

                <div className="flex justify-between items-center px-4 w-full">
                    <button onClick={onNext} className="flex flex-col items-center gap-4 hover:opacity-90 active:scale-95 transition-all">
                        <div className="w-16 h-16 rounded-full bg-[#ff3b30] flex items-center justify-center shadow-lg">
                            <svg className="w-8 h-8 fill-white" viewBox="0 0 24 24"><path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z" /></svg>
                        </div>
                        <span className="text-sm font-medium">Decline</span>
                    </button>

                    <button onClick={onNext} className="flex flex-col items-center gap-4 hover:opacity-90 active:scale-95 transition-all">
                        <div className="w-16 h-16 rounded-full bg-[#34c759] flex items-center justify-center shadow-lg animate-bounce">
                            <svg className="w-8 h-8 fill-white" viewBox="0 0 24 24"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.44-5.15-3.75-6.59-6.59l1.97-1.57c.26-.29.35-.68.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3.3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.5c0-.54-.45-.99-.99-.99z" /></svg>
                        </div>
                        <span className="text-sm font-medium">Accept</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

function CourseOfferPopup({ onNext }: { onNext: () => void }) {
    const [msLeft, setMsLeft] = useState(15000);

    useEffect(() => {
        const interval = setInterval(() => {
            setMsLeft((prev) => (prev <= 0 ? 0 : prev - 17));
        }, 10);
        return () => clearInterval(interval);
    }, []);

    const seconds = Math.floor(msLeft / 1000);

    return (
        <PopupWrapper>
            <div className="w-full max-w-lg bg-white rounded-lg shadow-2xl p-8 animate-popup border border-gray-100 relative">
                <div className="absolute -top-3 -right-3 bg-red-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase shadow-lg animate-pulse">
                    Expires in 10s
                </div>
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Wait! One Last Thing</h2>
                    <p className="text-gray-500">Get the full 2024 Bundle for 90% OFF.</p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300 mb-6 flex justify-between items-center">
                    <div className="text-left">
                        <div className="text-gray-400 line-through text-sm">$499.00</div>
                        <div className="text-3xl font-bold text-gray-900">$19.99</div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-500 uppercase font-semibold">Offer ends in</div>
                        <div className="font-mono text-2xl font-bold text-red-600 w-20 text-right">00:{seconds.toString().padStart(2, '0')}</div>
                    </div>
                </div>

                <button onClick={onNext} className="w-full py-4 bg-black text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition active:scale-[0.99] shadow-xl">
                    ADD TO ORDER - $19.99
                </button>
                <button onClick={onNext} className="mt-4 text-sm text-gray-400 hover:text-gray-600 underline">
                    No thanks, I don't want to succeed
                </button>
            </div>
        </PopupWrapper>
    );
}

function LocationPopup({ onNext }: { onNext: () => void }) {
    return (
        <>
            <div className="fixed inset-0 z-[-1] pointer-events-auto" onClick={onNext}></div>
            <div className="fixed top-4 left-4 md:left-24 z-[100] animate-popup pointer-events-auto">
                <div className="bg-white rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 p-4 w-80 mt-2">
                    <div className="flex gap-3">
                        <div className="text-lg pt-0.5"><MapPin /></div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 mb-1">
                                devmastery.com wants to know your location
                            </p>
                            <p className="text-xs text-gray-500 mb-3">
                                To show you better local pricing.
                            </p>
                            <div className="flex gap-2 justify-end">
                                <button onClick={onNext} className="px-3 py-1.5 border border-gray-200 rounded text-xs font-semibold hover:bg-gray-50 text-gray-600 transition">
                                    Block
                                </button>
                                <button onClick={onNext} className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition shadow-sm shadow-blue-100">
                                    Allow
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
