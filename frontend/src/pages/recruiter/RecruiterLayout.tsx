import { NavLink, Outlet, Navigate } from "react-router-dom";
import { LayoutDashboard, Briefcase, PlusCircle, Building2, LogOut, X, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

const sidebarLinks = [
  { label: "Dashboard", href: "/recruiter/dashboard", icon: LayoutDashboard },
  { label: "My Jobs", href: "/recruiter/jobs", icon: Briefcase },
  { label: "Post a Job", href: "/recruiter/create-job", icon: PlusCircle },
  { label: "Company", href: "/recruiter/company", icon: Building2 },
];

const RecruiterLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Job seeker accidentally on recruiter dashboard → redirect
  if (role === "job_seeker") {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      {/* Sidebar */}
      <>
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside className={`w-64 border-r border-border bg-card flex flex-col fixed top-0 left-0 bottom-0 z-40 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:z-auto`}>
          <div className="p-4 border-b border-border flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Recruiter</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 p-3 space-y-1 overflow-y-auto mt-4">
            {sidebarLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`
                }
              >
                <link.icon className="w-4 h-4 flex-shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="p-3 border-t border-border">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>
      </>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-50 p-2.5 rounded-lg bg-card border border-border text-foreground hover:bg-muted transition-colors shadow-lg md:hidden"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Main Content */}
      <main className="flex-1 min-h-screen md:ml-64 transition-all duration-300">
        <div className="p-4 sm:p-6 md:p-8 min-h-screen pt-20 md:pt-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default RecruiterLayout;
