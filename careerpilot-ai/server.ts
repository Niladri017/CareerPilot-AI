import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '5mb' }));

  // Initialize Gemini client strictly on the server
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      })
    : null;

  // Health and configuration status endpoint
  app.get('/api/gemini/status', (req, res) => {
    res.json({
      configured: Boolean(process.env.GEMINI_API_KEY),
      model: 'gemini-3.8-flash',
    });
  });

  // Dedicated endpoint for Gemini AI Application Analysis
  app.post('/api/gemini/analyze', async (req, res) => {
    try {
      const { resumeText, jobDescText } = req.body;

      if (!resumeText || !resumeText.trim()) {
        return res.status(400).json({
          error: 'Resume text is required.',
          code: 'MISSING_RESUME',
        });
      }

      if (!jobDescText || !jobDescText.trim()) {
        return res.status(400).json({
          error: 'Job description text is required.',
          code: 'MISSING_JOB_DESC',
        });
      }

      if (!ai || !process.env.GEMINI_API_KEY) {
        return res.status(503).json({
          error: 'Gemini API key is not configured on the server.',
          code: 'MISSING_API_KEY',
          message: 'GEMINI_API_KEY is not set. Please configure GEMINI_API_KEY in the Secrets panel in AI Studio.',
        });
      }

      const prompt = `You are CareerPilot AI, an objective career intelligence advisor and senior technical recruiter.
Analyze the candidate's resume strictly against the target job description.

CRITICAL TRUTHFULNESS & GROUNDING MANDATES:
1. NEVER invent, assume, or hallucinate candidate qualifications, metrics, companies, or experience not explicitly present in the provided resume.
2. If a required or preferred skill from the job description is absent or insufficiently evidenced in the resume, you must explicitly note that it is missing or lacks supporting evidence.
3. For matched skills, cite specific verifiable evidence directly from the candidate's resume text.
4. For the tailored cover letter, ground every single claim in the candidate's verified background. Do NOT fabricate numbers, achievements, or past responsibilities.
5. Generate EXACTLY eight (8) role-relevant interview questions testing the candidate against the role requirements. For each question, provide an answer outline grounded strictly in their actual resume experience, and explicitly mark any areas requiring personalization (e.g. personal reflection, specific metrics, company context) with "[Requires Personalization]: ...".

CANDIDATE RESUME:
"""
${resumeText}
"""

TARGET JOB DESCRIPTION:
"""
${jobDescText}
"""`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an objective, honest, and rigorous AI job application analyst. You evaluate resumes against job descriptions based exclusively on verified evidence in the text.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              resumeAnalysis: {
                type: Type.OBJECT,
                properties: {
                  strengths: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Candidate strengths grounded strictly in the resume evidence.',
                  },
                  relevantExperience: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Highlighted roles, responsibilities, and achievements from the resume that directly align with the job description.',
                  },
                  missingOrInsufficientSkills: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Skills or qualifications required or preferred by the job description that are missing or insufficiently evidenced in the resume.',
                  },
                  atsReadabilitySuggestions: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Concrete ATS structural, layout, and terminology suggestions.',
                  },
                  actionableImprovements: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Actionable recommendations to enhance the resume for this specific position without inventing qualifications.',
                  },
                },
                required: [
                  'strengths',
                  'relevantExperience',
                  'missingOrInsufficientSkills',
                  'atsReadabilitySuggestions',
                  'actionableImprovements',
                ],
              },
              skillMatchExplanations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    skill: { type: Type.STRING },
                    status: { type: Type.STRING, description: "'matched' | 'partial' | 'gap'" },
                    evidenceFromResume: { type: Type.STRING, description: 'Specific evidence found in the resume or explanation of what is missing.' },
                    relevanceToJob: { type: Type.STRING, description: 'Why this skill matters for this job description.' },
                  },
                  required: ['skill', 'status', 'evidenceFromResume', 'relevanceToJob'],
                },
                description: 'Detailed skill match and gap explanations using evidence from the supplied text.',
              },
              tailoredCoverLetter: {
                type: Type.STRING,
                description: 'Tailored cover letter grounded completely in the resume and job description without fabricating achievements or qualifications.',
              },
              interviewQuestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    category: { type: Type.STRING, description: 'e.g., Behavioral, Technical, Architecture, Role-Fit, Leadership, Situational' },
                    rationale: { type: Type.STRING, description: 'Why an interviewer for this role would ask this question based on the job requirements.' },
                    answerOutline: { type: Type.STRING, description: 'Structured answer outline grounded strictly in the candidate actual resume experience.' },
                    personalizationNote: { type: Type.STRING, description: 'Marked guidance indicating where candidate must provide personal context, metrics, or reflection.' },
                  },
                  required: ['question', 'category', 'rationale', 'answerOutline', 'personalizationNote'],
                },
                description: 'Exactly eight role-relevant interview questions grounded in the resume.',
              },
            },
            required: [
              'resumeAnalysis',
              'skillMatchExplanations',
              'tailoredCoverLetter',
              'interviewQuestions',
            ],
          },
        },
      });

      const rawJson = response.text;
      if (!rawJson) {
        throw new Error('Gemini model returned an empty response.');
      }

      const parsedData = JSON.parse(rawJson);
      return res.json({
        success: true,
        data: parsedData,
      });
    } catch (err: any) {
      console.error('Gemini API Error:', err);

      let cleanMessage = err.message || 'An error occurred while analyzing with Gemini.';
      let errorCode = 'GEMINI_ERROR';

      // Parse nested JSON errors from the GoogleGenAI SDK
      try {
        if (typeof err.message === 'string' && err.message.trim().startsWith('{')) {
          const parsed = JSON.parse(err.message);
          if (parsed.error?.message) {
            cleanMessage = parsed.error.message;
            errorCode = parsed.error.status || (parsed.error.code ? `HTTP_${parsed.error.code}` : 'GEMINI_ERROR');
          }
        }
      } catch {
        // Keep fallback cleanMessage
      }

      return res.status(500).json({
        error: cleanMessage,
        code: errorCode,
      });
    }
  });

  // Development vs Production serving
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CareerPilot AI server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
