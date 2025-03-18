
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import FormPage from "./pages/FormPage";
import SubmissionSuccess from "./pages/SubmissionSuccess";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Leads from "./pages/admin/Leads";
import LeadDetails from "./pages/admin/LeadDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('adminToken') !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/form" element={<FormPage />} />
          <Route path="/success" element={<SubmissionSuccess />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/dashboard" element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          } />
          <Route path="/admin/leads" element={
            <AdminRoute>
              <Leads />
            </AdminRoute>
          } />
          <Route path="/admin/leads/:id" element={
            <AdminRoute>
              <LeadDetails />
            </AdminRoute>
          } />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
