import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faStar,
    faRocket,
    faCode,
    faComments,
    faQrcode,
    faQuoteRight,
    faStamp,
    faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { faNodeJs, faReact } from "@fortawesome/free-brands-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { useGitHubContributors } from "../../context/ContributorsContext";
import { TourOverlay } from "./components/TourOverlay";
import ModelCard from "../../components/shared/ModelCard";

const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/DTHIWmxV5CQ0V0GtbmlCsw";
const QR_CODE_IMG = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    WHATSAPP_GROUP_LINK
)}`;

const TOUR_STEPS = [
    {
        targetId: "tour-msg-card",
        title: "رسالة المدير التنفيذي",
        body: "اقرأ رسالة الإدارة أولاً — ستفهم روح المجتمع وأهدافه. لا يوجد إلزام، الهدف الأساسي هو التعلم المشترك.",
        label: "الخطوة 1 من 3",
    },
    {
        targetId: "tour-qr-card",
        title: "انضم عبر واتساب",
        body: "امسح الباركود بكاميرتك أو اضغط زر الانضمام للدخول مباشرة إلى مجموعة المطورين.",
        label: "الخطوة 2 من 3",
        isQr: true,
    },
    {
        targetId: "tour-road-card",
        title: "ابدأ رحلتك البرمجية",
        body: "الآن بعد أن انضممت، اضغط على الزر لترى خارطة الطريق الكاملة: إعداد البيئة ← أول مهمة ← أول Pull Request.",
        label: "الخطوة 3 من 3",
        isLast: true,
    },
];

function useCommunityTour() {
    const [showOverlay, setShowOverlay] = useState(true);
    const [touring, setTouring] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [spotlightRect, setSpotlightRect] = useState(null);
    const [joined, setJoined] = useState(false);
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        if (showOverlay || touring) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [showOverlay, touring]);

    const measureElement = useCallback((el) => {
        const rect = el.getBoundingClientRect();
        setSpotlightRect({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
        });
    }, []);

    const updateSpotlight = useCallback((stepIndex) => {
        const step = TOUR_STEPS[stepIndex];
        const el = document.getElementById(step.targetId);
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => measureElement(el), 400);
    }, [measureElement]);

    useEffect(() => {
        if (touring) updateSpotlight(currentStep);
    }, [touring, currentStep, updateSpotlight]);

    useEffect(() => {
        if (!touring) return;
        const handleResize = () => {
            const step = TOUR_STEPS[currentStep];
            const el = document.getElementById(step.targetId);
            if (el) measureElement(el);
        };
        window.addEventListener("resize", handleResize);
        window.addEventListener("orientationchange", () => setTimeout(handleResize, 200));
        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("orientationchange", handleResize);
        };
    }, [touring, currentStep, measureElement]);

    const startTour = useCallback(() => {
        setShowOverlay(false);
        setCurrentStep(0);
        setTouring(true);
    }, []);

    const nextStep = useCallback(() => {
        if (currentStep < TOUR_STEPS.length - 1) {
            setCurrentStep((p) => p + 1);
        } else {
            setTouring(false);
            setFinished(true);
        }
    }, [currentStep]);

    const closeTour = useCallback(() => {
        setShowOverlay(false);
        setTouring(false);
    }, []);

    return {
        showOverlay, touring, currentStep, step: TOUR_STEPS[currentStep],
        steps: TOUR_STEPS, spotlightRect, joined, setJoined, finished,
        startTour, nextStep, closeTour,
    };
}

const STEPS = [
    {
        icon: faComments,
        color: "blue",
        title: "انضم وتواصل",
        text: "ادخل مجموعة الواتساب وتعرّف على المطورين وآخر المهام المتاحة.",
    },
    {
        icon: faCode,
        color: "purple",
        title: "ساهم بالكود",
        text: "اختر مهمة تناسبك، نفّذها، وأرسل مساهمتك (Pull Request) للمراجعة.",
    },
    {
        icon: faStar,
        color: "yellow",
        title: "اصعد في الترتيب",
        text: "كل مساهمة تُحتسب تلقائيًا وتظهر نسبتك في لوحة المساهمين.",
    },
];

const colorMap = {
    blue: "bg-blue-500/10 text-blue-400",
    purple: "bg-purple-500/10 text-purple-400",
    yellow: "bg-yellow-500/10 text-yellow-400",
};

const TechImmersion = () => {
    const { contributors, isLoading: isLoadingContributors } = useGitHubContributors();
    const tour = useCommunityTour();

    return (
        <>
            {/* ── Tour Overlay ── */}
            <TourOverlay
                showOverlay={tour.showOverlay}
                touring={tour.touring}
                step={tour.step}
                steps={tour.steps}
                currentStep={tour.currentStep}
                spotlightRect={tour.spotlightRect}
                joined={tour.joined}
                setJoined={tour.setJoined}
                startTour={tour.startTour}
                nextStep={tour.nextStep}
                closeTour={tour.closeTour}
            />

            <div dir="rtl" className="min-h-screen bg-black text-slate-200 p-5 md:p-12 font-sans">
                <div className="max-w-6xl mx-auto">

                    {/* ── Hero ── */}
                    <header className="mb-10 text-center">
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-3 tracking-tight">
                            مجتمع <span className="text-blue-500">أثر</span>
                        </h1>
                        <p className="text-slate-400 text-lg max-w-xl mx-auto mb-6">
                            بيئة تطوير تفاعلية — ابنِ مهاراتك من خلال المساهمة في مشاريع حقيقية.
                        </p>

                        {/* Success banner after finishing tour */}
                        {tour.finished && (
                            <div className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-sm font-bold">
                                <FontAwesomeIcon icon={faCheck} />
                                أهلاً بك في المجتمع! الآن انطلق في رحلتك البرمجية 🚀
                            </div>
                        )}
                    </header>

                    {/* ── Bento Grid ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">

                        {/* رسالة المدير التنفيذي */}
                        <div
                            id="tour-msg-card"
                            className="lg:col-span-7 relative bg-gradient-to-br from-slate-900 to-slate-900/40 border border-slate-800 rounded-[2rem] p-7 md:p-9 overflow-hidden"
                        >
                            <FontAwesomeIcon
                                icon={faQuoteRight}
                                className="absolute -top-2 left-6 text-slate-800 text-7xl opacity-60"
                            />
                            <div className="relative">
                                <div className="flex items-center gap-2 mb-5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                    <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
                                        رسالة من المدير التنفيذي
                                    </span>
                                </div>
                                <p className="text-slate-200 leading-loose text-[15px] md:text-base mb-5">
                                    أحب أوضح نقطة مهمة بخصوص هذا القسم: أي قرار أو اقتراح أو تعديل تشوفونه هنا في
                                    التصميم أو الفكرة، هو من باب الاحترام الكامل لآرائكم وقراراتكم، ومافيه أي إلزام
                                    من جهتنا.
                                    <br />
                                    <br />
                                    الهدف الأساسي هو{" "}
                                    <span className="text-white font-semibold">تبادل الخبرات</span> بينكم، وفتح مجال
                                    للتجربة والتعلم العملي، بحيث يساهم كل واحد منكم بأفكاره وأسلوبه، ونستفيد
                                    جميعًا من تنوع وجهات النظر — وهذا يصب في صالح تأهيلكم بشكل أفضل لسوق العمل.
                                </p>
                                <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                                    <span className="text-slate-500 text-sm">— المدير التنفيذي</span>
                                    <FontAwesomeIcon icon={faStamp} className="text-slate-700 text-xl" />
                                </div>
                            </div>
                        </div>

                        {/* خارطة طريق المجتمع */}
                        <div
                            id="tour-road-card"
                            className="lg:col-span-5 bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/30 rounded-[2rem] p-7 md:p-9 flex flex-col justify-center text-center relative overflow-hidden group shadow-xl"
                        >
                            <div className="absolute -left-10 -top-10 w-24 h-24 bg-blue-500/10 blur-2xl rounded-full group-hover:scale-125 transition-transform duration-700" />
                            <FontAwesomeIcon icon={faRocket} className="text-blue-400 text-3xl mb-4 mx-auto" />
                            <h3 className="text-xl md:text-2xl font-black text-white mb-2">
                                خارطة طريق المجتمع التقني
                            </h3>
                            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                                دليلك البرمجي المتكامل للتأهيل العملي. تتبع خطوات التأسيس، إعداد بيئة العمل،
                                والمساهمة في المشاريع الفعلية خطوة بخطوة.
                            </p>
                            <Link
                                to="/getstarted"
                                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-l from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full font-black text-sm transition-all shadow-lg shadow-blue-500/20 transform hover:-translate-y-0.5"
                            >
                                ابدأ رحلتك البرمجية الآن
                            </Link>

                            {/* hint shown after tour finishes */}
                            {tour.finished && (
                                <div className="mt-4 px-4 py-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-300 text-xs leading-relaxed text-right">
                                    <span className="font-bold text-blue-400">خارطة الطريق تشمل: </span>
                                    إعداد بيئة العمل ← المهام الأولى ← أول Pull Request ← الصعود في لوحة المساهمين
                                </div>
                            )}
                        </div>

                        {/* خطوات العمل */}
                        {STEPS.map((step, i) => (
                            <div
                                key={i}
                                className="lg:col-span-4 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 hover:border-slate-600 transition-all"
                            >
                                <div
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${colorMap[step.color]}`}
                                >
                                    <FontAwesomeIcon icon={step.icon} className="text-xl" />
                                </div>
                                <h4 className="font-bold text-white text-lg mb-1">{step.title}</h4>
                                <p className="text-slate-400 text-sm leading-relaxed">{step.text}</p>
                            </div>
                        ))}

                        {/* QR Card */}
                        <div
                            id="tour-qr-card"
                            className="lg:col-span-4 bg-white rounded-3xl p-6 flex flex-col items-center justify-center text-center"
                        >
                            <img
                                src={QR_CODE_IMG}
                                alt="QR Code لمجموعة واتساب"
                                className="w-36 h-36 mb-4"
                            />
                            <p className="text-slate-800 text-sm font-bold mb-3 flex items-center gap-2">
                                <FontAwesomeIcon icon={faQrcode} className="text-slate-500" />
                                امسح للانضمام مباشرة
                            </p>
                            <a
                                href={WHATSAPP_GROUP_LINK}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-full font-bold text-sm transition-all"
                            >
                                <FontAwesomeIcon icon={faWhatsapp} />
                                انضم عبر واتساب
                            </a>
                        </div>

                        {/* لوحة المساهمين */}
                        <div className="lg:col-span-8 bg-slate-900/50 border border-slate-800 rounded-3xl p-7">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="font-bold text-2xl text-white flex items-center gap-2">
                                        <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                                        أبرز المساهمين
                                    </h3>
                                    <p className="text-slate-500 text-sm mt-1">
                                        النشطاء الذين يبنون مستقبل المنصة
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {isLoadingContributors ? (
                                    <p className="text-center text-slate-500 py-6">جاري تحميل أبطال الكود...</p>
                                ) : (
                                    contributors.map((user) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center justify-between p-3.5 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-slate-500 transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={user.avatar_url}
                                                    className="w-10 h-10 rounded-full border-2 border-slate-700"
                                                    alt={user.login}
                                                />
                                                <span className="font-bold">{user.login}</span>
                                            </div>
                                            <span className="text-yellow-500 font-bold bg-yellow-500/10 px-4 py-1 rounded-full text-sm">
                                                {user.percentage}%
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Experiment with Models Section */}
                    <section className="mt-16 pt-12 border-t border-slate-900/50">
                        <header className="text-center mb-10">
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
                                Experiment with the latest models
                            </h2>
                            <p className="text-slate-400 text-base max-w-xl mx-auto">
                                استكشف أحدث النماذج والتقنيات التي نستخدمها لبناء وتطوير منصة أثر.
                            </p>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <ModelCard
                                icon={<FontAwesomeIcon icon={faReact} />}
                                title="Gemini 3"
                                description="State-of-the-art reasoning"
                                iconBg="#1a2a4a"
                                iconColor="#8ab4f8"
                            />
                            <ModelCard
                                icon={<FontAwesomeIcon icon={faNodeJs} />}
                                title="Gemini Flash Live"
                                description="Realtime voice and video interactions"
                                iconBg="#1a3a2a"
                                iconColor="#8af8ab"
                            />
                            <ModelCard
                                icon={<FontAwesomeIcon icon={faRocket} />}
                                title="Lyria"
                                description="Professional-grade music generation"
                                iconBg="#2a1a0a"
                                iconColor="#ddaa44"
                            />
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default TechImmersion;