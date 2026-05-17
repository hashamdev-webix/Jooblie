import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Users, Eye, Edit, Trash2, Plus, MapPin, X } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";

interface Job {
  id: string;
  recruiter_id: string;
  title: string;
  location: string | null;
  company_name: string | null;
  status: string | null;
  created_at: string | null;
}

interface EditFormData {
  id: string;
  title: string;
  location: string;
  status: string;
}

const formatPostedDate = (dateString: string | null) => {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

const RecruiterJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const [editData, setEditData] = useState<EditFormData | null>(null);

  const fetchMyJobs = async () => {
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      toast.error("You must be logged in");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("jobs")
      .select("id, recruiter_id, title, location, company_name, status, created_at")
      .eq("recruiter_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch jobs error:", error);
      toast.error("Failed to load jobs");
      setLoading(false);
      return;
    }

    setJobs(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const handleDelete = async (jobId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this job?");
    if (!confirmed) return;

    setDeletingId(jobId);

    const { error } = await supabase.from("jobs").delete().eq("id", jobId);

    if (error) {
      console.error("Delete job error:", error);
      toast.error(error.message || "Failed to delete job");
      setDeletingId(null);
      return;
    }

    setJobs((prev) => prev.filter((job) => job.id !== jobId));
    toast.success("Job deleted successfully");
    setDeletingId(null);
  };

  const openEdit = (job: Job) => {
    setEditData({
      id: job.id,
      title: job.title || "",
      location: job.location || "",
      status: job.status || "active",
    });
  };

  const handleUpdate = async () => {
    if (!editData) return;

    if (!editData.title.trim()) {
      toast.error("Job title is required");
      return;
    }

    setUpdating(true);

    const { error } = await supabase
      .from("jobs")
      .update({
        title: editData.title.trim(),
        location: editData.location.trim(),
        status: editData.status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", editData.id);

    if (error) {
      console.error("Update job error:", error);
      toast.error(error.message || "Failed to update job");
      setUpdating(false);
      return;
    }

    setJobs((prev) =>
      prev.map((job) =>
        job.id === editData.id
          ? {
              ...job,
              title: editData.title.trim(),
              location: editData.location.trim(),
              status: editData.status,
            }
          : job,
      ),
    );

    toast.success("Job updated successfully");
    setEditData(null);
    setUpdating(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col items-center mb-8 gap-4 md:flex-row md:justify-between">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold font-display mb-1 text-foreground">
            My Job Posts
          </h1>
          <p className="text-muted-foreground">
            Manage your active job listings.
          </p>
        </div>

        <Link
          to="/recruiter/create-job"
          className="gradient-bg-accent text-accent-foreground px-5 py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <Plus className="w-4 h-4" /> New Job
        </Link>
      </div>

      {loading ? (
        <div className="glow-card p-6 text-center text-muted-foreground">
          Loading jobs...
        </div>
      ) : jobs.length === 0 ? (
        <div className="glow-card p-8 text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            No jobs yet
          </h2>
          <p className="text-muted-foreground mb-4">
            You have not posted any jobs yet.
          </p>
          <Link
            to="/recruiter/create-job"
            className="gradient-bg-accent text-accent-foreground px-5 py-2.5 rounded-lg font-medium text-sm inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Your First Job
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glow-card p-5 flex flex-col md:flex-row md:items-center gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-5 h-5 text-accent" />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{job.title}</h3>
                <p className="text-xs text-muted-foreground">
                  Posted {formatPostedDate(job.created_at)}
                </p>
                {job.location && (
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {job.location}
                  </p>
                )}
              </div>

              <div className="flex gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  0
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  0
                </span>
              </div>

              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  (job.status || "").toLowerCase() === "active"
                    ? "bg-secondary/20 text-secondary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {job.status || "draft"}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(job)}
                  className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(job.id)}
                  disabled={deletingId === job.id}
                  className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-60"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {editData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="glass-card w-full max-w-lg p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-foreground">Edit Job</h2>
              <button
                onClick={() => setEditData(null)}
                className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Job Title
                </label>
                <input
                  value={editData.title}
                  onChange={(e) =>
                    setEditData((prev) =>
                      prev ? { ...prev, title: e.target.value } : prev,
                    )
                  }
                  className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Location
                </label>
                <input
                  value={editData.location}
                  onChange={(e) =>
                    setEditData((prev) =>
                      prev ? { ...prev, location: e.target.value } : prev,
                    )
                  }
                  className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Status
                </label>
                <select
                  value={editData.status}
                  onChange={(e) =>
                    setEditData((prev) =>
                      prev ? { ...prev, status: e.target.value } : prev,
                    )
                  }
                  className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleUpdate}
                  disabled={updating}
                  className="gradient-bg-accent text-accent-foreground px-6 py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-70"
                >
                  {updating ? "Updating..." : "Update Job"}
                </button>

                <button
                  onClick={() => setEditData(null)}
                  className="border border-border text-foreground px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default RecruiterJobs;