import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

 const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  setLoading(true);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log("auth data", data);

  if (error) {
    setLoading(false);
    alert(error.message);
    return;
  }

  const user = data.user;

  const { data: existingProfile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  console.log("existingProfile", existingProfile);
  console.log("profileError", profileError);

  if (profileError) {
    console.error("Profile check error:", profileError);
    setLoading(false);
    alert(profileError.message || "Error checking profile.");
    return;
  }

  if (!existingProfile) {
    const role =
      user.user_metadata?.role === "admin"
        ? "admin"
        : user.user_metadata?.role === "recruiter"
        ? "recruiter"
        : "job_seeker";

    const { error: insertError } = await supabase.from("profiles").insert({
      id: user.id,
      role,
      full_name: user.user_metadata?.full_name || "User",
      company_name:
        role === "recruiter"
          ? user.user_metadata?.company_name || null
          : null,
    });

    if (insertError) {
      console.error("Insert profile error:", insertError);
      setLoading(false);
      alert(insertError.message || "Failed to create profile.");
      return;
    }
  }

  const { data: profile, error: roleError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  console.log("role profile", profile);
  console.log("role error", roleError);

  if (roleError) {
    console.error("Role fetch error:", roleError);
    setLoading(false);
    alert(roleError.message || "Failed to get profile role.");
    return;
  }

  setLoading(false);

  if (profile?.role === "admin") {
    navigate("/admin");
  } else if (profile?.role === "recruiter") {
    navigate("/recruiter/dashboard");
  } else {
    navigate("/dashboard");
  }
};
  return (
    <div className="min-h-screen bg-background overflow-hidden mt-10">
      <Navbar />
      <div className="relative w-full h-screen flex items-center justify-center px-4 sm:px-6">
        {/* Floating Orbs */}
        <div className="floating-orb w-80 h-80 bg-primary absolute -top-10 -right-10 animate-pulse-glow" />
        <div className="floating-orb w-64 h-64 bg-secondary absolute bottom-10 -left-10 animate-pulse-glow" />

        {/* Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card w-full max-w-md p-6 md:p-10 mx-4 relative z-10"
          style={{ marginTop: "5vh", marginBottom: "5vh" }} // ✅ Add vertical breathing space
        >
          <div className="text-center mb-6 md:mb-8">
            <div className="w-12 h-12 rounded-xl gradient-bg-primary flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold font-display text-foreground">
              Welcome Back
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Sign in to your Jooblie account
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

          <div>
  <label className="text-sm font-medium text-foreground mb-1.5 block">
    Password
  </label>

  {/* Input Wrapper */}
  <div className="relative">
    {/* Lock Icon */}
    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

    {/* Input */}
    <input
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="••••••••"
      className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
    />

    {/* Eye Icon */}
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

  {/* Forgot Password BELOW input */}
  <div className="text-right mt-1">
    <Link
      to="/forgot-password"
      className="text-sm text-primary hover:underline"
    >
      Forgot Password?
    </Link>
  </div>
</div>

            <button
              disabled={loading}
              className="w-full gradient-bg-primary text-primary-foreground py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
