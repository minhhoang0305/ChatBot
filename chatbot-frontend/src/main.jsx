// Import React's StrictMode - Development tool để phát hiện lỗi
import { StrictMode } from 'react'

// Import createRoot để mount React app vào DOM
import { createRoot } from 'react-dom/client'

// Import global CSS styles
import './index.css'

// Import App component chính
import App from './App.jsx'

/**
 * Khởi tạo React application
 * 
 * Giải thích:
 * 1. createRoot() - Tạo React root element
 * 2. document.getElementById('root') - Tìm <div id="root"></div> trong HTML
 * 3. .render() - Render App component vào root element
 * 4. <StrictMode> - Wrapper để development warnings
 */
createRoot(document.getElementById('root')).render(
  // StrictMode giúp phát hiện side effects và deprecated APIs
  <StrictMode>
    {/* Component chính ứng dụng */}
    <App />
  </StrictMode>,
)
