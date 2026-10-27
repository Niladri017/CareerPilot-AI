import React from 'react';
import { ShieldCheck, Zap, Award } from 'lucide-react';

interface HeroProps {
  onLoadSample: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onLoadSample }) => {
  return (
    <section className="pt-10 pb-8 sm:pt-14 sm:pb-10 border-b border-slate-200/60 bg-gradient-to-b from-white via-slate-50/50 to-slate-100/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Quiet inline metadata with typographic separators */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-3 tracking-wide">
            <span className="text-blue-600 font-semibold">CareerPilot AI</span>
            <span aria-hidden="true">·</span>
            <span>Powered by Gemini 3.8 Flash</span>
            <span aria-hidden="true">·</span>
            <span>ATS Friendly Evaluation</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15] text-balance">
            Your Next Career Move Starts Here
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
            Optimize your resume against target job descriptions, discover critical keyword gaps, craft tailored cover letters, and rehearse role-specific interview questions in seconds.
          </p>

          {/* Quick value trust markers */}
          <div className="mt-6 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Private & Client-Side Analysis</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>Instant Keyword & ATS Scoring</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-blue-600" />
              <span>Tailored Cover Letter & Interview Q&As</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
