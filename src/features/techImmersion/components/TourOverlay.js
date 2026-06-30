import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheck,
    faArrowLeft,
    faXmark,
    faMapSigns,
    faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/DTHIWmxV5CQ0V0GtbmlCsw";
const PAD = 10;

export const TourOverlay = ({
    showOverlay,
    touring,
    step,
    steps,
    currentStep,
    spotlightRect,
    joined,
    setJoined,
    startTour,
    nextStep,
    closeTour,
}) => {
    /* ── Phase 1: Welcome overlay with blurred background ── */
    if (showOverlay && !touring) {
        return (
            <div
                className="fixed inset-0 z-[9999] flex items-center justify-center"
                style={{ animation: "tourFadeIn 0.4s ease-out" }}
            >
                {/* Blurred backdrop */}
                <div
                    className="absolute inset-0"
                    style={{
                        backdropFilter: "blur(28px) saturate(120%)",
                        WebkitBackdropFilter: "blur(28px) saturate(120%)",
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                    }}
                    onClick={closeTour}
                />

                {/* Welcome card */}
                <div
                    dir="rtl"
                    className="relative z-10 w-[92vw] max-w-md text-center"
                    style={{ animation: "tourSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }}
                >
                    {/* Close button */}
                    <button
                        onClick={closeTour}
                        className="absolute -top-3 -left-3 w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all z-20 shadow-lg"
                    >
                        <FontAwesomeIcon icon={faXmark} className="text-sm" />
                    </button>

                    <div
                        className="rounded-3xl overflow-hidden border border-slate-700/60 p-10 md:p-12"
                        style={{
                            background: "linear-gradient(145deg, rgba(15, 23, 42, 0.97), rgba(30, 41, 59, 0.95))",
                            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.5), 0 0 80px rgba(59, 130, 246, 0.08)",
                        }}
                    >
                        {/* Icon */}
                        <div className="w-20 h-20 rounded-[1.5rem] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-6">
                            <FontAwesomeIcon icon={faMapSigns} className="text-blue-400 text-3xl" />
                        </div>

                        <h2 className="text-white font-black text-2xl md:text-3xl mb-3">
                            مرحبًا بك في <span className="text-blue-400">أثر</span>
                        </h2>

                        <p className="text-slate-400 text-sm md:text-[15px] leading-relaxed mb-8 max-w-xs mx-auto">
                            خذ جولة سريعة تعرّفك على المجتمع وكيف تبدأ مشوارك البرمجي معنا.
                        </p>

                        <button
                            onClick={startTour}
                            className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-gradient-to-l from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-base font-black transition-all shadow-lg shadow-blue-500/25 transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <FontAwesomeIcon icon={faPlay} className="text-sm" />
                            ابدأ الجولة التعريفية
                        </button>

                        <button
                            onClick={closeTour}
                            className="block mx-auto mt-4 text-slate-500 hover:text-slate-300 text-sm transition-colors"
                        >
                            تخطي
                        </button>
                    </div>
                </div>

                <style>{`
                    @keyframes tourFadeIn {
                        from { opacity: 0; }
                        to   { opacity: 1; }
                    }
                    @keyframes tourSlideUp {
                        from { opacity: 0; transform: translateY(30px) scale(0.96); }
                        to   { opacity: 1; transform: translateY(0) scale(1); }
                    }
                `}</style>
            </div>
        );
    }

    /* ── Phase 2: Spotlight tour steps ── */
    if (!touring || !spotlightRect) return null;

    const handleJoin = () => {
        setJoined(true);
        window.open(WHATSAPP_GROUP_LINK, "_blank");
    };

    const nextLabel = step.isLast
        ? "فهمت"
        : step.isQr && joined
            ? "انضممت ✓  التالي"
            : "التالي";

    const progress = ((currentStep + 1) / steps.length) * 100;

    return (
        <>
            {/* Dark overlay with spotlight cutout */}
            <div className="fixed inset-0 z-40 pointer-events-none">
                <svg width="100%" height="100%" className="absolute inset-0">
                    <defs>
                        <mask id="tour-mask">
                            <rect width="100%" height="100%" fill="white" />
                            <rect
                                x={spotlightRect.left - PAD}
                                y={spotlightRect.top - PAD}
                                width={spotlightRect.width + PAD * 2}
                                height={spotlightRect.height + PAD * 2}
                                rx="16"
                                fill="black"
                            />
                        </mask>
                    </defs>
                    <rect
                        width="100%"
                        height="100%"
                        fill="rgba(0,0,0,0.75)"
                        mask="url(#tour-mask)"
                    />
                </svg>
            </div>

            {/* Spotlight border ring */}
            <div
                className="fixed z-40 pointer-events-none transition-all duration-500 ease-in-out"
                style={{
                    top: spotlightRect.top - PAD,
                    left: spotlightRect.left - PAD,
                    width: spotlightRect.width + PAD * 2,
                    height: spotlightRect.height + PAD * 2,
                    borderRadius: "1rem",
                    border: "2px solid rgba(255,255,255,0.2)",
                    boxShadow: "0 0 0 1px rgba(59,130,246,0.4)",
                }}
            />

            {/* Click interceptor */}
            <div className="fixed inset-0 z-40" onClick={closeTour} />

            {/* Tooltip card */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90vw] max-w-sm pointer-events-auto">
                <div
                    dir="rtl"
                    className="rounded-2xl overflow-hidden border border-slate-700/60"
                    style={{
                        background: "linear-gradient(145deg, rgba(15, 23, 42, 0.97), rgba(30, 41, 59, 0.95))",
                        boxShadow: "0 25px 60px rgba(0, 0, 0, 0.5), 0 0 80px rgba(59, 130, 246, 0.08)",
                        animation: "tourSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                >
                    {/* Progress bar */}
                    <div className="h-1 bg-slate-800 relative">
                        <div
                            className="h-full bg-gradient-to-l from-blue-500 to-indigo-500 transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <div className="p-5">
                        {/* Step dots */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                {steps.map((_, i) => (
                                    <div
                                        key={i}
                                        className="transition-all duration-300"
                                        style={{
                                            width: i === currentStep ? "24px" : "8px",
                                            height: "8px",
                                            borderRadius: "4px",
                                            background:
                                                i === currentStep
                                                    ? "linear-gradient(90deg, #3b82f6, #6366f1)"
                                                    : i < currentStep
                                                        ? "#3b82f6"
                                                        : "#334155",
                                        }}
                                    />
                                ))}
                            </div>
                            <span className="text-[11px] text-slate-500 font-bold tracking-wide">
                                {step.label}
                            </span>
                        </div>

                        {/* Title */}
                        <h4 className="text-white font-bold text-base mb-1.5">{step.title}</h4>

                        {/* Body */}
                        <p className="text-slate-400 text-sm leading-relaxed mb-4">{step.body}</p>

                        {/* Actions */}
                        <div className="flex flex-col gap-2.5">
                            <div className="flex items-center gap-2 flex-row-reverse">
                                <button
                                    onClick={nextStep}
                                    className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-l from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full text-sm font-bold transition-all shadow-lg shadow-blue-500/20"
                                >
                                    {step.isLast && <FontAwesomeIcon icon={faCheck} className="text-xs" />}
                                    {nextLabel}
                                    {!step.isLast && <FontAwesomeIcon icon={faArrowLeft} className="text-xs opacity-60" />}
                                </button>

                                <button
                                    onClick={closeTour}
                                    className="px-4 py-2.5 text-slate-500 hover:text-slate-300 text-sm transition-colors"
                                >
                                    تخطي
                                </button>
                            </div>

                            {step.isQr && !joined && (
                                <button
                                    onClick={handleJoin}
                                    className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-green-700/80 hover:bg-green-600 text-white rounded-full text-sm font-bold transition-all border border-green-600/30"
                                >
                                    <FontAwesomeIcon icon={faWhatsapp} className="text-base" />
                                    انضم عبر واتساب الآن
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes tourSlideUp {
                    from { opacity: 0; transform: translateY(30px) scale(0.96); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </>
    );
};