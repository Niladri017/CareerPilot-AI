import React from 'react';
import { FileText, Briefcase, Sparkles, Trash2, ArrowRight } from 'lucide-react';
import { countWords, countCharacters } from '../utils/textAnalysis';

interface InputWorkspaceProps {
  resumeText: string;
  jobDescText: string;
  onResumeChange: (val: string) => void;
  onJobDescChange: (val: string) => void;
  onAnalyze: () => void;
  onLoadSample: () => void;
  onLoadSampleResume: () => void;
  onLoadSampleJobDesc: () => void;
  onClearResume: () => void;
  onClearJobDesc: () => void;
  isAnalyzing: boolean;
  errorMessage: string | null;
}

export const InputWorkspace: React.FC<InputWorkspaceProps> = ({
  resumeText,
  jobDescText,
  onResumeChange,
  onJobDescChange,
  onAnalyze,
  onLoadSample,
  onLoadSampleResume,
  onLoadSampleJobDesc,
  onClearResume,
  onClearJobDesc,
  isAnalyzing,
  errorMessage,
}) => {
  const resumeWords = countWords(resumeText);
  const resumeChars = countCharacters(resumeText);
  const jobWords = countWords(jobDescText);
  const jobChars = countCharacters(jobDescText);

  return (
    <section id="workspace" className="py-8 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Application Document Workspace
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Paste your current resume and target job listing below for instant comparative intelligence.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onLoadSample}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200/80 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Use Sample Application Data</span>
            </button>
          </div>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-sm flex items-start gap-3"
          >
            <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
            <div>
              <strong className="font-semibold">Input required: </strong>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* 2-Column Responsive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Section 1: Resume Text Input */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-full focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <label
                    htmlFor="resume-input"
                    className="block text-sm font-bold text-slate-900 cursor-pointer"
                  >
                    Paste Resume Text
                  </label>
                  <span className="text-xs text-slate-500">
                    Include experience, technical skills, and achievements
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {!resumeText && (
                  <button
                    type="button"
                    onClick={onLoadSampleResume}
                    className="text-xs text-blue-600 hover:text-blue-800 transition-colors px-2 py-1 rounded hover:bg-blue-50"
                  >
                    Load Sample
                  </button>
                )}
                {resumeText && (
                  <button
                    type="button"
                    onClick={onClearResume}
                    className="text-xs text-slate-400 hover:text-rose-600 transition-colors p-1.5 rounded hover:bg-slate-50 flex items-center gap-1"
                    aria-label="Clear Resume text"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Clear</span>
                  </button>
                )}
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col">
              <textarea
                id="resume-input"
                name="resume"
                value={resumeText}
                onChange={(e) => onResumeChange(e.target.value)}
                placeholder="Paste the plain text of your resume here...&#10;&#10;e.g.,&#10;Jane Doe — Senior Product Manager&#10;Experience:&#10;• Spearheaded cloud migration resulting in 30% cost efficiency...&#10;• Led cross-functional team of 8 engineers...&#10;&#10;Skills: TypeScript, SQL, Agile, Data Analysis..."
                rows={12}
                className="w-full flex-1 p-3 text-sm text-slate-800 placeholder-slate-400 bg-slate-50/50 rounded-lg border border-slate-200 focus:outline-none focus:bg-white focus:border-blue-500 transition-colors font-mono leading-relaxed resize-y min-h-[220px]"
                aria-describedby="resume-counter"
              />

              <div
                id="resume-counter"
                className="mt-3 flex items-center justify-between text-xs text-slate-500 font-mono tabular-nums"
              >
                <span>
                  {resumeWords} {resumeWords === 1 ? 'word' : 'words'} · {resumeChars} chars
                </span>
                <span>
                  {resumeWords < 150 ? 'Recommended: 200–800 words' : 'Optimal length'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Job Description Input */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-full focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <label
                    htmlFor="jobdesc-input"
                    className="block text-sm font-bold text-slate-900 cursor-pointer"
                  >
                    Paste Job Description
                  </label>
                  <span className="text-xs text-slate-500">
                    Include job title, responsibilities, and required qualifications
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {!jobDescText && (
                  <button
                    type="button"
                    onClick={onLoadSampleJobDesc}
                    className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors px-2 py-1 rounded hover:bg-indigo-50"
                  >
                    Load Sample
                  </button>
                )}
                {jobDescText && (
                  <button
                    type="button"
                    onClick={onClearJobDesc}
                    className="text-xs text-slate-400 hover:text-rose-600 transition-colors p-1.5 rounded hover:bg-slate-50 flex items-center gap-1"
                    aria-label="Clear Job Description text"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Clear</span>
                  </button>
                )}
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col">
              <textarea
                id="jobdesc-input"
                name="jobDescription"
                value={jobDescText}
                onChange={(e) => onJobDescChange(e.target.value)}
                placeholder="Paste the target job description or listing text here...&#10;&#10;e.g.,&#10;Staff Software Engineer — Growth Platform&#10;We are seeking an experienced engineer to drive high-impact architecture...&#10;&#10;Requirements:&#10;• 5+ years of experience in distributed systems&#10;• Strong familiarity with React, Node.js, and Cloud Infrastructure..."
                rows={12}
                className="w-full flex-1 p-3 text-sm text-slate-800 placeholder-slate-400 bg-slate-50/50 rounded-lg border border-slate-200 focus:outline-none focus:bg-white focus:border-blue-500 transition-colors font-mono leading-relaxed resize-y min-h-[220px]"
                aria-describedby="jobdesc-counter"
              />

              <div
                id="jobdesc-counter"
                className="mt-3 flex items-center justify-between text-xs text-slate-500 font-mono tabular-nums"
              >
                <span>
                  {jobWords} {jobWords === 1 ? 'word' : 'words'} · {jobChars} chars
                </span>
                <span>
                  {jobWords < 80 ? 'Paste full listing for best accuracy' : 'Listing loaded'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Action Button Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={onAnalyze}
            disabled={isAnalyzing}
            className="w-full sm:w-auto min-w-[240px] px-8 py-3.5 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl shadow-md hover:shadow-lg transition-all duration-150 flex items-center justify-center gap-2.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300"
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Analyzing with Gemini AI...</span>
              </>
            ) : (
              <>
                <span>Analyze My Resume</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
