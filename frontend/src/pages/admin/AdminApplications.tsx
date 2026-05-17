import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface ApplicationRow {
  id: string;
  applicant_id: string;
  created_at: string;
  jobs: {
    title: string;
    company_name: string | null;
  } | null;
}

interface ApplicantProfile {
  id: string;
  full_name: string | null;
}

const AdminApplications = () => {
  const [applications, setApplications] = useState<
    { id: string; applicantName: string; jobTitle: string; companyName: string; createdAt: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("applications")
        .select(`
          id,
          applicant_id,
          created_at,
          jobs (
            title,
            company_name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        toast.error("Failed to load applications");
        setLoading(false);
        return;
      }

      const typedData: ApplicationRow[] = (data || []).map((item: any) => ({
        id: item.id,
        applicant_id: item.applicant_id,
        created_at: item.created_at,
        jobs: Array.isArray(item.jobs) ? item.jobs[0] : item.jobs,
      }));

      const applicantIds = Array.from(new Set(typedData.map((a) => a.applicant_id)));

      let profiles: ApplicantProfile[] = [];
      if (applicantIds.length > 0) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", applicantIds);

        profiles = profileData || [];
      }

      const profileMap = new Map(
        profiles.map((p) => [p.id, p.full_name || "Unknown Applicant"])
      );

      setApplications(
        typedData.map((app) => ({
          id: app.id,
          applicantName: profileMap.get(app.applicant_id) || "Unknown Applicant",
          jobTitle: app.jobs?.title || "Unknown Job",
          companyName: app.jobs?.company_name || "Unknown Company",
          createdAt: new Date(app.created_at).toLocaleDateString(),
        }))
      );

      setLoading(false);
    };

    fetchApplications();
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl font-bold font-display mb-1 text-foreground">Applications</h1>
      <p className="text-muted-foreground mb-8">All submitted applications.</p>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : applications.length === 0 ? (
        <p className="text-muted-foreground">No applications found.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="glow-card p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{app.applicantName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {app.jobTitle} at {app.companyName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Applied on {app.createdAt}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default AdminApplications;