import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, MapPin, DollarSign, Save } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";

interface JobFormData {
  title: string;
  location: string;
    salary_min: string;
  salary_max: string;
  job_type: string;
  experience: string;
  description: string;
  skills: string;
}

interface JobFormErrors {
  title?: string;
  location?: string;
   salary_min?: string;
  salary_max?: string;
  description?: string;
}

const LOCAL_STORAGE_KEY = "createJobDraft";

const CreateJob = () => {
  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    location: "",
   salary_min: "",
  salary_max: "",
    job_type: "Full-time",
    experience: "Junior",
    description: "",
    skills: "",
  });

  const [errors, setErrors] = useState<JobFormErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) setFormData(JSON.parse(saved));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // remove field error while typing
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const newErrors: JobFormErrors = {};

    if (!formData.title.trim()) newErrors.title = "Job title is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
if (
  formData.salary_min &&
  formData.salary_max &&
  Number(formData.salary_min) > Number(formData.salary_max)
) {
  newErrors.salary_max = "Maximum salary must be greater than minimum salary";
}
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error("You must be logged in to post a job");
        setLoading(false);
        return;
      }

      const skillsArray = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

        const { data: profile } = await supabase
  .from("profiles")
  .select("company_name")
  .eq("id", user.id)
  .single();
   const { error } = await supabase.from("jobs").insert({
  title: formData.title.trim(),
  company_name: profile?.company_name || "Unknown Company", // ✅ FIX
  location: formData.location.trim(),
  salary_min: formData.salary_min.trim(),
  salary_max: formData.salary_max.trim(),
  job_type: formData.job_type,
  experience: formData.experience,
  description: formData.description.trim(),
  skills: skillsArray,
  recruiter_id: user.id,
});

      if (error) {
        console.error("Insert job error:", error);
        toast.error(error.message || "Failed to publish job");
        setLoading(false);
        return;
      }

      toast.success("Job published successfully");

      setFormData({
        title: "",
        location: "",
        salary_min: "",
  salary_max: "",
        job_type: "Full-time",
        experience: "Junior",
        description: "",
        skills: "",
      });

      setErrors({});
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
    toast.success("Draft saved");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl font-bold font-display mb-1 text-foreground text-center">
        Post a New Job
      </h1>
      <p className="text-muted-foreground mb-8 text-center">
        Create a compelling job listing to attract top talent.
      </p>

      <div className="glass-card p-8 max-w-3xl mx-auto">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Job Title
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Senior React Developer"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Remote, City, etc."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
  <div>
    <label className="text-sm font-medium text-foreground mb-1.5 block">
      Minimum Salary
    </label>
    <div className="relative">
      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        name="salary_min"
        value={formData.salary_min}
        onChange={handleChange}
        placeholder="200"
        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
    </div>
    {errors.salary_min && (
      <p className="text-red-500 text-sm mt-1">{errors.salary_min}</p>
    )}
  </div>

  <div>
    <label className="text-sm font-medium text-foreground mb-1.5 block">
      Maximum Salary
    </label>
    <div className="relative">
      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        name="salary_max"
        value={formData.salary_max}
        onChange={handleChange}
        placeholder="400"
        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
    </div>
    {errors.salary_max && (
      <p className="text-red-500 text-sm mt-1">{errors.salary_max}</p>
    )}
  </div>
</div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Job Type
              </label>
              <select
                name="type"
                value={formData.job_type}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Experience Level
              </label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option>Junior</option>
                <option>Mid-level</option>
                <option>Senior</option>
                <option>Lead</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Job Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              placeholder="Describe the role, responsibilities, and what you're looking for..."
              className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Required Skills
            </label>
            <input
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="React, TypeScript, Node.js (comma-separated)"
              className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="gradient-bg-accent text-accent-foreground px-8 py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2 disabled:opacity-70"
            >
              <Save className="w-4 h-4" />
              {loading ? "Publishing..." : "Publish Job"}
            </button>

            <button
              type="button"
              onClick={handleSaveDraft}
              className="border border-border text-foreground px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-muted transition-colors"
            >
              Save Draft
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default CreateJob;