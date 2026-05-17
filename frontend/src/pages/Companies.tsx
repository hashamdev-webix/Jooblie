import { useEffect, useMemo, useState } from "react";
import { Building2, Users, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { supabase } from "@/lib/supabase";

interface ProfileCompanyRow {
  id: string;
  company_name: string | null;
  company_size: string | null;
  location: string | null;
  industry: string | null;
  about: string | null;
  role: string;
}

interface JobRow {
  recruiter_id: string;
}

const Companies = () => {
  const [profiles, setProfiles] = useState<ProfileCompanyRow[]>([]);
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);

      const [profilesRes, jobsRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, company_name, company_size, location, industry, about, role")
          .eq("role", "recruiter")
          .not("company_name", "is", null),

        supabase
          .from("jobs")
          .select("recruiter_id")
          .eq("status", "active"),
      ]);

      console.log("profiles error", profilesRes.error);
      console.log("profiles data", profilesRes.data);
      console.log("jobs error", jobsRes.error);
      console.log("jobs data", jobsRes.data);

      if (profilesRes.error) {
        console.error("Fetch profiles error:", profilesRes.error);
        setProfiles([]);
      } else {
        setProfiles(profilesRes.data || []);
      }

      if (jobsRes.error) {
        console.error("Fetch jobs error:", jobsRes.error);
        setJobs([]);
      } else {
        setJobs(jobsRes.data || []);
      }

      setLoading(false);
    };

    fetchCompanies();
  }, []);

  const companies = useMemo(() => {
    const jobsCountMap = new Map<string, number>();

    for (const job of jobs) {
      jobsCountMap.set(
        job.recruiter_id,
        (jobsCountMap.get(job.recruiter_id) || 0) + 1
      );
    }

    return profiles
      .filter((profile) => profile.company_name && profile.company_name.trim() !== "")
      .map((profile) => ({
        id: profile.id,
        name: profile.company_name?.trim() || "Unknown Company",
        location: profile.location?.trim() || "Not specified",
        industry: profile.industry?.trim() || "Not specified",
        employees: profile.company_size?.trim() || "Not specified",
        description: profile.about?.trim() || "Hiring now on Jooblie.",
        openJobs: jobsCountMap.get(profile.id) || 0,
      }))
      .sort((a, b) => b.openJobs - a.openJobs);
  }, [profiles, jobs]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-10 sm:mb-12 md:mb-14">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-8">
              Top{" "}
              <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                Companies
              </span>{" "}
              Hiring
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto px-4">
              Explore leading companies and discover amazing career opportunities.
            </p>
          </AnimatedSection>

          {loading ? (
            <AnimatedSection>
              <div className="backdrop-blur-xl bg-card/50 border border-border rounded-xl p-8 text-center">
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Loading companies...
                </h2>
                <p className="text-muted-foreground">Please wait a moment.</p>
              </div>
            </AnimatedSection>
          ) : companies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {companies.map((c, i) => (
                <AnimatedSection key={c.id} delay={i * 0.1}>
                  <div className="backdrop-blur-xl bg-card/50 border border-border rounded-xl p-5 sm:p-6 h-full flex flex-col hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                      </div>

                      <span className="text-xs font-medium text-cyan-400 bg-cyan-500/10 px-2 sm:px-2.5 py-1 rounded-full whitespace-nowrap">
                        {c.openJobs} open job{c.openJobs > 1 ? "s" : ""}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-foreground mb-1">
                      {c.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                      {c.industry}
                    </p>

                    <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-3">
                      {c.description}
                    </p>

                    <div className="flex flex-wrap gap-2 sm:gap-3 text-xs text-muted-foreground mt-auto pt-3 sm:pt-4 border-t border-border">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{c.location}</span>
                      </span>

                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 flex-shrink-0" />
                        {c.employees}
                      </span>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <AnimatedSection>
              <div className="backdrop-blur-xl bg-card/50 border border-border rounded-xl p-8 text-center">
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  No companies available
                </h2>
                <p className="text-muted-foreground">
                  No recruiter companies are available right now.
                </p>
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Companies;