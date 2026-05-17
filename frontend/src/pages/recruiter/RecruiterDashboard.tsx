import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Users, Eye, TrendingUp } from "lucide-react";
import Chatbot from "@/components/Chatbot";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

interface ApplicantRow {
  id: string;
  applicant_id: string;
  created_at: string;
  jobs: {
    id: string;
    title: string;
  } | null;
}

interface ApplicantProfile {
  id: string;
  full_name: string | null;
}

const RecruiterDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [activeJobsCount, setActiveJobsCount] = useState(0);
  const [totalApplicantsCount, setTotalApplicantsCount] = useState(0);
  const [jobViewsCount, setJobViewsCount] = useState(0);
  const [hireRate, setHireRate] = useState("0%");
  const [recentApplicants, setRecentApplicants] = useState<
    { id: string; name: string; role: string; status: string }[]
  >([]);

  useEffect(() => {
    const fetchRecruiterDashboard = async () => {
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

      const [jobsCountRes, recruiterJobsRes] = await Promise.all([
        supabase
          .from("jobs")
          .select("id", { count: "exact", head: true })
          .eq("recruiter_id", user.id)
          .eq("status", "active"),

        supabase
          .from("jobs")
          .select("id")
          .eq("recruiter_id", user.id),
      ]);

      if (jobsCountRes.error) {
        console.error("Active jobs count error:", jobsCountRes.error);
        toast.error("Failed to load active jobs");
      }

      if (recruiterJobsRes.error) {
        console.error("Recruiter jobs error:", recruiterJobsRes.error);
        toast.error("Failed to load recruiter jobs");
        setLoading(false);
        return;
      }

      const recruiterJobIds = (recruiterJobsRes.data || []).map((job) => job.id);

      setActiveJobsCount(jobsCountRes.count || 0);

      if (recruiterJobIds.length === 0) {
        setTotalApplicantsCount(0);
        setRecentApplicants([]);
        setJobViewsCount(0);
        setHireRate("0%");
        setLoading(false);
        return;
      }

      const { data: applicationsData, error: applicationsError } = await supabase
        .from("applications")
        .select(`
          id,
          applicant_id,
          created_at,
          jobs (
            id,
            title
          )
        `)
        .in("job_id", recruiterJobIds)
        .order("created_at", { ascending: false });

      if (applicationsError) {
        console.error("Applications fetch error:", applicationsError);
        toast.error("Failed to load applicants");
        setLoading(false);
        return;
      }

      const typedApplications: ApplicantRow[] = (applicationsData || []).map((item: any) => ({
        id: item.id,
        applicant_id: item.applicant_id,
        created_at: item.created_at,
        jobs: Array.isArray(item.jobs) ? item.jobs[0] : item.jobs,
      }));

      setTotalApplicantsCount(typedApplications.length);

      const uniqueApplicantIds = Array.from(
        new Set(typedApplications.map((item) => item.applicant_id))
      );

      let applicantProfiles: ApplicantProfile[] = [];

      if (uniqueApplicantIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", uniqueApplicantIds);

        if (profilesError) {
          console.error("Applicant profiles error:", profilesError);
        } else {
          applicantProfiles = profilesData || [];
        }
      }

      const profileMap = new Map(
        applicantProfiles.map((profile) => [profile.id, profile.full_name || "Unknown Applicant"])
      );

      const recent = typedApplications.slice(0, 5).map((app) => ({
        id: app.id,
        name: profileMap.get(app.applicant_id) || "Unknown Applicant",
        role: app.jobs?.title || "Unknown Job",
        status: "Applied",
      }));

      setRecentApplicants(recent);

      // current schema has no job views tracking or hiring status tracking
      setJobViewsCount(0);
      setHireRate("0%");

      setLoading(false);
    };

    fetchRecruiterDashboard();
  }, []);

  const stats = useMemo(
    () => [
      {
        label: "Active Jobs",
        value: loading ? "..." : String(activeJobsCount),
        icon: Briefcase,
        change: "Currently active",
      },
      {
        label: "Total Applicants",
        value: loading ? "..." : String(totalApplicantsCount),
        icon: Users,
        change: "Across all jobs",
      },
      {
        label: "Job Views",
        value: loading ? "..." : String(jobViewsCount),
        icon: Eye,
        change: "Tracking not added",
      },
      {
        label: "Hire Rate",
        value: loading ? "..." : hireRate,
        icon: TrendingUp,
        change: "Hiring status not added",
      },
    ],
    [loading, activeJobsCount, totalApplicantsCount, jobViewsCount, hireRate]
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl font-bold font-display mb-1 text-foreground text-center">
        Recruiter Dashboard
      </h1>
      <p className="text-muted-foreground mb-8 text-center">
        Manage your hiring pipeline efficiently.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glow-card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="w-5 h-5 text-accent" />
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
          Recent Applicants
        </h2>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : recentApplicants.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No applicants yet for your jobs.
          </p>
        ) : (
          <div className="space-y-3">
            {recentApplicants.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full gradient-bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                    {a.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground">{a.name}</h3>
                    <p className="text-xs text-muted-foreground">{a.role}</p>
                  </div>
                </div>

                <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <Chatbot context="recruiter" />
    </motion.div>
  );
};

export default RecruiterDashboard;