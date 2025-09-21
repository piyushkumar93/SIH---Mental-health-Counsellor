import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// Apply theme early to avoid flash
;(function applyInitialTheme () {
  try {
    const stored = localStorage.getItem('theme')
    if (stored === 'dark') document.documentElement.classList.add('dark')
    else if (stored === 'light')
      document.documentElement.classList.remove('dark')
    else {
      // follow system preference if no stored value
      const prefersDark =
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) document.documentElement.classList.add('dark')
    }
  } catch (e) {
    // ignore
  }
})()

createRoot(document.getElementById('root')!).render(<App />)
