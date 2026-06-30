import ENV from "../config/env";

const API_BASE = ENV.API_BASE_URL;

/**
 * دالة موحدة لإرسال طلبات API إلى الخادم.
 * @param {string} endpoint - نقطة النهاية المطلوبة (مثال: '/auth/github').
 * @param {object} options - خيارات الطلب.
 * @param {string} [options.method='GET'] - نوع الطلب (GET, POST, etc.).
 * @param {object} [options.body=null] - جسم الطلب لطلبات POST/PUT.
 * @param {object} [options.headers={}] - ترويسات إضافية للطلب.
 * @returns {Promise<any>} - Promise يرجع بيانات الـ JSON عند النجاح.
 * @throws {Error} - يرمي خطأ في حال فشل الطلب أو إرجاع الخادم لخطأ.
 */
export const apiClient = async (
  endpoint,
  { method = "GET", body = null, headers = {} } = {},
) => {
  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include", // ضمان إرسال الكوكيز مع الطلب لدعم الجلسات
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  const data = await response.json();

  if (!response.ok) {
    // يرمي خطأ يحتوي على البيانات القادمة من الخادم لتسهيل الترجمة والمعالجة
    const error = new Error(
      data.message || "An error occurred with the API request.",
    );
    error.data = data; // إرفاق بيانات الخطأ الكاملة
    throw error;
  }

  return data;
};

export const api = {
  get: (endpoint, headers) => apiClient(endpoint, { method: 'GET', headers }),
  post: (endpoint, body, headers) => apiClient(endpoint, { method: 'POST', body, headers }),
  patch: (endpoint, body, headers) => apiClient(endpoint, { method: 'PATCH', body, headers }),
  put: (endpoint, body, headers) => apiClient(endpoint, { method: 'PUT', body, headers }),
  delete: (endpoint, body, headers) => apiClient(endpoint, { method: 'DELETE', body, headers }),
};
