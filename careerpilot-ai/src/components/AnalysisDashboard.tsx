import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  FileSearch,
  Target,
  FileText,
  MessageSquareQuote,
  Sparkles,
  Briefcase,
  HelpCircle,
  UserCheck
} from 'lucide-react';
import { AnalysisResult, FeatureKey } from '../types/index';

interface AnalysisDashboardProps {
  analysis: AnalysisResult;
  activeFeature: FeatureKey;
  onSelectFeature: (feature: FeatureKey) => void;
  onReanalyze: () => void;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({
  analysis,
  activeFeature,
  onSelectFeature,
}) => {
  const [copiedCoverLetter, setCopiedCoverLetter] = useState(false);
  const [copiedQuestionIndex, setCopiedQuestionIndex] = useState<number | null>(null);

  const handleCopyCoverLetter = () => {
    navigator.clipboard.writeText(analysis.coverLetterDraft);
    setCopiedCoverLetter(true);
    setTimeout(() => setCopiedCoverLetter(false), 2000);
  };

  const handleCopyQuestion = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedQuestionIndex(index);
    setTimeout(() => setCopiedQuestionIndex(null), 2000);
  };

  const gemini = analysis.geminiAnalysis;

  return (
    <section id="results" className="py-10 bg-white border-b border-slate-200 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Results Header with Score Overview */}
        <div className="mb-8 p-6 bg-slate-900 rounded-2xl text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-1.5 uppercase tracking-wider">
              {analysis.isAiGenerated ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>Gemini 3.8 Flash Verified</span>
                  <span aria-hidden="true">·</span>
                  <span>Strictly Grounded Analysis</span>
                </>
              ) : (
                <>
                  <span>Analysis Completed</span>
                  <span aria-hidden="true">·</span>
                  <span>Comparative Diagnostic</span>
                </>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Application Readiness Report
            </h2>
            <p className="mt-1 text-sm text-slate-300 max-w-xl">
              {analysis.isAiGenerated
                ? 'Evaluated against the target role using the Gemini 3.8 Flash model. All insights are grounded in the supplied text without fabricated qualifications.'
                : 'Evaluated against the target role requirements across ATS compatibility and keyword resonance.'}
            </p>
          </div>

          <div className="flex items-center gap-6 sm:gap-8 self-stretch md:self-auto justify-around bg-slate-800/80 px-6 py-4 rounded-xl border border-slate-700/60">
            <div className="text-center">
              <span className="block text-3xl font-extrabold text-white font-mono tabular-nums">
                {analysis.overallScore}%
              </span>
              <span className="text-xs text-slate-400 font-medium">Overall Fit</span>
            </div>
            <div className="w-px h-10 bg-slate-700" />
            <div className="text-center">
              <span className="block text-3xl font-extrabold text-blue-400 font-mono tabular-nums">
                {analysis.atsReadinessScore}%
              </span>
              <span className="text-xs text-slate-400 font-medium">ATS Score</span>
            </div>
            <div className="w-px h-10 bg-slate-700" />
            <div className="text-center max-w-[130px]">
              <span className="block text-3xl font-extrabold text-indigo-400 font-mono tabular-nums">
                {analysis.keywordMatchPercentage}%
              </span>
              <span className="text-xs text-slate-400 font-medium leading-tight block">
                Approx. Keyword Indicator
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                (Not hiring probability)
              </span>
            </div>
          </div>
        </div>

        {/* Feature Navigation Tabs */}
        <div className="border-b border-slate-200 mb-8 overflow-x-auto">
          <nav className="flex space-x-2 sm:space-x-4 min-w-max pb-2" aria-label="Analysis Modules">
            <button
              type="button"
              onClick={() => onSelectFeature('resume-analysis')}
              className={`px-4 py-2.5 text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                activeFeature === 'resume-analysis'
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600 rounded-b-none'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileSearch className="w-4 h-4" />
              <span>Resume Analysis</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectFeature('job-match')}
              className={`px-4 py-2.5 text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                activeFeature === 'job-match'
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600 rounded-b-none'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Job Match ({analysis.keywordMatchPercentage}%)</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectFeature('cover-letter')}
              className={`px-4 py-2.5 text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                activeFeature === 'cover-letter'
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600 rounded-b-none'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Cover Letter Generator</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectFeature('interview-prep')}
              className={`px-4 py-2.5 text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                activeFeature === 'interview-prep'
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600 rounded-b-none'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <MessageSquareQuote className="w-4 h-4" />
              <span>Interview Preparation ({analysis.interviewQuestions.length})</span>
            </button>
          </nav>
        </div>

        {/* Tab 1: Resume Analysis Details */}
        {activeFeature === 'resume-analysis' && (
          <div className="space-y-6">
            {/* Quantitative Baseline Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-xl border border-slate-200 bg-white">
                <span className="text-xs font-semibold text-slate-500 block mb-1">ATS Parsability</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                    {analysis.atsReadinessScore}/100
                  </span>
                  <span className="text-xs text-emerald-600 font-medium">Standard Structure</span>
                </div>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Based on section headers, contact information formatting, and scannable chronological layout.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 bg-white">
                <span className="text-xs font-semibold text-slate-500 block mb-1">Impact Metrics</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                    {analysis.quantifiableMetricsCount}
                  </span>
                  <span className="text-xs text-slate-600 font-medium">Quantified Points</span>
                </div>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Evidenced percentages, dollar values, scale numbers, or metrics found in your resume.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 bg-white">
                <span className="text-xs font-semibold text-slate-500 block mb-1">Action Verbs</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                    {analysis.actionVerbsDetected.length}
                  </span>
                  <span className="text-xs text-blue-600 font-medium">Leadership Verbs</span>
                </div>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Proactive leadership words detected: {analysis.actionVerbsDetected.slice(0, 4).join(', ') || 'demonstrated'}...
                </p>
              </div>
            </div>

            {/* AI Grounded Experience Alignment & Strengths */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-emerald-100 bg-emerald-50/30">
                <div className="flex items-center gap-2 mb-4 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Verified Candidate Strengths</span>
                </div>
                <ul className="space-y-3">
                  {(gemini?.strengths || analysis.keyStrengths).map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 rounded-xl border border-blue-100 bg-blue-50/30">
                <div className="flex items-center gap-2 mb-4 text-blue-800 font-bold text-sm">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <span>Relevant Experience & Alignments</span>
                </div>
                <ul className="space-y-3">
                  {(gemini?.relevantExperience || [
                    'Highlighted direct hands-on experience applicable to the target position.',
                    'Grounded project work matching expectations outlined in the job posting.',
                  ]).map((exp, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                      <span>{exp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Missing Skills & Actionable Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-amber-100 bg-amber-50/30">
                <div className="flex items-center gap-2 mb-4 text-amber-800 font-bold text-sm">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <span>Missing or Insufficiently Evidenced Skills</span>
                </div>
                <ul className="space-y-3">
                  {(gemini?.missingOrInsufficientSkills || [
                    'Review job requirements for domain proficiencies not explicitly evidenced in your experience.',
                  ]).map((miss, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span>{miss}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 rounded-xl border border-indigo-100 bg-indigo-50/30">
                <div className="flex items-center gap-2 mb-4 text-indigo-800 font-bold text-sm">
                  <UserCheck className="w-5 h-5 text-indigo-600" />
                  <span>Actionable Resume Enhancements</span>
                </div>
                <ul className="space-y-3">
                  {(gemini?.actionableImprovements || analysis.recommendedImprovements).map((imp, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ATS Readability Suggestions */}
            {gemini?.atsReadabilitySuggestions && gemini.atsReadabilitySuggestions.length > 0 && (
              <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/60">
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <FileSearch className="w-4 h-4 text-slate-600" />
                  <span>ATS Formatting & Readability Recommendations</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {gemini.atsReadabilitySuggestions.map((sug, i) => (
                    <div key={i} className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-700">
                      <span className="font-semibold text-slate-900 block mb-0.5">Suggestion {i + 1}</span>
                      <span>{sug}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Job Match Details */}
        {activeFeature === 'job-match' && (
          <div className="space-y-6">
            <div className="p-6 rounded-xl border border-slate-200 bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Transparent Keyword Baseline & Evidence-Based Match
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Approximate keyword presence compared transparently alongside in-depth Gemini AI textual evidence.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-indigo-600 font-mono tabular-nums">
                    {analysis.keywordMatchPercentage}%
                  </span>
                  <span className="text-xs text-slate-500 block font-medium">Approx. Keyword Indicator</span>
                  <span className="text-[10px] text-slate-400 block">(Not hiring probability)</span>
                </div>
              </div>

              {/* Matched Keywords (Transparent Baseline) */}
              <div className="mb-6 pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700 block mb-2">
                  Matched Skills & Keywords in Resume ({analysis.matchedKeywords.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {analysis.matchedKeywords.length > 0 ? (
                    analysis.matchedKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/60"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">No direct matches identified yet.</span>
                  )}
                </div>
              </div>

              {/* Missing Keywords Gap (Transparent Baseline) */}
              <div className="mb-6">
                <span className="text-xs font-bold text-slate-700 block mb-2">
                  Target Keywords Missing from Resume ({analysis.missingKeywords.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingKeywords.length > 0 ? (
                    analysis.missingKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-emerald-600 font-medium">
                      All primary target keywords detected.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* AI Deep Evidence Explanation */}
            {analysis.skillExplanations && analysis.skillExplanations.length > 0 && (
              <div className="p-6 rounded-xl border border-slate-200 bg-white">
                <div className="mb-4">
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>Evidence-Based Skill Grounding (Gemini AI Analysis)</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Detailed breakdown explaining matched skills and gaps using explicit textual evidence from the supplied text.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {analysis.skillExplanations.map((item, idx) => {
                    const isMatched = item.status.toLowerCase().includes('match');
                    const isGap = item.status.toLowerCase().includes('gap');

                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="font-bold text-slate-900 text-sm">{item.skill}</span>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                                isMatched
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : isGap
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 mb-1">
                            <strong className="text-slate-900">Evidence from Resume: </strong>
                            <span>{item.evidenceFromResume}</span>
                          </p>
                          <p className="text-xs text-slate-500">
                            <strong className="text-slate-700">Relevance to Job: </strong>
                            <span>{item.relevanceToJob}</span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Cover Letter Generator */}
        {activeFeature === 'cover-letter' && (
          <div className="space-y-4">
            <div className="p-6 rounded-xl border border-slate-200 bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span>Customized Cover Letter Draft</span>
                    {analysis.isAiGenerated && (
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                        AI Grounded · No Fabrications
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tailored using verified candidate accomplishments, evidenced skills, and role expectations without fabricating qualifications.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyCoverLetter}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  {copiedCoverLetter ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Cover Letter</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-5 bg-slate-50 rounded-lg border border-slate-200/80 font-mono text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed max-h-[460px] overflow-y-auto">
                {analysis.coverLetterDraft}
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>Grounded strictly in supplied resume experience</span>
                <span className="text-slate-400">Ready to personalize and submit</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Interview Preparation */}
        {activeFeature === 'interview-prep' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>Anticipated Interview Questions & Response Strategy</span>
                  <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {analysis.interviewQuestions.length} Questions
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Role-relevant questions grounded in your resume with structured answer outlines and clearly marked personalization guidance.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {analysis.interviewQuestions.map((q, idx) => (
                <div key={idx} className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded">
                        {q.category}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        #{idx + 1} of {analysis.interviewQuestions.length}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyQuestion(`${q.question}\n\nTalking Points:\n${q.answerOutline || q.tip}`, idx)}
                      className="text-xs text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1.5 p-1 rounded"
                      aria-label={`Copy question ${idx + 1}`}
                    >
                      {copiedQuestionIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <h4 className="font-semibold text-slate-900 text-sm mb-2 leading-snug">
                    "{q.question}"
                  </h4>

                  {q.rationale && (
                    <p className="text-xs text-slate-500 mb-3 italic">
                      <strong className="font-semibold not-italic text-slate-600">Interviewer Intent: </strong>
                      {q.rationale}
                    </p>
                  )}

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-700 space-y-2">
                    <div>
                      <strong className="text-slate-900 font-semibold block mb-1">
                        Grounded Answer Outline (from your resume):
                      </strong>
                      <p className="leading-relaxed">{q.answerOutline || q.tip}</p>
                    </div>

                    {q.personalizationNote && (
                      <div className="pt-2 border-t border-slate-200/60 text-indigo-900 bg-indigo-50/60 p-2.5 rounded">
                        <strong className="font-semibold block mb-0.5 text-indigo-950">
                          Personalization Guidance:
                        </strong>
                        <p className="leading-relaxed text-indigo-800">{q.personalizationNote}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
