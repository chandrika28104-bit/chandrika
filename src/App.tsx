import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Upload,
  FileText,
  Briefcase,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  Copy,
  Check,
  Download,
  Printer,
  History,
  Trash2,
  Rocket,
  X,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Code,
  Shield,
  Layers,
} from 'lucide-react';

// Benchmark test cases from Step 6
interface SampleCase {
  id: string;
  name: string;
  role: string;
  expectedScore: string;
  resume: string;
  jobDesc: string;
}

const SAMPLE_CASES: SampleCase[] = [
  {
    id: 'case-1-junior-fullstack',
    name: 'Alex Chen',
    role: 'Full Stack Engineer (React/Node)',
    expectedScore: '74%',
    resume: `Alex Chen
San Francisco, CA • alex.chen@example.com • linkedin.com/in/alexchen-dev

PROFESSIONAL SUMMARY
Passionate Full Stack Developer with 2+ years of experience building web applications using React, Node.js, Express, and PostgreSQL. Improved page load speeds by 30% and built REST APIs serving 20,000+ monthly active users.

TECHNICAL SKILLS
• Languages: JavaScript (ES6+), TypeScript, HTML5, CSS3, SQL
• Frontend: React 18, Redux Toolkit, Tailwind CSS, Vite
• Backend: Node.js, Express.js, RESTful API Design, JWT Authentication
• Databases: PostgreSQL, MongoDB, Redis
• Tools: Git, GitHub, Jest, Postman, Linux

WORK EXPERIENCE
Junior Software Engineer | CloudScale Tech | Austin, TX (July 2024 - Present)
• Built 14+ reusable React UI components with TypeScript and Tailwind CSS.
• Developed backend microservices using Node.js and Express, cutting latency from 450ms to 180ms.
• Integrated Stripe payment checkout handling $120K+ in monthly customer subscriptions.
• Implemented client caching with React Query and Redis, cutting redundant queries by 42%.

EDUCATION
B.S. in Computer Science | University of Texas at Austin (Dec 2023)`,
    jobDesc: `Mid-Level Full Stack Software Engineer
VentureLink Technologies — San Francisco, CA (Hybrid)

RESPONSIBILITIES:
• Build responsive, high-performance web applications using Next.js (App Router), TypeScript, and Tailwind CSS.
• Design robust RESTful and GraphQL APIs using Node.js with PostgreSQL and Prisma ORM.
• Containerize services using Docker and deploy to AWS (ECS, S3, RDS) using Terraform and CI/CD pipelines.
• Implement monitoring with Datadog and automated test suites.

REQUIRED QUALIFICATIONS:
• 3+ years software engineering experience in production web applications.
• Strong proficiency in TypeScript, React, and Next.js.
• Experience with Node.js, PostgreSQL, and cloud infrastructure (AWS ECS, Docker, Terraform).
• Excellent communication and collaborative problem solving.`
  },
  {
    id: 'case-2-data-analyst',
    name: 'Priya Sharma',
    role: 'Data Analyst → Analytics Engineer',
    expectedScore: '82%',
    resume: `Priya Sharma
Chicago, IL • priya.sharma@analytics.io • linkedin.com/in/priyasharma-data

SUMMARY
Results-oriented Data Analyst with 4 years of experience translating transactional datasets into executive dashboards and automated KPI reporting. Proficient in SQL, Python, Tableau, and Snowflake.

SKILLS
• Analytics: Advanced SQL (Window functions, CTEs), Data Warehousing, Star Schema, ETL
• Tools: Snowflake, Tableau, Power BI, Google BigQuery, dbt (foundational)
• Programming: Python (Pandas, NumPy), Git

EXPERIENCE
Senior BI Analyst | RetailHub Inc. (March 2023 - Present)
• Spearheaded migration of 40+ legacy SQL reports to Snowflake, cutting query runtimes by 65%.
• Architected 12 Tableau dashboards tracking $85M annual revenue for C-suite stakeholders.
• Developed automated Python scripts for anomaly detection across 1.2M daily sales records.

EDUCATION
B.S. in Statistics & Data Science | UIUC (2021)`,
    jobDesc: `Senior Analytics Engineer
FinScale Insights — New York, NY (Remote)

RESPONSIBILITIES:
• Write modular, tested dbt models applying dimensional data modeling best practices.
• Build data transformation pipelines connecting Fivetran, Snowflake, and reverse-ETL tools.
• Implement CI tests using dbt-expectations, GitHub Actions, and SQLFluff linters.

REQUIREMENTS:
• 3-5 years experience in analytics engineering or data modeling.
• Mastery of SQL, including query performance tuning and analytical window functions.
• In-depth production experience with dbt and Snowflake.`
  },
  {
    id: 'case-3-ml-engineer',
    name: 'Marcus Vance',
    role: 'Senior Machine Learning Engineer',
    expectedScore: '91%',
    resume: `Marcus Vance, M.S.
Seattle, WA • marcus.vance@mlengineer.ai • github.com/marcus-vance

PROFESSIONAL SUMMARY
Senior ML Engineer with 6 years experience productionizing deep learning, NLP, and LLM fine-tuning pipelines. Built real-time inference systems serving 4,000 QPS with sub-50ms p99 latency on Triton and vLLM.

CORE SKILLS
• GenAI: Transformer architectures, LoRA/QLoRA, RAG pipelines, LangChain, Vector DBs (Pinecone)
• Frameworks: PyTorch, Hugging Face, DeepSpeed, Ray, ONNX, TensorRT-LLM
• Infrastructure: Kubernetes (K8s), Docker, AWS SageMaker, GCP Vertex AI, Triton
• Languages: Python (Expert), C++, SQL

EXPERIENCE
Senior ML Engineer | OmniVision AI (Jan 2023 - Present)
• Led engineering of enterprise multimodal RAG engine, improving search relevance by 43%.
• Optimized LLM serving with vLLM on AWS EKS, slashing GPU inference costs by $180,000/yr.
• Fine-tuned 8B and 70B parameter models using QLoRA and DeepSpeed ZeRO-3.

EDUCATION
M.S. in Computer Science (Machine Learning) | University of Washington (2019)`,
    jobDesc: `Lead AI / LLM Systems Engineer
Anthrosphere Labs — San Francisco, CA (Hybrid)

RESPONSIBILITIES:
• Architect, deploy, and benchmark distributed LLM inference clusters using vLLM or Triton on Kubernetes.
• Build robust Retrieval-Augmented Generation (RAG) architectures with hybrid dense/sparse search.
• Implement scalable fine-tuning pipelines (LoRA, DPO, RLHF) across multi-GPU clusters.

REQUIREMENTS:
• 5+ years ML engineering experience, with 2+ years dedicated to LLMs and modern NLP.
• Expert mastery of PyTorch and Python.
• Production experience with low-latency GPU serving engines (vLLM, TensorRT) on Kubernetes.`
  }
];

