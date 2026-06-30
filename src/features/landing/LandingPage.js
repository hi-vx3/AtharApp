import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldAlt,
  faTerminal,
  faFolderOpen,
  faBolt,
  faArrowLeft,
  faRocket,
  faStar,
  faSun,
  faMoon,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import {
  faReact,
  faNodeJs,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useScroll,
  useTransform,
  AnimatePresence,
  useMotionValueEvent,
} from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Toaster, toast } from "sonner"; // استيراد مكتبة الإشعارات
import ModelCard from "../../components/shared/ModelCard";
import { useGitHubContributors } from "../../context/ContributorsContext";

// ── Header Component ────────────────────────────────────────────────────────
const Header = ({ theme, toggleTheme, showNavLinks = true }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  const navLinkClasses =
    "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors";
  const activeNavLinkClasses = "text-blue-500 dark:text-blue-400 font-bold";

  // Effect to lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // Effect to handle scroll state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide header on scroll down, show on scroll up
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    // Hide header if scrolling down and past a threshold
    if (latest > previous && latest > 100) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`
                fixed top-0 z-50 w-full transition-all duration-300
                ${
                  isScrolled
                    ? "backdrop-blur-lg bg-white/80 dark:bg-[#070b13]/80 border-b border-slate-200/50 dark:border-slate-800/50"
                    : "bg-transparent border-b border-transparent"
                }
            `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-black text-slate-900 dark:text-white"
        >
          <span className="text-blue-500">أثر</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
            {showNavLinks && (
              <>
                <a href="#features" className={navLinkClasses}>
                  المميزات
                </a>
                <a href="#testimonials" className={navLinkClasses}>
                  آراء المطورين
                </a>
              </>
            )}
            <NavLink
              to="/resources"
              className={({ isActive }) =>
                isActive
                  ? `${navLinkClasses} ${activeNavLinkClasses}`
                  : navLinkClasses
              }
            >
              المصادر
            </NavLink>
          </nav>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors mr-2"
            aria-label="تبديل الوضع"
          >
            <FontAwesomeIcon icon={theme === "dark" ? faSun : faMoon} />
          </button>

          <Link
            to="/getstarted"
            className="bg-slate-200 dark:bg-slate-800/50 hover:bg-slate-300 dark:hover:bg-slate-700/50 border border-slate-300 dark:border-slate-700/80 text-slate-800 dark:text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm mr-2"
          >
            دخول المنصة
          </Link>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle menu"
            >
              <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden fixed top-0 right-0 w-3/4 max-w-sm h-full bg-white/90 dark:bg-[#070b13]/90 backdrop-blur-xl shadow-2xl"
          >
            <nav className="flex flex-col items-start justify-start h-full gap-8 text-lg font-semibold text-right p-8 pt-24">
              {showNavLinks && (
                <>
                  <a
                    href="#features"
                    className={navLinkClasses}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    المميزات
                  </a>
                  <a
                    href="#testimonials"
                    className={navLinkClasses}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    آراء المطورين
                  </a>
                </>
              )}
              <NavLink
                to="/resources"
                className={({ isActive }) =>
                  isActive
                    ? `${navLinkClasses} ${activeNavLinkClasses}`
                    : navLinkClasses
                }
                onClick={() => setIsMenuOpen(false)}
              >
                المصادر
              </NavLink>
              <Link
                to="/getstarted"
                onClick={() => setIsMenuOpen(false)}
                className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-base px-8 py-3 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-blue-500/20"
              >
                دخول المنصة
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
// ──────────────────────────────────────────────────────────────────────────

// --- AnimatedCodeBlock Component Logic (Merged) ---
const codeSnippet = `const Athar = () => {
  const greeting = "Welcome to Athar";
  const mission = "An integrated dev environment for creators";

  return (
    <div className="athar-hub">
      <h1>{greeting}</h1>
      <p>{mission}</p>
    </div>
  );
};

Athar();
`;

const tokenColors = {
  keyword: "text-purple-400",
  function: "text-blue-400",
  string: "text-amber-400",
  punctuation: "text-slate-500",
  default: "text-slate-300",
};

const getHighlightedCode = (code) => {
  const keywords = ["const", "return"];
  const tokens = code.split(/([,;=(){}[\]"'.\s+])/).filter(Boolean);

  let isString = false;
  const coloredChars = [];

  tokens.forEach((token) => {
    let color = tokenColors.default;

    if (isString) {
      color = tokenColors.string;
      if (token === '"') {
        isString = false;
      }
    } else if (token === '"') {
      color = tokenColors.string;
      isString = true;
    } else if (keywords.includes(token)) {
      color = tokenColors.keyword;
    } else if (/[A-Z]/.test(token[0]) && token.length > 1) {
      // Simple check for Component/Function name
      color = tokenColors.function;
    } else if (/[(){}[\].,;]/.test(token)) {
      color = tokenColors.punctuation;
    }

    token.split("").forEach((char) => coloredChars.push({ char, color }));
  });

  return coloredChars;
};

const AnimatedCodeBlock = () => {
  const sentence = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.5,
        staggerChildren: 0.015,
      },
    },
  };

  const letter = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <motion.div
      className="bg-[#0D1117]/80 border border-slate-800/50 rounded-2xl p-6 shadow-2xl shadow-purple-500/10 backdrop-blur-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="w-3 h-3 bg-red-500 rounded-full"></span>
        <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
      </div>
      <motion.pre
        dir="ltr"
        className="font-mono text-sm whitespace-pre-wrap text-left"
        variants={sentence}
        initial="hidden"
        animate="visible"
      >
        {getHighlightedCode(codeSnippet).map(({ char, color }, index) => (
          <motion.span key={index} variants={letter} className={color}>
            {char}
          </motion.span>
        ))}
      </motion.pre>
    </motion.div>
  );
};
// ──────────────────────────────────────────────────────────────────────────

const LandingPage = () => {
  const navigate = useNavigate();

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  // تأثير الإضاءة الذي يتبع الفأرة
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlightTemplate = useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, rgba(147, 112, 219, 0.15), transparent 80%)`;

  const handleMouseMove = ({ clientX, clientY, currentTarget }) => {
    if (!currentTarget) return;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  // Parallax on Scroll
  const { scrollYProgress } = useScroll();
  const glow1Y = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const glow2Y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  // Animation Variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30, scale: 0.98 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeInOut" },
    },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const features = [
    {
      icon: faTerminal,
      title: "سطر أوامر تفاعلي",
      description: "تشغيل وإيقاف ومراقبة الخوادم الخلفية مباشرة من المتصفح.",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: faFolderOpen,
      title: "مستعرض ملفات متكامل",
      description: "إدارة ملفات ومجلدات المشاريع مع محرر أكواد مدمج.",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: faShieldAlt,
      title: "أمان محلي",
      description:
        "النظام مصمم للعمل على بيئة محلية فقط لضمان أقصى درجات الأمان.",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      icon: faBolt,
      title: "إدارة المنافذ تلقائياً",
      description:
        "لا داعي للقلق بشأن المنافذ المشغولة، النظام يقوم بإدارتها بذكاء.",
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
    },
  ];

  const testimonials = [
    {
      name: "سعد محمد",
      role: "Full-Stack Developer",
      email: "saad@example.com",
      comment:
        "أثرHub غير طريقة إدارتي للمشاريع المحلية. كل شيء أصبح أسرع وأكثر تنظيماً. الـ Terminal المدمج ميزة رائعة!",
    },
    {
      name: "ليلى حسن",
      role: "Frontend Developer",
      email: "layla@example.com",
      comment:
        "كـ مطورة واجهات، أصبحت عملية تشغيل بيئة الباك اند سهلة جداً. لا مزيد من الأوامر المعقدة، كل شيء بضغطة زر.",
    },
  ];

  const handleCopyEmail = (email, name) => {
    navigator.clipboard.writeText(email);
    toast.success(`تم نسخ بريد ${name} الإلكتروني!`);
  };

  const { contributors, isLoading: isLoadingContributors } =
    useGitHubContributors();

  // Intersection Observers
  const { ref: featuresRef, inView: featuresInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { ref: testimonialsRef, inView: testimonialsInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { ref: contributorsRef, inView: contributorsInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div
      dir="rtl"
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-white dark:bg-[#070b13] text-slate-700 dark:text-slate-200 font-sans overflow-x-hidden transition-colors duration-500 relative"
    >
      <Toaster richColors position="bottom-center" />
      {/* Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 dark:opacity-100"
        style={{ background: spotlightTemplate }}
      />
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          style={{ y: glow1Y }}
          className="absolute top-[-20%] left-0 -translate-x-1/4 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-purple-600/10 dark:bg-purple-600/10 blur-[100px] md:blur-[150px] rounded-full"
        ></motion.div>
        <motion.div
          style={{ y: glow2Y }}
          className="absolute bottom-[-20%] right-0 translate-x-1/4 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-blue-600/10 dark:bg-blue-600/10 blur-[100px] md:blur-[150px] rounded-full"
        ></motion.div>
      </div>

      <Header theme={theme} toggleTheme={toggleTheme} />

      <main className="relative z-10">
        {/* Hero Section */}
        <motion.section
          className="min-h-screen flex items-center py-20 px-4 sm:px-6"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-right">
              <motion.h1
                variants={fadeInUp}
                className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-tight [background-size:200%_auto]"
              >
                منصة التطوير المتكاملة
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 animate-gradient-shine">
                  لإدارة مشاريعك المحلية
                </span>
              </motion.h1>
              <motion.p
                variants={fadeInUp}
                className="text-md sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed"
              >
                منصة أثر توفر لك بيئة تطوير داخلية لإدارة، تشغيل، ومراقبة مشاريع
                الخوادم الخلفية بكل سهولة وسلاسة من خلال واجهة ويب احترافية.
              </motion.p>
              <motion.div variants={fadeInUp}>
                <button
                  onClick={() => navigate("/resources")}
                  className="relative inline-flex h-14 overflow-hidden rounded-2xl p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 group"
                >
                  <span className="absolute inset-[-1000%] animate-[aurora_6s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#58A6FF_0%,#A371F7_50%,#58A6FF_100%)]" />
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-[14px] bg-slate-950/90 px-8 py-1 text-base sm:text-lg font-bold text-white backdrop-blur-3xl gap-3">
                    <span>ابدأ الآن</span>
                    <FontAwesomeIcon
                      icon={faArrowLeft}
                      className="transform group-hover:-translate-x-1 transition-transform"
                    />
                  </span>
                </button>
              </motion.div>
            </div>
            {/* Left Column: Animated Code Block */}
            <div className="hidden lg:block">
              <AnimatedCodeBlock />
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <section
          ref={featuresRef}
          id="features"
          className="py-20 px-4 sm:px-6 bg-slate-100/50 dark:bg-slate-900/20 border-y border-slate-200 dark:border-slate-800/50 backdrop-blur-md"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              animate={featuresInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                كل ما تحتاجه في مكان واحد
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mt-3 max-w-xl mx-auto">
                أدوات قوية مصممة لتسريع وتيرة التطوير وتحسين تجربة المطورين في
                البيئة المحلية.
              </p>
            </motion.div>
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="initial"
              animate={featuresInView ? "animate" : "initial"}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className={`
                                        bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/60 
                                        p-8 rounded-3xl text-center transition-transform duration-300 relative overflow-hidden group
                                        ${index === 0 ? "lg:col-span-2" : ""}
                                        ${index === 3 ? "lg:col-span-2" : ""}
                                    `}
                >
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${feature.bgColor} blur-3xl`}
                  ></div>
                  <div
                    className={`relative w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center ${feature.bgColor} border border-slate-300 dark:border-slate-700/50`}
                  >
                    <FontAwesomeIcon
                      icon={feature.icon}
                      className={`text-2xl ${feature.color}`}
                    />
                  </div>
                  <div className="relative">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Models Section */}
        <section
          ref={testimonialsRef}
          id="models"
          className="py-24 px-4 sm:px-6"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              animate={testimonialsInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                جرّب أحدث النماذج
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mt-3">
                استكشف أحدث النماذج والتقنيات التي نستخدمها لبناء وتطوير منصة
                أثر.
              </p>
            </motion.div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="initial"
              animate={testimonialsInView ? "animate" : "initial"}
            >
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
            </motion.div>
          </div>
        </section>

        {/* Top Contributors Section */}
        <section
          ref={contributorsRef}
          className="py-20 px-4 sm:px-6 bg-slate-100/50 dark:bg-slate-900/20 border-y border-slate-200 dark:border-slate-800/50 backdrop-blur-md"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              animate={contributorsInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                أبرز المساهمين
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mt-3">
                النشطاء الذين يبنون مستقبل المنصة بجهودهم البرمجية.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2 relative group rounded-3xl">
                <span className="absolute inset-0 rounded-3xl p-[1px] animate-[aurora_4s_linear_infinite] bg-[linear-gradient(to_right,#A371F7,#58A6FF,#A371F7)] [background-size:200%_100%]" />
                <div className="relative bg-white/50 dark:bg-slate-950/95 p-6 rounded-[23px]">
                  {isLoadingContributors ? (
                    <div className="space-y-4 animate-pulse">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 p-2">
                          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                          <div className="flex-1 h-4 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                          <div className="w-24 h-4 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <motion.div
                      className="space-y-2"
                      variants={staggerContainer}
                      initial="initial"
                      animate={contributorsInView ? "animate" : "initial"}
                    >
                      {contributors.slice(0, 4).map((user) => {
                        const percent = parseFloat(user.percentage);
                        const progressColor =
                          percent > 50
                            ? "bg-yellow-400"
                            : percent > 20
                              ? "bg-blue-400"
                              : "bg-purple-400";
                        return (
                          <motion.a
                            key={user.id}
                            href={user.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            variants={fadeInUp}
                            className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors duration-200"
                          >
                            <img
                              src={user.avatar_url}
                              alt={user.login}
                              className="w-10 h-10 rounded-full border-2 border-slate-300 dark:border-slate-700"
                            />
                            <div className="flex-1">
                              <h3 className="font-bold text-sm text-slate-800 dark:text-white truncate">
                                {user.login}
                              </h3>
                            </div>
                            <div className="w-32 bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${progressColor}`}
                                style={{ width: `${percent}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 w-14 text-left">
                              {percent.toFixed(1)}%
                            </span>
                          </motion.a>
                        );
                      })}
                    </motion.div>
                  )}
                </div>
              </div>
              <motion.div variants={fadeInUp} className="text-right">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  هدفنا المشترك
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  هدفهم الرئيسي هو بناء وتطوير المنصة بأحدث التقنيات، مع التركيز
                  على الأداء العالي وتجربة المستخدم المميزة، وخلق بيئة تعليمية
                  تساهم في تأهيل المطورين لسوق العمل.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-right">
            {/* Branding */}
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                <span className="text-blue-500">أثر</span>
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                منصة تطوير متكاملة للمبدعين.
              </p>
            </div>

            {/* Links */}
            <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-3">
                  المنصة
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="#features"
                      className="text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors"
                    >
                      المميزات
                    </a>
                  </li>
                  <li>
                    <a
                      href="#contributors"
                      className="text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors"
                    >
                      المساهمين
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-3">
                  تواصل معنا
                </h4>
                <a
                  href="https://github.com/hi-vx3/AtharHub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 dark:text-slate-400 hover:text-white transition-colors"
                >
                  <FontAwesomeIcon icon={faGithub} size="2x" />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-slate-200 dark:border-slate-800/50 pt-8 text-center text-xs text-slate-500 dark:text-slate-500">
            <p>&copy; {new Date().getFullYear()} أثر. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
