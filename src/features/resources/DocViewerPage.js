import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowRight, 
  faUserCheck, 
  faTasks, 
  faInfoCircle,
  faSyncAlt,
  faCode,
  faLaptopCode,
  faExternalLinkAlt,
  faCheckCircle,
  faExclamationCircle,
  faStar,
  faCogs
} from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

// Developer rich metadata stored on the page itself
const DEVELOPER_METADATA = {
  "سعد محمد": {
    id: 1,
    track: "Full-Stack Developer",
    level: "رئيس قسم التطوير",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=saad",
    skills: ["React.js", "Node.js", "Express", "PostgreSQL"],
    tasks: [
      { name: "تصميم وتطوير الموجهات الفرعية (Sub-routing)", status: "Completed", desc: "عزل مسارات الموارد والصفحات محلياً لزيادة مديولية الكود." },
      { name: "ربط قواعد البيانات للوحة التحكم", status: "In Progress", desc: "إعداد الجداول ونقاط الاتصال بالـ API." }
    ],
    availability: "🟢 متاح بالكامل للمشاريع والمهام الكبرى",
    gitLink: "https://github.com/hi-vx3"
  },
  "أحمد العلي": {
    id: 2,
    track: "DevOps & Cloud Systems Admin",
    level: "مسؤول الإدارة التقنية",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=ahmed",
    skills: ["Docker", "AWS", "CI/CD", "Linux Admin"],
    tasks: [
      { name: "تأمين خوادم النشر والـ DevOps", status: "Completed", desc: "إعداد تجميع حاويات Docker والـ CI/CD." },
      { name: "حماية وتأمين قواعد البيانات", status: "Pending", desc: "حظر الهجمات والتأكد من أمان بيئة التشغيل." }
    ],
    availability: "🔴 مشغول حالياً (خوادم الإنتاج)",
    gitLink: "https://github.com"
  },
  "ليلى حسن": {
    id: 3,
    track: "Frontend Developer",
    level: "مطور واجهات",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=layla",
    skills: ["React", "Next.js", "Tailwind CSS", "Figma"],
    tasks: [
      { name: "إعادة تصميم واجهات الموارد والخطط (UI/UX)", status: "Completed", desc: "تحويل الصفحات للأسلوب الزجاجي الحديث المتوافق مع الهوية الجديدة." }
    ],
    availability: "🟡 متاحة للاستشارات وتصميم المكونات الفرعية",
    gitLink: "https://github"
  }
};

// Vacant/Suggested tasks data stored on the page
const VACANT_TASKS = [
  {
    title: "بناء نظام الإشعارات الفورية (Real-time Notifications)",
    status: "🟢 متاح للانضمام",
    description: "تطوير ميزة إشعارات فورية ترسل تنبيهات للمطورين عند تحديث خطة التطوير أو تعيين مهام جديدة لهم.",
    requirements: ["بناء اتصال مستمر باستخدام WebSockets أو Socket.io", "ربط التنبيهات بقاعدة بيانات MongoDB وتحديث حالتها."],
    conditions: ["تجنب استهلاك موارد الأجهزة أو التسبب في تسريب الذاكرة (Memory Leaks) في الخلفية."]
  },
  {
    title: "أتمتة وتكامل رسائل واتساب الذكية (WhatsApp Automation)",
    status: "💡 فكرة قابلة للتطوير",
    description: "إعداد بوت محادثة للواتساب يقوم بإعلام المشرف تلقائياً فور قيام المطور بتسليم اسمه البرمجي أو إنهاء مهمة.",
    requirements: ["الربط مع WhatsApp Business API أو مكتبة whatsapp-web.js", "تجهيز قوالب رسائل منسقة تدعم اللغة العربية."],
    conditions: ["تطبيق حدود معدل الإرسال (Rate Limiting) لتجنب حظر الرقم.", "إعداد سجل لتتبع وتحليل الأخطاء (Error Logs)."]
  }
];

