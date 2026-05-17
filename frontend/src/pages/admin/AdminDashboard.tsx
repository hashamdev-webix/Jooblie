import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Building2, Users, Briefcase, FileText } from "lucide-react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

interface RecentUser {
  id: string;
  full_name: string | null;
  role: string | null;
  created_at: string | null;
  company_name: string | null;
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return "Unknown";
  return new Date(dateString).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [jobSeekersCount, setJobSeekersCount] = useState(0);
  const [companiesCount, setCompaniesCount] = useState(0);
  const [jobsCount, setJobsCount] = useState(0);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);

      const [
        seekersRes,
        recruitersRes,
        jobsRes,
        applicationsRes,
        recentUsersRes,
      ] = await Promise.all([
        supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .eq("role", "job_seeker"),

        supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .eq("role", "recruiter"),

        supabase
          .from("jobs")
          .select("id", { count: "exact", head: true }),

        supabase
          .from("applications")
          .select("id", { count: "exact", head: true }),

        supabase
          .from("profiles")
          .select("id, full_name, role, created_at, company_name")
          .order("created_at", { ascending: false })
          .limit(6),
      ]);

      if (seekersRes.error) console.error(seekersRes.error);
      if (recruitersRes.error) console.error(recruitersRes.error);
      if (jobsRes.error) console.error(jobsRes.error);
      if (applicationsRes.error) console.error(applicationsRes.error);
      if (recentUsersRes.error) console.error(recentUsersRes.error);

      if (
        seekersRes.error ||
        recruitersRes.error ||
        jobsRes.error ||
        applicationsRes.error ||
        recentUsersRes.error
      ) {
        toast.error("Failed to load admin dashboard");
      }

      setJobSeekersCount(seekersRes.count || 0);
      setCompaniesCount(recruitersRes.count || 0);
      setJobsCount(jobsRes.count || 0);
      setApplicationsCount(applicationsRes.count || 0);
      setRecentUsers(recentUsersRes.data || []);
      setLoading(false);
    };

    fetchAdminData();
  }, []);

  const stats = useMemo(
    () => [
      {
        label: "Companies",
        value: loading ? "..." : String(companiesCount),
        icon: Building2,
      },
      {
        label: "Job Seekers",
        value: loading ? "..." : String(jobSeekersCount),
        icon: Users,
      },
      {
        label: "Jobs",
        value: loading ? "..." : String(jobsCount),
        icon: Briefcase,
      },
      {
        label: "Applications",
        value: loading ? "..." : String(applicationsCount),
        icon: FileText,
      },
    ],
    [loading, companiesCount, jobSeekersCount, jobsCount, applicationsCount]
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl font-bold font-display mb-1 text-foreground text-center">
        Admin Dashboard
      </h1>
      <p className="text-muted-foreground mb-8 text-center">
        Monitor companies, job seekers, jobs, and applications.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glow-card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="w-5 h-5 text-accent" />
            </div>
            <div className="text-2xl font-bold font-display text-foreground">
              {stat.value}
            </div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="glow-card p-6">
        <h2 className="text-lg font-semibold font-display text-foreground mb-4">
          Recent Users
        </h2>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : recentUsers.length === 0 ? (
          <p className="text-sm text-muted-foreground">No users found.</p>
        ) : (
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div>
                  <h3 className="text-sm font-medium text-foreground">
                    {user.full_name || "Unnamed User"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {user.role === "recruiter"
                      ? user.company_name || "Recruiter"
                      : user.role}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                    {user.role || "unknown"}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(user.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminDashboard;