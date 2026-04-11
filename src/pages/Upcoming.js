import React from 'react';
import { Rocket, Bot, MousePointerClick, Mail, Brain, Shield, Sparkles } from 'lucide-react';

const features = [
  {
    icon: MousePointerClick,
    title: "1-Click Chrome Extension",
    description: "Automatically fill out complex workday and standard job applications with a single click using your stored profile data.",
    quarter: "Q3 2026",
    status: "In Development",
    statusColor: "bg-primary-500/20 text-primary-400 border-primary-500/30"
  },
  {
    icon: Bot,
    title: "Voice AI Mock Interviews",
    description: "Practice your behavioral and technical interviews with an advanced AI that listens, responds, and critiques your answers in real-time.",
    quarter: "Q4 2026",
    status: "Planning",
    statusColor: "bg-blue-500/20 text-blue-400 border-blue-500/30"
  },
  {
    icon: Mail,
    title: "Smart Gmail Integration",
    description: "Connect your inbox to automatically move job applications to 'Interview' or 'Rejected' phases when recruiter emails are detected.",
    quarter: "Q4 2026",
    status: "Research",
    statusColor: "bg-purple-500/20 text-purple-400 border-purple-500/30"
  },
  {
    icon: Brain,
    title: "AI Salary Negotiator",
    description: "Upload your initial offer letter and let the AI draft perfectly calibrated counter-offer emails based on local market trends.",
    quarter: "Q1 2027",
    status: "Backlog",
    statusColor: "bg-dark-500/20 text-dark-300 border-dark-500/30"
  }
];

export default function Upcoming() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-slide-up">
      {/* Header Banner */}
      <div className="glass-card p-8 flex flex-col md:flex-row items-center justify-between overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 via-indigo-600/10 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-primary-400" />
            <span className="text-sm text-primary-400 font-bold uppercase tracking-widest text-shadow-sm">The Roadmap</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Upcoming Features</h1>
          <p className="text-dark-300 max-w-xl text-sm leading-relaxed mb-0">
            We are constantly researching and building state-of-the-art tools to give you the absolute edge in the job market. Here's an exclusive look at what we are working on next!
          </p>
        </div>
        
        <div className="hidden md:flex shrink-0 relative mt-6 md:mt-0 p-4 border border-dark-600 rounded-2xl bg-dark-800/50 backdrop-blur-md shadow-2xl">
          <Rocket className="w-16 h-16 text-primary-500 animate-pulse" />
        </div>
      </div>

      {/* Feature List */}
      <div className="space-y-4">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div key={idx} className="glass-card p-6 border-l-4 border-l-primary-500 group hover:bg-dark-800/40 transition-colors">
              <div className="flex flex-col md:flex-row gap-5 items-start md:items-center">
                {/* Icon Circle */}
                <div className="w-14 h-14 rounded-full bg-dark-900 border border-dark-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <Icon className="w-6 h-6 text-primary-400 group-hover:text-primary-300" />
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                    <h3 className="text-lg font-bold text-white tracking-wide">{feature.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-dark-400 bg-dark-800 px-2 py-0.5 rounded-md border border-dark-700">
                        {feature.quarter}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${feature.statusColor}`}>
                        {feature.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-dark-300 leading-relaxed md:max-w-3xl">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Support / Idea Box */}
      <div className="glass-card p-6 border-dashed border-2 border-primary-500/30 bg-primary-900/5 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4 mt-8">
        <div>
          <h4 className="text-white font-bold mb-1 flex items-center justify-center sm:justify-start gap-2">
            <Shield className="w-4 h-4 text-green-400" /> Have an idea?
          </h4>
          <p className="text-xs text-dark-400 leading-relaxed max-w-md">
            The best ideas come from our users. If there is a tool that would help you land a job faster, let us know and we might just build it!
          </p>
        </div>
        <button className="px-6 py-2 rounded-xl bg-dark-800 border border-dark-600 text-white font-semibold text-sm hover:bg-dark-700 transition-colors shadow-lg whitespace-nowrap">
          Submit Feature Request
        </button>
      </div>

    </div>
  );
}
