import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Index from "./pages/Index";
import About from "./pages/About";
import Categories from "./pages/Categories";
import StatusCheck from "./pages/StatusCheck";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRegistrations from "./pages/admin/AdminRegistrations";
import AdminPanchayaths from "./pages/admin/AdminPanchayaths";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminRoles from "./pages/admin/AdminRoles";
import NewAdminLogin from "./pages/admin/NewAdminLogin";
import NewAdminDashboard from "./pages/admin/NewAdminDashboard";
import SimpleAdmin from "./pages/admin/SimpleAdmin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  console.log('App component rendering...');
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/status" element={<StatusCheck />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/registrations" element={<AdminRegistrations />} />
                <Route path="/admin/panchayaths" element={<AdminPanchayaths />} />
                <Route path="/admin/categories" element={<AdminCategories />} />
                <Route path="/admin/roles" element={<AdminRoles />} />
                <Route path="/admin/new-login" element={<NewAdminLogin />} />
                <Route path="/admin/new-dashboard" element={<NewAdminDashboard />} />
                <Route path="/admin/simple" element={<SimpleAdmin />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;