import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  DollarSign,
  Clock,
  Briefcase,
  Building2,
  ArrowLeft,
  Share2,
  Heart,
} from "lucide-react";


import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import Chatbot from "@/components/Chatbot";
import { supabase } from "@/lib/supabase";

interface Job {
  id: string;
  title: string;
  company_name: string | null;
  location: string | null;
  job_type: string | null;
  salary_min: string | null;
  salary_max: string | null;
  salary_currency: string | null;
  created_at: string | null;
  skills: string[] | null;
  description: string | null;
  requirements: string | null;
  status: string | null;
}

const formatPostedDate = (dateString: string | null) => {
  if (!dateString) return "Recently";
  const now = new Date();
  const posted = new Date(dateString);
  const diffMs = now.getTime() - posted.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  return posted.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

const formatSalary = (job: Job) => {
  const currency = job.salary_currency || "$";
  if (job.salary_min && job.salary_max) {
    return `${currency}${job.salary_min} - ${currency}${job.salary_max}`;
  }
  if (job.salary_min) return `${currency}${job.salary_min}`;
  if (job.salary_max) return `${currency}${job.salary_max}`;
  return "Not specified";
};

const parseRequirements = (requirements: string | null) => {
  if (!requirements) return [];
  return requirements
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
};

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [saved, setSaved] = useState(false);
const navigate = useNavigate();
const [applying, setApplying] = useState(false);
const [applied, setApplied] = useState(false);
useEffect(() => {
  const checkIfApplied = async () => {
    if (!id) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("applications")
      .select("id")
      .eq("job_id", id)
      .eq("applicant_id", user.id)
      .maybeSingle();

    if (!error && data) {
      setApplied(true);
    }
  };

  checkIfApplied();
}, [id]);

const handleApplyNow = async () => {
  if (!id) return;

  setApplying(true);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    toast.error("Please login first to apply");
    navigate("/login");
    setApplying(false);
    return;
  }

  // get applicant profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("resume_path")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Profile fetch error:", profileError);
    toast.error("Could not fetch profile");
    setApplying(false);
    return;
  }

  if (!profile?.resume_path) {
    toast.error("Please upload your resume first");
    setApplying(false);
    return;
  }

  const { error } = await supabase.from("applications").insert({
    job_id: id,
    applicant_id: user.id,
    resume_url: profile.resume_path,
  });

  if (error) {
    console.error("Apply error:", error);
    toast.error(error.message || "Failed to apply");
    setApplying(false);
    return;
  }

  setApplied(true);
  toast.success("Applied successfully");
  setApplying(false);
};

useEffect(() => {
  const checkSavedStatus = async () => {
    if (!id) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("saved_jobs")
      .select("id")
      .eq("user_id", user.id)
      .eq("job_id", id)
      .maybeSingle();

    if (!error && data) {
      setSaved(true);
    }
  };

  checkSavedStatus();
}, [id]);
const handleSaveJob = async () => {
  if (!id) return;

  setSaving(true);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    toast.error("Please login to save jobs");
    setSaving(false);
    return;
  }

  if (saved) {
    const { error } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("user_id", user.id)
      .eq("job_id", id);

    if (error) {
      toast.error("Failed to remove saved job");
      setSaving(false);
      return;
    }

    setSaved(false);
    toast.success("Job removed from saved");
    setSaving(false);
    return;
  }

  const { error } = await supabase.from("saved_jobs").insert({
    user_id: user.id,
    job_id: id,
  });

  if (error) {
    if (error.code === "23505") {
      setSaved(true);
      toast.success("Job already saved");
    } else {
      toast.error(error.message || "Failed to save job");
    }
    setSaving(false);
    return;
  }

  setSaved(true);
  toast.success("Job saved successfully");
  setSaving(false);
};
  useEffect(() => {
    const fetchJob = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      setLoading(true);

      const { data, error } = await supabase
        .from("jobs")
        .select(
          "id, title, company_name, location, job_type, salary_min, salary_max, salary_currency, created_at, skills, description, requirements, status"
        )
        .eq("id", id)
        .eq("status", "active")
        .maybeSingle();

      if (error) {
        console.error("Fetch job detail error:", error);
        setJob(null);
        setLoading(false);
        return;
      }

      setJob(data || null);
      setLoading(false);
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-28 pb-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="glass-card p-8 text-center">
              <h2 className="text-xl font-semibold text-foreground mb-2">Loading job...</h2>
              <p className="text-muted-foreground">Please wait a moment.</p>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-28 pb-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <AnimatedSection>
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Jobs
              </Link>

              <div className="glass-card p-8 text-center">
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Job not found
                </h2>
                <p className="text-muted-foreground">
                  This job does not exist or is no longer available.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  const requirementsList = parseRequirements(job.requirements);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <AnimatedSection>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Jobs
            </Link>

            <div className="glass-card p-8">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-7 h-7 text-primary" />
                  </div>

                  <div>
                    <h1 className="text-2xl font-bold font-display text-foreground">
                      {job.title}
                    </h1>
                    <p className="text-muted-foreground">
                      {job.company_name || "Unknown Company"}
                    </p>

                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {job.location || "Not specified"}
                      </span>

                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {formatSalary(job)}
                      </span>

                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatPostedDate(job.created_at)}
                      </span>

                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        {job.job_type || "Not specified"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button  onClick={handleSaveJob}
  disabled={saving} className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button  className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {(job.skills || []).length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {(job.skills || []).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-semibold font-display text-foreground mb-3">
                    Description
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {job.description || "No description available."}
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold font-display text-foreground mb-3">
                    Requirements
                  </h2>

                  {requirementsList.length > 0 ? (
                    <ul className="space-y-2">
                      {requirementsList.map((r) => (
                        <li
                          key={r}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No requirements specified.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row gap-3">
               <button
  onClick={handleApplyNow}
  disabled={applying || applied}
  className="gradient-bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity flex-1 sm:flex-none disabled:opacity-60"
>
  {applying ? "Applying..." : applied ? "Applied" : "Apply Now"}
</button>

               <button
  onClick={handleSaveJob}
  disabled={saving}
  className="border border-border text-foreground px-8 py-3 rounded-lg font-medium text-sm hover:bg-muted transition-colors disabled:opacity-60"
>
  {saving ? "Saving..." : saved ? "Saved" : "Save Job"}
</button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
      <Footer />
      <Chatbot context="job-detail" />
    </div>
  );
};

export default JobDetail;