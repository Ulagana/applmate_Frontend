import React, { useState } from 'react';
import {
  Upload, FileText, AlertCircle, CheckCircle,
  ChevronRight, Loader2, BarChart2, Tag, Lightbulb, Lock
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import api from '../utils/api';

// ─── Helpers ────────────────────────────────────────────────────────────────

function extractKeywords(text) {
  if (!text) return [];
  const stopWords = new Set([
    'the','a','an','and','or','but','in','on','at','to','for','of','with',
    'by','from','is','are','was','were','be','been','being','have','has',
    'had','do','does','did','will','would','could','should','may','might',
    'shall','must','can','need','this','that','these','those','we','you',
    'they','he','she','it','i','our','your','their','its','my','as','if',
    'then','than','so','also','not','no','but','up','out','about','into',
    'through','during','before','after','above','below','between','each',
    'both','few','more','most','other','some','such'
  ]);
  const words = text
    .toLowerCase()
    .replace(/[^\w\s+#]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));
  return [...new Set(words)];
}

function analyzeMatch(resumeText, jobDesc) {
  const resumeKW = new Set(extractKeywords(resumeText));
  const jobKW = extractKeywords(jobDesc);

  const matched = [];
  const missing = [];

  // Prioritise multi-word tech terms
  const techTerms = [
    'react', 'node', 'nodejs', 'express', 'mongodb', 'typescript', 'javascript',
    'python', 'java', 'aws', 'docker', 'kubernetes', 'graphql', 'rest', 'api',
    'sql', 'postgresql', 'mysql', 'redis', 'git', 'agile', 'scrum', 'ci/cd',
    'tailwind', 'css', 'html', 'webpack', 'jest', 'testing', 'leadership',
    'communication', 'problem-solving', 'data', 'machine learning', 'ai'
  ];

  const uniqueJobKW = [...new Set([...jobKW, ...techTerms.filter(t => jobDesc.toLowerCase().includes(t))])];

  uniqueJobKW.forEach(kw => {
    if (resumeKW.has(kw) || resumeText.toLowerCase().includes(kw)) {
      matched.push(kw);
    } else if (jobDesc.toLowerCase().includes(kw)) {
      missing.push(kw);
    }
  });

  const total = matched.length + missing.length;
  const percentage = total > 0 ? Math.round((matched.length / total) * 100) : 0;

  const suggestions = [];
  if (percentage < 50) {
    suggestions.push('Your resume appears to have low keyword overlap. Tailor it specifically for each job.');
  }
  if (missing.some(k => ['experience', 'years'].includes(k))) {
    suggestions.push('Highlight your years of experience more prominently.');
  }
  if (!resumeText.toLowerCase().includes('achievement') && !resumeText.toLowerCase().includes('impact')) {
    suggestions.push('Add quantified achievements (e.g., "Reduced load time by 40%") to stand out.');
  }
  if (missing.length > 5) {
    suggestions.push(`Add ${missing.slice(0, 3).join(', ')} and other missing keywords naturally into your resume.`);
  }
  suggestions.push('Use a clean single-column format for better ATS parsing.');
  suggestions.push('Ensure your contact info (email, LinkedIn, GitHub) is in plain text, not embedded in images.');
  if (percentage >= 70) {
    suggestions.push('Great match! Fine-tune your summary section to directly mirror the job description language.');
  }

  return { percentage, matched: matched.slice(0, 15), missing: missing.slice(0, 15), suggestions };
}

// ─── Score Ring ─────────────────────────────────────────────────────────────

function ScoreRing({ score }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative flex items-center justify-center w-[140px] h-[140px] mb-4">
      <svg width="140" height="140" className="-rotate-90 absolute inset-0">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#1e293b" strokeWidth="12" />
        <circle
          cx="70" cy="70" r={r} fill="none"
          stroke={color} strokeWidth="12"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="text-center z-10 mt-1">
        <p className="text-3xl font-bold text-white leading-none">{score}%</p>
        <p className="text-[10px] text-dark-400 uppercase tracking-wider mt-1">Match</p>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const { notify } = useNotification();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.txt')) {
      notify('error', 'Please upload a PDF or TXT file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      notify('error', 'File must be under 5MB');
      return;
    }

    setUploading(true);
    setFileName(file.name);

    try {
      // Try backend upload first
      const formData = new FormData();
      formData.append('resume', file);
      const res = await api.post('/resume/extract', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setResumeText(res.data.text || '');
      notify('success', 'Resume parsed successfully!');
      return;
    } catch {
      // Fall back to reading TXT client-side
    }

    if (file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setResumeText(ev.target.result);
        notify('success', 'Resume parsed successfully!');
        setUploading(false);
      };
      reader.readAsText(file);
    } else {
      notify('error', 'Failed to parse PDF. Please ensure the connection to the backend is active.');
      setFileName('');
      setUploading(false);
    }
    setUploading(false);
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      notify('error', 'Please upload a resume first');
      return;
    }
    if (!jobDesc.trim() || jobDesc.length < 50) {
      notify('error', 'Please paste a job description (min 50 chars)');
      return;
    }
    setAnalyzing(true);
    
    // Simulate async analysis to give visual feedback
    await new Promise(r => setTimeout(r, 1500));
    const localResult = analyzeMatch(resumeText, jobDesc);
    setResult(localResult);
    
    notify('success', 'Analysis complete!');
    setAnalyzing(false);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* AI Notice Banner */}
      <div className="glass-card p-4 flex items-center gap-3 border-yellow-500/20 bg-yellow-500/5">
        <Lock className="w-5 h-5 text-yellow-400 shrink-0" />
        <div>
          <p className="text-sm font-medium text-yellow-300">AI Analysis Mode — Rule-based</p>
          <p className="text-xs text-dark-400">
            Currently using local keyword-matching engine.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left: Inputs */}
        <div className="space-y-5">
          {/* Upload */}
          <div className="glass-card p-5">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary-400" />
              Upload Resume
            </h3>
            <label className="block cursor-pointer group">
              <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
                ${fileName ? 'border-primary-500/50 bg-primary-500/5' : 'border-dark-600 hover:border-primary-500/50 hover:bg-primary-500/5'}`}>
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
                    <p className="text-sm text-dark-400">Processing...</p>
                  </div>
                ) : fileName ? (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                    <p className="text-sm font-medium text-white">{fileName}</p>
                    <p className="text-xs text-dark-400">Click to replace</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-dark-400 group-hover:text-primary-400 transition-colors" />
                    <p className="text-sm font-medium text-dark-300">Drop your resume here</p>
                    <p className="text-xs text-dark-500">PDF or TXT · Max 5MB</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Extracted / Manual Text Content */}
            <div className="mt-5">
              <label className="text-sm font-medium text-dark-200 mb-2 block">Extracted Resume Content (Edit if necessary)</label>
              <textarea
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
                rows={6}
                placeholder="Upload a file above, or manually paste your resume text here to pre-fill it..."
                className="w-full bg-dark-800/50 border border-dark-600 rounded-xl p-3 text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors text-sm resize-none"
              />
            </div>
          </div>

          {/* Job Description */}
          <div className="glass-card p-5">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-primary-400" />
              Job Description
            </h3>
            <textarea
              value={jobDesc}
              onChange={e => setJobDesc(e.target.value)}
              rows={10}
              placeholder="Paste the full job description here for the most accurate analysis..."
              className="input-field resize-none text-sm"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={analyzing || !resumeText || !jobDesc}
            className="btn-primary w-full justify-center py-3 text-base font-semibold shadow-lg shadow-primary-600/20"
          >
            {analyzing ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
            ) : (
              <><ChevronRight className="w-4 h-4" /> Analyze Resume</>
            )}
          </button>
        </div>

        {/* Right: Results */}
        <div className="space-y-5">
          {!result ? (
            <div className="glass-card p-12 flex flex-col items-center justify-center text-center h-full min-h-64">
              <BarChart2 className="w-12 h-12 text-dark-600 mb-4" />
              <p className="text-dark-300 font-medium mb-1">No analysis yet</p>
              <p className="text-dark-500 text-sm">Upload your resume and paste a job description, then click Analyze.</p>
            </div>
          ) : (
            <>
              {/* Score */}
              <div className="glass-card p-6 flex flex-col items-center">
                <h3 className="text-base font-semibold text-white mb-4 self-start flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-primary-400" />
                  ATS Match Score
                </h3>
                <ScoreRing score={result.percentage} />
                <p className="text-sm text-dark-400 text-center -mt-6">
                  {result.percentage >= 70
                    ? '🎉 Strong match! Your resume aligns well with this role.'
                    : result.percentage >= 40
                    ? '⚠️ Moderate match. Some improvements could boost your chances.'
                    : '❌ Low match. Significant tailoring recommended.'}
                </p>
              </div>

              {/* Matched Keywords */}
              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Matched Keywords ({result.matched.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.matched.map(kw => (
                    <span key={kw} className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/15 text-green-400 border border-green-500/25">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  Missing Keywords ({result.missing.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.missing.map(kw => (
                    <span key={kw} className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/15 text-red-400 border border-red-500/25 flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-400" />
                  Improvement Suggestions
                </h3>
                <ul className="space-y-2.5">
                  {result.suggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-dark-300">
                      <ChevronRight className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
