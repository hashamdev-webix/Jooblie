import { useEffect, useState } from "react";
import { Building2, MapPin, Globe } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface Company {
  id: string;
  full_name: string | null;
  company_name: string | null;
  industry: string | null;
  location: string | null;
  website: string | null;
  company_size: string | null;
  created_at: string | null;
}

const AdminCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, company_name, industry, location, website, company_size, created_at")
        .eq("role", "recruiter")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        toast.error("Failed to load companies");
      } else {
        setCompanies(data || []);
      }

      setLoading(false);
    };

    fetchCompanies();
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl font-bold font-display mb-1 text-foreground">Companies</h1>
      <p className="text-muted-foreground mb-8">All recruiter companies on the platform.</p>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : companies.length === 0 ? (
        <p className="text-muted-foreground">No companies found.</p>
      ) : (
        <div className="space-y-4">
          {companies.map((company) => (
            <div key={company.id} className="glow-card p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-accent" />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    {company.company_name || "Unnamed Company"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Owner: {company.full_name || "Unknown"}
                  </p>

                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                    <span>{company.industry || "No industry"}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {company.location || "No location"}
                    </span>
                    <span>{company.company_size || "No size"}</span>
                    {company.website && (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        <Globe className="w-3 h-3" />
                        Website
                      </a>
                    )}
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

export default AdminCompanies;