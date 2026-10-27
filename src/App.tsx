import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Upload,
  FileText,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Printer,
  Download,
  RefreshCw,
  Search,
  CheckCheck,
} from 'lucide-react';

interface AnalysisData {
  ats_score: number;
  summary: string;
  match_analysis: string;
  matching_skills: string[];
  missing_keywords: string[];
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
}

export default function App() {
  const [resume, setResume] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisData | null>(null);
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // File upload handler (PDF, TXT, MD, DOCX)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setFileName(file.name);

    try {
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        // Use PDF.js if available
        if ((window as any).pdfjsLib) {
          const buffer = await file.arrayBuffer();
          const pdf = await (window as any).pdfjsLib.getDocument({ data: buffer }).promise;
          let extracted = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            extracted += content.items.map((it: any) => it.str).join(' ') + '\n';
          }
          if (extracted.trim()) {
            setResume(extracted.trim());
            return;
          }
        }
      }

      // Plaintext or fallback text reading
      const text = await file.text();
      if (text.trim()) {
        setResume(text.trim());
      } else {
        throw new Error('The uploaded file was empty. Please paste your resume text directly.');
      }
    } catch (err: any) {
      console.error(err);
      setError('Could not extract text from this file. Please paste your resume text directly into the box.');
    }
  };

  // Analyze Resume Function
  const handleAnalyze = async () => {
    if (!resume.trim() || !jobDesc.trim()) {
      setError('Please provide both your Resume text and the Job Description to analyze.');
      return;
    }

    if (resume.trim().length < 30 || jobDesc.trim().length < 30) {
      setError('Please provide more complete details for both your resume and the job description (at least 30 characters each).');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    // 45-second timeout controller so it never hangs in infinite loading
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume: resume.trim(),
          jobDesc: jobDesc.trim(),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Verify that the response is JSON, not HTML from a catch-all rewrite
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('Server returned an invalid response. Please ensure the backend is running and GEMINI_API_KEY is configured in Vercel.');
      }

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error || `Server error (${response.status}) while analyzing resume.`);
      }

      if (!json.data || typeof json.data.ats_score !== 'number') {
        throw new Error('AI returned an unexpected response structure. Please try again.');
      }

      setResult(json.data);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error('Analysis error:', err);
      if (err.name === 'AbortError') {
        setError('Analysis request timed out after 45 seconds. Please check your network and try again.');
      } else {
        setError(err.message || 'An error occurred while contacting the AI Career Copilot service.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyKeyword = (kw: string) => {
    navigator.clipboard.writeText(kw);
    setCopiedKeyword(kw);
    setTimeout(() => setCopiedKeyword(null), 1500);
  };

  const handleExportMarkdown = () => {
    if (!result) return;
    const md = `# ATS Resume Analysis Report
Generated by AI Career Copilot · Powered by Gemini AI
Date: ${new Date().toLocaleDateString()}

## Overall ATS Compatibility Score: ${result.ats_score} / 100

### Executive Assessment
${result.summary}

### Detailed Match Analysis
${result.match_analysis}

### Matching Skills & Keywords Found
${result.matching_skills.map((s) => `- ${s}`).join('\n')}

### Critical Missing Keywords (To Add)
${result.missing_keywords.map((k) => `- ${k}`).join('\n')}

### Standout Resume Strengths
${result.strengths.map((s) => `- ${s}`).join('\n')}

### Key Weaknesses / Gaps
${result.weaknesses.map((w) => `- ${w}`).join('\n')}

### Recommended Improvements
${result.improvements.map((i) => `- ${i}`).join('\n')}
`;
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ats-resume-analysis-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <header className="bg-slate-900 text-white border-b border-slate-800 shadow-md">
          <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
                  AI Career <span className="text-red-500">Copilot</span>
                  <span className="text-[10px] bg-red-950/80 text-red-300 border border-red-700/60 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Gemini AI
                  </span>
                </h1>
                <p className="text-xs text-slate-400">
                  Resume Analysis & ATS Intelligence · Built by <strong className="text-slate-200">Chandrika</strong>
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-400 text-right hidden sm:block">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Gemini 3.8 Flash Active
              </span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
          {/* Subheader Intro */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Optimize Your Resume for Enterprise ATS
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Paste your resume and a target job description below. Our AI evaluates keyword match, experience alignment, strengths, and gives actionable improvements to help you land the interview.
            </p>
          </div>

          {/* Dual Input Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. Resume Input Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs">
                      <FileText className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Your Resume
                    </h3>
                  </div>

                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".pdf,.txt,.md"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200/80 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{fileName ? 'Change File' : 'Upload Resume (PDF/TXT)'}</span>
                    </button>
                  </div>
                </div>

                {fileName && (
                  <div className="mb-2 text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 flex items-center justify-between">
                    <span className="truncate">Loaded: <strong>{fileName}</strong></span>
                    <button
                      onClick={() => {
                        setFileName(null);
                        setResume('');
                      }}
                      className="text-slate-400 hover:text-red-500 ml-2"
                    >
                      Remove
                    </button>
                  </div>
                )}

                <textarea
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  rows={12}
                  placeholder="Paste your full resume text here or upload a file above...&#10;&#10;Include:&#10;• Contact info & professional summary&#10;• Work experience & measurable achievements&#10;• Technical and soft skills&#10;• Education and projects"
                  className="w-full text-xs font-mono p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 leading-relaxed"
                />
              </div>

              <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                <span>
                  Words: {resume.trim() ? resume.trim().split(/\s+/).length : 0} · Characters: {resume.length}
                </span>
                {resume && (
                  <button
                    onClick={() => {
                      setResume('');
                      setFileName(null);
                    }}
                    className="text-slate-400 hover:text-red-600 font-medium transition-colors"
                  >
                    Clear Text
                  </button>
                )}
              </div>
            </div>

            {/* 2. Job Description Input Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Target Job Description
                    </h3>
                  </div>
                </div>

                <textarea
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  rows={12}
                  placeholder="Paste the target job posting here...&#10;&#10;Include:&#10;• Target job title & role level&#10;• Required and preferred technical skills&#10;• Key job responsibilities&#10;• Years of experience required"
                  className="w-full text-xs font-mono p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 leading-relaxed"
                />
              </div>

              <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                <span>
                  Words: {jobDesc.trim() ? jobDesc.trim().split(/\s+/).length : 0} · Characters: {jobDesc.length}
                </span>
                {jobDesc && (
                  <button
                    onClick={() => setJobDesc('')}
                    className="text-slate-400 hover:text-red-600 font-medium transition-colors"
                  >
                    Clear Text
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-900 rounded-2xl text-xs flex items-start gap-3 shadow-xs">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="block font-bold">Analysis Error</strong>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Analyze Resume Button */}
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isLoading}
            className="w-full py-4 px-6 bg-red-600 hover:bg-red-700 active:scale-[0.99] disabled:opacity-60 text-white font-extrabold text-sm rounded-2xl transition-all shadow-md flex items-center justify-center gap-2.5 cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analyzing Resume with Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                <span>Analyze Resume</span>
              </>
            )}
          </button>

          {/* Loading Indicator State */}
          {isLoading && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs text-center space-y-3 animate-in fade-in duration-200">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">
                Evaluating Resume against Job Description
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Comparing keyword frequencies, hard technical skills, experience alignment, and formatting standards with Google Gemini...
              </p>
            </div>
          )}

          {/* Results Section */}
          <div ref={resultsRef}>
            {result && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
                {/* Result Actions Bar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-slate-800">Analysis Complete</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportMarkdown}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Report</span>
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print</span>
                    </button>
                  </div>
                </div>

                {/* Score & Summary Card */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                  {/* Left: Overall ATS Score Meter */}
                  <div className="md:col-span-4 flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-slate-100 text-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                      ATS Match Score
                    </span>
                    <div className="relative w-36 h-36 flex items-center justify-center">
                      <div
                        className={`text-5xl font-black ${
                          result.ats_score >= 80
                            ? 'text-emerald-600'
                            : result.ats_score >= 60
                            ? 'text-amber-500'
                            : 'text-red-600'
                        }`}
                      >
                        {result.ats_score}
                        <span className="text-base text-slate-400 font-bold">/100</span>
                      </div>
                    </div>
                    <div
                      className={`mt-2 px-3 py-1 rounded-full text-xs font-extrabold border ${
                        result.ats_score >= 80
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : result.ats_score >= 60
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}
                    >
                      {result.ats_score >= 80
                        ? 'High Match · Well Optimized'
                        : result.ats_score >= 60
                        ? 'Moderate Match · Needs Improvement'
                        : 'Low Match · Substantial Gaps'}
                    </div>
                  </div>

                  {/* Right: Executive Summary & Match Analysis */}
                  <div className="md:col-span-8 flex flex-col justify-center space-y-4 py-2 text-xs">
                    <div>
                      <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5 flex items-center gap-1.5 text-red-600">
                        <Sparkles className="w-3.5 h-3.5" />
                        Executive Assessment
                      </h4>
                      <p className="text-slate-700 text-sm leading-relaxed font-normal">
                        {result.summary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100">
                      <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5 flex items-center gap-1.5 text-slate-800">
                        <Search className="w-3.5 h-3.5 text-slate-500" />
                        Match Analysis
                      </h4>
                      <p className="text-slate-600 leading-relaxed font-normal">
                        {result.match_analysis}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Matching Skills vs Missing Keywords Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Matching Skills */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        <CheckCheck className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                        Matching Skills & Keywords Found
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      These requirements from the job description were identified in your resume:
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {result.matching_skills && result.matching_skills.length > 0 ? (
                        result.matching_skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold"
                          >
                            ✓ {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 italic">No exact matching skills detected.</span>
                      )}
                    </div>
                  </div>

                  {/* Missing Keywords */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
                          <AlertCircle className="w-3.5 h-3.5" />
                        </div>
                        <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                          Missing Critical Keywords
                        </h4>
                      </div>
                      <span className="text-slate-400 text-[10px]">Click to copy</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Add these missing skills naturally into your experience bullets:
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {result.missing_keywords && result.missing_keywords.length > 0 ? (
                        result.missing_keywords.map((kw) => (
                          <button
                            key={kw}
                            type="button"
                            onClick={() => handleCopyKeyword(kw)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                            title="Click to copy"
                          >
                            <span>{kw}</span>
                            {copiedKeyword === kw ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3 text-amber-500 opacity-60" />
                            )}
                          </button>
                        ))
                      ) : (
                        <span className="text-emerald-700 italic">No critical keywords missing!</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Strengths & Weaknesses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Strengths */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
                    <h4 className="font-bold text-emerald-700 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Resume Strengths
                    </h4>
                    <ul className="space-y-2 pt-1 text-slate-700">
                      {result.strengths.map((str, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                          <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                            ✓
                          </span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
                    <h4 className="font-bold text-red-700 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-red-600" />
                      Gaps & Weaknesses
                    </h4>
                    <ul className="space-y-2 pt-1 text-slate-700">
                      {result.weaknesses.map((weak, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                          <span className="w-4 h-4 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                            !
                          </span>
                          <span>{weak}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Improvement Suggestions */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-red-600">
                    <Sparkles className="w-4 h-4" />
                    Specific Actionable Improvements
                  </h4>
                  <p className="text-slate-500 text-[11px]">
                    Make these targeted edits to your resume before submitting to maximize recruiter review and ATS pass rates:
                  </p>
                  <ul className="space-y-2.5 pt-1 text-slate-700">
                    {result.improvements.map((imp, idx) => (
                      <li key={idx} className="flex items-start gap-3 leading-relaxed p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-extrabold text-[11px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-4 text-center text-xs text-slate-500 space-y-1">
        <p className="font-semibold text-slate-700">
          AI Career Copilot · Built by <strong>Chandrika</strong>
        </p>
        <p className="text-[11px] text-slate-400">
          Powered by Google Gemini 3.8 Flash API
        </p>
      </footer>
    </div>
  );
}
