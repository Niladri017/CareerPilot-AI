import React from 'react';
import { FileSearch, Target, FileText, MessageSquareQuote, ArrowUpRight } from 'lucide-react';
import { FeatureKey, AnalysisResult } from '../types/index';

interface FeatureCardsProps {
  activeFeature: FeatureKey;
  onSelectFeature: (feature: FeatureKey) => void;
  analysis: AnalysisResult | null;
}

export const FeatureCards: React.FC<FeatureCardsProps> = ({
  activeFeature,
  onSelectFeature,
  analysis,
}) => {
  const cards: Array<{
    id: FeatureKey;
    title: string;
    icon: React.ReactNode;
    description: string;
    actionHint: string;
    metricLabel?: string;
  }> = [
    {
      id: 'resume-analysis',
      title: 'Resume Analysis',
      icon: <FileSearch className="w-5 h-5 text-blue-600" />,
      description: 'Audit formatting readability, detect power action verbs, and verify quantified achievements for ATS scanners.',
      actionHint: 'View ATS & Content Score',
      metricLabel: analysis ? `ATS Score: ${analysis.atsReadinessScore}%` : undefined,
    },
    {
      id: 'job-match',
      title: 'Job Match',
      icon: <Target className="w-5 h-5 text-indigo-600" />,
      description: 'Compare candidate qualifications against targeted job descriptions to identify aligned skills and critical keyword gaps.',
      actionHint: 'Check Keyword Alignment',
      metricLabel: analysis ? `Match: ${analysis.keywordMatchPercentage}%` : undefined,
    },
    {
      id: 'cover-letter',
      title: 'Cover Letter Generator',
      icon: <FileText className="w-5 h-5 text-teal-600" />,
      description: 'Generate a cohesive, tailored cover letter emphasizing relevant experience and impact directly aligned to the role.',
      actionHint: 'Generate Tailored Draft',
      metricLabel: analysis ? 'Draft Generated' : undefined,
    },
    {
      id: 'interview-prep',
      title: 'Interview Preparation',
      icon: <MessageSquareQuote className="w-5 h-5 text-amber-600" />,
      description: 'Anticipate behavioral and technical interview questions derived directly from the job requirements and your background.',
      actionHint: 'Rehearse Targeted Q&A',
      metricLabel: analysis ? `${analysis.interviewQuestions.length} Questions Ready` : undefined,
    },
  ];

  return (
    <section id="features" className="py-8 border-b border-slate-200/60 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Comprehensive Career Toolkit
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Select any capability below to explore focused analysis insights.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            4 Core AI Assistance Modules
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => {
            const isSelected = activeFeature === card.id;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => onSelectFeature(card.id)}
                aria-pressed={isSelected}
                className={`relative text-left p-5 rounded-xl border transition-all duration-150 flex flex-col justify-between h-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/30 shadow-sm ring-1 ring-blue-600/20'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 bg-white shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {card.icon}
                    </div>
                    {card.metricLabel && (
                      <span className="text-xs font-semibold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                        {card.metricLabel}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mb-1.5 flex items-center justify-between">
                    <span>{card.title}</span>
                    <ArrowUpRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected
                          ? 'text-blue-600 translate-x-0.5 -translate-y-0.5'
                          : 'text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
                      }`}
                    />
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium">
                  <span className={isSelected ? 'text-blue-600 font-semibold' : 'text-slate-500'}>
                    {isSelected ? 'Active View' : card.actionHint}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
