import test from 'node:test';
import assert from 'node:assert/strict';
import {
  countWords,
  countCharacters,
  extractSignificantKeywords,
  findActionVerbs,
  countQuantifiableMetrics,
  calculateJobMatch,
  analyzeApplication,
  SAMPLE_RESUME,
  SAMPLE_JOB_DESCRIPTION
} from './textAnalysis';

test('countWords calculates accurate word counts', () => {
  assert.equal(countWords(''), 0);
  assert.equal(countWords('   '), 0);
  assert.equal(countWords('CareerPilot AI job assistant'), 4);
  assert.equal(countWords('   One   two   three   '), 3);
});

test('countCharacters calculates exact string lengths', () => {
  assert.equal(countCharacters(''), 0);
  assert.equal(countCharacters('abc'), 3);
});

test('extractSignificantKeywords strips stop words and returns top terms', () => {
  const sample = 'TypeScript React React TypeScript Node.js React performance';
  const keywords = extractSignificantKeywords(sample, 5);
  assert.equal(keywords[0], 'react');
  assert.ok(keywords.includes('typescript'));
});

test('findActionVerbs identifies impactful leadership verbs', () => {
  const sample = 'Architected and deployed microservices. Streamlined CI/CD and mentored engineers.';
  const verbs = findActionVerbs(sample);
  assert.ok(verbs.includes('architected'));
  assert.ok(verbs.includes('streamlined'));
  assert.ok(verbs.includes('mentored'));
});

test('countQuantifiableMetrics detects percentages and numbers with units', () => {
  const sample = 'Reduced latency by 42% and supported 15M+ requests with 5 engineers across 4 hours.';
  const count = countQuantifiableMetrics(sample);
  assert.ok(count >= 3);
});

test('calculateJobMatch compares resume against job description', () => {
  const match = calculateJobMatch(SAMPLE_RESUME, SAMPLE_JOB_DESCRIPTION);
  assert.ok(match.matchPercentage > 50);
  assert.ok(match.matchedKeywords.length > 0);
});

test('analyzeApplication generates comprehensive assessment', () => {
  const result = analyzeApplication(SAMPLE_RESUME, SAMPLE_JOB_DESCRIPTION);
  assert.ok(result.overallScore >= 60);
  assert.ok(result.atsReadinessScore >= 70);
  assert.ok(result.coverLetterDraft.includes('Dear Hiring Manager'));
  assert.equal(result.interviewQuestions.length, 4);
});
