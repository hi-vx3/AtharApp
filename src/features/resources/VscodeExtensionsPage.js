import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faPuzzlePiece, 
    faExternalLinkAlt, 
    faCopy, 
    faCheck,
    faSearch, 
    faInfoCircle,
    faChevronLeft,
    faCode,
    faRocket,
    faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';

const vscodeExtensions = [
    { 
        id: "dsznajder.es7-react-js-snippets",
        name: "ES7+ React/Redux Snippets", 
        description: "اختصارات برمجية سريعة لـ React و Redux و React Native لتسريع وتيرة كتابة الكود بشكل ملحوظ.", 
        link: "https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets",
        editors: ['vscode', 'antigravity'],
        category: "productivity",
        categoryAr: "إنتاجية واختصارات"
    },
    { 
        id: "bradlc.vscode-tailwindcss",
        name: "Tailwind CSS IntelliSense", 
        description: "إكمال تلقائي ذكي وتلميحات ممتازة لأسماء كلاسات إطار العمل Tailwind CSS مع عرض الألوان والخصائص مباشرة.", 
        link: "https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss",
        editors: ['vscode', 'antigravity'],
        category: "styling",
        categoryAr: "تنسيق وتصميم"
    },
    { 
        id: "esbenp.prettier-vscode",
        name: "Prettier - Code formatter", 
        description: "تنسيق كودك وترتيبه تلقائياً عند الحفظ لضمان أسلوب كتابة متسق ونظيف بين جميع أفراد الفريق.", 
        link: "https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode",
        editors: ['vscode', 'antigravity'],
        category: "formatting",
        categoryAr: "تنسيق وترتيب"
    },
    { 
        id: "dbaeumer.vscode-eslint",
        name: "ESLint", 
        description: "اكتشاف الأخطاء البرمجية وتطبيق معايير كتابة الكود المحددة تلقائياً لتجنب المشاكل قبل التشغيل.", 
        link: "https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint",
        editors: ['vscode', 'antigravity'],
        category: "linting",
        categoryAr: "جودة الكود"
    },
    { 
        id: "formulahendry.auto-close-tag",
        name: "Auto Close Tag", 
        description: "إغلاق وسوم HTML و JSX تلقائياً بمجرد كتابة وسم البداية، مما يوفر الوقت ويمنع أخطاء نسيان الوسوم.", 
        link: "https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-close-tag",
        editors: ['vscode', 'antigravity'],
        category: "productivity",
        categoryAr: "إنتاجية واختصارات"
    },
    { 
        id: "zhuangtongfa.Material-Theme",
        name: "One Dark Pro", 
        description: "واحد من أشهر وأجمل الثيمات الداكنة لـ VS Code، مريح جداً للعين أثناء جلسات البرمجة الطويلة.", 
        link: "https://marketplace.visualstudio.com/items?itemName=zhuangtongfa.Material-Theme",
        editors: ['vscode', 'antigravity'],
        category: "theme",
        categoryAr: "مظهر وأيقونات"
    },
    { 
        id: "PKief.material-icon-theme",
        name: "Material Icon Theme", 
        description: "مجموعة ضخمة من الأيقونات الحديثة والجميلة للمجلدات والملفات تسهل عليك تحديد نوع الملف بنظرة سريعة.", 
        link: "https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme",
        editors: ['vscode', 'antigravity'],
        category: "theme",
        categoryAr: "مظهر وأيقونات"
    },
];