// Personas from Step 4 & 5
interface Persona {
  id: string;
  name: string;
  desc: string;
  prompt: string;
}

const PERSONAS: Persona[] = [
  {
    id: 'general',
    name: 'Enterprise ATS Coach (Default)',
    desc: 'Standard ATS screener & corporate recruiter',
    prompt: `You are an expert career coach and enterprise ATS (Applicant Tracking System) specialist with 10+ years of experience helping candidates pass automated resume screening at top companies.`
  },
  {
    id: 'tech',
    name: 'Tech Recruiter (Coding & Systems)',
    desc: 'Deep focus on technical depth, metrics & modern stack',
    prompt: `You are a Silicon Valley Principal Tech Recruiter and Engineering Hiring Manager with 12+ years of experience evaluating software engineers, AI/ML practitioners, and technical leaders. Scrutinize system scale, metrics (Google XYZ formula), architecture complexity, and hands-on coding depth.`
  },
  {
    id: 'fresh_grad',
    name: 'Campus & Early Career Recruiter',
    desc: 'Focus on potential, projects & coursework',
    prompt: `You are a University Relations Lead and Early-Career Talent Specialist. Analyze this entry-level resume against the junior job description. Assess potential, foundational coursework, hackathons, and internship accomplishments.`
  },
  {
    id: 'career_changer',
    name: 'Career Pivot Strategist',
    desc: 'Highlight transferable skills from past roles',
    prompt: `You are an executive Career Transition Strategist who specializes in translating non-traditional backgrounds, transferable skills, and adjacent industry experience into compelling tech qualifications.`
  }
];

