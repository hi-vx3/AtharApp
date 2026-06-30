import React, { useEffect } from 'react';

const AuthCallbackPage = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state'); // استخلاص قيمة state
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');

    if (code && window.opener) {
      // إرسال الكود إلى النافذة الرئيسية التي فتحت البوباب
      window.opener.postMessage({ type: 'GITHUB_AUTH_SUCCESS', code: code, state: state }, window.location.origin);
    } else if (error && window.opener) {
      // في حال أرسل GitHub خطأً واضحاً
      window.opener.postMessage({ 
        type: 'GITHUB_AUTH_FAILURE', 
        error: error,
        errorDescription: errorDescription
      }, window.location.origin);
    } else {
      // في حال عدم وجود كود أو خطأ (حالة غير متوقعة)
      window.opener.postMessage({ type: 'GITHUB_AUTH_FAILURE', error: 'No code received' }, window.location.origin);
    }

    // إغلاق النافذة المنبثقة في جميع الحالات
    window.close();
  }, []);

  // رسالة مؤقتة تظهر للمستخدم
  return <div style={{ padding: '20px', fontFamily: 'sans-serif', textAlign: 'center' }}>جاري المصادقة...</div>;
};

export default AuthCallbackPage;