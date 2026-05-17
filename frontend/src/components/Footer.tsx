import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";

const Footer = () => (
  <footer className="mt-12 sm:mt-16 md:mt-20 border-t border-border bg-card/50">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg gradient-bg-primary flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold font-display gradient-text">
              Jooblie
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Find your dream job or the perfect candidate. AI-powered matching
            for the modern workforce.
          </p>
        </div>
        <div>
          <h4 className="font-display font-semibold text-foreground mb-4">
            For Job Seekers
          </h4>
          <div className="flex flex-col gap-2">
            <Link
              to="/jobs"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Browse Jobs
            </Link>
            <Link
              to="/companies"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Companies
            </Link>
            <Link
              to="/dashboard"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold text-foreground mb-4">
            For Recruiters
          </h4>
          <div className="flex flex-col gap-2">
            <Link
              to="/recruiter/dashboard"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Recruiter Dashboard
            </Link>
            <Link
              to="/recruiter/create-job"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Post a Job
            </Link>
            <Link
              to="/pricing"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Pricing
            </Link>
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold text-foreground mb-4">
            Follow Us
          </h4>
          <div className="flex gap-3">
            <a
              href="https://www.facebook.com/jooblie"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted/80 transition-colors"
            >
              <FaFacebookF className="w-4 h-4" />
            </a>
            <a
              href="https://www.instagram.com/joobliejooblie/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted/80 transition-colors"
            >
              <FaInstagram className="w-4 h-4" />
            </a>
            <a
              href="https://x.com/Jooblie01"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted/80 transition-colors"
            >
              <FaXTwitter className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border mt-8 pt-8 text-center">
        <p className="text-sm text-muted-foreground">
          © 2026 Jooblie. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
