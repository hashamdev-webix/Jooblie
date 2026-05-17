import { motion } from "framer-motion";
import { Search, MapPin, Briefcase, TrendingUp, Users, Zap, Star, ArrowRight, Building2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";

const stats = [
  { value: "50K+", label: "Active Jobs", icon: Briefcase },
  { value: "12K+", label: "Companies", icon: Building2 },
  { value: "200K+", label: "Job Seekers", icon: Users },
  { value: "95%", label: "Success Rate", icon: TrendingUp },
];

const features = [
  {
    icon: Zap,
    title: "AI-Powered Matching",
    description: "Our AI analyzes your skills and preferences to find the perfect job matches instantly.",
  },
  {
    icon: Star,
    title: "Smart Recommendations",
    description: "Get personalized job recommendations based on your profile and career goals.",
  },
  {
    icon: TrendingUp,
    title: "Career Growth Insights",
    description: "Track your applications, interviews, and get insights to accelerate your career.",
  },
];

const topCompanies = [
  "Google", "Microsoft", "Apple", "Amazon", "Meta", "Netflix",
];

const Index = () => {
  const navigate = useNavigate();

  const [jobKeyword, setJobKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (jobKeyword.trim()) params.set("q", jobKeyword.trim());
    if (location.trim()) params.set("location", location.trim());

    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="floating-orb w-96 h-96 bg-primary -top-20 -left-20 animate-pulse-glow" />
        <div className="floating-orb w-80 h-80 bg-secondary top-40 right-0 animate-pulse-glow animate-float-delayed" />
        <div className="floating-orb w-64 h-64 bg-accent bottom-0 left-1/3 animate-pulse-glow" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6"
            >
              <Zap className="w-4 h-4" />
              AI-Powered Job Matching Platform
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold font-display leading-tight mb-6">
              Find Your <span className="gradient-text-hero">Dream Career</span>
              <br />
              In Minutes
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Connect with top companies, get AI-powered job recommendations, and land your perfect role with Jooblie.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="glass-card p-2 max-w-3xl mx-auto flex flex-col sm:flex-row gap-2"
            >
              <div className="flex items-center gap-2 flex-1 px-4 py-2 rounded-lg bg-muted/50">
                <Search className="w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={jobKeyword}
                  onChange={(e) => setJobKeyword(e.target.value)}
                  placeholder="Job title, keyword, or company..."
                  className="bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground w-full text-sm"
                />
              </div>

              <div className="flex items-center gap-2 flex-1 px-4 py-2 rounded-lg bg-muted/50">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location or Remote"
                  className="bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground w-full text-sm"
                />
              </div>

              <button
                onClick={handleSearch}
                className="gradient-bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity whitespace-nowrap text-center"
              >
                Search Jobs
              </button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-sm text-muted-foreground mt-4"
            >
              Popular: React Developer, Product Designer, Data Scientist, DevOps Engineer
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 border-y border-border bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <AnimatedSection key={stat.label} delay={i * 0.1} className="text-center">
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-3xl md:text-4xl font-bold font-display gradient-text mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              Why Choose <span className="gradient-text">Jooblie</span>?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We combine cutting-edge AI with a beautiful experience to make your job search effortless.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <AnimatedSection key={feature.title} delay={i * 0.15}>
                <div className="glow-card p-8 h-full">
                  <div className="w-12 h-12 rounded-xl gradient-bg-primary flex items-center justify-center mb-5">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold font-display mb-3 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              Trusted by <span className="gradient-text-accent">Top Companies</span>
            </h2>
            <p className="text-muted-foreground">Leading companies hire through Jooblie every day.</p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="flex flex-wrap justify-center gap-6">
              {topCompanies.map((company) => (
                <div
                  key={company}
                  className="glass-card px-8 py-4 text-lg font-display font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {company}
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 relative overflow-hidden">
        <div className="floating-orb w-72 h-72 bg-primary bottom-0 right-0 animate-pulse-glow" />
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection className="text-center">
            <div className="glass-card p-12 md:p-16 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold font-display mb-6">
                Ready to Start Your <span className="gradient-text-hero">Journey</span>?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Join thousands of professionals who found their dream jobs through Jooblie.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="gradient-bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-2 justify-center"
                >
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/jobs"
                  className="border border-border text-foreground px-8 py-3 rounded-lg font-medium hover:bg-muted transition-colors text-center"
                >
                  Browse Jobs
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;