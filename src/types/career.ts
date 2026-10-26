export interface CategoryScores {
  keywords_match: number;
  experience_alignment: number;
  formatting_clarity: number;
  hard_skills: number;
  soft_skills: number;
}

export interface SeniorityEstimate {
  candidate_level: string;
  role_level: string;
  alignment: string;
}

export interface SalaryEstimate {
  range: string;
  notes: string;
}

export interface AnalysisData {
  ats_score: number;
  summary: string;
  strengths: string[];
  missing_keywords: string[];
  improvements: string[];
  category_scores: CategoryScores;
  seniority_estimate: SeniorityEstimate;
  salary_estimate: SalaryEstimate;
  interview_prep_questions: string[];
  cover_letter_hook: string;
}

export interface AnalysisResult {
  success: boolean;
  data: AnalysisData;
  modelUsed: string;
  analyzedAt: string;
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  candidateName: string;
  targetRole: string;
  atsScore: number;
  personaUsed: string;
  resumePreview: string;
  jobDescPreview: string;
  analysis: AnalysisData;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
