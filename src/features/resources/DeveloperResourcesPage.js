import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext'; // استيراد سياق المصادقة العام
import { useGitHubAuth } from '../../context/GitHubAuthContext';
import { useGitHubRepo } from '../../context/GitHubRepoContext';

import Lenis from '@studio-freight/lenis';
const DeveloperResourcesPage = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const { isAuthenticated, user, logout } = useAuth();
  const { isLoggingIn, login } = useGitHubAuth(); // استخدام هوك GitHub لعملية الدخول
  const githubUsername = user?.name; // الحصول على اسم المستخدم من الهوك
  const loginSectionRef = useRef(null);
  const [showLogout, setShowLogout] = useState(false);
  const { isJoining, isContributor, openRepoFailed, joinStatus, requestJoin: handleJoinRequest, openRepo: handleOpenRepo } = useGitHubRepo();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    logout();
    setShowLogout(false);
    // Optionally, scroll back to the top or another section
  };

  // مراقبة حالة طلب الانضمام وعرض التنبيهات
  useEffect(() => {
    if (joinStatus) {
      if (joinStatus.type === 'success') {
        toast.success(joinStatus.message);
      } else if (joinStatus.type === 'error') {
        toast.error(joinStatus.message);
      } else if (joinStatus.type === 'info') {
        toast(joinStatus.message, { icon: 'ℹ️' });
      }
    }
  }, [joinStatus]);

  useEffect(() => {
    if (isAuthenticated && loginSectionRef.current) {
      loginSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (!isAuthenticated) {
      setShowLogout(false);
    }

    // إظهار زر تسجيل الخروج بعد فترة من إتمام الدخول
    if (isAuthenticated) {
      const timer = setTimeout(() => setShowLogout(true), 2500);
      return () => clearTimeout(timer);
    }

  }, [isAuthenticated]);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    { q: "كيف أبدأ في استلام أول مهمة تطويرية لي؟", a: "يمكنك استعراض \"سجل المطورين وتوزيع المهام\" من لوحة التحكم، والاطلاع على الفرص والمشاريع الشاغرة، ثم التنسيق مع مشرف القسم لتعيين المهمة لك رسمياً." },
    { q: "كيف يمكنني رفع التعديلات البرمجية التي قمت بها بأمان؟", a: "استخدم GitHub Desktop أو Terminal. أنشئ فرع (Branch) جديد يعبر عن تعديلك، أجرِ التعديلات وافحصها محلياً، ثم أرسل التغييرات (Push) وافتح Pull Request لمراجعتها ودمجها مع الفرع الرئيسي." },
    { q: "أين أجد مستندات ومشاريع التوثيق للملفات التقنية؟", a: "تم توفير بوابة متكاملة تسمى \"نظام إدارة ملفات ومشاريع أثر التقنية\" تتيح لك تصفح الهيكل الشجري وقراءة ملفات التوثيق بنمط GitHub." },
    { q: "كيف أقوم بتحديث معلوماتي البرمجية والمهارات المتاحة في الواجهة؟", a: "راجع \"خطوات الانضمام والمساهمة\" المتوفرة أعلاه، والتي تشرح طريقة تعديل سجل المطورين وإضافة مهاراتك ورسالتك التعبيرية بالتفصيل." },
  ];

  return (
    <div className="bg-[#070b13] text-slate-100 font-sans">
      <div className="fixed top-[-10%] right-[5%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      {/* Hero Section */}
      <div className="absolute top-0 right-0 p-6 md:p-12 z-20">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors group"
        >
          <i className="ti ti-arrow-right group-hover:translate-x-1 transition-transform"></i>
          <span className="text-sm font-semibold border-b border-transparent group-hover:border-blue-500/30">العودة للرئيسية</span>
        </button>
      </div>
      <div className="relative h-screen flex flex-col items-center justify-center text-center p-6 overflow-hidden snap-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10"
        >
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            مركز موارد <span className="text-blue-400">المطورين</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            بوابتك للوصول إلى كل ما تحتاجه لبدء رحلتك في المساهمة والتطوير.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="absolute bottom-10 flex flex-col items-center gap-2 text-slate-500 z-10"
        >
          <motion.svg initial={{ y: 0 }} animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19 12L12 19L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </motion.svg>
          <span className="text-xs font-semibold">اسحب للأسفل</span>
        </motion.div>
      </div>

      {/* GitHub Login Section */}
      <div ref={loginSectionRef} className="py-20 px-6 bg-slate-950/20 border-y border-slate-900/60">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-right"
        >
          <div className="relative">
            <AnimatePresence mode="wait">
              {!isAuthenticated ? (
                <motion.div
                  key="prompt"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl md:text-3xl font-black text-white mb-2">هل أنت مستعد للمساهمة؟</h2>
                  <p className="text-slate-400 max-w-lg">سجّل دخولك بحساب GitHub للوصول لأدوات إضافية.</p>
                </motion.div>
              ) : (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl md:text-3xl font-black text-white mb-2">أهلاً بك مجدداً!</h2>
                  <p className="text-slate-400 max-w-lg">أنت الآن مسجّل. استكشف الموارد المتاحة بالأسفل.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <motion.button
            onClick={isAuthenticated && showLogout ? handleLogoutClick : login}
            disabled={isLoggingIn}
            className={`font-bold text-sm py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 mx-auto md:mx-0 shrink-0 overflow-hidden
              ${isAuthenticated && showLogout
                ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30 cursor-pointer'
                : isAuthenticated
                ? 'bg-emerald-500 text-white cursor-default'
                : isLoggingIn
                ? 'bg-slate-300 text-black cursor-wait'
                : 'bg-white text-black hover:bg-slate-200'
              }`
            }
            style={{ width: isAuthenticated || isLoggingIn ? '210px' : '250px' }}
            layout
          >
            <AnimatePresence mode="wait">
              {isAuthenticated ? (
                showLogout ? (
                  <motion.span key="logout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                    <i className="ti ti-logout text-lg"></i>
                    <span>تسجيل الخروج</span>
                  </motion.span>
                ) : (
                  githubUsername ? (
                    <motion.span key="welcoming" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2">
                      <i className="ti ti-user-check text-lg"></i>
                      <span>أهلاً بك، {githubUsername}</span>
                    </motion.span>
                  ) : (
                    <motion.span key="authenticated" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2"><i className="ti ti-check text-lg"></i><span>تم تسجيل الدخول</span></motion.span>
                  )
                )
              ) : isLoggingIn ? ( // During login process
                <motion.span key="loggingIn" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex items-center gap-2">
                   <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>جاري تسجيل الدخول...</span>
                </motion.span>
              ) : (
                <motion.span key="initial" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2">
                  <i className="ti ti-brand-github text-lg"></i>
                  <span>تسجيل الدخول بواسطة GitHub</span>
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </div>

      {isAuthenticated && (
        <div className="max-w-4xl mx-auto px-6 py-12 sm:py-20 relative z-10 snap-start">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-300 text-xs font-semibold tracking-wider px-3 py-1.5 rounded-full border border-blue-600/25 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
              <span>مركز التطوير • الموارد الشاملة</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold mb-3">أدوات وموارد <span className="text-blue-300">المطورين</span></h1>
            <p className="text-base text-slate-400 leading-relaxed max-w-xl">بوابتك المتكاملة للوصول لأفضل بيئات التطوير، المكتبات البرمجية، وخرائط العمل التنفيذية لتسريع عجلة الإنتاج.</p>
          </div>

          
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-blue-600/10 border border-blue-600/25 text-blue-300 text-base shrink-0"><i className="ti ti-check"></i></div>
                <div>
                  <div className="text-base font-bold text-slate-100">الاستعداد للمشروع</div>
                  <div className="text-xs text-slate-500 mt-0.5">متطلبات إجبارية قبل البدء في أي مساهمة</div>
                </div>
              </div>
              <div className="bg-[#0d1220] border border-white/10 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-right">
                  <h3 className="font-bold text-white mb-2">الهدف من المساهمة</h3>
                  <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
                    الهدف الأساسي هو تبادل الخبرات بينكم، وفتح مجال للتجربة والتعلم العملي، بحيث يساهم كل واحد منكم بأفكاره وأسلوبه، ونستفيد جميعًا من تنوع وجهات النظر — وهذا يصب في صالح تأهيلكم بشكل أفضل لسوق العمل.
                  </p>
                </div>
                <div className="flex flex-col gap-3 shrink-0">
                  <AnimatePresence mode="wait">
                    {isContributor ? (
                      <motion.button
                        key="open-repo"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        onClick={handleOpenRepo}
                        className="w-full px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 no-underline shadow-sm bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/80 text-white cursor-pointer"
                      >
                        <i className="ti ti-brand-github"></i>
                        <span>فتح المستودع</span>
                      </motion.button>
                    ) : (
                      <motion.button
                        key="join-request"
                        exit={{ opacity: 0, scale: 0.95 }}                        
                        transition={{ duration: 0.3 }}
                        onClick={handleJoinRequest}
                        disabled={isJoining}
                        className={`w-full px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70
                          ${isJoining
                            ? 'bg-slate-300 text-black cursor-wait'
                            : 'bg-white text-black hover:bg-slate-200'
                          }`}
                      >
                        {isJoining ? (
                          <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : (
                          <i className="ti ti-user-plus"></i>
                        )}
                        <span>{isJoining ? 'جاري إرسال الطلب...' : 'طلب الانضمام للمساهمة'}</span>
                      </motion.button>
                    )}
                  </AnimatePresence>
                  <a
                    data-tooltip-id="desktop-app-tooltip"
                    href="https://desktop.github.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="relative"
                  >
                    <div
                      className={`w-full bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/80 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 no-underline ${openRepoFailed ? 'animate-head-shake ring-2 ring-offset-2 ring-red-500/50 ring-offset-[#0d1220]' : ''}`}
                    >
                      <i className="ti ti-download"></i>
                      <span>تنزيل GitHub Desktop</span>
                    </div>
                    {openRepoFailed && (
                      <motion.div
                        initial={{ opacity: 0, x: -10, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="absolute left-full top-0 ml-4 w-max max-w-xs bg-red-600/90 text-white text-xs font-semibold rounded-lg px-3 py-2 shadow-lg backdrop-blur-sm border border-red-500/50"
                      >
                        فشلت محاولة الفتح. هل قمت بتثبيت التطبيق؟
                        <div
                          className="absolute top-1/2 -translate-y-1/2 w-0 h-0"
                          style={{
                            left: '-8px',
                            borderTop: '8px solid transparent',
                            borderBottom: '8px solid transparent',
                            borderRight: '8px solid rgb(220 38 38 / 0.9)',
                          }}
                        ></div>
                      </motion.div>
                    )}
                  </a>
                </div>
              </div>
            </motion.div>
          

          <div className="h-px bg-white/5 mb-12"></div>

          
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-blue-600/10 border border-blue-600/25 text-blue-300 text-base shrink-0"><i className="ti ti-code"></i></div>
                <div>
                  <div className="text-base font-bold text-slate-100">محررات الأكواد وبيئات التطوير</div>
                  <div className="text-xs text-slate-500 mt-0.5">اختر المحرر الأنسب لك وابدأ البرمجة</div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-2.5">
                <div className="flex flex-col bg-blue-600/5 border border-blue-600/25 rounded-xl p-4 transition-colors">
                  <div className="inline-block text-xs font-bold bg-blue-600 text-white px-2.5 py-1 rounded-lg mb-2.5 self-start">الأفضل • موصى به</div>
                  <div className="text-sm font-bold mb-1.5">Antigravity IDE</div>
                  <div className="text-xs text-slate-400 leading-relaxed flex-1">بيئة التطوير الذكية المدعومة بالذكاء الاصطناعي، توفر تجربة برمجية خارقة وسرعة إنتاجية لا مثيل لها.</div>
                  <a href="https://antigravity.google/download" target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-300 hover:opacity-80 transition-opacity">
                    <i className="ti ti-download text-sm"></i> تحميل Antigravity
                  </a>
                </div>
                <div className="flex flex-col bg-[#0d1220] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors">
                  <div className="h-6 mb-2.5"></div>
                  <div className="text-sm font-bold mb-1.5">VS Code</div>
                  <div className="text-xs text-slate-400 leading-relaxed flex-1">محرر الأكواد الأكثر استخداماً، قوي ومرن ويقبل التخصيص والإضافات المتنوعة.</div>
                  <a href="https://code.visualstudio.com/download" target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-300 hover:opacity-80 transition-opacity">
                    <i className="ti ti-download text-sm"></i> تحميل VS Code
                  </a>
                </div>
              </div>
              <Link to="/installtools" className="flex items-center gap-3 bg-[#0d1220] border border-white/5 rounded-xl p-3.5 hover:border-blue-600/20 transition-colors no-underline">
                <i className="ti ti-puzzle text-lg text-slate-500 shrink-0"></i>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-100 mb-0.5">إضافات محررات الأكواد</div>
                  <div className="text-xs text-slate-400">أفضل الإضافات لـ Antigravity و VS Code لتحسين سرعة وجودة الكود</div>
                </div>
                <i className="ti ti-arrow-left text-base text-slate-500"></i>
              </Link>
            </motion.div>
          

          <div className="h-px bg-white/5 mb-12"></div>

          
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-blue-600/10 border border-blue-600/25 text-blue-300 text-base shrink-0"><i className="ti ti-stack-2"></i></div>
                <div>
                  <div className="text-base font-bold text-slate-100">التقنيات والمكتبات</div>
                  <div className="text-xs text-slate-500 mt-0.5">قواعد البيانات — Frontend — Backend</div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="bg-[#0d1220] border border-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3"><i className="ti ti-database text-sm"></i> قواعد البيانات</div>
                  <div className="flex items-center justify-between py-2 border-b border-white/5"><div className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-slate-500"></span><span className="text-sm text-slate-200">MongoDB Server</span></div><a href="https://www.mongodb.com/try/download/community" target="_blank" rel="noreferrer" className="w-6 h-6 flex items-center justify-center rounded-md bg-[#111827] border border-white/5 text-slate-500 hover:border-blue-600/30 hover:text-blue-300 transition-all text-xs"><i className="ti ti-external-link"></i></a></div>
                  <div className="flex items-center justify-between py-2 border-b border-white/5"><div className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-slate-500"></span><span className="text-sm text-slate-200">MongoDB Compass</span></div><a href="https://www.mongodb.com/products/compass" target="_blank" rel="noreferrer" className="w-6 h-6 flex items-center justify-center rounded-md bg-[#111827] border border-white/5 text-slate-500 hover:border-blue-600/30 hover:text-blue-300 transition-all text-xs"><i className="ti ti-external-link"></i></a></div>
                  <div className="flex items-center justify-between pt-2"><div className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-slate-500"></span><span className="text-sm text-slate-200">MySQL Workbench</span></div><a href="https://www.mysql.com/products/workbench/" target="_blank" rel="noreferrer" className="w-6 h-6 flex items-center justify-center rounded-md bg-[#111827] border border-white/5 text-slate-500 hover:border-blue-600/30 hover:text-blue-300 transition-all text-xs"><i className="ti ti-external-link"></i></a></div>
                </div>
                <div className="bg-[#0d1220] border border-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3"><i className="ti ti-layout text-sm"></i> Frontend</div>
                  <div className="flex items-center justify-between py-2 border-b border-white/5"><div className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-slate-500"></span><span className="text-sm text-slate-200">React Documentation</span></div><a href="https://react.dev/learn" target="_blank" rel="noreferrer" className="w-6 h-6 flex items-center justify-center rounded-md bg-[#111827] border border-white/5 text-slate-500 hover:border-blue-600/30 hover:text-blue-300 transition-all text-xs"><i className="ti ti-external-link"></i></a></div>
                  <div className="flex items-center justify-between pt-2"><div className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-slate-500"></span><span className="text-sm text-slate-200">Tailwind CSS Docs</span></div><a href="https://tailwindcss.com/docs" target="_blank" rel="noreferrer" className="w-6 h-6 flex items-center justify-center rounded-md bg-[#111827] border border-white/5 text-slate-500 hover:border-blue-600/30 hover:text-blue-300 transition-all text-xs"><i className="ti ti-external-link"></i></a></div>
                </div>
                <div className="bg-[#0d1220] border border-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3"><i className="ti ti-server text-sm"></i> Backend</div>
                  <div className="flex items-center justify-between py-2 border-b border-white/5"><div className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-slate-500"></span><span className="text-sm text-slate-200">Node.js</span></div><a href="https://nodejs.org/en/download" target="_blank" rel="noreferrer" className="w-6 h-6 flex items-center justify-center rounded-md bg-[#111827] border border-white/5 text-slate-500 hover:border-blue-600/30 hover:text-blue-300 transition-all text-xs"><i className="ti ti-external-link"></i></a></div>
                  <div className="flex items-center justify-between py-2 border-b border-white/5"><div className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-slate-500"></span><span className="text-sm text-slate-200">Express.js</span></div><a href="https://expressjs.com/" target="_blank" rel="noreferrer" className="w-6 h-6 flex items-center justify-center rounded-md bg-[#111827] border border-white/5 text-slate-500 hover:border-blue-600/30 hover:text-blue-300 transition-all text-xs"><i className="ti ti-external-link"></i></a></div>
                  <div className="flex items-center justify-between py-2 border-b border-white/5"><div className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-slate-500"></span><span className="text-sm text-slate-200">NestJS</span></div><a href="https://nestjs.com/" target="_blank" rel="noreferrer" className="w-6 h-6 flex items-center justify-center rounded-md bg-[#111827] border border-white/5 text-slate-500 hover:border-blue-600/30 hover:text-blue-300 transition-all text-xs"><i className="ti ti-external-link"></i></a></div>
                  <div className="flex items-center justify-between pt-2"><div className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-slate-500"></span><span className="text-sm text-slate-200">HTTP Toolkit</span></div><a href="https://httptoolkit.com/" target="_blank" rel="noreferrer" className="w-6 h-6 flex items-center justify-center rounded-md bg-[#111827] border border-white/5 text-slate-500 hover:border-blue-600/30 hover:text-blue-300 transition-all text-xs"><i className="ti ti-external-link"></i></a></div>
                </div>
              </div>
            </motion.div>
          

          <div className="h-px bg-white/5 mb-12"></div>

          
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-blue-600/10 border border-blue-600/25 text-blue-300 text-base shrink-0"><i className="ti ti-layout-grid"></i></div>
                <div>
                  <div className="text-base font-bold text-slate-100">بوابات وأنظمة المساهمة</div>
                  <div className="text-xs text-slate-500 mt-0.5">أنظمة تفاعلية متكاملة للعمل الجماعي</div>
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                <a href="http://localhost:5173/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3.5 bg-[#0d1220] border border-white/5 rounded-xl p-4 hover:border-blue-600/20 transition-colors no-underline">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#111827] border border-white/10 text-slate-400 text-lg shrink-0"><i className="ti ti-folder-open"></i></div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm mb-1">نظام إدارة ملفات ومشاريع أثر التقنية</div>
                    <div className="text-xs text-slate-400 leading-relaxed">مجلد مخصص للمشاريع التقنية مع مستعرض ومحرر نصوص مدمج لإدارة وتحديث وثائق المشاريع البرمجية.</div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="text-xs font-semibold bg-blue-600/10 text-blue-300 border border-blue-600/25 px-2 py-0.5 rounded-md">إدارة الملفات</span>
                      <span className="text-xs font-semibold bg-blue-600/10 text-blue-300 border border-blue-600/25 px-2 py-0.5 rounded-md">مشاريع تقنية</span>
                      <span className="text-xs font-semibold bg-blue-600/10 text-blue-300 border border-blue-600/25 px-2 py-0.5 rounded-md">تعديل مباشر</span>
                    </div>
                  </div>
                  <i className="ti ti-external-link text-base text-slate-500"></i>
                </a>
                <a href="http://localhost:5173/terminal" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3.5 bg-[#0d1220] border border-white/5 rounded-xl p-4 hover:border-blue-600/20 transition-colors no-underline">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#111827] border border-white/10 text-slate-400 text-lg shrink-0"><i className="ti ti-terminal"></i></div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm mb-1">مركز تشغيل وإدارة السيرفرات (Terminal)</div>
                    <div className="text-xs text-slate-400 leading-relaxed">لوحة تحكم تفاعلية لتشغيل وإيقاف خوادم الباك اند ومتابعة سجلات التشغيل بشكل حي ومستمر.</div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="text-xs font-semibold bg-blue-600/10 text-blue-300 border border-blue-600/25 px-2 py-0.5 rounded-md">التحكم بالخادم</span>
                      <span className="text-xs font-semibold bg-blue-600/10 text-blue-300 border border-blue-600/25 px-2 py-0.5 rounded-md">Terminal Logs</span>
                      <span className="text-xs font-semibold bg-blue-600/10 text-blue-300 border border-blue-600/25 px-2 py-0.5 rounded-md">بث حي</span>
                    </div>
                  </div>
                  <i className="ti ti-external-link text-base text-slate-500"></i>
                </a>
              </div>
            </motion.div>
          

          <div className="h-px bg-white/5 mb-12"></div>

          
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-blue-600/10 border border-blue-600/25 text-blue-300 text-base shrink-0"><i className="ti ti-help"></i></div>
                <div>
                  <div className="text-base font-bold text-slate-100">الأسئلة الشائعة والمساعدة</div>
                  <div className="text-xs text-slate-500 mt-0.5">إجابات سريعة للأسئلة المتكررة للبدء في المساهمة البرمجية</div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {faqs.map((faq, index) => (
                  <div key={index} className={`bg-[#0d1220] border border-white/5 rounded-xl overflow-hidden transition-all ${activeFaq === index ? '!border-white/10' : ''}`}>
                    <div className="flex justify-between items-center p-4 cursor-pointer select-none gap-2.5" onClick={() => toggleFaq(index)}>
                      <span className="text-sm font-semibold text-slate-100">{faq.q}</span>
                      <i className={`ti ti-chevron-down text-sm text-slate-500 shrink-0 transition-transform ${activeFaq === index ? 'rotate-180 !text-blue-300' : ''}`}></i>
                    </div>
                    <div className={`transition-all duration-300 ease-in-out grid ${activeFaq === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                      <div className="overflow-hidden">
                        <div className="text-xs text-slate-400 leading-relaxed p-4 pt-3 border-t border-white/5">
                          {faq.a}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          
        </div>
      )}
    </div>
  );
};

export default DeveloperResourcesPage;
