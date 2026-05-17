import { motion } from "framer-motion";
import { Check, Zap, Crown, Building2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    icon: Zap,
    gradient: false,
    features: ["5 job applications/month", "Basic profile", "Job alerts", "Resume upload"],
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For serious job seekers",
    icon: Crown,
    gradient: true,
    features: ["Unlimited applications", "AI resume builder", "Priority visibility", "Interview prep", "Salary insights", "24/7 support"],
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    description: "For recruiting teams",
    icon: Building2,
    gradient: false,
    features: ["Unlimited job posts", "AI candidate matching", "Team collaboration", "Analytics dashboard", "ATS integration", "Dedicated manager"],
  },
];

const Pricing = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <section className="pt-28 sm:pt-32 md:pt-36 pb-16 sm:pb-20 md:pb-24 relative overflow-hidden">
      <div className="floating-orb w-80 h-80 bg-primary -top-20 left-1/4 animate-pulse-glow" />
      <div className="floating-orb w-64 h-64 bg-accent bottom-0 right-1/4 animate-pulse-glow" />

      <div className="container mx-auto px-4 relative z-10">
        <AnimatedSection className="text-center mb-10 sm:mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-7 md:mb-8">
            Simple, <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Transparent</span> Pricing
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto px-4">Choose the plan that fits your needs. Upgrade or downgrade anytime.</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <AnimatedSection key={plan.name} delay={i * 0.15}>
              <div className={`rounded-2xl p-6 sm:p-7 md:p-8 h-full flex flex-col ${plan.gradient ? "border-2 border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 relative" : "backdrop-blur-xl bg-card/50 border border-border"}`}>
                {plan.gradient && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold">
                    POPULAR
                  </div>
                )}
                <plan.icon className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500 mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-bold text-foreground">{plan.name}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 mb-3 sm:mb-4">{plan.description}</p>
                <div className="mb-4 sm:mb-6">
                  <span className="text-3xl sm:text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground text-xs sm:text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm transition-opacity hover:opacity-90 ${plan.gradient ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white" : "border border-border text-foreground hover:bg-muted"}`}>
                  Get Started
                </button>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
    <Footer />
  </div>
);

export default Pricing;
