import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './speech.d.ts'

// Inline CSS with Tailwind utility classes
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  
  /* Tailwind CSS Reset and Base */
  *, *::before, *::after {
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
  }
  
  html {
    line-height: 1.5;
    -webkit-text-size-adjust: 100%;
    tab-size: 4;
    font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  }
  
  body {
    margin: 0;
    line-height: inherit;
  }
  
  /* Tailwind Base Styles */
  h1, h2, h3, h4, h5, h6 {
    font-size: inherit;
    font-weight: inherit;
  }
  
  p {
    margin: 0;
  }
  
  button, input, optgroup, select, textarea {
    font-family: inherit;
    font-size: 100%;
    line-height: inherit;
    color: inherit;
    margin: 0;
    padding: 0;
  }
  
  button {
    background-color: transparent;
    background-image: none;
    cursor: pointer;
  }
  
  button:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
  }
  
  /* Essential Tailwind Utilities */
  .flex { display: flex; }
  .flex-col { flex-direction: column; }
  .flex-row-reverse { flex-direction: row-reverse; }
  .flex-1 { flex: 1 1 0%; }
  .flex-shrink-0 { flex-shrink: 0; }
  
  .items-center { align-items: center; }
  .items-start { align-items: flex-start; }
  .justify-between { justify-content: space-between; }
  
  .h-screen { height: 100vh; }
  .h-4 { height: 1rem; }
  .h-5 { height: 1.25rem; }
  .h-6 { height: 1.5rem; }
  .h-8 { height: 2rem; }
  .w-2 { width: 0.5rem; }
  .w-8 { width: 2rem; }
  .w-full { width: 100%; }
  
  .max-w-xs { max-width: 20rem; }
  .max-w-md { max-width: 28rem; }
  
  .p-1\.5 { padding: 0.375rem; }
  .p-2 { padding: 0.5rem; }
  .p-3 { padding: 0.75rem; }
  .p-4 { padding: 1rem; }
  .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
  .px-4 { padding-left: 1rem; padding-right: 1rem; }
  .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
  .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
  .pr-20 { padding-right: 5rem; }
  
  .mb-1 { margin-bottom: 0.25rem; }
  .mb-3 { margin-bottom: 0.75rem; }
  .mt-1 { margin-top: 0.25rem; }
  
  .space-x-1 > * + * { margin-left: 0.25rem; }
  .space-x-2 > * + * { margin-left: 0.5rem; }
  .space-x-3 > * + * { margin-left: 0.75rem; }
  .space-x-reverse > * + * { margin-left: 0; margin-right: 0.75rem; }
  .space-y-4 > * + * { margin-top: 1rem; }
  
  .overflow-y-auto { overflow-y: auto; }
  .resize-none { resize: none; }
  
  .rounded-full { border-radius: 9999px; }
  .rounded-lg { border-radius: 0.5rem; }
  .rounded-md { border-radius: 0.375rem; }
  
  .border { border-width: 1px; }
  .border-b { border-bottom-width: 1px; }
  .border-t { border-top-width: 1px; }
  
  .bg-white { background-color: rgb(255 255 255); }
  .bg-blue-50 { background-color: rgb(239 246 255); }
  .bg-blue-500 { background-color: rgb(59 130 246); }
  .bg-indigo-100 { background-color: rgb(224 231 255); }
  .bg-green-500 { background-color: rgb(34 197 94); }
  .bg-purple-500 { background-color: rgb(168 85 247); }
  .bg-purple-600 { background-color: rgb(147 51 234); }
  .bg-gray-100 { background-color: rgb(243 244 246); }
  .bg-gray-200 { background-color: rgb(229 231 235); }
  .bg-gray-300 { background-color: rgb(209 213 219); }
  .bg-gray-400 { background-color: rgb(156 163 175); }
  .bg-red-500 { background-color: rgb(239 68 68); }
  .bg-red-600 { background-color: rgb(220 38 38); }
  
  .bg-gradient-to-br { background-image: linear-gradient(to bottom right, var(--tw-gradient-stops)); }
  .bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-stops)); }
  .from-blue-50 { --tw-gradient-from: rgb(239 246 255); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgb(239 246 255 / 0)); }
  .from-blue-500 { --tw-gradient-from: rgb(59 130 246); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgb(59 130 246 / 0)); }
  .to-indigo-100 { --tw-gradient-to: rgb(224 231 255); }
  .to-purple-600 { --tw-gradient-to: rgb(147 51 234); }
  
  .text-white { color: rgb(255 255 255); }
  .text-gray-500 { color: rgb(107 114 128); }
  .text-gray-600 { color: rgb(75 85 99); }
  .text-gray-700 { color: rgb(55 65 81); }
  .text-gray-800 { color: rgb(31 41 55); }
  .text-blue-100 { color: rgb(219 234 254); }
  
  .text-xs { font-size: 0.75rem; line-height: 1rem; }
  .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
  .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
  .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
  
  .font-medium { font-weight: 500; }
  .font-semibold { font-weight: 600; }
  .font-bold { font-weight: 700; }
  
  .shadow-sm { box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
  .shadow-md { box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); }
  .shadow-lg { box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1); }
  
  .border-gray-300 { border-color: rgb(209 213 219); }
  .border-transparent { border-color: transparent; }
  
  .focus\\:ring-2:focus { box-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color); }
  .focus\\:ring-blue-500:focus { --tw-ring-opacity: 1; --tw-ring-color: rgb(59 130 246 / var(--tw-ring-opacity)); }
  .focus\\:border-transparent:focus { border-color: transparent; }
  
  .hover\\:bg-gray-100:hover { background-color: rgb(243 244 246); }
  .hover\\:bg-gray-200:hover { background-color: rgb(229 231 235); }
  .hover\\:bg-blue-600:hover { background-color: rgb(37 99 235); }
  .hover\\:bg-red-600:hover { background-color:
