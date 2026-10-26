# AI Career Copilot — Engineer Your First LLM Product 🚀

A production-grade, fast, and responsive resume analyzer powered by Google's Gemini API. Built for the **AI Career Copilot** capstone project (ApnoAI Internship).

## 🌟 Key Features
- **Deterministic Structured Output**: Forces clean JSON output with calibrated ATS score (0-100), executive summary, strengths, missing keywords, and actionable improvements.
- **Prompt Engineering Framework**: Built using the 4-part framework (**ROLE + TASK + FORMAT + RULES**) with customizable persona presets (Enterprise ATS Coach, Silicon Valley Tech Recruiter, Campus Recruiter, Career Pivot Strategist).
- **5 Real Benchmark Test Resumes**: Pre-loaded test cases (Full Stack Engineer, Data Analyst, ML Engineer, Career Switcher, New Grad) for instant evaluation and testing.
- **PDF & Text Upload**: Client-side resume document parser supporting `.pdf`, `.txt`, and `.md` files.
- **Evaluation History**: Persists past evaluations in `localStorage` for side-by-side tracking of prompt improvements.
- **Export Capabilities**: 1-click export of analysis report to Markdown (`.md`) or printable format.
- **Zero-Error Vercel Deployment**: Pre-configured with `vercel.json` for seamless 1-click deployment.

---

## ⚡ Quick Start for Vercel Deployment

### 1. Push to GitHub
1. Create a new repository on GitHub: `ai-career-copilot`
2. Push this project code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: AI Career Copilot"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/ai-career-copilot.git
   git push -u origin main
   ```

### 2. Deploy on Vercel
1. Log in to [vercel.com](https://vercel.com) with GitHub.
2. Click **"Add New Project"** → Import your repository.
3. Framework Preset: **Vite** (automatically detected).
4. In **Project Settings → Environment Variables**, add:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Your free Gemini API key from [aistudio.google.com](https://aistudio.google.com)
5. Click **Deploy**! Your site is live permanently in under 45 seconds.

---

## 🛠️ Tech Stack
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **AI Brain**: Google Gemini 3.8 Flash (`@google/genai`)
- **PDF Parser**: PDF.js (client-side text extraction)
- **Icons**: Lucide React
