import React from 'react';
import { UploadCloud, Cpu, Award } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Paste Resume & Job Listing',
      description: 'Input your raw resume text alongside the target job description to establish a comparative baseline.',
      icon: <UploadCloud className="w-5 h-5 text-blue-600" />,
    },
    {
      step: '02',
      title: 'Run Multi-Vector Diagnostics',
      description: 'Our engine identifies missing keywords, evaluates ATS layout structure, and audits measurable impact metrics.',
      icon: <Cpu className="w-5 h-5 text-indigo-600" />,
    },
    {
      step: '03',
      title: 'Generate Assets & Prepare',
      description: 'Instantly produce a customized cover letter draft and practice tailored behavioral and technical interview questions.',
      icon: <Award className="w-5 h-5 text-emerald-600" />,
    },
  ];

  return (
    <section id="how-it-works" className="py-12 bg-white border-b border-slate-200/60 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <span>Workflow</span>
            <span aria-hidden="true">·</span>
            <span>3 Simple Steps</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            How CareerPilot AI Elevates Your Applications
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Transform a generic application into an interview-winning candidate profile.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((item) => (
            <div
              key={item.step}
              className="p-6 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 shadow-2xs flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="font-mono text-sm font-bold text-slate-400">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
