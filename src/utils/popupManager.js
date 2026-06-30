/**
 * يفتح نافذة منبثقة جديدة في منتصف الشاشة.
 * @param {string} url - الرابط المطلوب فتحه.
 * @param {string} title - عنوان النافذة.
 * @param {number} width - عرض النافذة.
 * @param {number} height - ارتفاع النافذة.
 * @returns {Window | null} مرجع للنافذة المفتوحة.
 */
export const openCenteredPopup = (url, title, width, height) => {
  const left = window.screen.width / 2 - width / 2;
  const top = window.screen.height / 2 - height / 2;
  const options = `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`;
  return window.open(url, title, options);
};