'use client';

import { useState, useEffect } from 'react';
import {
  Cpu,
  CheckCircle2,
  Calendar,
  Flame,
  Clock,
  ChevronRight,
  ChevronDown,
  Award,
  Sparkles,
  Info,
  Activity,
  Target,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '@/common/contexts/ThemeContext';
import { INTERVIEW_ROADMAP_DATA, WEEKLY_10_PLAN } from './data';

const ICON_MAP: Record<string, any> = {
  MessageSquare,
  Cpu,
  Activity,
  Sparkles,
  Target,
};

export default function InterviewPrepRoadmap() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<string>('behavioral');
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});
  const [checkedSubtopics, setCheckedSubtopics] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    const savedChecks = localStorage.getItem('evosan_interview_checked_subtopics');
    if (savedChecks) setCheckedSubtopics(JSON.parse(savedChecks));
    const defaultSubject = INTERVIEW_ROADMAP_DATA.find((s) => s.id === 'behavioral');
    if (defaultSubject?.topics.length) {
      setExpandedTopics({ [defaultSubject.topics[0].id]: true });
    }
    setMounted(true);
  }, []);

  const toggleSubtopic = (id: string) => {
    const updated = { ...checkedSubtopics, [id]: !checkedSubtopics[id] };
    setCheckedSubtopics(updated);
    localStorage.setItem('evosan_interview_checked_subtopics', JSON.stringify(updated));
    if (updated[id]) toast.success('Skill locked in! One step closer to the offer 🎯');
  };

  const toggleTopicExpand = (id: string) => {
    setExpandedTopics((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const activeSubject = INTERVIEW_ROADMAP_DATA.find((s) => s.id === activeTab);

  const totalSubtopicsCount = INTERVIEW_ROADMAP_DATA.flatMap((s) => s.topics.flatMap((t) => t.subtopics)).length;
  const completedSubtopicsCount = Object.keys(checkedSubtopics).filter((k) => checkedSubtopics[k]).length;
  const overallPercentage = totalSubtopicsCount > 0 ? Math.round((completedSubtopicsCount / totalSubtopicsCount) * 100) : 0;

  const activeSubjectSubtopics = activeSubject ? activeSubject.topics.flatMap((t) => t.subtopics) : [];
  const activeSubjectCompletedCount = activeSubjectSubtopics.filter((sub) => checkedSubtopics[sub.id]).length;
  const activeSubjectPercentage = activeSubjectSubtopics.length > 0 ? Math.round((activeSubjectCompletedCount / activeSubjectSubtopics.length) * 100) : 0;

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 md:px-8 py-6 max-w-[1600px] mx-auto animate-in fade-in duration-300">

      {/* HEADER */}
      <div className="relative overflow-hidden bg-card/30 p-6 rounded-2xl border border-border/40 backdrop-blur-md">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Award size={18} className="text-primary animate-pulse" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary">Offer Acceleration</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
              Interview Prep Roadmap
            </h1>
            <p className="text-muted-foreground text-xs md:text-sm max-w-2xl mt-1">
              Comprehensive 10-week program covering STAR behavioral frameworks, distributed system design, DSA patterns, OOP depth, and live coding performance techniques.
            </p>
          </div>

          {/* Progress Ring */}
          <div className="flex items-center gap-4 bg-card/80 p-4 rounded-xl border border-border/80 shadow-md">
            <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle cx="24" cy="24" r="20" stroke="currentColor" className="text-muted/20" strokeWidth="3" fill="transparent" />
                <circle cx="24" cy="24" r="20" stroke="currentColor" className="text-primary transition-all duration-700" strokeWidth="3.5" fill="transparent"
                  strokeDasharray={2 * Math.PI * 20}
                  strokeDashoffset={2 * Math.PI * 20 * (1 - overallPercentage / 100)}
                />
              </svg>
              <span className="text-[11px] font-mono font-extrabold text-foreground">{overallPercentage}%</span>
            </div>
            <div>
              <span className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground block">Interview Readiness</span>
              <span className="text-sm font-extrabold text-foreground block">{completedSubtopicsCount} of {totalSubtopicsCount} Skills Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-border/40">
        {INTERVIEW_ROADMAP_DATA.map((subject) => {
          const isActive = activeTab === subject.id;
          const SubIcon = ICON_MAP[subject.iconName] ?? Sparkles;
          const subjectSubtopicsList = subject.topics.flatMap((t) => t.subtopics);
          const subjectPct = subjectSubtopicsList.length > 0
            ? Math.round(subjectSubtopicsList.filter((s) => checkedSubtopics[s.id]).length / subjectSubtopicsList.length * 100) : 0;

          return (
            <button key={subject.id} onClick={() => setActiveTab(subject.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold transition-all relative ${isActive
                ? 'btn-plush-base btn-plush-blue text-sky-950 dark:text-sky-100 shadow-md border border-sky-400/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-xl border border-transparent'}`}>
              <SubIcon size={14} className={isActive ? 'text-sky-600 dark:text-sky-300' : 'text-muted-foreground'} />
              <span>{subject.name}</span>
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-sky-500/20 text-sky-850 dark:text-sky-200' : 'bg-muted text-muted-foreground'}`}>
                {subjectPct}%
              </span>
            </button>
          );
        })}
        <button onClick={() => setActiveTab('study-plan')}
          className={`flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold transition-all relative ${activeTab === 'study-plan'
            ? 'btn-plush-base btn-plush-blue text-sky-950 dark:text-sky-100 shadow-md border border-sky-400/20'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-xl border border-transparent'}`}>
          <Calendar size={14} className={activeTab === 'study-plan' ? 'text-sky-600 dark:text-sky-300' : 'text-muted-foreground'} />
          <span>10-Week Plan</span>
        </button>
      </div>

      {/* SUBJECT VIEW */}
      {activeTab !== 'study-plan' && activeSubject && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* LEFT — Topics */}
          <div className="lg:col-span-2 space-y-4">

            {/* Subject header card */}
            <div className={`p-5 rounded-2xl border bg-gradient-to-b ${activeSubject.bgGradient} space-y-3 shadow-sm`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border bg-card ${activeSubject.color}`}>
                    {(() => { const Icon = ICON_MAP[activeSubject.iconName] ?? Sparkles; return <Icon size={20} />; })()}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">{activeSubject.name} Curriculum</h2>
                    <span className="text-[10px] text-muted-foreground block">Targeted practice strategies and key competencies.</span>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase font-mono tracking-wider ${activeSubject.badgeColor}`}>
                  {activeSubject.badgeText}
                </span>
              </div>
              <p className="text-xs md:text-sm text-foreground/80 leading-relaxed font-medium">{activeSubject.description}</p>
              <div className="pt-2 border-t border-border/30 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-[10px] font-bold text-muted-foreground mb-1">
                    <span>Subject Progress</span>
                    <span>{activeSubjectCompletedCount} of {activeSubjectSubtopics.length} Mastered</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full transition-all duration-700" style={{ width: `${activeSubjectPercentage}%` }}></div>
                  </div>
                </div>
                <span className="text-lg font-extrabold text-foreground font-mono">{activeSubjectPercentage}%</span>
              </div>
            </div>

            {/* Topic accordions */}
            <div className="space-y-4">
              {activeSubject.topics.map((topic) => {
                const isExpanded = !!expandedTopics[topic.id];
                const topicSubCount = topic.subtopics.length;
                const topicCompleted = topic.subtopics.filter((s) => checkedSubtopics[s.id]).length;
                const topicPct = topicSubCount > 0 ? Math.round((topicCompleted / topicSubCount) * 100) : 0;

                return (
                  <div key={topic.id} className={`rounded-xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'bg-card border-border/80 shadow-md' : 'bg-card/45 border-border/40 hover:border-border/80'}`}>
                    <div onClick={() => toggleTopicExpand(topic.id)} className="p-4 flex items-center justify-between gap-3 cursor-pointer select-none">
                      <div className="flex items-center gap-3">
                        <div className={`w-1 h-8 rounded-full ${topic.importance === 'Critical' ? 'bg-rose-500' : topic.importance === 'Important' ? 'bg-yellow-500' : 'bg-slate-400'}`} />
                        <div>
                          <h3 className="text-xs md:text-sm font-extrabold text-foreground">{topic.title}</h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${topic.importance === 'Critical' ? 'bg-rose-500/10 text-rose-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                              {topic.importance}
                            </span>
                            <span className="text-[9px] text-muted-foreground flex items-center gap-1"><Clock size={10} />{topic.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded">{topicCompleted}/{topicSubCount} ({topicPct}%)</span>
                        {isExpanded ? <ChevronDown size={16} className="text-muted-foreground" /> : <ChevronRight size={16} className="text-muted-foreground" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-4 pt-0 border-t border-border/40 bg-muted/15 space-y-4 animate-in slide-in-from-top-1 duration-200">
                        <p className="text-xs leading-relaxed text-muted-foreground mt-3 italic">"{topic.description}"</p>

                        <div className="space-y-2">
                          <span className="text-[9px] uppercase font-mono font-bold text-primary tracking-wider block">Subtopic Mastery Tracker</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {topic.subtopics.map((sub) => {
                              const isChecked = !!checkedSubtopics[sub.id];
                              return (
                                <div key={sub.id} onClick={() => toggleSubtopic(sub.id)}
                                  className={`flex items-start gap-2.5 p-3 rounded-lg border transition-all duration-300 cursor-pointer ${isChecked ? 'bg-primary/[0.02] border-primary/20' : 'bg-card border-border/50 hover:border-primary/20'}`}>
                                  <div className={`mt-0.5 flex-shrink-0 ${isChecked ? 'text-primary' : 'text-muted-foreground'}`}>
                                    <CheckCircle2 size={14} fill={isChecked ? 'currentColor' : 'none'} />
                                  </div>
                                  <span className={`text-[11px] font-semibold leading-relaxed ${isChecked ? 'line-through text-muted-foreground/60' : 'text-foreground'}`}>{sub.text}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          <div className="bg-card p-3 rounded-xl border border-border/60 space-y-2 shadow-sm">
                            <span className="text-[9px] font-mono font-extrabold uppercase text-rose-500 tracking-wider flex items-center gap-1"><Info size={11} /> Need To Know</span>
                            <ul className="space-y-1.5 pl-1">
                              {topic.needToKnow.map((item, idx) => (
                                <li key={idx} className="text-[10px] text-foreground leading-relaxed flex items-start gap-1.5">
                                  <span className="w-1 h-1 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-card p-3 rounded-xl border border-border/60 space-y-2 shadow-sm">
                            <span className="text-[9px] font-mono font-extrabold uppercase text-secondary tracking-wider flex items-center gap-1"><Flame size={11} /> Why It Matters</span>
                            <p className="text-[10px] text-muted-foreground leading-relaxed">{topic.whyItMatters}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT — Guidelines */}
          <div className="space-y-6">
            <div className="bg-card rounded-2xl p-5 border border-border/60 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border/40 pb-2">
                <Sparkles size={14} className="text-primary" />Mock Interview Drills
              </h3>
              <div className="space-y-3">
                {[
                  { num: '1', color: 'rose', title: '45-Minute Mock Loops', body: 'Simulate a complete session: 5 min behavioral, 20 min system design, 20 min coding. Use a timer. No pausing.' },
                  { num: '2', color: 'blue', title: 'Rubber Duck Narration', body: 'Talk through every problem to a rubber duck or camera before touching code. Silence = lost points.' },
                  { num: '3', color: 'purple', title: 'Post-Mock Scoring', body: 'Score yourself on: Communication (1–5), Solution Quality (1–5), Edge Cases (1–5). Target 4+ in each.' },
                ].map(({ num, color, title, body }) => (
                  <div key={num} className={`flex items-start gap-3 p-3 rounded-xl bg-muted/40 border border-border/60`}>
                    <div className={`w-6 h-6 rounded-full bg-${color}-500/10 flex items-center justify-center flex-shrink-0 text-${color}-500 text-[10px] font-bold`}>{num}</div>
                    <div>
                      <h4 className="text-[11px] font-bold text-foreground">{title}</h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-2xl p-5 border border-border/60 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <Target size={14} className="text-secondary" />Interview Benchmarks
              </h3>
              <div className="bg-muted/40 p-2.5 rounded-lg border border-border/60 text-[9px] font-mono leading-relaxed text-foreground/80 flex flex-col gap-1">
                <span>- Behavioral answer: 90–120 seconds</span>
                <span>- System design: clarify in &lt; 5 min</span>
                <span>- Coding: brute force in &lt; 10 min</span>
                <span>- Edge cases: state 3+ before coding</span>
                <span>- Filler words: &lt; 2 per answer</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10-WEEK PLAN */}
      {activeTab === 'study-plan' && (
        <div className="bg-card rounded-2xl p-6 border border-border/60 shadow-sm space-y-6 animate-in fade-in duration-300">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Calendar size={18} className="text-primary" />10-Week Interview Mastery Blueprint
            </h2>
            <p className="text-muted-foreground text-xs mt-0.5">From behavioral scripting to full-loop mock simulations — each week builds on the last.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground font-semibold">
                  <th className="py-3 px-4 w-24">Timeline</th>
                  <th className="py-3 px-4 w-44">Focus Area</th>
                  <th className="py-3 px-4">Core Goal</th>
                  <th className="py-3 px-4">Practice Milestone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-medium">
                {WEEKLY_10_PLAN.map((item, idx) => (
                  <tr key={idx} className="hover:bg-muted/10 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-primary">{item.week}</td>
                    <td className="py-4 px-4 text-foreground">{item.subject}</td>
                    <td className="py-4 px-4 text-muted-foreground leading-relaxed">{item.goal}</td>
                    <td className="py-4 px-4 text-foreground/90">
                      <div className="flex items-center gap-2">
                        <ArrowRight size={13} className="text-secondary flex-shrink-0" />
                        <span>{item.project}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-muted/20 p-4 rounded-xl border border-border/60 flex items-start gap-3">
            <Info size={16} className="text-primary mt-0.5 flex-shrink-0" />
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              <strong>Pro Tip:</strong> Do a <strong>timed mock loop every Friday</strong> from Week 5 onward. Use <a href="https://www.pramp.com" target="_blank" className="text-primary underline">Pramp</a> or <a href="https://interviewing.io" target="_blank" className="text-primary underline">Interviewing.io</a> for peer feedback. Track your score improvement week-over-week.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
