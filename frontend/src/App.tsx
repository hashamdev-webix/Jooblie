import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Pricing from "./pages/Pricing";
import Companies from "./pages/Companies";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";

import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardIndex from "./pages/dashboard/DashboardIndex";
import Applications from "./pages/dashboard/Applications";
import Recommendations from "./pages/dashboard/Recommendations";
import Profile from "./pages/dashboard/Profile";
import Resume from "./pages/dashboard/Resume";

import RecruiterLayout from "./pages/recruiter/RecruiterLayout";
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import RecruiterJobs from "./pages/recruiter/RecruiterJobs";
import CreateJob from "./pages/recruiter/CreateJob";
import CompanyPage from "./pages/recruiter/CompanyPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCompanies from "./pages/admin/AdminCompanies";
import AdminJobSeekers from "./pages/admin/AdminJobSeekers";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminApplications from "./pages/admin/AdminApplications";
import NotFound from "./pages/NotFound";
import { Toaster } from "react-hot-toast";
import SavedJobs from "./pages/dashboard/SavedJobs";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
      <TooltipProvider>
        {/* ✅ ONLY ONE TOAST */}
        <Sonner position="top-right" richColors />
<Toaster/>
        <BrowserRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
             <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />

            {/* Job Seeker Dashboard */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardIndex />} />
              <Route path="applications" element={<Applications />} />
              <Route path="saved" element={<SavedJobs />} />
              <Route path="recommendations" element={<Recommendations />} />
              <Route path="profile" element={<Profile />} />
              <Route path="resume" element={<Resume />} />
            </Route>

              {/* Recruiter Dashboard */}
              <Route path="/recruiter" element={<RecruiterLayout />}>
                <Route path="dashboard" element={<RecruiterDashboard />} />
                <Route path="jobs" element={<RecruiterJobs />} />
                <Route path="create-job" element={<CreateJob />} />
                <Route path="company" element={<CompanyPage />} />
              </Route>

              {/* Admin Dashboard */}
              <Route path="/admin" element={<AdminLayout />}>
  <Route index element={<AdminDashboard />} />
  <Route path="companies" element={<AdminCompanies />} />
  <Route path="job-seekers" element={<AdminJobSeekers />} />
  <Route path="jobs" element={<AdminJobs />} />
  <Route path="applications" element={<AdminApplications />} />
</Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
