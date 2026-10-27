import React from 'react';
import { Compass, Sparkles, FileText } from 'lucide-react';

interface NavbarProps {
  onLoadSample: () => void;
  onReset: () => void;
  hasContent: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onLoadSample, onReset, hasContent }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="/"
            className="flex items-center gap-2.5 text-slate-900 font-bold text-lg tracking-tight whitespace-nowrap shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-md"
            aria-label="CareerPilot AI Home"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-700 transition-colors">
              <Compass className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-900 text-lg">
              CareerPilot <span className="text-blue-600">AI</span>
            </span>
          </a>

          {/* Zone 2: 4 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600" aria-label="Main Navigation">
            <a
              href="#workspace"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-blue-600 rounded-sm"
            >
              Application Studio
            </a>
            <a
              href="#features"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-blue-600 rounded-sm"
            >
              Core Capabilities
            </a>
            <a
              href="#how-it-works"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-blue-600 rounded-sm"
            >
              How It Works
            </a>
            <a
              href="#faq"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-blue-600 rounded-sm"
            >
              Job Seeker Guide
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            {hasContent && (
              <button
                type="button"
                onClick={onReset}
                className="hidden sm:inline-flex text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 transition-colors rounded-lg border border-slate-200 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                Clear Inputs
              </button>
            )}
            <button
              type="button"
              onClick={onLoadSample}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 whitespace-nowrap shrink-0"
              aria-label="Load Sample Resume & Job Description"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Sample Data</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
