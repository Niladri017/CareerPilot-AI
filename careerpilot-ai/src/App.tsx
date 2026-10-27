/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeatureCards } from './components/FeatureCards';
import { InputWorkspace } from './components/InputWorkspace';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { HowItWorks } from './components/HowItWorks';
import { Footer } from './components/Footer';
import { FeatureKey, AnalysisResult } from './types/index';
import {
  analyzeApplication,
  SAMPLE_RESUME,
  SAMPLE_JOB_DESCRIPTION,
} from './utils/textAnalysis';
import { mergeGeminiWithBaseline } from './utils/geminiTransformer';
import { AlertCircle, RefreshCw, KeyRound, Sparkles } from 'lucide-react';

interface ApiErrorState {
  title: string;
  message: string;
  code?: string;
}

export default function App() {
  const [resumeText, setResumeText] = useState<string>('');
  const [jobDescText, setJobDescText] = useState<string>('');
  const [activeFeature, setActiveFeature] = useState<FeatureKey>('resume-analysis');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [apiError, setApiError] = useState<ApiErrorState | null>(null);

  const performAnalysis = async (resume: string, jobDesc: string, targetFeature?: FeatureKey) => {
    // Prevent duplicate concurrent requests
    if (isAnalyzing) return;

    if (!resume.trim() && !jobDesc.trim()) {
      setErrorMessage('Please paste both your resume text and the job description before analyzing.');
      return;
    }
    if (!resume.trim()) {
      setErrorMessage('Please paste your resume text to evaluate.');
      return;
    }
    if (!jobDesc.trim()) {
      setErrorMessage('Please paste the job description to compare your qualifications against.');
      return;
    }

    setErrorMessage(null);
    setApiError(null);
    setIsAnalyzing(true);

    // Compute baseline transparent keyword and structure metrics
    const baseline = analyzeApplication(resume, jobDesc);

    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText: resume,
          jobDescText: jobDesc,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        // Handle server-side errors, missing API keys, or model failures
        // Note: We never show fake AI results when the API fails
        setAnalysis(null);
        if (result.code === 'MISSING_API_KEY') {
          setApiError({
            title: 'Gemini API Key Configuration Required',
            message: 'GEMINI_API_KEY is not set on the server. Please add your GEMINI_API_KEY secret in the AI Studio Secrets panel to enable live model analysis.',
            code: 'MISSING_API_KEY',
          });
        } else if (result.code === 'UNAVAILABLE') {
          setApiError({
            title: 'Gemini Service Temporarily at Capacity',
            message: 'The model is currently experiencing high demand spikes. Spikes in demand are temporary. Please click "Retry Live Gemini Analysis" to retry.',
            code: 'UNAVAILABLE',
          });
        } else {
          setApiError({
            title: 'Live Gemini Analysis Failed',
            message: result.error || 'The model could not process this request. Please verify your inputs and try again.',
            code: result.code || 'API_ERROR',
          });
        }
        setIsAnalyzing(false);
        return;
      }

      // Merge verified Gemini output with baseline metrics
      const merged = mergeGeminiWithBaseline(result.data, baseline);
      setAnalysis(merged);
      if (targetFeature) {
        setActiveFeature(targetFeature);
      }
      setIsAnalyzing(false);

      // Scroll smoothly to results
      setTimeout(() => {
        const resultsEl = document.getElementById('results');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 60);
    } catch (err: any) {
      // Network or connection failure: do not mock fake AI results
      setAnalysis(null);
      setApiError({
        title: 'Connection Error',
        message: err.message || 'Unable to communicate with the application server. Please verify your server connection and retry.',
        code: 'NETWORK_ERROR',
      });
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeClick = () => {
    performAnalysis(resumeText, jobDescText);
  };

  const handleLoadSample = () => {
    setResumeText(SAMPLE_RESUME);
    setJobDescText(SAMPLE_JOB_DESCRIPTION);
    setErrorMessage(null);
    setApiError(null);
    performAnalysis(SAMPLE_RESUME, SAMPLE_JOB_DESCRIPTION, 'resume-analysis');
  };

  const handleLoadSampleResume = () => {
    setResumeText(SAMPLE_RESUME);
    if (errorMessage) setErrorMessage(null);
    setApiError(null);
    if (jobDescText.trim()) {
      performAnalysis(SAMPLE_RESUME, jobDescText, activeFeature);
    }
  };

  const handleLoadSampleJobDesc = () => {
    setJobDescText(SAMPLE_JOB_DESCRIPTION);
    if (errorMessage) setErrorMessage(null);
    setApiError(null);
    if (resumeText.trim()) {
      performAnalysis(resumeText, SAMPLE_JOB_DESCRIPTION, activeFeature);
    }
  };

  const handleSelectFeature = (feature: FeatureKey) => {
    setActiveFeature(feature);
    if (!analysis && resumeText.trim() && jobDescText.trim() && !isAnalyzing) {
      performAnalysis(resumeText, jobDescText, feature);
    } else if (analysis) {
      const resultsEl = document.getElementById('results');
      if (resultsEl) {
        resultsEl.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      const workspaceEl = document.getElementById('workspace');
      if (workspaceEl) {
        workspaceEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleReset = () => {
    setResumeText('');
    setJobDescText('');
    setAnalysis(null);
    setErrorMessage(null);
    setApiError(null);
    setActiveFeature('resume-analysis');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar
        onLoadSample={handleLoadSample}
        onReset={handleReset}
        hasContent={Boolean(resumeText || jobDescText || analysis)}
      />

      <main className="flex-1">
        <Hero onLoadSample={handleLoadSample} />

        <FeatureCards
          activeFeature={activeFeature}
          onSelectFeature={handleSelectFeature}
          analysis={analysis}
        />

        <InputWorkspace
          resumeText={resumeText}
          jobDescText={jobDescText}
          onResumeChange={(val) => {
            setResumeText(val);
            if (errorMessage) setErrorMessage(null);
            if (apiError) setApiError(null);
          }}
          onJobDescChange={(val) => {
            setJobDescText(val);
            if (errorMessage) setErrorMessage(null);
            if (apiError) setApiError(null);
          }}
          onAnalyze={handleAnalyzeClick}
          onLoadSample={handleLoadSample}
          onLoadSampleResume={handleLoadSampleResume}
          onLoadSampleJobDesc={handleLoadSampleJobDesc}
          onClearResume={() => setResumeText('')}
          onClearJobDesc={() => setJobDescText('')}
          isAnalyzing={isAnalyzing}
          errorMessage={errorMessage}
        />

        {/* Dedicated API Error / Configuration Setup State */}
        {apiError && (
          <section className="py-6 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div
                role="alert"
                className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 shadow-sm"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                    {apiError.code === 'MISSING_API_KEY' ? (
                      <KeyRound className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-base text-rose-900">
                      {apiError.title}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-rose-800 leading-relaxed">
                      {apiError.message}
                    </p>

                    {apiError.code === 'MISSING_API_KEY' && (
                      <div className="mt-3 p-3.5 bg-white/80 rounded-lg border border-rose-200/80 text-xs text-rose-900 leading-relaxed space-y-1">
                        <strong className="block text-slate-900">How to configure your API key securely:</strong>
                        <p>1. Open the <strong>Settings &gt; Secrets</strong> panel in the Google AI Studio interface.</p>
                        <p>2. Add or attach your secret named <code className="bg-rose-100 px-1 py-0.5 rounded text-rose-900 font-mono">GEMINI_API_KEY</code>.</p>
                        <p>3. AI Studio automatically injects this secret into the server environment without exposing it to the client.</p>
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={handleAnalyzeClick}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-xs"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Retry Live Gemini Analysis</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Active Analysis Dashboard (Only shown on verified success) */}
        {analysis && (
          <AnalysisDashboard
            analysis={analysis}
            activeFeature={activeFeature}
            onSelectFeature={setActiveFeature}
            onReanalyze={handleAnalyzeClick}
          />
        )}

        <HowItWorks />
      </main>

      <Footer />
    </div>
  );
}
