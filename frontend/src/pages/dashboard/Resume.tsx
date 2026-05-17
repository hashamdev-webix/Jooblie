import { motion } from "framer-motion";
import { Upload, File, Download, Trash2, Sparkles } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

interface ResumeData {
  resume_path: string | null;
  resume_file_name: string | null;
  resume_file_size: number | null;
  resume_uploaded_at: string | null;
}

const Resume = () => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData>({
    resume_path: null,
    resume_file_name: null,
    resume_file_size: null,
    resume_uploaded_at: null,
  });

  useEffect(() => {
    fetchResumeData();
  }, [user]);

  const fetchResumeData = async () => {
    if (!user) return;

    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select(
          "resume_path, resume_file_name, resume_file_size, resume_uploaded_at",
        )
        .eq("id", authData.user.id)
        .single();

      if (error) {
        console.error("Error fetching resume data:", error);
        return;
      }

      if (data) {
        setResumeData(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log(
      "File selected:",
      file.name,
      "Type:",
      file.type,
      "Size:",
      file.size,
    );

    // Validate file type
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type)) {
      alert("Please upload PDF, DOC, or DOCX file only");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setSelectedFile(file);
    setUploading(true);

    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError) {
        console.error("Auth error:", authError);
        alert(`Authentication error: ${authError.message}`);
        return;
      }

      if (!authData.user) {
        alert("User not authenticated");
        return;
      }

      console.log("User authenticated:", authData.user.id);

      // Get file extension
      const fileExtension = file.name.split(".").pop();
      const filePath = `${authData.user.id}.${fileExtension}`;

      console.log("Uploading to path:", filePath);

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error("Upload error details:", {
          message: uploadError.message,
          statusCode: uploadError.statusCode,
          error: uploadError,
        });
        alert(`Failed to upload resume: ${uploadError.message}`);
        return;
      }

      console.log("Upload successful:", uploadData);

      // Update profiles table
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          resume_path: filePath,
          resume_uploaded_at: new Date().toISOString(),
          resume_file_name: file.name,
          resume_file_size: file.size,
        })
        .eq("id", authData.user.id);

      if (updateError) {
        console.error("Update error:", updateError);
        alert(`Failed to update resume metadata: ${updateError.message}`);
        return;
      }

      console.log("Profile updated successfully");

      // Refresh data
      await fetchResumeData();
      alert(`File "${file.name}" uploaded successfully!`);
      setSelectedFile(null);
    } catch (error: any) {
      console.error("Unexpected error:", error);
      alert(
        `An error occurred during upload: ${error?.message || "Unknown error"}`,
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async () => {
    if (!resumeData.resume_path) return;

    try {
      const { data, error } = await supabase.storage
        .from("resumes")
        .createSignedUrl(resumeData.resume_path, 60);

      if (error) {
        console.error("Download error:", error);
        alert("Failed to generate download link");
        return;
      }

      if (data?.signedUrl) {
        window.open(data.signedUrl, "_blank");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during download");
    }
  };

  const handleDelete = async () => {
    if (!resumeData.resume_path) return;
    if (!confirm("Are you sure you want to delete your resume?")) return;

    setDeleting(true);

    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        alert("User not authenticated");
        return;
      }

      // Remove from storage
      const { error: deleteError } = await supabase.storage
        .from("resumes")
        .remove([resumeData.resume_path]);

      if (deleteError) {
        console.error("Delete error:", deleteError);
        alert("Failed to delete resume file");
        return;
      }

      // Update profiles table
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          resume_path: null,
          resume_file_name: null,
          resume_file_size: null,
          resume_uploaded_at: null,
        })
        .eq("id", authData.user.id);

      if (updateError) {
        console.error("Update error:", updateError);
        alert("Failed to update resume metadata");
        return;
      }

      // Update local state
      setResumeData({
        resume_path: null,
        resume_file_name: null,
        resume_file_size: null,
        resume_uploaded_at: null,
      });

      alert("Resume deleted successfully");
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during deletion");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "";
    return `${Math.round(bytes / 1024)} KB`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 sm:px-0"
    >
      <h1 className="text-2xl sm:text-3xl font-bold font-display mb-1 text-foreground mt-12 sm:mt-0 text-center">
        My Resume
      </h1>
      <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 text-center">
        Upload and manage your resume to apply for jobs faster.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto w-full">
        {/* Upload */}
        <div className="glow-card p-6 sm:p-8 flex flex-col items-center justify-center text-center min-h-[240px] sm:min-h-[280px]">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
            <Upload className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold font-display text-foreground mb-2">
            Upload Resume
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4">
            PDF, DOC, or DOCX (max 5MB)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={handleFileClick}
            disabled={uploading}
            className="gradient-bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 w-full sm:w-auto"
          >
            {uploading ? "Uploading..." : "Choose File"}
          </button>
          {selectedFile && (
            <p className="text-xs text-muted-foreground mt-3 break-all px-2">
              Selected: {selectedFile.name}
            </p>
          )}
        </div>

        {/* Current Resume */}
        <div className="glow-card p-6 sm:p-8">
          <h3 className="text-base sm:text-lg font-semibold font-display text-foreground mb-4">
            Current Resume
          </h3>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          ) : resumeData.resume_path ? (
            <>
              <div className="flex items-start sm:items-center gap-3 p-3 sm:p-4 rounded-lg bg-muted/50 mb-4">
                <File className="w-7 h-7 sm:w-8 sm:h-8 text-primary flex-shrink-0 mt-1 sm:mt-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground break-words">
                    {resumeData.resume_file_name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Uploaded {formatDate(resumeData.resume_uploaded_at)} •{" "}
                    {formatFileSize(resumeData.resume_file_size)}
                  </p>
                </div>
                <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                  <button
                    onClick={handleDownload}
                    className="p-1.5 sm:p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="p-1.5 sm:p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-3 sm:p-4 rounded-lg border border-secondary/30 bg-secondary/5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-secondary flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-secondary">
                    AI Analysis
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your resume scores{" "}
                  <strong className="text-foreground">85/100</strong>. Consider
                  adding more quantifiable achievements.
                </p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <File className="w-12 h-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">
                No resume uploaded yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Upload your resume to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Resume;
