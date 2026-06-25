'use client';

import { useState, useEffect } from 'react';
import {
  Compass,
  MessageSquare,
  Code,
  Cpu,
  CheckCircle2,
  Calendar,
  Flame,
  Clock,
  BookOpen,
  CheckSquare,
  BookOpenCheck,
  ChevronRight,
  ListTodo,
  X,
  Copy,
  Check,
  Award,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface GoalItem {
  id: string;
  text: string;
  category: 'english' | 'stack' | 'mlops';
}

interface QuarterData {
  id: string;
  title: string;
  date: string;
  focus: string;
  goals: GoalItem[];
}

interface Subtopic {
  id: string;
  text: string;
}

interface Topic {
  id: string;
  title: string;
  subtopics: Subtopic[];
}

interface SubjectData {
  id: string;
  name: string;
  icon: any;
  color: string;
  topics: Topic[];
}

interface ScenarioData {
  id: string;
  title: string;
  desc: string;
  script: string;
  powerWords: string[];
  chatgptPrompt: string;
}

const ROADMAP_DATA: QuarterData[] = [
  {
    id: 'q2',
    title: 'Q2: Foundations & Experiment Tracking',
    date: 'May - June 2026',
    focus: 'Mastering experiment logging, core backend syntax, and professional daily standups.',
    goals: [
      {
        id: 'q2_eng_1',
        text: 'Daily Morning Sync: Apply Standup Script A or B from English Plan.',
        category: 'english',
      },
      {
        id: 'q2_eng_2',
        text: 'Speaking practice: 5 minutes daily on ChatGPT Voice Mode at night.',
        category: 'english',
      },
      {
        id: 'q2_stack_1',
        text: 'SQL Whiteboard drill: Recreate classic raw queries (Joins/Rank) from memory.',
        category: 'stack',
      },
      {
        id: 'q2_stack_2',
        text: 'NestJS whiteboards: Mock controllers, services & dependency injection patterns.',
        category: 'stack',
      },
      {
        id: 'q2_mlops_1',
        text: 'MLflow Logging: Track hyperparameters & accuracy locally.',
        category: 'mlops',
      },
      {
        id: 'q2_mlops_2',
        text: 'MLflow Registry: Successfully train and register a Scikit-Learn model.',
        category: 'mlops',
      },
    ],
  },
  {
    id: 'q3',
    title: 'Q3: Data Pipelines & Modern Frontend',
    date: 'July - September 2026',
    focus:
      'Automating workflows, mastering React/Next.js data flows, and thinking directly in English.',
    goals: [
      {
        id: 'q3_eng_1',
        text: 'Narrative Coding: Describe your coding out loud in English to eliminate native translation.',
        category: 'english',
      },
      {
        id: 'q3_eng_2',
        text: 'PR Writing formula: Draft all PR descriptions using Context ➔ Action ➔ Result.',
        category: 'english',
      },
      {
        id: 'q3_stack_1',
        text: 'Next.js 14: Master Server vs Client Component boundaries and data hydration.',
        category: 'stack',
      },
      {
        id: 'q3_stack_2',
        text: 'Explain Next.js SSR optimization out loud in English from a technical standpoint.',
        category: 'stack',
      },
      {
        id: 'q3_mlops_1',
        text: 'DVC Setup: Version control a large dataset backed by AWS S3.',
        category: 'mlops',
      },
      {
        id: 'q3_mlops_2',
        text: 'Workflow Orchestration: Create a Prefect pipeline triggered by database inserts.',
        category: 'mlops',
      },
    ],
  },
  {
    id: 'q4',
    title: 'Q4: Model Serving & API Architectures',
    date: 'October - December 2026',
    focus: 'Scaling models, mastering Python microservices, and leading high-pressure meetings.',
    goals: [
      {
        id: 'q4_eng_1',
        text: 'Blocker Management: Explain technical roadblocks using clear business analogies.',
        category: 'english',
      },
      {
        id: 'q4_stack_1',
        text: 'FastAPI schemas: Whiteboard asynchronous endpoints with Pydantic validation.',
        category: 'stack',
      },
      {
        id: 'q4_stack_2',
        text: 'Microservices: Explain asynchronous Python advantages for LLM execution.',
        category: 'stack',
      },
      {
        id: 'q4_mlops_1',
        text: 'Model Packaging: Containerize trained model runners inside BentoML.',
        category: 'mlops',
      },
      {
        id: 'q4_mlops_2',
        text: 'AWS Deployment: Write a multi-stage Dockerfile and push to AWS ECS.',
        category: 'mlops',
      },
    ],
  },
  {
    id: 'q1',
    title: 'Q1: Production Monitoring & Scalability',
    date: 'January - March 2027',
    focus: 'High availability, enterprise system design, and advanced technical presence.',
    goals: [
      {
        id: 'q1_eng_1',
        text: 'Mock Interviews: Standard mock QA sessions under technical evaluation pressure.',
        category: 'english',
      },
      {
        id: 'q1_stack_1',
        text: 'Distributed Patterns: Whiteboard Transactional Outbox & Saga design patterns.',
        category: 'stack',
      },
      {
        id: 'q1_stack_2',
        text: 'Integrate QuickBooks sync details into microservice system design discussions.',
        category: 'stack',
      },
      {
        id: 'q1_mlops_1',
        text: 'Production Drift: Set up Evidently AI calculations on input feature drifts.',
        category: 'mlops',
      },
      {
        id: 'q1_mlops_2',
        text: 'Observability: Configure automated weekly quality PDF reports on AWS.',
        category: 'mlops',
      },
    ],
  },
];

const WEEKLY_CHECKPOINTS = [
  {
    id: 'chk_mon',
    text: 'Monday Standup: Execute clear Context ➔ Action ➔ Result update',
    day: 'Mon',
  },
  { id: 'chk_wed', text: 'Wednesday Stack Drill: 15 mins paper whiteboard coding', day: 'Wed' },
  { id: 'chk_sat', text: 'Saturday Legacy Code: 2 hours MLOps project implementation', day: 'Sat' },
  { id: 'chk_sun', text: 'Sunday blueprint sync: Log metrics & review roadmap', day: 'Sun' },
];

const TITAN_SCHEDULE = [
  {
    time: '08:00 AM',
    label: 'Bus to Office',
    desc: 'Learning Lab: MLOps Podcasts / Deep Docs',
    icon: BookOpen,
  },
  {
    time: '09:30 AM',
    label: 'Office Hours',
    desc: 'High-Performance Coding / PR Writing',
    icon: Code,
  },
  {
    time: '06:30 PM',
    label: 'Bus to Home',
    desc: 'English Shadowing / Audiobooks',
    icon: MessageSquare,
  },
  { time: '09:00 PM', label: 'Legacy Block', desc: 'MLOps Coding & Stack whiteboards', icon: Cpu },
  {
    time: '10:15 PM',
    label: 'Speech Polish',
    desc: 'ChatGPT Voice Mode Conversation',
    icon: Flame,
  },
];

const SYLLABUS_DATA: SubjectData[] = [
  {
    id: 'mlops',
    name: 'MLOps Platforms',
    icon: Cpu,
    color: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
    topics: [
      {
        id: 'mlops_t1',
        title: 'Topic 1: Experimentation & Model Registries (MLflow)',
        subtopics: [
          { id: 'mlops_s1_1', text: 'MLflow local server installation and dashboard setup' },
          {
            id: 'mlops_s1_2',
            text: 'Logging hyperparameters, training logs, and artifacts (.pkl)',
          },
          { id: 'mlops_s1_3', text: 'Model Versioning & Registry UI operations' },
          {
            id: 'mlops_s1_4',
            text: 'Writing automated Python scripts to train and register models',
          },
        ],
      },
      {
        id: 'mlops_t2',
        title: 'Topic 2: Data Version Control (DVC)',
        subtopics: [
          { id: 'mlops_s2_1', text: 'Tracking massive datasets (>100MB) without git bloat' },
          { id: 'mlops_s2_2', text: 'Configuring AWS S3 bucket as DVC remote storage' },
          { id: 'mlops_s2_3', text: 'DVC push, pull, and pipeline checkout workflows' },
        ],
      },
      {
        id: 'mlops_t3',
        title: 'Topic 3: Pipeline Orchestration (Prefect)',
        subtopics: [
          { id: 'mlops_s3_1', text: 'Defining structured Prefect tasks and flows' },
          { id: 'mlops_s3_2', text: 'Building weekly schedules for automated data fetching' },
          {
            id: 'mlops_s3_3',
            text: 'Triggering model training pipelines via database insertion hooks',
          },
        ],
      },
      {
        id: 'mlops_t4',
        title: 'Topic 4: Model Serving (BentoML & Docker)',
        subtopics: [
          { id: 'mlops_s4_1', text: 'Packaging machine learning models inside BentoML runners' },
          { id: 'mlops_s4_2', text: 'Writing optimized multi-stage Dockerfiles for ML inference' },
          { id: 'mlops_s4_3', text: 'Deploying lightweight containers to AWS ECS microservices' },
        ],
      },
      {
        id: 'mlops_t5',
        title: 'Topic 5: Monitoring & Drift (Evidently AI)',
        subtopics: [
          { id: 'mlops_s5_1', text: 'Setting up Evidently AI on production inference logs' },
          { id: 'mlops_s5_2', text: 'Calculating data drift and feature quality changes' },
          {
            id: 'mlops_s5_3',
            text: 'Creating automated weekly model performance drift PDF reports',
          },
        ],
      },
    ],
  },
  {
    id: 'english',
    name: 'English & Presence',
    icon: MessageSquare,
    color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    topics: [
      {
        id: 'eng_t1',
        title: 'Topic 1: Cognitive Speaking Drills',
        subtopics: [
          {
            id: 'eng_s1_1',
            text: 'Narrative Coding: Narrating your code out loud in English while coding (5m/day)',
          },
          {
            id: 'eng_s1_2',
            text: 'Thinking in English: Deleting the native-language translation lag',
          },
        ],
      },
      {
        id: 'eng_t2',
        title: 'Topic 2: AI Conversation Partners',
        subtopics: [
          { id: 'eng_s2_1', text: 'Practicing technical debates using ChatGPT Voice Mode' },
          {
            id: 'eng_s2_2',
            text: 'Speaking daily morning sync updates with structured AI feedback prompts',
          },
        ],
      },
      {
        id: 'eng_t3',
        title: 'Topic 3: Technical Written Presence',
        subtopics: [
          {
            id: 'eng_s3_1',
            text: 'Drafting Slack updates using the Context ➔ Action ➔ Result formula',
          },
          {
            id: 'eng_s3_2',
            text: 'Writing pixel-perfect, structured PR documentation for team clarity',
          },
        ],
      },
      {
        id: 'eng_t4',
        title: 'Topic 4: Professional Standup Mastery',
        subtopics: [
          { id: 'eng_s4_1', text: 'Standup Script A practice (for clean, on-track deliveries)' },
          {
            id: 'eng_s4_2',
            text: 'Standup Script B practice (managing blockers & stepping in for peer support)',
          },
        ],
      },
    ],
  },
  {
    id: 'stack',
    name: 'Active Stack Mastery',
    icon: Code,
    color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
    topics: [
      {
        id: 'st_t1',
        title: 'Topic 1: Whiteboard SQL Mastery',
        subtopics: [
          { id: 'st_s1_1', text: 'Writing raw SQL inner/left joins from memory once a week' },
          {
            id: 'st_s1_2',
            text: 'Solving 2nd Highest Salary & Duplicate records whiteboard questions',
          },
          {
            id: 'st_s1_3',
            text: 'Applying advanced analytical window functions (DENSE_RANK) without helpers',
          },
        ],
      },
      {
        id: 'st_t2',
        title: 'Topic 2: NestJS & Backend Systems',
        subtopics: [
          { id: 'st_s2_1', text: 'Mastering NestJS dependency injection scopes and decorators' },
          { id: 'st_s2_2', text: 'Designing robust database transactions with TypeORM/PostgreSQL' },
        ],
      },
      {
        id: 'st_t3',
        title: 'Topic 3: Modern Next.js Data Flow',
        subtopics: [
          {
            id: 'st_s3_1',
            text: 'Understanding Next.js 14 Server vs Client Component rendering boundaries',
          },
          {
            id: 'st_s3_2',
            text: 'Explaining SSR caching policies and data hydration architectures',
          },
        ],
      },
      {
        id: 'st_t4',
        title: 'Topic 4: High-Performance Distributed Patterns',
        subtopics: [
          {
            id: 'st_s4_1',
            text: 'Mastering Transactional Outbox pattern design for messaging safety',
          },
          {
            id: 'st_s4_2',
            text: 'Designing Saga Orchestrations for complex integrations (like QuickBooks Sync)',
          },
        ],
      },
    ],
  },
];

const SCENARIOS_DATA: ScenarioData[] = [
  {
    id: 'elevator',
    title: '1-Minute elevator Pitch',
    desc: 'Perfect for quick introductions with new team members, engineers, or cross-functional departments in casual slack or standup syncs.',
    script: `Hey everyone, I'm Santosh Sah. I'm a Senior Backend and AI Platform Engineer at Go Brilliant. For the past four years, I've focused heavily on building high-performance APIs and orchestrating scalable backend architectures—mostly leveraging NestJS, Next.js, and Python. I love solving complex data flow challenges and ensuring our production servers run smoothly. Really excited to collaborate with you all!`,
    powerWords: [
      'Senior Backend',
      'AI Platform Engineer',
      'orchestrating',
      'leveraging',
      'data flow challenges',
    ],
    chatgptPrompt: `Act as an engineering coach. I want to practice my senior software developer 1-minute elevator introduction. Ask me to introduce myself, listen carefully to my vocal clarity, and give me highly specific feedback on my transition pacing, tone, and confidence.`,
  },
  {
    id: 'interview',
    title: 'Senior Architect Interview Pitch',
    desc: 'Custom engineered for high-pressure technical interviews. Focuses heavily on backend scalability, your QuickBooks POC system delivery, and AI agent platforms.',
    script: `Good morning. I'm Santosh, a Senior Software Engineer with over four years of production experience specializing in scalable backend systems and AI architectures. Throughout my career, I've successfully designed and delivered robust microservice platforms using NestJS, Next.js, and Python. 

For instance, at Go Brilliant, I independently architected the entire QuickBooks invoice sync integration, which handled thousands of complex financial transactions seamlessly. I also spearheaded multiple AI integrations—moving beyond simple API wrappers to write core agentic pipelines. I'm really looking forward to discussing how I can leverage my architectural expertise and MLOps learnings to add massive value to your team.`,
    powerWords: [
      'production experience',
      'scalable backend systems',
      'successfully designed and delivered',
      'independently architected',
      'financial transactions seamlessly',
      'spearheaded multiple AI integrations',
      'leverage my architectural expertise',
    ],
    chatgptPrompt: `Act as a senior engineering hiring director conducting a technical WebEx interview. Ask me the opening question: "Tell me about yourself and walk me through your technical highlights." Evaluate my answer on architectural depth, structural clarity, and executive presence.`,
  },
  {
    id: 'stakeholder',
    title: 'Business Client & Stakeholder Pitch',
    desc: 'Used when speaking directly to clients, investors, or business stakeholders. Translates complex code boundaries into direct business timelines and ROI.',
    script: `Hello team. I'm Santosh Sah, the Senior Backend Architect. My primary objective on this project is to ensure that our platform's infrastructure is built for maximum scalability, absolute security, and perfect alignment with your core business requirements. 

We are leveraging a modular NestJS framework alongside Next.js Server Components to deliver an incredibly fast, highly optimized user experience. I will keep you updated on all technical milestones and potential blockers proactively, ensuring a transparent and highly successful delivery.`,
    powerWords: [
      'Senior Backend Architect',
      'maximum scalability',
      'perfect alignment',
      'core business requirements',
      'highly optimized user experience',
      'technical milestones',
      'highly successful delivery',
    ],
    chatgptPrompt: `Act as a non-technical product owner or business client in a project kickoff meeting. Ask me: "Santosh, what is your architectural strategy for this rollout, and how will it protect our release timeline?" Judge my answer on how well I bridge technical choices to business value.`,
  },
];

const SCRIPT_A_TEXT = `Good morning everyone. Yesterday, I successfully delivered the QuickBooks invoice mapping services. Following that, I wrote unit tests to cover the core database exceptions. Today, my primary focus is to deploy the microservice to staging and conduct end-to-end integration tests. I have no blockers at the moment.`;
const SCRIPT_B_TEXT = `Hi team. Yesterday, I worked on the Redis caching integration. However, I’ve hit a slight blocker regarding network connection timeouts between the API gateway and the Redis cluster in staging. Today, I'll be debugging the security group settings. I might need to sync with our DevOps team for 10 minutes to resolve this.`;

export default function RoadmapPage() {
  const [activeView, setActiveView] = useState<'quarterly' | 'syllabus' | 'practice'>('quarterly');
  const [selectedQuarter, setSelectedQuarter] = useState<string>('q2');
  const [selectedSubject, setSelectedSubject] = useState<string>('mlops');
  const [selectedScenario, setSelectedScenario] = useState<string>('elevator');

  const [checkedGoals, setCheckedGoals] = useState<Record<string, boolean>>({});
  const [weeklyStates, setWeeklyStates] = useState<Record<string, boolean>>({});
  const [checkedSubtopics, setCheckedSubtopics] = useState<Record<string, boolean>>({});
  const [practiceRuns, setPracticeRuns] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  // Standup Playbook modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedScript, setCopiedScript] = useState<'a' | 'b' | null>(null);

  // Audio Playback states
  const [isPlayingSpeech, setIsPlayingSpeech] = useState(false);

  // Time-based auto quarter detector
  const getActiveQuarterId = (): string => {
    const month = new Date().getMonth();
    if (month >= 4 && month <= 5) return 'q2';
    if (month >= 6 && month <= 8) return 'q3';
    if (month >= 9 && month <= 11) return 'q4';
    return 'q1';
  };

  // Calendar week calculation helper
  const getWeekNumber = (d: Date): number => {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  };

  useEffect(() => {
    const savedGoals = localStorage.getItem('evosan_roadmap_goals');
    const savedWeekly = localStorage.getItem('evosan_roadmap_weekly');
    const savedSubtopics = localStorage.getItem('evosan_roadmap_subtopics');
    const savedPractice = localStorage.getItem('evosan_roadmap_practice_runs');

    if (savedGoals) setCheckedGoals(JSON.parse(savedGoals));
    if (savedWeekly) setWeeklyStates(JSON.parse(savedWeekly));
    if (savedSubtopics) setCheckedSubtopics(JSON.parse(savedSubtopics));
    if (savedPractice) setPracticeRuns(JSON.parse(savedPractice));

    // Dynamic Quarter Detection
    setSelectedQuarter(getActiveQuarterId());

    // Weekly Auto-Reset Logic
    const currentWeek = getWeekNumber(new Date());
    const savedWeekNum = localStorage.getItem('evosan_roadmap_week_number');
    if (savedWeekNum) {
      if (parseInt(savedWeekNum, 10) !== currentWeek) {
        localStorage.setItem('evosan_roadmap_weekly', JSON.stringify({}));
        setWeeklyStates({});
        localStorage.setItem('evosan_roadmap_week_number', currentWeek.toString());
        toast.success('New week started! Weekly checklist reset. 🌅');
      }
    } else {
      localStorage.setItem('evosan_roadmap_week_number', currentWeek.toString());
    }

    setMounted(true);
  }, []);

  // Stop active speech synthesis if scenario or tab changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlayingSpeech(false);
    }
  }, [selectedScenario, activeView]);

  const toggleGoal = (id: string) => {
    const updated = { ...checkedGoals, [id]: !checkedGoals[id] };
    setCheckedGoals(updated);
    localStorage.setItem('evosan_roadmap_goals', JSON.stringify(updated));
    if (updated[id]) {
      toast.success('Milestone completed! Keep pushing ⚡');
    }
  };

  const toggleWeekly = (id: string) => {
    const updated = { ...weeklyStates, [id]: !weeklyStates[id] };
    setWeeklyStates(updated);
    localStorage.setItem('evosan_roadmap_weekly', JSON.stringify(updated));
    if (updated[id]) {
      toast.success('Weekly checkpoint marked done! ✅');
    }
  };

  const toggleSubtopic = (id: string) => {
    const updated = { ...checkedSubtopics, [id]: !checkedSubtopics[id] };
    setCheckedSubtopics(updated);
    localStorage.setItem('evosan_roadmap_subtopics', JSON.stringify(updated));
    if (updated[id]) {
      toast.success('Syllabus subtopic mastered! 📚');
    }
  };

  const togglePracticeRun = (id: string) => {
    const updated = { ...practiceRuns, [id]: !practiceRuns[id] };
    setPracticeRuns(updated);
    localStorage.setItem('evosan_roadmap_practice_runs', JSON.stringify(updated));
    if (updated[id]) {
      toast.success('Practice run complete! Great verbal shadowing! 🎙️');
    }
  };

  const copyScriptText = (text: string, type: 'a' | 'b') => {
    navigator.clipboard.writeText(text);
    setCopiedScript(type);
    toast.success('Script copied to clipboard!');
    setTimeout(() => setCopiedScript(null), 2000);
  };

  const copyGenericText = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast.success(message);
  };

  // Web Speech API Voice Synthesis play/stop
  const handleStartSpeech = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      toast.error('Web Speech API is not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    // Choose a high-quality professional US/UK voice
    const engVoice = voices.find((v) => v.lang.startsWith('en-US') || v.lang.startsWith('en-GB'));
    if (engVoice) {
      utterance.voice = engVoice;
    }

    // Slightly clear and paced speed for active verbal shadowing
    utterance.rate = 0.88;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsPlayingSpeech(false);
    };
    utterance.onerror = () => {
      setIsPlayingSpeech(false);
    };

    setIsPlayingSpeech(true);
    window.speechSynthesis.speak(utterance);
    toast.success('Audio playback started! Plug in headphones & shadow 🎧');
  };

  const handleStopSpeech = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlayingSpeech(false);
      toast.success('Audio playback stopped.');
    }
  };

  // Math metrics helper (Quarterly Goals)
  const allGoals = ROADMAP_DATA.flatMap((q) => q.goals);
  const completedTotalCount = allGoals.filter((g) => checkedGoals[g.id]).length;
  const overallPercentage =
    allGoals.length > 0 ? Math.round((completedTotalCount / allGoals.length) * 100) : 0;

  // Math metrics helper (Syllabus subtopics)
  const allSubtopics = SYLLABUS_DATA.flatMap((s) => s.topics.flatMap((t) => t.subtopics));
  const completedSubtopicsCount = allSubtopics.filter((sub) => checkedSubtopics[sub.id]).length;
  const overallSyllabusPercentage =
    allSubtopics.length > 0 ? Math.round((completedSubtopicsCount / allSubtopics.length) * 100) : 0;

  const currentQuarterData = ROADMAP_DATA.find((q) => q.id === selectedQuarter) || ROADMAP_DATA[0];
  const quarterCompletedCount = currentQuarterData.goals.filter((g) => checkedGoals[g.id]).length;
  const quarterPercentage =
    currentQuarterData.goals.length > 0
      ? Math.round((quarterCompletedCount / currentQuarterData.goals.length) * 100)
      : 0;

  const currentSubjectData =
    SYLLABUS_DATA.find((s) => s.id === selectedSubject) || SYLLABUS_DATA[0];
  const subjectSubtopics = currentSubjectData.topics.flatMap((t) => t.subtopics);
  const subjectCompletedCount = subjectSubtopics.filter((sub) => checkedSubtopics[sub.id]).length;
  const subjectPercentage =
    subjectSubtopics.length > 0
      ? Math.round((subjectCompletedCount / subjectSubtopics.length) * 100)
      : 0;

  // Practice tab scenario picker
  const activeScenarioData =
    SCENARIOS_DATA.find((s) => s.id === selectedScenario) || SCENARIOS_DATA[0];

  const highlightPowerWords = (text: string, words: string[]) => {
    let highlighted = text;
    words.forEach((word) => {
      const regex = new RegExp(`(${word})`, 'gi');
      highlighted = highlighted.replace(
        regex,
        '<span class="text-rose-500 font-extrabold underline decoration-rose-500/40">$1</span>'
      );
    });
    return (
      <p
        className="text-xs md:text-sm leading-relaxed text-foreground bg-card p-4 rounded-xl border border-border/40 italic"
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    );
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 px-4 md:px-8 py-4 md:py-6 max-w-[1600px] mx-auto animate-in fade-in duration-500 relative">
      {/* HEADER CONTROL DECK */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card/30 p-4 rounded-xl border border-border/40">
        <div>
          <div className="flex items-center gap-2 text-primary mb-1">
            <Compass size={18} className="animate-spin-slow" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80">
              Career GPS
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            2026 Career Transformation Roadmap
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm">
            Transitioning to confident AI Platform & MLOps Architect.
          </p>
        </div>

        {/* Global Progress Widgets */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Playbook Launcher Badge */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm group hover:scale-[1.02]"
          >
            <Flame size={14} className="animate-pulse text-rose-500" />
            <span>Standup Scripts Playbook</span>
          </button>

          {/* Quarterly Progress */}
          <div className="flex items-center gap-3 bg-card px-3.5 py-2 rounded-xl border border-border/80 shadow-sm">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  stroke="currentColor"
                  className="text-muted/30"
                  strokeWidth="2.5"
                  fill="transparent"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  stroke="currentColor"
                  className="text-primary transition-all duration-700"
                  strokeWidth="3"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 16}
                  strokeDashoffset={2 * Math.PI * 16 * (1 - overallPercentage / 100)}
                />
              </svg>
              <span className="text-[10px] font-mono font-bold text-foreground">
                {overallPercentage}%
              </span>
            </div>
            <div>
              <div className="text-[8px] uppercase tracking-widest text-muted-foreground font-bold">
                Milestones
              </div>
              <div className="text-xs font-extrabold text-foreground">
                {completedTotalCount}/{allGoals.length} Done
              </div>
            </div>
          </div>

          {/* Syllabus Subtopics Progress */}
          <div className="flex items-center gap-3 bg-card px-3.5 py-2 rounded-xl border border-border/80 shadow-sm">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  stroke="currentColor"
                  className="text-muted/30"
                  strokeWidth="2.5"
                  fill="transparent"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  stroke="currentColor"
                  className="text-secondary transition-all duration-700"
                  strokeWidth="3"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 16}
                  strokeDashoffset={2 * Math.PI * 16 * (1 - overallSyllabusPercentage / 100)}
                />
              </svg>
              <span className="text-[10px] font-mono font-bold text-foreground">
                {overallSyllabusPercentage}%
              </span>
            </div>
            <div>
              <div className="text-[8px] uppercase tracking-widest text-muted-foreground font-bold">
                Syllabus Mastered
              </div>
              <div className="text-xs font-extrabold text-foreground">
                {completedSubtopicsCount}/{allSubtopics.length} Skills
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABS SELECTOR */}
      <div className="flex border-b border-border/60 pb-px gap-2">
        <button
          onClick={() => setActiveView('quarterly')}
          className={`px-4 py-2 text-xs md:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeView === 'quarterly'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <ListTodo size={14} />
          Quarterly Milestones
        </button>
        <button
          onClick={() => setActiveView('syllabus')}
          className={`px-4 py-2 text-xs md:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeView === 'syllabus'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <BookOpenCheck size={14} />
          Detailed Subjects & Syllabus
        </button>
        <button
          onClick={() => setActiveView('practice')}
          className={`px-4 py-2 text-xs md:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeView === 'practice'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <MessageSquare size={14} />
          English Practice Hub
        </button>
      </div>

      {activeView === 'quarterly' && (
        <>
          {/* QUARTERLY TIMELINE BUTTONS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-4 animate-in fade-in duration-350">
            {ROADMAP_DATA.map((q) => {
              const isActive = selectedQuarter === q.id;
              const isQ2ActiveNow = q.id === 'q2';
              const compCount = q.goals.filter((g) => checkedGoals[g.id]).length;
              const pct = Math.round((compCount / q.goals.length) * 100);

              return (
                <button
                  key={q.id}
                  onClick={() => setSelectedQuarter(q.id)}
                  className={`p-3 text-left rounded-xl transition-all duration-500 relative border group overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-b from-card to-primary/[0.03] border-primary/40 shadow-md shadow-primary/5'
                      : 'bg-card border-border hover:border-muted-foreground/30 shadow-sm'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[9px] font-mono font-bold text-muted-foreground group-hover:text-primary transition-colors">
                        {q.date}
                      </span>
                      {isQ2ActiveNow && (
                        <span className="px-1 py-0.5 rounded text-[8px] font-bold font-mono bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 animate-pulse">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-bold text-foreground mb-1.5 flex items-center gap-1 group-hover:text-primary transition-colors">
                      {q.title.split(':')[0]}
                    </div>
                    {/* Micro Progress Bar */}
                    <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                  <div
                    className={`absolute bottom-0 left-0 w-full h-0.5 transition-all duration-500 ${isActive ? 'bg-primary' : 'bg-transparent'}`}
                  />
                </button>
              );
            })}
          </div>

          {/* MAIN TWO-COLUMN CONTENT GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 animate-in fade-in duration-500">
            {/* Left Column (Quarterly Milestones & Checklists) */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              <div className="bg-card rounded-xl p-4 md:p-6 border border-border shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-4 border-b border-border/80">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-primary font-bold">
                      {currentQuarterData.date}
                    </span>
                    <h2 className="text-base md:text-lg font-bold text-foreground flex items-center gap-1.5 mt-0.5">
                      <Calendar size={16} className="text-secondary" />
                      {currentQuarterData.title}
                    </h2>
                    <p className="text-muted-foreground text-xs leading-relaxed mt-1">
                      {currentQuarterData.focus}
                    </p>
                  </div>
                  <div className="bg-muted/50 px-3 py-1.5 rounded-lg border border-border flex items-center gap-2.5 self-start md:self-center">
                    <span className="text-[10px] font-bold font-mono text-muted-foreground">
                      {quarterPercentage}% Done
                    </span>
                    <div className="w-16 bg-muted h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all duration-500"
                        style={{ width: `${quarterPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-extrabold text-rose-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <MessageSquare size={13} /> English & Presence
                    </h3>
                    <div className="space-y-2">
                      {currentQuarterData.goals
                        .filter((g) => g.category === 'english')
                        .map((goal) => (
                          <div
                            key={goal.id}
                            onClick={() => toggleGoal(goal.id)}
                            className={`flex flex-col gap-1 p-3 rounded-lg border transition-all duration-300 cursor-pointer ${
                              checkedGoals[goal.id]
                                ? 'bg-rose-500/[0.02] border-rose-500/20 text-muted-foreground'
                                : 'bg-muted/30 border-border hover:border-rose-500/20'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`mt-0.5 flex-shrink-0 ${checkedGoals[goal.id] ? 'text-rose-500' : 'text-muted-foreground'}`}
                              >
                                <CheckCircle2
                                  size={16}
                                  fill={checkedGoals[goal.id] ? 'currentColor' : 'none'}
                                  className={checkedGoals[goal.id] ? 'text-rose-500' : ''}
                                />
                              </div>
                              <span
                                className={`text-xs md:text-sm font-medium leading-relaxed ${checkedGoals[goal.id] ? 'line-through text-muted-foreground/60' : 'text-foreground'}`}
                              >
                                {goal.text}
                              </span>
                            </div>

                            {goal.id === 'q2_eng_1' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsModalOpen(true);
                                }}
                                className="mt-2.5 px-2 py-1 rounded text-[10px] font-bold bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/20 transition-all flex items-center gap-1.5 self-start animate-pulse"
                              >
                                <Flame size={11} /> Open Standup Scripts Playbook
                              </button>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-extrabold text-cyan-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Code size={13} /> Active Stack Mastery
                    </h3>
                    <div className="space-y-2">
                      {currentQuarterData.goals
                        .filter((g) => g.category === 'stack')
                        .map((goal) => (
                          <div
                            key={goal.id}
                            onClick={() => toggleGoal(goal.id)}
                            className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-300 cursor-pointer ${
                              checkedGoals[goal.id]
                                ? 'bg-cyan-500/[0.02] border-cyan-500/20 text-muted-foreground'
                                : 'bg-muted/30 border-border hover:border-cyan-500/20'
                            }`}
                          >
                            <div
                              className={`mt-0.5 flex-shrink-0 ${checkedGoals[goal.id] ? 'text-cyan-500' : 'text-muted-foreground'}`}
                            >
                              <CheckCircle2
                                size={16}
                                fill={checkedGoals[goal.id] ? 'currentColor' : 'none'}
                                className={checkedGoals[goal.id] ? 'text-cyan-500' : ''}
                              />
                            </div>
                            <span
                              className={`text-xs md:text-sm font-medium leading-relaxed ${checkedGoals[goal.id] ? 'line-through text-muted-foreground/60' : 'text-foreground'}`}
                            >
                              {goal.text}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-extrabold text-violet-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Cpu size={13} /> MLOps Platform Engineering
                    </h3>
                    <div className="space-y-2">
                      {currentQuarterData.goals
                        .filter((g) => g.category === 'mlops')
                        .map((goal) => (
                          <div
                            key={goal.id}
                            onClick={() => toggleGoal(goal.id)}
                            className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-300 cursor-pointer ${
                              checkedGoals[goal.id]
                                ? 'bg-violet-500/[0.02] border-violet-500/20 text-muted-foreground'
                                : 'bg-muted/30 border-border hover:border-violet-500/20'
                            }`}
                          >
                            <div
                              className={`mt-0.5 flex-shrink-0 ${checkedGoals[goal.id] ? 'text-violet-500' : 'text-muted-foreground'}`}
                            >
                              <CheckCircle2
                                size={16}
                                fill={checkedGoals[goal.id] ? 'currentColor' : 'none'}
                                className={checkedGoals[goal.id] ? 'text-violet-500' : ''}
                              />
                            </div>
                            <span
                              className={`text-xs md:text-sm font-medium leading-relaxed ${checkedGoals[goal.id] ? 'line-through text-muted-foreground/60' : 'text-foreground'}`}
                            >
                              {goal.text}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (Weekly Tracker & Titan Daily Schedule) */}
            <div className="space-y-4 md:space-y-6">
              <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
                <h2 className="text-xs md:text-sm font-bold text-foreground mb-3 flex items-center gap-1.5">
                  <CheckSquare size={16} className="text-primary" />
                  Weekly Progress Checklist
                </h2>
                <div className="space-y-2">
                  {WEEKLY_CHECKPOINTS.map((chk) => (
                    <div
                      key={chk.id}
                      onClick={() => toggleWeekly(chk.id)}
                      className={`flex items-center justify-between p-2.5 rounded-lg border transition-all duration-300 cursor-pointer ${
                        weeklyStates[chk.id]
                          ? 'bg-primary/[0.02] border-primary/20 text-muted-foreground'
                          : 'bg-muted/50 border-border hover:border-primary/20'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-extrabold text-[10px] ${
                            weeklyStates[chk.id]
                              ? 'bg-primary/20 text-primary'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {chk.day}
                        </span>
                        <span
                          className={`text-[11px] font-semibold ${weeklyStates[chk.id] ? 'line-through text-muted-foreground/60' : 'text-foreground'}`}
                        >
                          {chk.text}
                        </span>
                      </div>
                      <div
                        className={
                          weeklyStates[chk.id] ? 'text-primary' : 'text-muted-foreground/50'
                        }
                      >
                        <CheckCircle2
                          size={16}
                          fill={weeklyStates[chk.id] ? 'currentColor' : 'none'}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
                <h2 className="text-xs md:text-sm font-bold text-foreground mb-3 flex items-center gap-1.5">
                  <Clock size={16} className="text-secondary" />
                  The "Titan" Daily Cycle
                </h2>
                <div className="space-y-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60">
                  {TITAN_SCHEDULE.map((item, idx) => {
                    return (
                      <div key={idx} className="flex gap-3 relative z-10 group">
                        <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center flex-shrink-0 text-muted-foreground group-hover:text-secondary group-hover:border-secondary transition-all">
                          <item.icon size={13} />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono font-bold text-secondary">
                              {item.time}
                            </span>
                            <span className="text-xs font-bold text-foreground">
                              — {item.label}
                            </span>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-0.5 font-medium leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeView === 'syllabus' && (
        /* SYLLABUS VIEWER VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 animate-in fade-in duration-350">
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">
              Select Subject
            </h2>
            <div className="flex flex-col gap-2">
              {SYLLABUS_DATA.map((sub) => {
                const isSelected = selectedSubject === sub.id;
                const subTopics = sub.topics.flatMap((t) => t.subtopics);
                const subDone = subTopics.filter((s) => checkedSubtopics[s.id]).length;
                const subPct =
                  subTopics.length > 0 ? Math.round((subDone / subTopics.length) * 100) : 0;

                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubject(sub.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-card border-primary/30 shadow-md shadow-foreground/5'
                        : 'bg-card/60 border-border hover:border-muted-foreground/30 hover:bg-card'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center border ${sub.color}`}
                      >
                        <sub.icon size={15} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-foreground block">{sub.name}</span>
                        <span className="text-[9px] font-mono text-muted-foreground block mt-0.5">
                          {subDone}/{subTopics.length} Mastered
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-primary">
                        {subPct}%
                      </span>
                      <ChevronRight size={14} className="text-muted-foreground" />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="bg-card/40 p-4 rounded-xl border border-border/80 mt-4">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-secondary block mb-1">
                Syllabus Practice Tip
              </span>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Tackle one subtopic under **{currentSubjectData.name}** during your daily **Legacy
                Block (09:00 PM)**. Ticking it off builds permanent expertise.
              </p>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4 md:space-y-6">
            <div className="bg-card rounded-xl p-4 md:p-6 border border-border shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-4 border-b border-border/80">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center border ${currentSubjectData.color}`}
                  >
                    <currentSubjectData.icon size={16} />
                  </div>
                  <div>
                    <h2 className="text-base md:text-lg font-bold text-foreground">
                      {currentSubjectData.name} Syllabus
                    </h2>
                    <p className="text-muted-foreground text-xs">
                      Step-by-step master checklist for direct skill acquisition.
                    </p>
                  </div>
                </div>
                <div className="bg-muted/50 px-3 py-1.5 rounded-lg border border-border flex items-center gap-2.5 self-start md:self-center">
                  <span className="text-[10px] font-bold font-mono text-muted-foreground">
                    {subjectPercentage}% Mastered
                  </span>
                  <div className="w-16 bg-muted h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all duration-500"
                      style={{ width: `${subjectPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {currentSubjectData.topics.map((topic) => {
                  const topicSubCount = topic.subtopics.length;
                  const topicCompletedCount = topic.subtopics.filter(
                    (sub) => checkedSubtopics[sub.id]
                  ).length;
                  const topicPercentage = Math.round((topicCompletedCount / topicSubCount) * 100);

                  return (
                    <div
                      key={topic.id}
                      className="p-3 md:p-4 rounded-xl bg-muted/20 border border-border/60 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-2">
                        <h3 className="text-xs md:text-sm font-extrabold text-foreground flex items-center gap-1.5">
                          {topic.title}
                        </h3>
                        <span className="text-[9px] font-mono bg-muted/80 px-2 py-0.5 rounded border border-border text-muted-foreground">
                          {topicCompletedCount}/{topicSubCount} Mastered ({topicPercentage}%)
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {topic.subtopics.map((sub) => (
                          <div
                            key={sub.id}
                            onClick={() => toggleSubtopic(sub.id)}
                            className={`flex items-start gap-2.5 p-2.5 rounded-lg border transition-all duration-300 cursor-pointer ${
                              checkedSubtopics[sub.id]
                                ? 'bg-primary/[0.01] border-primary/20 text-muted-foreground'
                                : 'bg-card/50 border-border hover:border-primary/20 hover:bg-card'
                            }`}
                          >
                            <div
                              className={`mt-0.5 flex-shrink-0 ${checkedSubtopics[sub.id] ? 'text-primary' : 'text-muted-foreground'}`}
                            >
                              <CheckCircle2
                                size={15}
                                fill={checkedSubtopics[sub.id] ? 'currentColor' : 'none'}
                                className={checkedSubtopics[sub.id] ? 'text-primary' : ''}
                              />
                            </div>
                            <span
                              className={`text-[11px] md:text-xs font-semibold leading-relaxed ${checkedSubtopics[sub.id] ? 'line-through text-muted-foreground/60' : 'text-foreground'}`}
                            >
                              {sub.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeView === 'practice' && (
        /* INTERACTIVE ENGLISH PRACTICE HUB VIEW WITH VOICE SYNTHESIS */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 animate-in fade-in duration-350">
          {/* Left Column: Pitch/Scenario Selector */}
          <div className="space-y-4">
            <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
              <h2 className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest mb-3 px-1">
                Introduction Scenarios
              </h2>
              <div className="flex flex-col gap-2">
                {SCENARIOS_DATA.map((sc) => {
                  const isSel = selectedScenario === sc.id;
                  return (
                    <button
                      key={sc.id}
                      onClick={() => setSelectedScenario(sc.id)}
                      className={`w-full p-3 rounded-xl border text-left transition-all ${
                        isSel
                          ? 'bg-rose-500/[0.02] border-rose-500/30 shadow-md shadow-rose-500/5'
                          : 'bg-card border-border hover:border-muted-foreground/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-xs font-bold ${isSel ? 'text-rose-500' : 'text-foreground'}`}
                        >
                          {sc.title}
                        </span>
                        {isSel && (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold font-mono bg-rose-500/10 text-rose-500 border border-rose-500/20">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">
                        {sc.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-card rounded-xl p-4 border border-border shadow-sm space-y-3">
              <h3 className="text-xs font-extrabold text-foreground flex items-center gap-1.5">
                <Flame size={14} className="text-rose-500 animate-pulse" />
                ChatGPT Voice Commute Partner
              </h3>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Copy this engineered coaching prompt onto your phone to run high-value roleplays
                during your evening shadowing sessions on the bus:
              </p>
              <div className="bg-muted p-2.5 rounded-lg border border-border/80 text-[10px] leading-relaxed text-foreground italic relative font-mono">
                "{activeScenarioData.chatgptPrompt}"
              </div>
              <button
                onClick={() =>
                  copyGenericText(
                    activeScenarioData.chatgptPrompt,
                    'Coaching prompt copied! Ready for voice mode ⚡'
                  )
                }
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 text-xs font-bold transition-all"
              >
                <Copy size={13} />
                <span>Copy Roleplay Prompt</span>
              </button>
            </div>
          </div>

          {/* Right Columns (Pitch Sandbox & Audio Shadowing Controls) */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <div className="bg-card rounded-xl p-4 md:p-6 border border-border shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/60 pb-3 gap-3">
                <div className="flex items-center gap-2">
                  <Award size={18} className="text-rose-500" />
                  <div>
                    <h2 className="text-base font-bold text-foreground">
                      {activeScenarioData.title}
                    </h2>
                    <p className="text-xs text-muted-foreground">{activeScenarioData.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Web Speech API Listen & Shadow Controls */}
                  {isPlayingSpeech ? (
                    <button
                      onClick={handleStopSpeech}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500 text-white hover:bg-rose-600 text-xs font-bold transition-all shadow-sm"
                    >
                      <VolumeX size={13} />
                      <span>Stop Listening</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartSpeech(activeScenarioData.script)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 text-xs font-bold transition-all shadow-sm animate-pulse"
                    >
                      <Volume2 size={13} />
                      <span>Listen & Shadow</span>
                    </button>
                  )}

                  <button
                    onClick={() =>
                      copyGenericText(activeScenarioData.script, 'Introduction script copied!')
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted-foreground/10 text-muted-foreground hover:text-foreground text-xs font-semibold transition-all border border-border"
                  >
                    <Copy size={13} />
                    <span>Copy Script</span>
                  </button>
                </div>
              </div>

              {/* Pitch Script displaying highlighted Power Words */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-rose-500">
                    Practice Script
                  </div>
                  <span className="text-[9px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border/60">
                    Shadow tempo: Clear & Articulate (0.88x speed)
                  </span>
                </div>
                {highlightPowerWords(activeScenarioData.script, activeScenarioData.powerWords)}
              </div>

              {/* Practice runs logs */}
              <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
                <div className="text-[10px] uppercase font-bold tracking-widest text-secondary mb-2.5 block">
                  Interactive Practice Checklist (Commit to 3 runs daily)
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['run_1', 'run_2', 'run_3'].map((num, idx) => {
                    const runId = `run_${activeScenarioData.id}_${num}`;
                    const isChecked = practiceRuns[runId];
                    return (
                      <button
                        key={runId}
                        onClick={() => togglePracticeRun(runId)}
                        className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-bold transition-all ${
                          isChecked
                            ? 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                            : 'bg-card border-border hover:border-rose-500/10 hover:text-rose-500'
                        }`}
                      >
                        <CheckCircle2 size={13} fill={isChecked ? 'currentColor' : 'none'} />
                        <span>Run #{idx + 1}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Daily Communication Best-Practices Frameworks card */}
            <div className="bg-card rounded-xl p-4 md:p-6 border border-border shadow-sm space-y-4">
              <h3 className="text-xs font-extrabold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} className="text-secondary" />
                High-Presence Communication Frameworks
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-muted/20 border border-border/60 space-y-2">
                  <div className="text-xs font-bold text-foreground">
                    The 3-Step "CAR" Update Formula
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Always format your Slack messages, daily updates, or technical reviews using:
                  </p>
                  <ul className="text-[10px] space-y-1.5 text-foreground leading-relaxed">
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>**Context**:
                      *"We had timeout drops on the QuickBooks pipeline."*
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>**Action**: *"I
                      restructured the sync batches and added a local transaction."*
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>**Result**:
                      *"Sync batch runs are now 40% faster with 0 failures."*
                    </li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-muted/20 border border-border/60 space-y-2">
                  <div className="text-xs font-bold text-foreground">
                    Meeting Blocker Vocabulary
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Practice replacing simple, hesitate phrases with polished transitions:
                  </p>
                  <ul className="text-[10px] space-y-1.5 text-foreground leading-relaxed">
                    <li>❌ *"I have a problem with redis..."*</li>
                    <li>
                      👉 **Polished**: *"I've hit a slight blocker regarding Redis gateway
                      timeouts..."*
                    </li>
                    <li>❌ *"Then I did this..."*</li>
                    <li>
                      👉 **Polished**: *"Following that, I focused on microservice integrations..."*
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GLASSMORPHIC STANDUP PLAYBOOK MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-card border border-border/80 rounded-2xl max-w-2xl w-full p-5 md:p-6 shadow-2xl relative animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border/85">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
                  <Flame size={16} />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-bold text-foreground">
                    Standup Scripts Playbook
                  </h3>
                  <p className="text-[10px] text-muted-foreground">
                    Copy and edit structures to deliver morning syncs with absolute executive
                    authority.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="mt-4 space-y-4">
              {/* Script A (On Track) */}
              <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-3 relative group">
                <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500">
                    Script A: When Everything is On Track
                  </span>
                  <button
                    onClick={() => copyScriptText(SCRIPT_A_TEXT, 'a')}
                    className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold bg-muted hover:bg-muted-foreground/10 text-muted-foreground hover:text-foreground transition-all"
                  >
                    {copiedScript === 'a' ? (
                      <Check size={11} className="text-emerald-500" />
                    ) : (
                      <Copy size={11} />
                    )}
                    <span>{copiedScript === 'a' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-xs leading-relaxed text-foreground bg-card p-3 rounded-lg border border-border/40 italic">
                  "{SCRIPT_A_TEXT}"
                </p>
                <div className="text-[10px] text-muted-foreground flex gap-3 mt-1">
                  <span>
                    🚀 **Focus**: Clarity, sequence transition words (following that, successfully).
                  </span>
                </div>
              </div>

              {/* Script B (Blocked) */}
              <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-3 relative group">
                <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-rose-500">
                    Script B: When You Have Blockers
                  </span>
                  <button
                    onClick={() => copyScriptText(SCRIPT_B_TEXT, 'b')}
                    className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold bg-muted hover:bg-muted-foreground/10 text-muted-foreground hover:text-foreground transition-all"
                  >
                    {copiedScript === 'b' ? (
                      <Check size={11} className="text-emerald-500" />
                    ) : (
                      <Copy size={11} />
                    )}
                    <span>{copiedScript === 'b' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-xs leading-relaxed text-foreground bg-card p-3 rounded-lg border border-border/40 italic">
                  "{SCRIPT_B_TEXT}"
                </p>
                <div className="text-[10px] text-muted-foreground flex gap-3 mt-1">
                  <span>
                    ⚡ **Focus**: Blocker vocabulary (hit a slight blocker regarding, sync with
                    DevOps).
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-5 pt-4 border-t border-border/80 flex items-center justify-between">
              <span className="text-[9px] text-muted-foreground italic">
                Tip: Practicing these out loud twice deletes the hesitation layer entirely.
              </span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold rounded-lg transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
