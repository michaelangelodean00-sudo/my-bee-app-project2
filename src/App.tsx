import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ContentFilterProvider } from "./contexts/ContentFilterContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SecurityProvider } from "./components/SecurityProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import AccessibilityEnhancements from "./components/AccessibilityEnhancements";
import CopyrightProtection from "./components/CopyrightProtection";
import Index from "./pages/Index";
import Businesses from "./pages/Businesses";
import Events from "./pages/Events";
import Ecommerce from "./pages/Ecommerce";
import Admin from "./pages/Admin";
import ProfileSettings from "./pages/ProfileSettings";
import NotFound from "./pages/NotFound";
import UserProfilePage from "./pages/UserProfilePage";
import Copyright from "./pages/Copyright";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  useEffect(() => {
    // Bee buzz vibration on app launch
    if ('vibrate' in navigator) {
      // Pattern: [vibrate, pause, vibrate, pause, vibrate]
      // Creates a bee-like buzzing effect
      navigator.vibrate([100, 50, 100, 50, 100]);
    }
  }, []);

  return (
  <HelmetProvider>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SecurityProvider>
          <ThemeProvider>
            <NotificationProvider>
              <ContentFilterProvider>
                <BrowserRouter>
                  <CopyrightProtection />
                  <AccessibilityEnhancements />
                  <Toaster 
                    position="bottom-right" 
                    toastOptions={{
                      duration: 4000,
                      style: {
                        background: 'hsl(var(--card))',
                        color: 'hsl(var(--card-foreground))',
                        border: '1px solid hsl(var(--border))',
                      },
                    }}
                  />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/businesses" element={<Businesses />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/ecommerce" element={<Ecommerce />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/settings" element={<ProfileSettings />} />
                    <Route path="/profile" element={<UserProfilePage />} />
                    <Route path="/profile/:id" element={<UserProfilePage />} />
                    <Route path="/copyright" element={<Copyright />} />
                    <Route path="/terms" element={<Copyright />} />
                    <Route path="/privacy" element={<Copyright />} />
                    <Route path="/dmca" element={<Copyright />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </ContentFilterProvider>
            </NotificationProvider>
          </ThemeProvider>
        </SecurityProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </HelmetProvider>
  );
};

export default App;