// JSON roles configuration for available developers
const DEVELOPER_ROLES_JSON = [
  { id: 1, type: "المشرف" },
  { id: 2, type: "مشرف" }
 
];

const DocViewerPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('available'); // 'available' | 'tasks'
  const [parsedNames, setParsedNames] = useState([]); // Array of { name, id, role, message, tags }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const docPath = activeTab === 'available' 
    ? '/docs/AVAILABLE_DEVELOPERS.md' 
    : '/docs/DEVELOPERS_TASKS.md';

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(docPath)
      .then((res) => {
        if (!res.ok) {
          throw new Error('تعذر تحميل ملف البيانات.');
        }
        return res.text();
      })
      .then((text) => {
        const lines = text.split('\n').map(line => line.trim());
        const developers = [];
        let currentDev = null;

        for (let line of lines) {
          if (line.startsWith('-')) {
            let rawName = line.substring(1).trim();
            let parsedId = null;
            // Match parenthesis containing digits or text as the ID, e.g. (1)
            const idMatch = rawName.match(/\(([^)]+)\)/);
            if (idMatch) {
              const val = idMatch[1].trim();
              parsedId = /^\d+$/.test(val) ? parseInt(val) : val;
              // Clean name from parenthesis
              rawName = rawName.replace(/\s*\([^)]+\)/g, '').trim();
            }
            currentDev = { name: rawName, id: parsedId, role: '', message: '', tags: [], available: true };
            developers.push(currentDev);
          } else if (line.startsWith('.') && currentDev) {
            currentDev.role = line.substring(1).trim();
          } else if (line.startsWith('+') && currentDev) {
            currentDev.message = line.substring(1).trim();
          } else if (line.startsWith('?') && currentDev) {
            const val = line.substring(1).trim().toLowerCase();
            currentDev.available = (val === 'true' || val === 'yes' || val === '1' || val === 'متاح');
          } else if (line.startsWith('*') && currentDev) {
            if (currentDev.tags.length < 4) {
              currentDev.tags.push(line.substring(1).trim());
            }
          }
        }
        setParsedNames(developers);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [docPath]);

  return (
    <div dir="rtl" className="min-h-screen bg-[#070b13] text-slate-200 font-sans p-6 md:p-12 relative overflow-hidden">

      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] bg-purple-600/8 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Navigation Back */}
        <button
          onClick={() => navigate('/getstarted')}
          className="mb-10 flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors group"
        >
          <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-1 transition-transform" />
          <span className="text-sm font-semibold border-b border-transparent group-hover:border-blue-500/30">
            العودة للموارد
          </span>
        </button>

        {/* Tab Switcher */}
        <div className="flex justify-center gap-4 mb-12 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-900/80 max-w-md mx-auto backdrop-blur-md shadow-lg">
          <button
            onClick={() => setActiveTab('available')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold transition-all duration-300 w-1/2 justify-center ${
              activeTab === 'available'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FontAwesomeIcon icon={faUserCheck} />
            <span>المبرمجين المتاحين</span>
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold transition-all duration-300 w-1/2 justify-center ${
              activeTab === 'tasks'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FontAwesomeIcon icon={faTasks} />
            <span>المهام والمسؤوليات</span>
          </button>
        </div>

        {/* Content Viewer Panel */}
        <div className="bg-slate-950/20 border border-slate-900/60 rounded-[2.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-md relative overflow-hidden min-h-[400px]">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 gap-3">
              <FontAwesomeIcon icon={faSyncAlt} className="animate-spin text-2xl text-blue-500" />
              <span className="text-xs font-bold animate-pulse">جاري تحميل البيانات...</span>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
              <FontAwesomeIcon icon={faInfoCircle} className="text-red-500 text-3xl mb-4" />
              <p className="text-red-400 font-bold mb-2">{error}</p>
              <button 
                onClick={() => setParsedNames([])}
                className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                إعادة المحاولة
              </button>
            </div>
          ) : activeTab === 'available' ? (
            // TAB 1: AVAILABLE PROGRAMMERS
            <div>
              <div className="flex items-center justify-between mb-8 border-b border-slate-900 pb-4">
                <h1 className="text-2xl md:text-4xl font-black text-white">سجل المطورين المتاحين للعمل</h1>
                <span className="text-xs text-slate-500 font-semibold font-mono">({parsedNames.filter(dev => dev.available !== false).length} مبرمجين متاحين)</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {parsedNames
                  .filter(dev => dev.available !== false)
                  .map((dev, index) => {
                    const name = dev.name;
                  
                  // Dynamic fallback profile if metadata is missing
                  const meta = DEVELOPER_METADATA[name] || {
                    id: index + 10,
                    track: "مطور برمجيات",
                    level: "عضو متاح",
                    avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
                    skills: ["JavaScript", "React.js", "Tailwind CSS"],
                    tasks: [],
                    availability: "🟢 متاح للمشاريع والمهام الجديدة",
                    gitLink: "https://github.com"
                  };

                  // Determine ID dynamically or from parenthesis:
                  // if opened parenthesis (like Name (1)), use that ID. Otherwise use next logical ID (index + 1)
                  const resolvedId = dev.id !== null ? dev.id : (index + 1);
                  const roleMeta = DEVELOPER_ROLES_JSON.find(item => item.id === resolvedId);
                  const titleLabel = roleMeta ? roleMeta.type : "عضو";
                  const canShowLinks = !!roleMeta;

                  const displayRole = dev.role || meta.track || "مطور برمجيات";
                  const displaySkills = dev.tags && dev.tags.length > 0 ? dev.tags : (meta.skills || []);
                  const availabilityText = `🟢 ${titleLabel}`;

                  return (
                    <div key={index} className="bg-slate-950/40 border border-slate-900 hover:border-blue-500/20 rounded-3xl p-6 transition-all duration-300 relative overflow-hidden group shadow-lg flex flex-col justify-between">
                      <div className="absolute -left-10 -top-10 w-24 h-24 bg-blue-500/5 blur-xl rounded-full pointer-events-none"></div>
                      <div>
                        <div className="flex items-center gap-4 mb-4">
                          <img src={meta.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`} alt={name} className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 p-1 group-hover:scale-105 transition-transform" />
                          <div>
                            <h3 className="text-lg font-black text-white">{name}</h3>
                            <p className="text-xs text-slate-400">عضو متاح • {displayRole}</p>
                          </div>
                        </div>
                        
                        <div className="text-xs text-blue-400 font-bold bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-500/15 mb-4 inline-block">
                          {availabilityText}
                        </div>

                        {dev.message && (
                          <div className="text-xs text-slate-400 italic bg-slate-900/40 p-3.5 rounded-2xl border border-slate-900/60 mb-4">
                            "{dev.message}"
                          </div>
                        )}

                        <div className="mb-6">
                          <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">إبراز:</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {displaySkills.map((skill, sIdx) => (
                              <span key={sIdx} className="text-[10px] font-bold bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-lg text-slate-300">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {canShowLinks && (
                        <div className="flex justify-between items-center border-t border-slate-900 pt-4 mt-2">
                          <button
                            onClick={() => navigate(`/member/${meta.id || index + 10}`)}
                            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                          >
                            <span>عرض الملف التقني</span>
                            <FontAwesomeIcon icon={faExternalLinkAlt} className="text-[10px]" />
                          </button>
                          <a href={meta.gitLink || "https://github.com"} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors">
                            <FontAwesomeIcon icon={faGithub} className="text-lg" />
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            // TAB 2: DEVELOPERS & TASKS
            <div>
              <div className="flex items-center justify-between mb-8 border-b border-slate-900 pb-4">
                <h1 className="text-2xl md:text-4xl font-black text-white">سجل المطورين وتوزيع المهام</h1>
                <span className="text-xs text-slate-500 font-semibold font-mono">تحديث فوري للمهام</span>
              </div>

              {/* Developers and their active tasks */}
              <div className="space-y-6 mb-12">
                {parsedNames.map((dev, index) => {
                  const name = dev.name;
                  const meta = DEVELOPER_METADATA[name] || {};
                  
                  const displayRole = dev.role || meta.track || "مطور برمجيات";

                  return (
                    <div key={index} className="bg-slate-950/40 border border-slate-900 rounded-3xl p-6 relative overflow-hidden">
                      <div className="flex flex-wrap justify-between items-center mb-4 gap-2 border-b border-slate-900 pb-3">
                        <div className="flex items-center gap-3">
                          <img src={meta.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`} alt={name} className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 p-1" />
                          <div>
                            <h3 className="text-base font-black text-white">{name}</h3>
                            <p className="text-[11px] text-slate-500">عضو متاح • {displayRole}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate(`/member/${meta.id || index + 10}`)}
                          className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 border border-blue-500/10 bg-blue-500/5 px-3 py-1.5 rounded-xl transition-all"
                        >
                          <span>عرض الملف الكامل</span>
                          <FontAwesomeIcon icon={faExternalLinkAlt} className="text-[10px]" />
                        </button>
                      </div>

                      {dev.message && (
                        <div className="mb-4 p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-xs text-blue-300">
                          <strong>الرسالة التعبيرية:</strong> "{dev.message}"
                        </div>
                      )}

                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide">المهام المسندة:</h4>
                        {meta.tasks && meta.tasks.length > 0 ? (
                          meta.tasks.map((task, tIdx) => (
                            <div key={tIdx} className="flex flex-col md:flex-row justify-between p-3.5 bg-slate-900/40 border border-slate-900 rounded-2xl gap-3">
                              <div>
                                <h5 className="text-sm font-bold text-slate-200">{task.name}</h5>
                                <p className="text-xs text-slate-400 mt-1">{task.desc}</p>
                              </div>
                              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border h-fit shrink-0 ${
                                task.status === 'Completed'
                                  ? 'bg-green-500/10 border-green-500/20 text-green-400'
                                  : task.status === 'In Progress'
                                  ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 animate-pulse'
                                  : 'bg-slate-900 border-slate-800 text-slate-500'
                              }`}>
                                {task.status === 'Completed' ? 'مكتمل' : task.status === 'In Progress' ? 'جاري العمل' : 'معلق'}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 bg-slate-900/20 border border-slate-900/50 rounded-2xl text-xs text-slate-500 font-bold">
                            ⚠️ لا توجد مهام مسندة حالياً لهذا المطور (متاح لاستلام المهام الجديدة).
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Vacant / Suggested Tasks section */}
              <div className="border-t border-slate-900 pt-8">
                <h2 className="text-xl font-black text-purple-400 mb-6 flex items-center gap-2">
                  <FontAwesomeIcon icon={faCogs} className="text-purple-500" />
                  <span>الفرص والمهام الشاغرة المقترحة</span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {VACANT_TASKS.map((task, index) => (
                    <div key={index} className="bg-slate-950/60 border border-purple-500/10 rounded-3xl p-6 relative overflow-hidden group">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-white text-base group-hover:text-purple-400 transition-colors">{task.title}</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300">{task.status}</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4">{task.description}</p>
                      
                      <div className="mb-4">
                        <h4 className="text-[11px] font-bold text-slate-500 mb-1.5">المتطلبات الأساسية:</h4>
                        <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300 pr-2">
                          {task.requirements.map((req, rIdx) => <li key={rIdx}>{req}</li>)}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-[11px] font-bold text-slate-500 mb-1.5">الشروط والضوابط:</h4>
                        <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300 pr-2">
                          {task.conditions.map((cond, cIdx) => <li key={cIdx}>{cond}</li>)}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocViewerPage;
