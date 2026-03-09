import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime"],
  },
  build: {
    // Use esbuild for minification (built-in, faster than terser)
    minify: 'esbuild',
    // Optimize chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React - keep ALL react packages in one chunk to prevent duplicate instances
          if (id.includes('node_modules/react-dom') || 
              id.includes('node_modules/react/') ||
              id.includes('node_modules/react-router')) return 'react-vendor';
          
          // Router - essential for navigation
          if (id.includes('react-router')) return 'router';
          
          // React Query - data fetching
          if (id.includes('@tanstack/react-query')) return 'query';
          
          // UI components - split by usage frequency
          if (id.includes('@radix-ui/react-dialog') || 
              id.includes('@radix-ui/react-dropdown-menu') ||
              id.includes('@radix-ui/react-popover')) return 'ui-core';
          
          if (id.includes('@radix-ui/react-toast') ||
              id.includes('@radix-ui/react-tooltip')) return 'ui-feedback';
          
          if (id.includes('@radix-ui/')) return 'ui-misc';
          
          // Charts - only loaded on analytics pages
          if (id.includes('recharts') || id.includes('d3-')) return 'charts';
          
          // Carousel - only for ad splash
          if (id.includes('embla-carousel')) return 'carousel';
          
          // Utilities
          if (id.includes('date-fns')) return 'date-utils';
          if (id.includes('lucide-react')) return 'icons';
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable source maps for production debugging
    sourcemap: false,
    // Target modern browsers for smaller bundles
    target: 'es2020',
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
    ],
  },
}));
