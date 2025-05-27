
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Index from "./pages/Index";
import Businesses from "./pages/Businesses";
import Events from "./pages/Events";
import Ecommerce from "./pages/Ecommerce";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Toaster position="bottom-right" />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/businesses" element={<Businesses />} />
        <Route path="/events" element={<Events />} />
        <Route path="/ecommerce" element={<Ecommerce />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/settings" element={<Index />} />
        <Route path="/profile" element={<Index />} />
        <Route path="/profile/:id" element={<Index />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
