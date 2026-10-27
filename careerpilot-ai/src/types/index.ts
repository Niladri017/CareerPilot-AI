export type FeatureKey = 'resume-analysis' | 'job-match' | 'cover-letter' | 'interview-prep';

export interface FeatureItem {
  id: FeatureKey;
  title: string;
  tagline: string;
  description: string;
  iconName: string;
}

export interface InterviewQuestionItem {
  question: string;
  category: string;
  tip?: string;
  rationale?: string;
  answerOutline?: string;
  personalizationNote?: string;
}

export interface GeminiSkillMatchExplanation {
  skill: string;
  status: 'matched' | 'partial' | 'gap' | string;
  evidenceFromResume: string;
  relevanceToJob: string;
}

export interface GeminiResumeAnalysis {
  strengths: string[];
  relevantExperience: string[];
  missingOrInsufficientSkills: string[];
  atsReadabilitySuggestions: string[];
  actionableImprovements: string[];
}

export interface AnalysisResult {
  isAiGenerated?: boolean;
  overallScore: number;
  atsReadinessScore: number;
  keywordMatchPercentage: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  keyStrengths: string[];
  recommendedImprovements: string[];
  actionVerbsDetected: string[];
  quantifiableMetricsCount: number;
  coverLetterDraft: string;
  interviewQuestions: InterviewQuestionItem[];
  geminiAnalysis?: GeminiResumeAnalysis;
  skillExplanations?: GeminiSkillMatchExplanation[];
}
