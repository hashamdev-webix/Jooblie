import { useEffect, useState } from "react";
import { Briefcase, MapPin, DollarSign } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface Job {
  id: string;
  title: string;
  company_name: string | null;
  location: string | null;
  salary_min: string | null;
  salary_max: string | null;
  salary_currency: string | null;
  status: string | null;
  created_at: string | null;
}

const AdminJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("jobs")
        .select("id, title, company_name, location, salary_min, salary_max, salary_currency, status, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        toast.error("Failed to load jobs");
      } else {
        setJobs(data || []);
      }

      setLoading(false);
    };

    fetchJobs();
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl font-bold font-display mb-1 text-foreground">Jobs</h1>
      <p className="text-muted-foreground mb-8">All jobs posted on the platform.</p>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : jobs.length === 0 ? (
        <p className="text-muted-foreground">No jobs found.</p>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="glow-card p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-accent" />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{job.title}</h3>
                  <p className="text-sm text-muted-foreground">{job.company_name || "Unknown Company"}</p>

                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {job.location || "No location"}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {job.salary_currency || "$"}
                      {job.salary_min || "0"} - {job.salary_currency || "$"}
                      {job.salary_max || "0"}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs">
                      {job.status || "unknown"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default AdminJobs;