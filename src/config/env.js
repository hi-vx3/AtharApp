const ENV = {
  // مسار الواجهة الخلفية (Backend) الأساسي
  API_BASE_URL: process.env.REACT_APP_API_BASE || 'http://localhost:5008',

  // معرف العميل الخاص بـ GitHub App (Client ID)
  GITHUB_CLIENT_ID: process.env.REACT_APP_GITHUB_CLIENT_ID,
};

export default ENV;
