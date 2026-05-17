import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, MapPin, Briefcase, Save } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

const Profile = () => {
  const { user, loading } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [fullName, setFullName] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [skills, setSkills] = useState("");
  const [role, setRole] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data: authData } = await supabase.auth.getUser();
        if (!authData.user) return;

        setEmail(authData.user.email || "");

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authData.user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }

        if (data) {
          setFullName(data.full_name || "");
          setLocation(data.location || "");
          setBio(data.about || "");
          setJobTitle(data.job_title || "");
          setSkills(data.skills || "");
          setRole(data.role || "");
          setCompanyName(data.company_name || "");
          setAvatarUrl(data.avatar_url || null);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchProfile();
  }, [user]);
const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files || e.target.files.length === 0) return;
  setAvatarFile(e.target.files[0]);
};

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    setSaving(true);

    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        console.error("No authenticated user");
        return;
      }
let uploadedAvatarUrl = avatarUrl;

if (avatarFile) {
  const fileExt = avatarFile.name.split(".").pop();
  const fileName = `${user.id}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("profile_avatars")
    .upload(fileName, avatarFile, {
      upsert: true,
    });

  if (uploadError) {
    console.error(uploadError);
  } else {
    const { data } = supabase.storage
      .from("profile_avatars")
      .getPublicUrl(fileName);

    uploadedAvatarUrl = data.publicUrl;
    setAvatarUrl(uploadedAvatarUrl);
  }
}
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          location: location,
          about: bio,
          job_title: jobTitle,
          skills: skills,
           avatar_url: uploadedAvatarUrl,
        })
        .eq("id", authData.user.id);


      if (error) {
        console.error("Error updating profile:", error);
      } else {
        console.log("Profile updated successfully");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading || fetchLoading) return null;

  const displayTitle =
    role === "recruiter"
      ? companyName
      : role === "job_seeker"
        ? "Job Seeker"
        : role;

  const skillsArray = skills
    ? skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl font-bold font-display mb-1 text-foreground text-center">
        My Profile
      </h1>
      <p className="text-muted-foreground mb-8 text-center">
        Manage your personal information and preferences.
      </p>

      <div className="glass-card p-8 max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
         
<div className="flex flex-col items-center">
  {/* Avatar */}
  <label className="w-20 h-20 rounded-full overflow-hidden border cursor-pointer group relative">
    {avatarUrl ? (
      <img
        src={avatarUrl}
        alt="avatar"
        className="w-full h-full object-cover"
      />
    ) : (
      <div className="w-full h-full gradient-bg-primary flex items-center justify-center">
        <User className="w-10 h-10 text-primary-foreground" />
      </div>
    )}

    {/* Hover overlay */}
    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs transition">
      Change
    </div>

    {/* Hidden input */}
    <input
      type="file"
      accept="image/*"
      onChange={handleAvatarChange}
      className="hidden"
    />
  </label>

  <p className="text-xs text-muted-foreground mt-2">
    Click to upload
  </p>
</div>
          <div>
            <h2 className="text-xl font-bold font-display text-foreground">
              {fullName || ""}
            </h2>
            <p className="text-sm text-muted-foreground">{displayTitle}</p>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSaveChanges}>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={email}
                  readOnly
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Job Title
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Skills
            </label>
            <input
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="Enter skills separated by commas"
              className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 mb-2"
            />
            <div className="flex flex-wrap gap-2">
              {skillsArray.map((skill) => (
                <span
                  key={skill}
                  className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="gradient-bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default Profile;
