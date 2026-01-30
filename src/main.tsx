import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { prefetchCriticalRoutes } from './hooks/usePrefetch'

createRoot(document.getElementById("root")!).render(<App />);

// Prefetch critical routes after initial render
prefetchCriticalRoutes();
