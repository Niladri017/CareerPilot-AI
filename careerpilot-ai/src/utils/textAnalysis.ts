import { AnalysisResult, InterviewQuestionItem } from '../types/index';

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'can\'t', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during',
  'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s',
  'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself',
  'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my', 'myself',
  'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
  'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such',
  'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too',
  'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t',
  'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves',
  'will', 'also', 'experience', 'ability', 'work', 'working', 'team', 'teams', 'skills', 'role', 'job', 'seeking', 'responsible', 'duties',
  'years', 'senior', 'staff', 'lead', 'junior', 'principal', 'company', 'looking', 'including', 'strong', 'well', 'high', 'within'
]);

const ACTION_VERBS = [
  'accelerated', 'achieved', 'administered', 'analyzed', 'architected', 'automated',
  'budgeted', 'built', 'championed', 'collaborated', 'consolidated', 'created',
  'delivered', 'designed', 'developed', 'devised', 'directed', 'engineered',
  'established', 'executed', 'expanded', 'expedited', 'formulated', 'generated',
  'guided', 'headed', 'identified', 'implemented', 'improved', 'increased',
  'initiated', 'innovated', 'instituted', 'integrated', 'launched', 'led',
  'maximized', 'mentored', 'modernized', 'negotiated', 'optimized', 'orchestrated',
  'overhauled', 'pioneered', 'planned', 'produced', 'reduced', 'refactored',
  'resolved', 'restructured', 'scaled', 'spearheaded', 'standardized', 'streamlined',
  'strengthened', 'supervised', 'surpassed', 'trained', 'transformed', 'upgraded'
];

