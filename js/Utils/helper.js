// ============================================================
// js/Utils/helper.js — Utility Functions
// ============================================================

/**
 * Escapes HTML entities to prevent XSS
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Copies text to clipboard and returns a promise
 */
function copyToClipboard(text) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  // Fallback for older browsers
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  return Promise.resolve();
}

/**
 * Formats file size from bytes to human readable
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Generates a unique ID
 */
function generateId() {
  return 'id-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
}

/**
 * Debounce function for search input
 */
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * Scrolls an element to its bottom
 */
function scrollToBottom(element) {
  if (element) {
    element.scrollTop = element.scrollHeight;
  }
}

/**
 * Shows a temporary feedback tooltip on a button
 */
function showCopyFeedback(button, text) {
  const existing = button.querySelector('.copy_feedback');
  if (existing) {
    existing.textContent = text;
    existing.classList.add('is-visible');
    setTimeout(() => existing.classList.remove('is-visible'), 1500);
    return;
  }
  const feedback = document.createElement('span');
  feedback.className = 'copy_feedback is-visible';
  feedback.textContent = text;
  button.appendChild(feedback);
  setTimeout(() => feedback.classList.remove('is-visible'), 1500);
  setTimeout(() => feedback.remove(), 2000);
}
