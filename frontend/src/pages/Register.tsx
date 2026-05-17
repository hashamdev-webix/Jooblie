import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"job_seeker" | "recruiter">("job_seeker");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      alert("Please fill all required fields.");
      return;
    }

    if (role === "recruiter" && !companyName.trim()) {
      alert("Company name is required for recruiters.");
      return;
    }

    setLoading(true);

    try {
      const metadata = {
        full_name: fullName.trim(),
        role,
        company_name: role === "recruiter" ? companyName.trim() : null,
      };

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: metadata },
      });

      if (error) {
        if (error.message.toLowerCase().includes("rate limit")) {
          alert("Too many signup attempts. Please wait a few minutes.");
        } else if (error.message.toLowerCase().includes("already")) {
          alert("An account with this email already exists.");
        } else {
          alert(error.message);
        }
        return;
      }

      if (!data.session) {
        alert(
          "Account created successfully! Please check your email to confirm your account before logging in.",
        );
        return;
      }

      navigate(role === "recruiter" ? "/recruiter/dashboard" : "/dashboard");
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar />
      <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Floating Orbs */}
        <div className="floating-orb w-80 h-80 bg-secondary absolute -top-10 -left-10 animate-pulse-glow" />
        <div className="floating-orb w-64 h-64 bg-accent absolute bottom-10 -right-10 animate-pulse-glow" />

        {/* Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card w-full max-w-md mx-4 p-4 md:p-6 relative z-10"
        >
          <div className="text-center mb-4">
            <div className="w-10 h-10 rounded-xl gradient-bg-primary flex items-center justify-center mx-auto mb-3">
              <Briefcase className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold font-display text-foreground">
              Create Account
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Join Jooblie and start your journey
            </p>
          </div>

          <form className="space-y-3" onSubmit={handleRegister}>
            <div className="flex rounded-lg bg-muted p-1 gap-1 mb-2">
              <button
                type="button"
                onClick={() => setRole("job_seeker")}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                  role === "job_seeker"
                    ? "gradient-bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Job Seeker
              </button>
              <button
                type="button"
                onClick={() => setRole("recruiter")}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                  role === "recruiter"
                    ? "gradient-bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Recruiter
              </button>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            {role === "recruiter" && (
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Your Company"
                  className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full gradient-bg-primary text-primary-foreground py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
