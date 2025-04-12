
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Businesses from "./pages/Businesses";
import Events from "./pages/Events";
import Ecommerce from "./pages/Ecommerce";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/businesses" element={<Businesses />} />
          <Route path="/events" element={<Events />} />
          <Route path="/ecommerce" element={<Ecommerce />} />
          <Route path="/friends" element={<Index />} />
          <Route path="/messages" element={<Index />} />
          <Route path="/notifications" element={<Index />} />
          <Route path="/saved" element={<Index />} />
          <Route path="/photos" element={<Index />} />
          <Route path="/settings" element={<Index />} />
          <Route path="/profile" element={<Index />} />
          <Route path="/profile/:id" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
