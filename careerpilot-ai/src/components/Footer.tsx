import React from 'react';
import { Compass, CheckCircle, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Purpose */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-base mb-3">
              <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white">
                <Compass className="w-4 h-4" />
              </div>
              <span>CareerPilot AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              An intelligent job application assistant designed to empower candidates with actionable resume diagnostics, keyword gap intelligence, and interview readiness.
            </p>
          </div>

          {/* Col 2: Capabilities */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              Application Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Resume Analysis
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Job Match Diagnostic
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Cover Letter Generator
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Interview Preparation
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Best Practices */}
          <div id="faq">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              Job Seeker Guide
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-slate-300 block font-medium">ATS Optimization</span>
                <span className="text-slate-400">Use standard headers and measurable bullet points.</span>
              </li>
              <li>
                <span className="text-slate-300 block font-medium">Quantified Results</span>
                <span className="text-slate-400">Pair action verbs with concrete business outcomes.</span>
              </li>
              <li>
                <span className="text-slate-300 block font-medium">Targeted Letters</span>
                <span className="text-slate-400">Align specific qualifications directly to job needs.</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Privacy & Guarantees */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              Privacy First
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Your resume and job description remain confidential and client-side in your current session.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <Shield className="w-4 h-4" />
              <span>Session-Protected Workspace</span>
            </div>
          </div>
        </div>

        {/* Quiet copyright & metadata divider */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} CareerPilot AI. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Client-side Frontend Edition</span>
            <span aria-hidden="true">·</span>
            <span>WCAG AA Accessible</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
