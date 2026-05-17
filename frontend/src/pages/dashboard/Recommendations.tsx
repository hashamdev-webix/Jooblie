import { motion } from "framer-motion";
import { Briefcase, MapPin, DollarSign, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const recommendations = [
  { id: "1", title: "Senior React Developer", company: "TechCorp", location: "Remote", salary: "$120K-$160K", match: 95 },
  { id: "2", title: "Full Stack Engineer", company: "DataFlow", location: "Austin, TX", salary: "$115K-$155K", match: 90 },
  { id: "3", title: "Frontend Architect", company: "CloudNine", location: "Remote", salary: "$140K-$180K", match: 87 },
  { id: "4", title: "React Native Developer", company: "FinanceAI", location: "Chicago, IL", salary: "$110K-$145K", match: 82 },
];

const Recommendations = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
    <div className="flex items-center justify-center gap-2 mb-1 mt-12 sm:mt-0">
      <h1 className="text-3xl font-bold font-display text-foreground text-center">AI Recommendations</h1>
      <Sparkles className="w-6 h-6 text-accent" />
    </div>
    <p className="text-muted-foreground mb-8 text-center">Jobs matched to your profile and preferences.</p>

    <div className="space-y-4">
      {recommendations.map((job, i) => (
        <motion.div
          key={job.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Link to={`/jobs/${job.id}`} className="block">
            <div className="glow-card p-6 flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{job.title}</h3>
                <p className="text-sm text-muted-foreground">{job.company}</p>
                <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                  <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{job.salary}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full gradient-border flex items-center justify-center">
                  <span className="text-sm font-bold gradient-text">{job.match}%</span>
                </div>
                <span className="text-xs text-muted-foreground">Match</span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export default Recommendations;