const VscodeExtensionsPage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [copiedId, setCopiedId] = useState(null);
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'dark';
    });

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
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const handleCopyId = (id) => {
        navigator.clipboard.writeText(id);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Filter categories
    const categories = [
        { id: 'all', name: 'الكل' },
        { id: 'productivity', name: 'إنتاجية واختصارات' },
        { id: 'styling', name: 'تنسيق وتصميم' },
        { id: 'formatting', name: 'تنسيق وترتيب' },
        { id: 'linting', name: 'جودة الكود' },
        { id: 'theme', name: 'مظهر وأيقونات' },
    ];

    // Filtered extensions list
    const filteredExtensions = vscodeExtensions.filter(ext => {
        const matchesCategory = activeCategory === 'all' || ext.category === activeCategory;
        const matchesSearch = ext.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              ext.description.includes(searchTerm) || 
                              ext.id.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div dir="rtl" onMouseMove={handleMouseMove} className="h-screen bg-white dark:bg-[#070b13] text-slate-700 dark:text-slate-200 font-sans p-6 md:p-12 relative overflow-hidden transition-colors duration-500">
            {/* Spotlight Effect */}
            <motion.div className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 dark:opacity-100" style={{ background: spotlightTemplate }} />

            {/* Background Glows */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 dark:bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 dark:bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Navigation Back */}
                <button
                    onClick={() => navigate('/resources')}
                    className="mb-8 flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors group"
                >
                    <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-1 transition-transform" />
                    <span>العودة لمركز موارد المطورين</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:h-[calc(100vh-150px)] lg:overflow-hidden">
                    {/* Right Sticky Column */}
                    <aside className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 h-fit">
                        <header className="mb-8">
                            <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl mb-4 text-blue-400">
                                <FontAwesomeIcon icon={faPuzzlePiece} size="2x" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight leading-tight">
                                إضافات <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-400 to-indigo-500">محررات الأكواد</span>
                            </h1>
                            <p className="text-md text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed mt-3">
                                مجموعة من الإضافات الأساسية والمفيدة لـ Antigravity و VS Code لرفع إنتاجيتك وتحسين تجربة كتابة الأكواد.
                            </p>
                        </header>
                        <div className="bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-5 flex flex-col gap-4 backdrop-blur-md">
                            <div className="flex items-start gap-3">
                                <div className="text-blue-400 shrink-0 pt-1">
                                    <FontAwesomeIcon icon={faInfoCircle} size="lg" />
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-300">
                                    <strong>نصيحة سريعة:</strong> يمكنك تثبيت أي إضافة بنسخ أمر التثبيت (لـ VS Code) ولصقه مباشرة في terminal جهازك.
                                </div>
                            </div>
                             <div className="text-xs text-slate-500 dark:text-slate-500 border-t border-slate-200 dark:border-slate-800 pt-3">
                                أو انسخ معرف الإضافة (ID) وابحث عنه داخل قسم الإضافات في المحرر (اختصار `Ctrl+Shift+X`).
                            </div>
                        </div>
                    </aside>

                    {/* Left Scrollable Column */}
                    <div className="lg:col-span-7 xl:col-span-8 flex flex-col lg:h-[calc(100vh-200px)]">
                        {/* Controls Section (Search & Filter) - Now independent */}
                        <div className="mb-10 space-y-8">
                            {/* Search Input */}
                            <div className="relative">
                                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500">
                                    <FontAwesomeIcon icon={faSearch} size="lg" />
                                </span>
                                <input
                                    type="text"
                                    placeholder="ابحث عن إضافة بالاسم، الوصف، أو الـ ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pr-12 pl-4 py-4 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all backdrop-blur-sm"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">فلترة حسب الفئة:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {categories.map((cat) => (
                                            <button
                                                key={cat.id}
                                                onClick={() => setActiveCategory(cat.id)}
                                                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-300 border ${
                                                    activeCategory === cat.id
                                                        ? 'bg-blue-600 border-blue-500 text-white'
                                                        : 'bg-slate-100/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                                                }`}
                                            >
                                                {cat.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Extensions Grid - Now scrollable */}
                        {/* Extensions Grid */}
                        <main className="flex-1 overflow-y-auto pr-2 -mr-2 custom-scrollbar">
                        {filteredExtensions.length > 0 ? (
                            <div className="space-y-4">
                                {filteredExtensions.map((extension) => (
                                    <div
                                        key={extension.id}
                                        className="bg-white/50 dark:bg-slate-900/30 p-5 rounded-2xl hover:bg-slate-200/50 dark:hover:bg-slate-800/40 transition-all duration-300 group backdrop-blur-md relative flex flex-col sm:flex-row sm:items-center gap-5"
                                    >
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start mb-3">
                                                <span className="text-[11px] font-bold px-3 py-1 bg-slate-800/80 border border-slate-700/50 rounded-full text-blue-400">
                                                    {extension.categoryAr} 
                                                </span>
                                                <a
                                                    href={extension.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-slate-500 hover:text-blue-400 transition-colors sm:hidden"
                                                    title="فتح في المتجر الرسمي"
                                                >
                                                    <FontAwesomeIcon icon={faExternalLinkAlt} size="sm" />
                                                </a>
                                            </div>
                                            
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-400 transition-colors mb-1">
                                                {extension.name}
                                            </h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                                {extension.description}
                                            </p>
                                        </div>

                                        <div className="flex-shrink-0 sm:w-64 flex flex-col sm:flex-row-reverse gap-2 mt-4 sm:mt-0 border-t sm:border-t-0 sm:border-r border-slate-200 dark:border-slate-800/60 pt-4 sm:pt-0 sm:pr-5">
                                            <div className="flex-grow space-y-2">
                                                {extension.editors.includes('vscode') && (
                                                    <a href={`vscode:extension/${extension.id}`} className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20">
                                                        <FontAwesomeIcon icon={faCode} />
                                                        <span>تثبيت في VS Code</span>
                                                    </a>
                                                )}
                                                {extension.editors.includes('antigravity') && (
                                                    <a href={`antigravity:extension/${extension.id}`} className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 border border-purple-500/20">
                                                        <FontAwesomeIcon icon={faRocket} />
                                                        <span>تثبيت في Antigravity</span>
                                                    </a>
                                                )}
                                            </div>
                                            <div className="flex-shrink-0">
                                                <button
                                                    onClick={() => handleCopyId(extension.id)}
                                                    title="نسخ معرف الإضافة (ID)"
                                                    className={`w-full sm:w-auto h-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                                                        copiedId === extension.id
                                                            ? 'bg-emerald-500/20 text-emerald-400'
                                                            : 'bg-slate-200/60 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700/70'
                                                    }`}
                                                >
                                                    <FontAwesomeIcon icon={copiedId === extension.id ? faCheck : faCopy} />
                                                    <span className="sm:hidden">{copiedId === extension.id ? 'تم نسخ الـ ID' : 'نسخ الـ ID'}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-slate-100/50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800/60 rounded-[2rem] backdrop-blur-md">
                                <div className="text-slate-500 mb-4">
                                    <FontAwesomeIcon icon={faInfoCircle} size="3x" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">لم نعثر على أي نتائج</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">جرّب استخدام كلمات مفتاحية أخرى أو تغيير التصنيف المختار.</p>
                            </div>
                        )}
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VscodeExtensionsPage;