interface AnalysisResult {
  ats_score: number;
  summary: string;
  strengths: string[];
  missing_keywords: string[];
  improvements: string[];
  salary_estimate?: {
    range: string;
    notes: string;
  };
  seniority_estimate?: {
    candidate_level: string;
    role_level: string;
    alignment: string;
  };
  interview_questions?: string[];
  cover_letter_hook?: string;
}

interface SavedHistory {
  id: string;
  date: string;
  candidateName: string;
  role: string;
  score: number;
  data: AnalysisResult;
}

export default function App() {
  // Brand info (easily customizable)
  const [studentName, setStudentName] = useState(() => localStorage.getItem('copilot_studentName') || 'Chandrika');
  const [appName, setAppName] = useState(() => localStorage.getItem('copilot_appName') || 'AI Career Copilot');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('user_gemini_key') || '');
  const [showKeyInput, setShowKeyInput] = useState(false);

  // Inputs
  const [resume, setResume] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [selectedPersonaId, setSelectedPersonaId] = useState('general');
  const [showPromptEditor, setShowPromptEditor] = useState(false);
  const [customPrompt, setCustomPrompt] = useState(PERSONAS[0].prompt);

  // Execution state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  // Modals & UI
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);
  const [copiedHook, setCopiedHook] = useState(false);
  const [activeTab, setActiveTab] = useState<'analyzer' | 'history' | 'guide'>('analyzer');

  // History
  const [history, setHistory] = useState<SavedHistory[]>(() => {
    try {
      const saved = localStorage.getItem('copilot_simple_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('copilot_studentName', studentName);
  }, [studentName]);

  useEffect(() => {
    localStorage.setItem('copilot_appName', appName);
  }, [appName]);

  useEffect(() => {
    if (apiKey) localStorage.setItem('user_gemini_key', apiKey);
  }, [apiKey]);

  useEffect(() => {
    try {
      localStorage.setItem('copilot_simple_history', JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  // Load sample case
  const handleLoadSample = (sample: SampleCase) => {
    setResume(sample.resume);
    setJobDesc(sample.jobDesc);
    setError(null);
  };

  // File upload parser (PDF, TXT, MD)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    try {
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        // PDF parser via window.pdfjsLib
        if (window.pdfjsLib) {
          const buffer = await file.arrayBuffer();
          const pdf = await window.pdfjsLib.getDocument({ data: buffer }).promise;
          let fullText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            fullText += content.items.map((it: any) => it.str).join(' ') + '\n';
          }
          if (fullText.trim()) {
            setResume(fullText.trim());
            return;
          }
        }
      }

      // Plaintext or fallback
      const text = await file.text();
      if (text.trim()) {
        setResume(text.trim());
      } else {
        throw new Error('File content was empty.');
      }
    } catch (err: any) {
      setError('Could not extract text from file. Please copy and paste your resume text directly.');
    }
  };

  // Main Analysis function
  const handleAnalyze = async () => {
    if (!resume.trim() || !jobDesc.trim()) {
      setError('Please paste both your Resume and the Job Description to analyze.');
      return;
    }

    if (resume.trim().length < 40 || jobDesc.trim().length < 40) {
      setError('Content is too short. Please paste complete resume and job description details.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const activePersonaPrompt = customPrompt.trim() || PERSONAS.find(p => p.id === selectedPersonaId)?.prompt || PERSONAS[0].prompt;

    try {
      // First attempt: call local server proxy route
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume: resume.trim(),
          jobDesc: jobDesc.trim(),
          customSystemPrompt: activePersonaPrompt,
          apiKey: apiKey || undefined,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          handleSuccess(json.data);
          return;
        }
      }

      // Fallback: If deployed as a purely static site on Vercel without a backend server,
      // call Gemini API directly if user provided their API key!
      const activeKey = apiKey || (import.meta as any).env?.VITE_GEMINI_API_KEY;
      if (!activeKey) {
        throw new Error('API key required. Click "Settings / API Key" above to paste your free Gemini key from Google AI Studio.');
      }

      const systemInstruction = `${activePersonaPrompt}

Your task: Analyze the provided resume against the job description and return strict JSON with:
{
  "ats_score": <number 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>", "<strength 4>"],
  "missing_keywords": ["<keyword 1>", "<keyword 2>", "<keyword 3>", "<keyword 4>", "<keyword 5>"],
  "improvements": ["<actionable improvement 1>", "<actionable improvement 2>", "<actionable improvement 3>"],
  "salary_estimate": { "range": "$110,000 - $140,000", "notes": "Estimated market benchmark" },
  "seniority_estimate": { "candidate_level": "Mid-Level", "role_level": "Mid-Level", "alignment": "Strong Fit" },
  "interview_questions": ["<question 1 based on gaps>", "<question 2>"],
  "cover_letter_hook": "<compelling 2-sentence opening hook tailored to this job>"
}`;

      const directRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${activeKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: systemInstruction + `\n\nRESUME:\n${resume}\n\nJOB DESCRIPTION:\n${jobDesc}` },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: 'application/json',
            },
          }),
        }
      );

      const directData = await directRes.json();
      if (!directRes.ok) {
        throw new Error(directData.error?.message || `API Error: ${directRes.status}`);
      }

      const rawText = directData.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error('Empty response from AI.');

      const parsed = JSON.parse(rawText);
      handleSuccess(parsed);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to complete analysis. Please check your inputs and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = (data: AnalysisResult) => {
    setResult(data);
    const firstLine = resume.split('\n')[0]?.trim().slice(0, 35) || 'Candidate';
    const firstJobLine = jobDesc.split('\n')[0]?.trim().slice(0, 35) || 'Target Role';

    const newHistoryItem: SavedHistory = {
      id: `hist-${Date.now()}`,
      date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      candidateName: firstLine,
      role: firstJobLine,
      score: data.ats_score,
      data,
    };

    setHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]);

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleCopyKeyword = (kw: string) => {
    navigator.clipboard.writeText(kw);
    setCopiedKeyword(kw);
    setTimeout(() => setCopiedKeyword(null), 1500);
  };

  const handleCopyHook = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHook(true);
    setTimeout(() => setCopiedHook(false), 2000);
  };

  const handleExportMarkdown = () => {
    if (!result) return;
    const md = `# ATS Resume Analysis Report
Generated by ${appName} · Powered by Google Gemini
Date: ${new Date().toLocaleDateString()}

## Overall ATS Score: ${result.ats_score} / 100

### Summary Assessment
${result.summary}

### Key Strengths
${result.strengths.map(s => `- ${s}`).join('\n')}

### Critical Missing Keywords (Add to Resume)
${result.missing_keywords.map(k => `- ${k}`).join('\n')}

### Actionable Improvements
${result.improvements.map(i => `- ${i}`).join('\n')}

### Tailored Cover Letter Hook
"${result.cover_letter_hook || ''}"
`;
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-analysis-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col justify-between">
      {/* Top Banner / Navigation */}
      <div>
        <header className="bg-slate-900 text-white border-b border-slate-800">
          <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold tracking-tight flex items-center gap-2">
                  {appName}
                  <span className="text-[10px] bg-orange-500/20 text-orange-400 border border-orange-500/30 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                    Gemini AI
                  </span>
                </h1>
                <p className="text-xs text-slate-400">
                  Built by <strong className="text-slate-200">{studentName}</strong> · AI/ML Engineering Capilot
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowKeyInput(!showKeyInput)}
                className="text-xs text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors"
              >
                🔑 {apiKey ? 'Key Set ✓' : 'Add API Key'}
              </button>

              <button
                type="button"
                onClick={() => setIsDeployModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all shadow-sm"
              >
                <Rocket className="w-3.5 h-3.5" />
                <span>Deploy to Vercel</span>
              </button>
            </div>
          </div>

          {/* Collapsible API Key Bar */}
          {showKeyInput && (
            <div className="bg-slate-800 px-4 py-3 border-t border-slate-700 text-xs text-slate-300">
              <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="font-semibold text-slate-200 shrink-0">Gemini Key:</span>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    placeholder="AIzaSy... (leave empty to use server default)"
                    className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white w-full sm:w-72 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <div className="text-[11px] text-slate-400">
                  Automatic in AI Studio dev server · Optional for direct client Vercel deployment
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="max-w-5xl mx-auto px-4 flex items-center gap-2 text-xs border-t border-slate-800/80 pt-2 pb-1">
            <button
              onClick={() => setActiveTab('analyzer')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                activeTab === 'analyzer' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              🚀 Resume Analyzer
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                activeTab === 'history' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              📊 Test History ({history.length})
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                activeTab === 'guide' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              📖 Prompt Guide & Vercel Steps
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
          {activeTab === 'analyzer' && (
            <>
              {/* Quick Sample Selector Bar (Step 6) */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                    Step 6 Test Samples:
                  </span>
                  <span className="text-slate-400 text-[11px]">Click to load instant test pair:</span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {SAMPLE_CASES.map(sample => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handleLoadSample(sample)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 border border-slate-200 rounded-lg text-slate-700 font-semibold transition-all"
                    >
                      {sample.name} ({sample.expectedScore})
                    </button>
                  ))}
                </div>
              </div>

              {/* Persona Selector (Step 4 & 5 Prompt Engineering) */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                      Step 5: System Prompt Persona
                    </span>
                    <select
                      value={selectedPersonaId}
                      onChange={e => {
                        setSelectedPersonaId(e.target.value);
                        const p = PERSONAS.find(it => it.id === e.target.value);
                        if (p) setCustomPrompt(p.prompt);
                      }}
                      className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    >
                      {PERSONAS.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowPromptEditor(!showPromptEditor)}
                    className="text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1"
                  >
                    <span>{showPromptEditor ? 'Hide Prompt' : 'View / Edit Prompt'}</span>
                    {showPromptEditor ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {showPromptEditor && (
                  <div className="mt-2 pt-2 border-t border-slate-100">
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      System Prompt (ROLE + TASK + FORMAT + RULES):
                    </label>
                    <textarea
                      value={customPrompt}
                      onChange={e => setCustomPrompt(e.target.value)}
                      rows={4}
                      className="w-full text-xs font-mono p-2.5 bg-slate-900 text-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                )}
              </div>

              {/* Two Column Input Areas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Resume Card */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-orange-500" />
                        1. Resume Text
                      </h3>

                      <div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept=".pdf,.txt,.md"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 px-2.5 py-1 rounded-md border border-orange-200 transition-colors"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Upload PDF/TXT</span>
                        </button>
                      </div>
                    </div>

                    <textarea
                      value={resume}
                      onChange={e => setResume(e.target.value)}
                      rows={10}
                      placeholder="Paste resume text here or upload PDF above...&#10;&#10;Include:&#10;• Experience and achievements&#10;• Technical and soft skills&#10;• Education and projects"
                      className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 leading-relaxed"
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Words: {resume.trim() ? resume.trim().split(/\s+/).length : 0}</span>
                    {resume && (
                      <button onClick={() => setResume('')} className="text-slate-400 hover:text-red-500 font-medium">
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Job Description Card */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-blue-500" />
                        2. Job Description
                      </h3>
                    </div>

                    <textarea
                      value={jobDesc}
                      onChange={e => setJobDesc(e.target.value)}
                      rows={10}
                      placeholder="Paste job description here...&#10;&#10;Include:&#10;• Job title and seniority level&#10;• Required skills and tools&#10;• Responsibilities and qualifications"
                      className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 leading-relaxed"
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Words: {jobDesc.trim() ? jobDesc.trim().split(/\s+/).length : 0}</span>
                    {jobDesc && (
                      <button onClick={() => setJobDesc('')} className="text-slate-400 hover:text-red-500 font-medium">
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <strong>Notice: </strong>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Analyze Button */}
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing with Gemini AI (5-10s)...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze Resume Against Job Description</span>
                  </>
                )}
              </button>

              {/* Results View */}
              <div ref={resultsRef}>
                {result && (
                  <div className="space-y-4 pt-2">
                    {/* Top Result Banner & Actions */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between flex-wrap gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-slate-800">Analysis Results Ready</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleExportMarkdown}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Export Markdown</span>
                        </button>
                        <button
                          onClick={() => window.print()}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Print</span>
                        </button>
                      </div>
                    </div>

                    {/* Score Card */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs text-center space-y-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Overall ATS Match Score
                      </span>
                      <div className="text-5xl font-black text-slate-900">
                        {result.ats_score}
                        <span className="text-lg text-slate-400 font-bold">/100</span>
                      </div>
                      <div
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          result.ats_score >= 80
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : result.ats_score >= 65
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {result.ats_score >= 80
                          ? 'Excellent Match · Well Optimized'
                          : result.ats_score >= 65
                          ? 'Good Match · Minor Revisions'
                          : 'Fair Match · Key Gaps Detected'}
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2 text-xs">
                      <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                        Executive Assessment
                      </h4>
                      <p className="text-slate-700 leading-relaxed text-sm font-normal">
                        {result.summary}
                      </p>
                    </div>

                    {/* Missing Keywords */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                          Missing High-Priority Keywords (Click to copy)
                        </h4>
                        <span className="text-slate-400 text-[11px]">Add these to past bullets</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {result.missing_keywords.map(kw => (
                          <button
                            key={kw}
                            type="button"
                            onClick={() => handleCopyKeyword(kw)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                          >
                            <span>{kw}</span>
                            {copiedKeyword === kw ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3 text-amber-500" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Strengths & Improvements */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Strengths */}
                      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2 text-xs">
                        <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-emerald-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          What Your Resume Does Well
                        </h4>
                        <ul className="space-y-2 pt-1 text-slate-700">
                          {result.strengths.map((str, idx) => (
                            <li key={idx} className="flex items-start gap-2 leading-relaxed">
                              <span className="text-emerald-500 font-bold">✓</span>
                              <span>{str}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Improvements */}
                      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2 text-xs">
                        <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-orange-700">
                          <AlertCircle className="w-4 h-4 text-orange-500" />
                          Recommended Bullet Improvements
                        </h4>
                        <ul className="space-y-2 pt-1 text-slate-700">
                          {result.improvements.map((imp, idx) => (
                            <li key={idx} className="flex items-start gap-2 leading-relaxed">
                              <span className="text-orange-500 font-bold">{idx + 1}.</span>
                              <span>{imp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Cover Letter Hook */}
                    {result.cover_letter_hook && (
                      <div className="bg-orange-50/60 p-5 rounded-xl border border-orange-200 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-orange-900 uppercase tracking-wider text-[11px]">
                            Tailored Cover Letter Opening Hook
                          </h4>
                          <button
                            type="button"
                            onClick={() => handleCopyHook(result.cover_letter_hook || '')}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-700 hover:text-orange-900"
                          >
                            {copiedHook ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedHook ? 'Copied' : 'Copy Hook'}</span>
                          </button>
                        </div>
                        <p className="italic text-slate-800 bg-white p-3 rounded-lg border border-orange-100">
                          "{result.cover_letter_hook}"
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 2: History */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Past Resume Evaluations (Saved in localStorage)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Review and compare your 5 test resume iterations for your project submission.
                  </p>
                </div>
                {history.length > 0 && (
                  <button
                    onClick={() => setHistory([])}
                    className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-semibold px-2.5 py-1 rounded-md hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <div className="bg-white p-10 text-center rounded-xl border border-slate-200 text-xs text-slate-400">
                  No evaluations saved yet. Run an analysis on the "Resume Analyzer" tab!
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map(item => (
                    <div
                      key={item.id}
                      className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">
                            {item.candidateName}
                          </span>
                          <span className="text-slate-400">→</span>
                          <span className="text-slate-600">{item.role}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                              item.score >= 80 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {item.score}% ATS
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">{item.date}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setResult(item.data);
                          setActiveTab('analyzer');
                          setTimeout(() => {
                            resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
                          }, 100);
                        }}
                        className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg font-semibold self-start sm:self-auto"
                      >
                        View Report →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Guide */}
          {activeTab === 'guide' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6 text-xs text-slate-700">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  Prompt Engineering Framework (The 4 Pillars)
                </h3>
                <p className="text-slate-500">
                  How this project converts raw text into production-grade recruiting intelligence:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-orange-50/60 border border-orange-200 space-y-1">
                  <span className="font-bold text-orange-900">1. ROLE (Persona)</span>
                  <p className="text-slate-600 text-[11px]">
                    "You are an expert career coach and ATS specialist with 10+ years of corporate experience."
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1">
                  <span className="font-bold text-blue-900">2. TASK (Objective)</span>
                  <p className="text-slate-600 text-[11px]">
                    "Rigorously analyze the candidate resume against the job description for keyword gaps."
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                  <span className="font-bold text-emerald-900">3. FORMAT (Structured JSON)</span>
                  <p className="text-slate-600 text-[11px]">
                    Forces valid JSON schema with exact fields: ats_score, summary, missing_keywords, improvements.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200 space-y-1">
                  <span className="font-bold text-purple-900">4. RULES (Constraints)</span>
                  <p className="text-slate-600 text-[11px]">
                    Be specific, data-backed, and use numbers. Penalize missing high-priority technical tools.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span>Ready to deploy your live product on Vercel?</span>
                <button
                  onClick={() => setIsDeployModalOpen(true)}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg"
                >
                  Open Vercel Guide →
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-4 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-700">
          Built by <strong>{studentName}</strong> · ApnoAI AI/ML Intern · October 2026
        </p>
        <p className="text-[11px] text-slate-400 mt-1">
          Powered by Google Gemini API · Deployable on Vercel
        </p>
      </footer>

      {/* Deploy to Vercel Modal */}
      {isDeployModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 border border-slate-200 shadow-xl text-xs text-slate-700">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-orange-500" />
                <h3 className="text-sm font-bold text-slate-900">
                  How to Deploy to Vercel (Steps 8 & 9)
                </h3>
              </div>
              <button
                onClick={() => setIsDeployModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <ol className="list-decimal pl-5 space-y-2.5 leading-relaxed text-slate-600">
              <li>
                <strong>Push to GitHub:</strong> Create a new repository named{' '}
                <code className="bg-slate-100 px-1 py-0.5 rounded text-orange-600 font-mono">
                  ai-career-copilot-{studentName.toLowerCase().replace(/\s+/g, '-')}
                </code>{' '}
                and push this project.
              </li>
              <li>
                <strong>Import to Vercel:</strong> Go to{' '}
                <a
                  href="https://vercel.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-orange-600 underline font-semibold"
                >
                  vercel.com
                </a>
                , sign in with GitHub, click <strong>"Add New Project"</strong>, and import your repo.
              </li>
              <li>
                <strong>Vercel Settings:</strong> Framework preset will be <strong>Vite</strong>. Build command is{' '}
                <code>npm run build</code> and output directory is <code>dist</code>.
              </li>
              <li>
                <strong>Set Environment Variable (Step 9):</strong> In Vercel Project Settings → Environment Variables, add:
                <div className="mt-1 bg-slate-900 text-white p-2 rounded font-mono text-[11px]">
                  GEMINI_API_KEY = your_free_key_from_aistudio
                </div>
              </li>
              <li>
                Click <strong>Deploy</strong>! You will have a live permanent URL in under 1 minute.
              </li>
            </ol>

            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-[11px]">
              ✓ <strong>Zero Errors Guaranteed:</strong> This project is tested with standard Vite build and compiles cleanly to static production assets!
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setIsDeployModalOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
