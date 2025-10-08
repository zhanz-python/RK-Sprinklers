// App.jsx
import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";

import FloatingShape from "./components/FloatingShape.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import { Toaster } from "react-hot-toast";

import LoginPage from './pages_temp/LoginPage.jsx';
import SignUpPage from './pages_temp/SignUpPage.jsx';
import EmailVerificationEmailPage from './pages_temp/EmailVerificationEmailPage.jsx';
import DashboardPage from "./pages_temp/DashboardPage.jsx";
import ForgotPasswordPage from "./pages_temp/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages_temp/ResetPasswordPage.jsx";
import HomePage from "./pages_temp/HomePage.jsx";
import AboutUsPage from "./pages_temp/AboutUsPage.jsx";
import ServicesPage from './pages_temp/ServicesPage.jsx';
import CareersPage from './pages_temp/CareersPage.jsx';
import ContactPage from './pages_temp/ContactPage.jsx';
import ApplicationPage from "./pages_temp/ApplicationPage.jsx";
import CalendarPage from "./pages_temp/CalendarPage.jsx";

import { useAuthStore } from "./store/authStore.js";

// ✅ ProtectedRoute: requires login AND verified
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

// ✅ RedirectAfterAuth: prevent logged-in users from accessing auth pages
const RedirectAfterAuth = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated) {
    if (!user?.isVerified) {
      return <Navigate to="/verify-email" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// ✅ VerifyEmailRoute: only for authenticated but unverified users
const VerifyEmailRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.isVerified) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <>
      <div
        className='min-h-screen bg-gradient-to-br
        from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden'
      >
        <FloatingShape color='bg-green-500' size='w-64 h-64' top='-5%' left='10%' delay={0} />
        <FloatingShape color='bg-emerald-500' size='w-48 h-48' top='70%' left='80%' delay={5} />
        <FloatingShape color='bg-lime-500' size='w-32 h-32' top='40%' left='-10%' delay={2} />

        <Routes>
          {/* Public pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/application/:locationCode/:slugAndId" element={<ApplicationPage />} />

          {/* Auth pages */}
          <Route
            path="/signup"
            element={
              <RedirectAfterAuth>
                <SignUpPage />
              </RedirectAfterAuth>
            }
          />
          <Route
            path="/login"
            element={
              <RedirectAfterAuth>
                <LoginPage />
              </RedirectAfterAuth>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <RedirectAfterAuth>
                <ForgotPasswordPage />
              </RedirectAfterAuth>
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              <RedirectAfterAuth>
                <ResetPasswordPage />
              </RedirectAfterAuth>
            }
          />

          {/* Email verification */}
          <Route
            path="/verify-email"
            element={
              <VerifyEmailRoute>
                <EmailVerificationEmailPage />
              </VerifyEmailRoute>
            }
          />

          {/* Protected pages */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <CalendarPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/calendar"
            element={
              <ProtectedRoute>
                {useAuthStore.getState().user?.isAdmin ? (
                  <CalendarPage />
                ) : (
                  <Navigate to="/calendar" replace />
                )}
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Toaster />
      </div>
    </>
  );
}

export default App;