export function countWords(text: string): number {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function countCharacters(text: string): number {
  return text ? text.length : 0;
}

export function extractSignificantKeywords(text: string, limit = 20): string[] {
  if (!text) return [];
  const tokens = text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9+#.\s]/g, ' ')
    .split(/\s+/)
    .map(t => t.replace(/^[^\w+#]+|[^\w+#]+$/g, '').trim())
    .filter(t => t.length > 2 && !STOP_WORDS.has(t));

  const frequencyMap = new Map<string, number>();
  for (const token of tokens) {
    frequencyMap.set(token, (frequencyMap.get(token) || 0) + 1);
  }

  return Array.from(frequencyMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(entry => entry[0]);
}

export function findActionVerbs(text: string): string[] {
  if (!text) return [];
  const lower = text.toLowerCase();
  const matched = new Set<string>();

  for (const verb of ACTION_VERBS) {
    const regex = new RegExp(`\\b${verb}\\b`, 'i');
    if (regex.test(lower)) {
      matched.add(verb);
    }
  }

  return Array.from(matched);
}

export function countQuantifiableMetrics(text: string): number {
  if (!text) return 0;
  // Match patterns like 25%, $1.2M, $50k, 10x, 150+, 40 hours, 100k, 5,000
  const metricRegex = /\b(\$?\d+(?:[.,]\d+)?\s?(?:%|x|k|m|b|million|billion|users|customers|hours|days|weeks|teams)?|\d+\+)\b/gi;
  const matches = text.match(metricRegex);
  return matches ? matches.length : 0;
}

export function calculateJobMatch(resumeText: string, jobDescText: string): {
  matchedKeywords: string[];
  missingKeywords: string[];
  matchPercentage: number;
} {
  const jobKeywords = extractSignificantKeywords(jobDescText, 18);
  if (jobKeywords.length === 0) {
    return {
      matchedKeywords: [],
      missingKeywords: [],
      matchPercentage: 0,
    };
  }

  const resumeLower = resumeText.toLowerCase();
  const matched: string[] = [];
  const missing: string[] = [];

  for (const kw of jobKeywords) {
    if (resumeLower.includes(kw)) {
      matched.push(kw);
    } else {
      missing.push(kw);
    }
  }

  const matchPercentage = Math.round((matched.length / jobKeywords.length) * 100);

  return {
    matchedKeywords: matched,
    missingKeywords: missing,
    matchPercentage,
  };
}

export function generateCoverLetterText(resumeText: string, jobDescText: string): string {
  // Extract candidate first words or name if present
  const lines = resumeText.trim().split('\n').map(l => l.trim()).filter(Boolean);
  const possibleName = lines.length > 0 && lines[0].length < 40 ? lines[0] : 'Candidate';

  const jobLines = jobDescText.trim().split('\n').map(l => l.trim()).filter(Boolean);
  const possibleJobTitle = jobLines.length > 0 && jobLines[0].length < 60 ? jobLines[0] : 'the advertised position';

  const actionVerbs = findActionVerbs(resumeText);
  const matchedData = calculateJobMatch(resumeText, jobDescText);
  const topKeywords = matchedData.matchedKeywords.slice(0, 4).join(', ') || 'core domain skills';

  return `Dear Hiring Manager,

I am writing to express my strong enthusiasm for ${possibleJobTitle}. Having reviewed the requirements and expectations for the role, I am confident that my background, proven track record, and technical capabilities align directly with your team's objectives.

Throughout my career, I have consistently focused on delivering tangible business value. In my recent roles, I have ${actionVerbs.slice(0, 3).join(', ') || 'developed, optimized, and delivered'} impactful initiatives that elevated team velocity and product quality. My hands-on proficiency with ${topKeywords} enables me to contribute to key milestones from day one.

What excites me most about this opportunity is the opportunity to bring disciplined problem-solving and cross-functional leadership to high-impact projects. I thrive in environments where data-driven execution and strategic alignment drive sustainable growth.

Thank you for your time and consideration. I would welcome the opportunity to discuss how my experience and dedication will help support your team's upcoming priorities.

Sincerely,
${possibleName}`;
}

export function generateInterviewQuestions(jobDescText: string, resumeText: string): InterviewQuestionItem[] {
  const match = calculateJobMatch(resumeText, jobDescText);
  const keyAreas = match.matchedKeywords.slice(0, 3);
  const missingAreas = match.missingKeywords.slice(0, 2);

  const questions: InterviewQuestionItem[] = [
    {
      category: 'Behavioral',
      question: 'Walk me through a time when a project scope or priority shifted abruptly. How did you adapt your roadmap and keep stakeholders aligned?',
      tip: 'Structure your response using the STAR method (Situation, Task, Action, Result). Focus on calm leadership and measurable outcomes.',
    },
    {
      category: 'Technical',
      question: `How have you applied ${keyAreas[0] || 'core technologies'} in production environments to solve complex system bottlenecks?`,
      tip: 'Be specific about trade-offs you evaluated, architecture decisions, and metrics that demonstrated latency or efficiency improvements.',
    },
    {
      category: 'Role-Fit',
      question: `This role demands strong ownership around ${keyAreas[1] || 'operational excellence'}. What is your philosophy for balancing velocity against quality?`,
      tip: 'Highlight automated testing, code reviews, and incremental delivery cadences you have established in past teams.',
    },
    {
      category: 'Situational',
      question: missingAreas[0]
        ? `Our team frequently works with ${missingAreas[0]}. How quickly do you onboard into less familiar technical areas or domains?`
        : 'Tell me about an instance where you identified an unaddressed gap in product workflow and independently spearheaded the fix.',
      tip: 'Demonstrate intellectual curiosity, structured learning systems, and resourcefulness when encountering ambiguous challenges.',
    },
  ];

  return questions;
}

export function analyzeApplication(resumeText: string, jobDescText: string): AnalysisResult {
  const resumeWords = countWords(resumeText);
  const jobWords = countWords(jobDescText);
  const actionVerbs = findActionVerbs(resumeText);
  const metricCount = countQuantifiableMetrics(resumeText);
  const matchData = calculateJobMatch(resumeText, jobDescText);

  // ATS Readiness heuristic
  let atsScore = 65;
  if (resumeWords >= 200 && resumeWords <= 900) atsScore += 15;
  if (actionVerbs.length >= 5) atsScore += 10;
  if (metricCount >= 3) atsScore += 10;
  atsScore = Math.min(98, Math.max(40, atsScore));

  // Overall Score combining match and ATS
  const overallScore = Math.round((matchData.matchPercentage * 0.55) + (atsScore * 0.45));

  // Key strengths
  const keyStrengths: string[] = [];
  if (actionVerbs.length >= 4) {
    keyStrengths.push(`Rich action-oriented phrasing (${actionVerbs.length} strong leadership verbs detected)`);
  }
  if (metricCount >= 3) {
    keyStrengths.push(`Quantified impact present (${metricCount} metric/data points identified)`);
  }
  if (matchData.matchedKeywords.length >= 3) {
    keyStrengths.push(`Direct alignment on core keywords: ${matchData.matchedKeywords.slice(0, 4).join(', ')}`);
  }
  if (keyStrengths.length === 0) {
    keyStrengths.push('Clean layout and foundational professional summary');
  }

  // Recommended improvements
  const recommendedImprovements: string[] = [];
  if (matchData.missingKeywords.length > 0) {
    recommendedImprovements.push(`Incorporate high-frequency target keywords from the job listing: ${matchData.missingKeywords.slice(0, 4).join(', ')}`);
  }
  if (metricCount < 3) {
    recommendedImprovements.push('Add specific quantifiable accomplishments (e.g., percentages, dollar amounts, time saved, team size).');
  }
  if (resumeWords < 250) {
    recommendedImprovements.push('Elaborate on project scope and responsibilities to provide deeper context for hiring managers.');
  } else if (resumeWords > 950) {
    recommendedImprovements.push('Condense bullet points to maintain scannability for 30-second initial recruiter reviews.');
  }

  const coverLetterDraft = generateCoverLetterText(resumeText, jobDescText);
  const interviewQuestions = generateInterviewQuestions(jobDescText, resumeText);

  return {
    overallScore,
    atsReadinessScore: atsScore,
    keywordMatchPercentage: matchData.matchPercentage,
    matchedKeywords: matchData.matchedKeywords,
    missingKeywords: matchData.missingKeywords,
    keyStrengths,
    recommendedImprovements,
    actionVerbsDetected: actionVerbs,
    quantifiableMetricsCount: metricCount,
    coverLetterDraft,
    interviewQuestions,
  };
}

export const SAMPLE_RESUME = `Elena Vance
Senior Full-Stack Engineer | San Francisco, CA | elena.vance@example.com | (555) 019-2834

PROFESSIONAL SUMMARY
Results-driven Senior Full-Stack Engineer with 6+ years of experience building scalable distributed web applications, high-throughput microservices, and modern user interfaces. Proven track record in TypeScript, React, Node.js, and cloud platforms. Passionate about engineering velocity, automated CI/CD, and system reliability.

PROFESSIONAL EXPERIENCE
Senior Software Engineer | CloudVenture Systems | 2021 – Present
- Architected and deployed microservices architecture handling 15M+ daily requests using TypeScript, Node.js, and Redis.
- Led frontend modernization by migrating legacy dashboards to React and Tailwind CSS, reducing page load times by 42%.
- Streamlined CI/CD deployment pipelines on AWS (ECS, Lambda), decreasing release cycle duration from 4 hours to 18 minutes.
- Mentored a cohort of 5 junior and mid-level engineers, instituting code review standards and unit testing conventions.

Software Engineer | NextEra Analytics | 2018 – 2021
- Engineered responsive client-facing data analytics dashboards consumed by 120,000+ monthly active business users.
- Optimized PostgreSQL relational database queries and indexing strategies, improving report generation throughput by 35%.
- Collaborated with product designers to implement WCAG 2.1 AA compliant component design systems.
- Automated end-to-end integration test suites, boosting deployment test coverage from 68% to 94%.

TECHNICAL SKILLS
Languages & Frameworks: TypeScript, JavaScript, React, Node.js, Next.js, Python, HTML5, CSS3, Tailwind CSS
Databases & Cloud: PostgreSQL, Redis, MongoDB, AWS (Lambda, S3, ECS), Docker, Git, CI/CD, REST APIs, GraphQL`;

export const SAMPLE_JOB_DESCRIPTION = `Staff Frontend Engineer - Core Platform
Company: Lumina Systems (San Francisco, CA / Hybrid)

About The Role:
We are looking for an exceptional Staff Frontend Engineer to lead our Core Platform engineering initiatives. In this role, you will define architectural standards, build scalable web experiences, and partner with product designers to ship mission-critical tooling.

Responsibilities:
- Architect and scale web applications using TypeScript, React, and modern CSS frameworks.
- Drive frontend performance optimization, accessibility (WCAG AA), and high-reliability client infrastructure.
- Collaborate cross-functionally with backend engineers, product managers, and designers to deliver clean user experiences.
- Establish frontend testing standards, automated CI/CD pipelines, and robust developer tooling.
- Mentor junior and senior engineers, conducting high-quality code reviews and technical design discussions.

Qualifications & Requirements:
- 5+ years of software engineering experience with deep expertise in TypeScript and React.
- Strong proficiency with Node.js, REST APIs, PostgreSQL, and cloud deployments (AWS or GCP).
- Demonstrated experience optimizing web performance, state management, and responsive layouts.
- Track record of shipping reliable, accessible software with automated testing and continuous integration.
- Excellent communication skills and enthusiasm for collaborating in fast-paced product squads.`;
