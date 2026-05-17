import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, FileText, Star, Eye } from "lucide-react";
import Chatbot from "@/components/Chatbot";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

interface RecentApplication {
  id: string;
  created_at: string;
  job: {
    id: string;
    title: string;
    company_name: string | null;
  } | null;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

const DashboardIndex = () => {
  const [loading, setLoading] = useState(true);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [interviewsCount, setInterviewsCount] = useState(0);
  const [savedJobsCount, setSavedJobsCount] = useState(0);
  const [profileViewsCount, setProfileViewsCount] = useState(0);
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error("Please login first");
        setLoading(false);
        return;
      }

      const [
        applicationsCountRes,
        savedJobsRes,
        recentApplicationsRes,
        profileViewsRes,
      ] = await Promise.all([
        supabase
          .from("applications")
          .select("id", { count: "exact", head: true })
          .eq("applicant_id", user.id),

        supabase
          .from("saved_jobs")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id),

        supabase
          .from("applications")
          .select(`
            id,
            created_at,
            jobs (
              id,
              title,
              company_name
            )
          `)
          .eq("applicant_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5),

        supabase
          .from("profile_views")
          .select("id", { count: "exact", head: true })
          .eq("profile_id", user.id),
      ]);

      if (applicationsCountRes.error) {
        console.error("Applications count error:", applicationsCountRes.error);
        toast.error("Failed to load applications count");
      }

      if (savedJobsRes.error) {
        console.error("Saved jobs count error:", savedJobsRes.error);
        toast.error("Failed to load saved jobs count");
      }

      if (recentApplicationsRes.error) {
        console.error("Recent applications error:", recentApplicationsRes.error);
        toast.error("Failed to load recent applications");
      }

      if (profileViewsRes.error) {
        console.error("Profile views error:", profileViewsRes.error);
        toast.error("Failed to load profile views");
      }

      setApplicationsCount(applicationsCountRes.count || 0);
      setSavedJobsCount(savedJobsRes.count || 0);
      setProfileViewsCount(profileViewsRes.count || 0);

      // no status column in applications table yet
      setInterviewsCount(0);

      const formattedRecent = (recentApplicationsRes.data || []).map((item: any) => ({
        id: item.id,
        created_at: item.created_at,
        job: Array.isArray(item.jobs) ? item.jobs[0] : item.jobs,
      }));

      setRecentApplications(formattedRecent);
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  const stats = useMemo(
    () => [
      {
        label: "Applications",
        value: loading ? "..." : String(applicationsCount),
        icon: FileText,
        change: "Total applied",
      },
      {
        label: "Interviews",
        value: loading ? "..." : String(interviewsCount),
        icon: Briefcase,
        change: "Needs status column",
      },
      {
        label: "Saved Jobs",
        value: loading ? "..." : String(savedJobsCount),
        icon: Star,
        change: "Saved for later",
      },
      {
        label: "Profile Views",
        value: loading ? "..." : String(profileViewsCount),
        icon: Eye,
        change: "Total views",
      },
    ],
    [loading, applicationsCount, interviewsCount, savedJobsCount, profileViewsCount]
  );

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 text-foreground text-center">
            Welcome back 👋
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground text-center">
            Here's your job search overview.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glow-card p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <stat.icon className="w-5 h-5 text-primary" />
                <span className="text-xs text-secondary">{stat.change}</span>
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
            Recent Applications
          </h2>

          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : recentApplications.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              You have not applied to any jobs yet.
            </p>
          ) : (
            <div className="space-y-3">
              {recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <h3 className="text-sm font-medium text-foreground">
                      {app.job?.title || "Unknown Job"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {app.job?.company_name || "Unknown Company"}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                      Applied
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(app.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <Chatbot context="dashboard" />
    </div>
  );
};

export default DashboardIndex;