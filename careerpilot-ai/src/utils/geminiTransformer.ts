import { AnalysisResult, GeminiResumeAnalysis, GeminiSkillMatchExplanation, InterviewQuestionItem } from '../types/index';

export interface RawGeminiResponse {
  resumeAnalysis: GeminiResumeAnalysis;
  skillMatchExplanations: GeminiSkillMatchExplanation[];
  tailoredCoverLetter: string;
  interviewQuestions: Array<{
    question: string;
    category: string;
    rationale: string;
    answerOutline: string;
    personalizationNote: string;
  }>;
}

export function mergeGeminiWithBaseline(
  raw: RawGeminiResponse,
  baseline: AnalysisResult
): AnalysisResult {
  const transformedQuestions: InterviewQuestionItem[] = (raw.interviewQuestions || []).map((q) => ({
    question: q.question,
    category: q.category,
    rationale: q.rationale,
    answerOutline: q.answerOutline,
    personalizationNote: q.personalizationNote,
    tip: q.answerOutline ? `${q.answerOutline} ${q.personalizationNote || ''}`.trim() : q.rationale,
  }));

  return {
    ...baseline,
    isAiGenerated: true,
    geminiAnalysis: raw.resumeAnalysis,
    keyStrengths: raw.resumeAnalysis?.strengths?.length
      ? raw.resumeAnalysis.strengths
      : baseline.keyStrengths,
    recommendedImprovements: raw.resumeAnalysis?.actionableImprovements?.length
      ? raw.resumeAnalysis.actionableImprovements
      : baseline.recommendedImprovements,
    skillExplanations: raw.skillMatchExplanations || [],
    coverLetterDraft: raw.tailoredCoverLetter || baseline.coverLetterDraft,
    interviewQuestions: transformedQuestions.length === 8 ? transformedQuestions : (transformedQuestions.length > 0 ? transformedQuestions : baseline.interviewQuestions),
  };
}
