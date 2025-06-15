
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AuthForm from "@/components/auth/AuthForm";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import CoachDashboard from "@/pages/coach/CoachDashboard";
import ClientDashboard from "@/pages/client/ClientDashboard";
import Index from "@/pages/Index";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <DashboardLayout>{children}</DashboardLayout>;
};

const DashboardRouter = () => {
  const { profile } = useAuth();
  
  if (!profile) return null;
  
  switch (profile.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'coach':
      return <CoachDashboard />;
    case 'client':
      return <ClientDashboard />;
    default:
      return <Navigate to="/" replace />;
  }
};

const AuthenticatedRedirect = () => {
  const { user, profile, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (user && profile) {
    switch (profile.role) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'coach':
        return <Navigate to="/coach" replace />;
      case 'client':
        return <Navigate to="/client" replace />;
      default:
        return <Index />;
    }
  }
  
  return <Index />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AuthenticatedRedirect />} />
            <Route path="/auth" element={<AuthForm />} />
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/coach/*" 
              element={
                <ProtectedRoute>
                  <CoachDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/client/*" 
              element={
                <ProtectedRoute>
                  <ClientDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
