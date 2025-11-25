import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Public Pages
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Signup from "./pages/Signup";
import Help from "./pages/Help";
import Legal from "./pages/Legal";
import NotFound from "./pages/NotFound";

// Learner Pages
import LearnerDashboard from "./pages/learner/LearnerDashboard";
import Modules from "./pages/learner/Modules";
import Wallet from "./pages/learner/Wallet";

// Instructor Pages
import InstructorDashboard from "./pages/instructor/InstructorDashboard";

// Institution Pages
import InstitutionDashboard from "./pages/institution/InstitutionDashboard";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Root & Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/help" element={<Help />} />
            <Route path="/legal" element={<Legal />} />

            {/* Learner Routes */}
            <Route
              path="/learner/dashboard"
              element={
                <ProtectedRoute allowedRoles={['learner']}>
                  <LearnerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/learner/modules"
              element={
                <ProtectedRoute allowedRoles={['learner']}>
                  <Modules />
                </ProtectedRoute>
              }
            />
            <Route
              path="/learner/wallet"
              element={
                <ProtectedRoute allowedRoles={['learner']}>
                  <Wallet />
                </ProtectedRoute>
              }
            />

            {/* Instructor Routes */}
            <Route
              path="/instructor/dashboard"
              element={
                <ProtectedRoute allowedRoles={['instructor']}>
                  <InstructorDashboard />
                </ProtectedRoute>
              }
            />

            {/* Institution Routes */}
            <Route
              path="/institution/dashboard"
              element={
                <ProtectedRoute allowedRoles={['institution']}>
                  <InstitutionDashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
