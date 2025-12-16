import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/useAuth";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { CartProvider } from "@/contexts/CartContext";
import { CommunityProvider } from "@/contexts/CommunityContext";
import { WalletProvider } from "@/contexts/WalletContext";
import { AssistantProvider } from "@/contexts/AssistantContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { StudyEarnAssistant } from "@/components/assistant/StudyEarnAssistant";

// Public Pages
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Signup from "./pages/Signup";
import Help from "./pages/Help";
import Legal from "./pages/Legal";
import NotFound from "./pages/NotFound";

// Auth Pages
import Welcome from "./pages/auth/Welcome";
import ChooseRole from "./pages/auth/ChooseRole";
import Login from "./pages/auth/Login";
import ProfileSetup from "./pages/auth/ProfileSetup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import SecuritySettings from "./pages/auth/SecuritySettings";
import PhoneSignup from "./pages/auth/PhoneSignup";
import PhoneLogin from "./pages/auth/PhoneLogin";
import VerifyPhone from "./pages/auth/VerifyPhone";
import TrustedDevices from "./pages/auth/TrustedDevices";
import AuthCallback from "./pages/auth/AuthCallback";

// Learner Pages
import LearnerDashboard from "./pages/learner/LearnerDashboard";
import Modules from "./pages/learner/Modules";
import Wallet from "./pages/learner/Wallet";
import Marketplace from "./pages/learner/Marketplace";
import Community from "./pages/learner/Community";
import Referral from "./pages/learner/Referral";
import Profile from "./pages/learner/Profile";
import Settings from "./pages/learner/Settings";
import Checkout from "./pages/learner/Checkout";
// Instructor Pages
import InstructorDashboard from "./pages/instructor/InstructorDashboard";

// Institution Pages
import InstitutionDashboard from "./pages/institution/InstitutionDashboard";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <CartProvider>
              <WalletProvider>
                <AssistantProvider>
                  <LanguageProvider>
                    <CommunityProvider>
                      <StudyEarnAssistant />
                      <Routes>
                  {/* Root & Public Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/landing" element={<Landing />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/help" element={<Help />} />
                  <Route path="/legal" element={<Legal />} />
                  
                  {/* Auth Routes */}
                  <Route path="/welcome" element={<Welcome />} />
                  <Route path="/choose-role" element={<ChooseRole />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/phone-signup" element={<PhoneSignup />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/phone-login" element={<PhoneLogin />} />
                  <Route path="/verify-phone" element={<VerifyPhone />} />
                  <Route path="/verify-phone-login" element={<VerifyPhone />} />
                  <Route path="/profile-setup" element={<ProfileSetup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route 
                    path="/security-settings" 
                    element={
                      <ProtectedRoute>
                        <SecuritySettings />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/trusted-devices" 
                    element={
                      <ProtectedRoute>
                        <TrustedDevices />
                      </ProtectedRoute>
                    } 
                  />

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
                  <Route
                    path="/learner/marketplace"
                    element={
                      <ProtectedRoute allowedRoles={['learner']}>
                        <Marketplace />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/learner/community"
                    element={
                      <ProtectedRoute allowedRoles={['learner']}>
                        <Community />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/learner/referral"
                    element={
                      <ProtectedRoute allowedRoles={['learner']}>
                        <Referral />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/learner/profile"
                    element={
                      <ProtectedRoute allowedRoles={['learner']}>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/learner/settings"
                    element={
                      <ProtectedRoute allowedRoles={['learner']}>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/learner/checkout"
                    element={
                      <ProtectedRoute allowedRoles={['learner']}>
                        <Checkout />
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

                      <Route path="*" element={<NotFound />} />
                      </Routes>
                    </CommunityProvider>
                  </LanguageProvider>
                </AssistantProvider>
              </WalletProvider>
            </CartProvider>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
