import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ContentFilterProvider } from "./contexts/ContentFilterContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SecurityProvider } from "./components/SecurityProvider";
import { AuthProvider } from "./hooks/useAuth";
import ErrorBoundary from "./components/ErrorBoundary";
import AccessibilityEnhancements from "./components/AccessibilityEnhancements";
import PageLoader from "./components/PageLoader";
import ProtectedRoute from "./components/ProtectedRoute";
import IdlePrefetcher from "./components/IdlePrefetcher";

// Eagerly import Index (home page) so it renders instantly without Suspense delay
import Index from "./pages/Index";
import Auth from "./pages/Auth";

// Lazy load all other pages for code splitting
const Businesses = lazy(() => import("./pages/Businesses"));
const Events = lazy(() => import("./pages/Events"));
const Ecommerce = lazy(() => import("./pages/Ecommerce"));
const Admin = lazy(() => import("./pages/Admin"));
const ProfileSettings = lazy(() => import("./pages/ProfileSettings"));
const NotFound = lazy(() => import("./pages/NotFound"));
const UserProfilePage = lazy(() => import("./pages/UserProfilePage"));
const Copyright = lazy(() => import("./pages/Copyright"));
const VideoUpload = lazy(() => import("./pages/VideoUpload"));
const CustomerAnalytics = lazy(() => import("./pages/CustomerAnalytics"));
const OAuthConsent = lazy(() => import("./pages/OAuthConsent"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,                          // Reduce retry overhead
      retryDelay: 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      staleTime: 5 * 60 * 1000,         // 5 minutes cache
      gcTime: 10 * 60 * 1000,           // 10 minutes garbage collection
      networkMode: 'offlineFirst',       // Serve cached data instantly offline
    },
  },
});

const App = () => {
  // Removed auto-vibrate on load - it's blocked without user interaction
  // and can cause issues on some browsers

  return (
  <HelmetProvider>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SecurityProvider>
          <ThemeProvider>
            <AuthProvider>
            <NotificationProvider>
              <ContentFilterProvider>
                <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                  <AccessibilityEnhancements />
                  <IdlePrefetcher />
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
                  <Suspense fallback={<PageLoader type="full" message="Loading B.E.E App..." />}>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/businesses" element={<Businesses />} />
                      <Route path="/events" element={<Events />} />
                      <Route path="/ecommerce" element={<Ecommerce />} />
                      <Route path="/admin" element={<ProtectedRoute requireRole="admin"><Admin /></ProtectedRoute>} />
                      <Route path="/settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
                      <Route path="/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
                      <Route path="/profile/:id" element={<UserProfilePage />} />
                      <Route path="/upload-video" element={<ProtectedRoute><VideoUpload /></ProtectedRoute>} />
                      <Route path="/copyright" element={<Copyright />} />
                      <Route path="/terms" element={<Copyright />} />
                      <Route path="/privacy" element={<Copyright />} />
                      <Route path="/dmca" element={<Copyright />} />
                      <Route path="/customer-analytics" element={<ProtectedRoute><CustomerAnalytics /></ProtectedRoute>} />
                      <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </BrowserRouter>
              </ContentFilterProvider>
            </NotificationProvider>
            </AuthProvider>
          </ThemeProvider>
        </SecurityProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </HelmetProvider>
  );
};

export default App;
