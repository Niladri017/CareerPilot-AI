import test from 'node:test';
import assert from 'node:assert/strict';
import { mergeGeminiWithBaseline, RawGeminiResponse } from './geminiTransformer';
import { analyzeApplication, SAMPLE_RESUME, SAMPLE_JOB_DESCRIPTION } from './textAnalysis';

test('mergeGeminiWithBaseline correctly integrates AI fields while preserving transparent baseline metrics', () => {
  const baseline = analyzeApplication(SAMPLE_RESUME, SAMPLE_JOB_DESCRIPTION);

  const mockRawGemini: RawGeminiResponse = {
    resumeAnalysis: {
      strengths: ['Demonstrated experience leading cloud migration and microservices.'],
      relevantExperience: ['Led migration from monolithic to React/TypeScript dashboards reducing load by 42%.'],
      missingOrInsufficientSkills: ['Deep Kubernetes cluster orchestration not explicitly detailed.'],
      atsReadabilitySuggestions: ['Standardize bullet points under Technical Skills section.'],
      actionableImprovements: ['Add quantitative impact to initial software engineer role.'],
    },
    skillMatchExplanations: [
      {
        skill: 'TypeScript',
        status: 'matched',
        evidenceFromResume: 'Explicitly used across CloudVenture Systems and listed in Core Skills.',
        relevanceToJob: 'Core requirement for Staff Frontend Engineer role.',
      },
      {
        skill: 'Kubernetes',
        status: 'gap',
        evidenceFromResume: 'Docker and AWS mentioned, but no explicit Kubernetes mention.',
        relevanceToJob: 'Preferred for cross-functional infrastructure alignment.',
      },
    ],
    tailoredCoverLetter: 'Dear Lumina Systems Hiring Team, I am writing to apply for the Staff Frontend Engineer role...',
    interviewQuestions: Array.from({ length: 8 }, (_, i) => ({
      question: `Question ${i + 1} regarding system architecture?`,
      category: i % 2 === 0 ? 'Technical' : 'Behavioral',
      rationale: `Tests candidate proficiency with scalable web applications.`,
      answerOutline: `Reference the 15M+ daily requests microservice architecture.`,
      personalizationNote: `[Requires Personalization]: Detail exact concurrency numbers and cache hit rates.`,
    })),
  };

  const merged = mergeGeminiWithBaseline(mockRawGemini, baseline);

  assert.equal(merged.isAiGenerated, true);
  assert.equal(merged.interviewQuestions.length, 8);
  assert.equal(merged.skillExplanations?.length, 2);
  assert.ok(merged.geminiAnalysis?.missingOrInsufficientSkills.includes('Deep Kubernetes cluster orchestration not explicitly detailed.'));
  assert.equal(merged.keywordMatchPercentage, baseline.keywordMatchPercentage);
  assert.equal(merged.overallScore, baseline.overallScore);
  assert.ok(merged.coverLetterDraft.includes('Lumina Systems'));
});
