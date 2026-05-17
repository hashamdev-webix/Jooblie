import { useEffect, useState } from "react";
import { User, MapPin, Briefcase } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface JobSeeker {
  id: string;
  full_name: string | null;
  location: string | null;
  job_title: string | null;
  skills: string | null;
  created_at: string | null;
}

const AdminJobSeekers = () => {
  const [jobSeekers, setJobSeekers] = useState<JobSeeker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeekers = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, location, job_title, skills, created_at")
        .eq("role", "job_seeker")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        toast.error("Failed to load job seekers");
      } else {
        setJobSeekers(data || []);
      }

      setLoading(false);
    };

    fetchSeekers();
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl font-bold font-display mb-1 text-foreground">Job Seekers</h1>
      <p className="text-muted-foreground mb-8">All job seekers on the platform.</p>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : jobSeekers.length === 0 ? (
        <p className="text-muted-foreground">No job seekers found.</p>
      ) : (
        <div className="space-y-4">
          {jobSeekers.map((seeker) => (
            <div key={seeker.id} className="glow-card p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    {seeker.full_name || "Unnamed User"}
                  </h3>

                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {seeker.location || "No location"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      {seeker.job_title || "No title"}
                    </span>
                  </div>

                  {seeker.skills && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Skills: {seeker.skills}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default AdminJobSeekers;