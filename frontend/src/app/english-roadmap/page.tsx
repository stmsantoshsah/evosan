'use client';

import { useState, useEffect } from 'react';
import {
  Compass,
  BookOpen,
  Cpu,
  CheckCircle2,
  Calendar,
  Flame,
  Clock,
  BookOpenCheck,
  ChevronRight,
  ChevronDown,
  X,
  Copy,
  Check,
  Award,
  Sparkles,
  GraduationCap,
  Info,
  Activity,
  Target,
  ArrowRight,
  MessageSquare,
  Volume2,
  VolumeX,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '@/common/contexts/ThemeContext';

interface Subtopic {
  id: string;
  text: string;
}

interface TopicDetail {
  id: string;
  title: string;
  importance: 'Critical' | 'Important' | 'Recommended';
  time: string;
  description: string;
  subtopics: Subtopic[];
  needToKnow: string[];
  whyItMatters: string;
}

interface Subject {
  id: string;
  name: string;
  icon: any;
  color: string;
  bgGradient: string;
  badgeColor: string;
  badgeText: string;
  description: string;
  topics: TopicDetail[];
}

const ENGLISH_ROADMAP_DATA: Subject[] = [
  {
    id: 'pronunciation',
    name: 'Pronunciation & Accent',
    icon: Volume2,
    color: 'text-rose-500',
    bgGradient: 'from-rose-500/10 to-rose-500/[0.02] border-rose-500/20',
    badgeColor: 'bg-rose-500/15 text-rose-500 border border-rose-500/20',
    badgeText: 'Foundation 1 - Week 1',
    description: 'Phonetics, muscle positioning, word stress, and audio shadowing to develop clear, easily intelligible speech.',
    topics: [
      {
        id: 'pron_t1',
        title: 'Phonetics & Mouth Positioning',
        importance: 'Critical',
        time: '3-4 hrs',
        description: 'Vowel contrasts, consonant articulation (TH, V/W, R/L), and dental/alveolar tongue placement.',
        subtopics: [
          { id: 'pron_s1_1', text: 'Voiced vs. Unvoiced TH sounds (think vs. this)' },
          { id: 'pron_s1_2', text: 'V and W differentiation (very vs. wary)' },
          { id: 'pron_s1_3', text: 'Alveolar ridge contact for T, D, L, and N' },
          { id: 'pron_s1_4', text: 'Vowel contrasts (short i in "sit" vs. long e in "seat")' }
        ],
        needToKnow: [
          'The exact mechanical difference between V (lip-teeth contact) and W (rounded lips)',
          'Tongue position for voiced TH (lightly touching the back of upper teeth with air flow)',
          'Alveolar ridge placement for crisp T and D sounds'
        ],
        whyItMatters: 'Mouth positioning is the mechanical baseline. Mispronouncing TH or confusing V/W causes native speakers to spend extra cognitive load deciphering basic nouns.'
      },
      {
        id: 'pron_t2',
        title: 'Word Stress & Rhythm',
        importance: 'Critical',
        time: '4-5 hrs',
        description: 'Syllable weight, content vs. function words, sentence rhythm, and schwa insertion.',
        subtopics: [
          { id: 'pron_s2_1', text: 'Identifying and stress-marking multisyllabic words' },
          { id: 'pron_s2_2', text: 'Stress shifts (e.g., PHOtograph vs. phoTOGrapher)' },
          { id: 'pron_s2_3', text: 'Function word reduction (e.g., to -> /tə/, for -> /fər/)' },
          { id: 'pron_s2_4', text: 'Intonation profiles (rising for yes/no, falling for statements)' }
        ],
        needToKnow: [
          'English is a stress-timed language (stressed syllables happen at regular intervals)',
          'Unstressed vowels reduce to the "Schwa" sound (/ə/) in natural speech',
          'Intonation boundaries dictate clauses and keep listeners engaged'
        ],
        whyItMatters: 'Incorrect word stress is the primary cause of communication breakdowns in professional environments, even if the individual sounds are correct.'
      }
    ]
  },
  {
    id: 'grammar',
    name: 'Grammar & Structure',
    icon: Compass,
    color: 'text-blue-500',
    bgGradient: 'from-blue-500/10 to-blue-500/[0.02] border-blue-500/20',
    badgeColor: 'bg-blue-500/15 text-blue-500 border border-blue-500/20',
    badgeText: 'Technical Precision',
    description: 'Constructing error-free, complex sentences that hold technical and logical relationships accurately.',
    topics: [
      {
        id: 'gram_t1',
        title: 'Verb Tenses in Action',
        importance: 'Critical',
        time: '4-6 hrs',
        description: 'Choosing appropriate tenses for progress reports, completed projects, and future plans.',
        subtopics: [
          { id: 'gram_s1_1', text: 'Present Perfect for ongoing tasks (e.g., "I have worked on this pipeline...")' },
          { id: 'gram_s1_2', text: 'Past Simple for completed milestones (e.g., "We migrated the database yesterday")' },
          { id: 'gram_s1_3', text: 'Present Continuous for currently executing tasks' },
          { id: 'gram_s1_4', text: 'Future forms for schedules (will vs. going to vs. present simple)' }
        ],
        needToKnow: [
          'Never mix Past Simple and Present Perfect in the same update window without clear temporal logic',
          'Use Present Perfect to signal current value: "I have optimized the query, which now runs in 10ms"',
          'Avoid "I am doing" for permanent properties or state attributes'
        ],
        whyItMatters: 'Using the incorrect tense during standups misleads project managers about whether a feature is complete, blocked, or in-flight.'
      },
      {
        id: 'gram_t2',
        title: 'Transitions & Logical Connectors',
        importance: 'Important',
        time: '3-4 hrs',
        description: 'Connecting clauses to show contrast, cause-and-effect, and order of operations.',
        subtopics: [
          { id: 'gram_s2_1', text: 'Contrast connectors: "However", "Although", "Whereas"' },
          { id: 'gram_s2_2', text: 'Causal links: "Consequently", "Therefore", "As a result of"' },
          { id: 'gram_s2_3', text: 'Sequence triggers: "Following that", "Subsequently", "Prior to"' },
          { id: 'gram_s2_4', text: 'Relative clauses for precision (using which, who, that, whose)' }
        ],
        needToKnow: [
          'Relative clauses clarify which object is executing which event',
          'Avoid starting every sentence with "And then..." or "So..."',
          'Use contrast transitions to set up blockers clearly'
        ],
        whyItMatters: 'Allows you to explain complex architectural tradeoffs (e.g. why SQL was selected over NoSQL) without losing the logical thread.'
      }
    ]
  },
  {
    id: 'vocabulary',
    name: 'Business Vocabulary',
    icon: Sparkles,
    color: 'text-purple-500',
    bgGradient: 'from-purple-500/10 to-purple-500/[0.02] border-purple-500/20',
    badgeColor: 'bg-purple-500/15 text-purple-500 border border-purple-500/20',
    badgeText: 'Polished Idiomatics',
    description: 'Replacing basic verbs and repetitive phrases with high-impact corporate vocabulary and precise synonyms.',
    topics: [
      {
        id: 'voc_t1',
        title: 'Verbal Precision & Action Verbs',
        importance: 'Critical',
        time: '4-5 hrs',
        description: 'Transitioning away from generic verbs like "get", "do", "make", and "take".',
        subtopics: [
          { id: 'voc_s1_1', text: 'Replacing "do/make" with: Formulate, execute, construct, implement' },
          { id: 'voc_s1_2', text: 'Replacing "get" with: Retrieve, acquire, resolve, obtain' },
          { id: 'voc_s1_3', text: 'Replacing "change" with: Adjust, modify, refactor, optimize' },
          { id: 'voc_s1_4', text: 'Using action-oriented verbs to describe contributions' }
        ],
        needToKnow: [
          'Say "I refactored the module" instead of "I changed the code"',
          'Say "We retrieved the payload" instead of "We got the data"',
          'Keep a personal log of repetitive verbs and map them to executive alternatives'
        ],
        whyItMatters: 'Using weak verbs minimizes the perceived complexity and value of your engineering contributions.'
      },
      {
        id: 'voc_t2',
        title: 'Corporate Idioms & Phrasal Verbs',
        importance: 'Important',
        time: '3-4 hrs',
        description: 'Understanding and using idioms relating to project management, tradeoffs, and deadlines.',
        subtopics: [
          { id: 'voc_s2_1', text: 'Collaboration: "On the same page", "Touch base", "Align"' },
          { id: 'voc_s2_2', text: 'Tradeoffs: "Give and take", "Double-edged sword", "Trade-off"' },
          { id: 'voc_s2_3', text: 'Urgency: "On the radar", "Back burner", "Bottleneck"' },
          { id: 'voc_s2_4', text: 'Resolution: "Iron out", "Wrap up", "Follow up"' }
        ],
        needToKnow: [
          'Use "align on" instead of "agree about"',
          'Use "bottleneck" instead of "the thing that is slow"',
          'Contextualize idioms so they flow naturally without sounding forced'
        ],
        whyItMatters: 'Professional idioms allow you to match the communication speed and tone of native-speaking stakeholders and team leads.'
      }
    ]
  },
  {
    id: 'speaking',
    name: 'Executive Speaking',
    icon: GraduationCap,
    color: 'text-teal-500',
    bgGradient: 'from-teal-500/10 to-teal-500/[0.02] border-teal-500/20',
    badgeColor: 'bg-teal-500/15 text-teal-500 border border-teal-500/20',
    badgeText: 'Syncs & Q&As',
    description: 'Structuring standups, articulating blockers, and delivering design proposals with confidence.',
    topics: [
      {
        id: 'spk_t1',
        title: 'Standups & The CAR Formula',
        importance: 'Critical',
        time: '5-6 hrs',
        description: 'Formatting morning sync updates to be brief, structured, and outcome-oriented.',
        subtopics: [
          { id: 'spk_s1_1', text: 'Context: "Yesterday, I focused on database migration"' },
          { id: 'spk_s1_2', text: 'Action: "I refactored the indexing script"' },
          { id: 'spk_s1_3', text: 'Result: "Which successfully reduced query latency by 30%"' },
          { id: 'spk_s1_4', text: 'Blocker flag: "I am currently blocked by DNS propagation..."' }
        ],
        needToKnow: [
          'Keep standup updates under 90 seconds',
          'Use chronological ordering transitions: "Initially, subsequently, currently"',
          'State the business impact of your engineering actions'
        ],
        whyItMatters: 'Standups are highly visible. Clear, brief updates project strong technical ownership and executive presence.'
      },
      {
        id: 'spk_t2',
        title: 'Handling Technical Q&A',
        importance: 'Critical',
        time: '4-5 hrs',
        description: 'Defending architectural decisions, explaining trade-offs, and managing unknown questions.',
        subtopics: [
          { id: 'spk_s2_1', text: 'Stalling phrases: "That is an interesting point, let me outline..."' },
          { id: 'spk_s2_2', text: 'Bridging to details: "Specifically, when looking at the latency..."' },
          { id: 'spk_s2_3', text: 'Admitting knowledge gaps: "I will investigate that and follow up"' },
          { id: 'spk_s2_4', text: 'Explaining trade-offs: "On one hand, we gain speed, but we compromise..."' }
        ],
        needToKnow: [
          'Never say "I don\'t know" and stop there. Add: "Let me check the logs and follow up on Slack"',
          'Use the "Point-Reason-Example-Point" (PREP) method to answer questions',
          'Maintain a calm, deliberate speaking pace of 130–140 words per minute'
        ],
        whyItMatters: 'Q&As test your composure. Pausing, acknowledging, and structuring answers prevents defensive or rambling responses.'
      }
    ]
  },
  {
    id: 'writing',
    name: 'Professional Writing',
    icon: BookOpen,
    color: 'text-orange-500',
    bgGradient: 'from-orange-500/10 to-orange-500/[0.02] border-orange-500/20',
    badgeColor: 'bg-orange-500/15 text-orange-500 border border-orange-500/20',
    badgeText: 'Slack & Pull Requests',
    description: 'Writing concise, scannable Slack updates, structured Pull Request notes, and professional engineering docs.',
    topics: [
      {
        id: 'wri_t1',
        title: 'Structured Slack Updates & Emails',
        importance: 'Critical',
        time: '3-4 hrs',
        description: 'Using bullet points, bold markers, and logical hierarchy to write scannable status updates.',
        subtopics: [
          { id: 'wri_s1_1', text: 'Using bold prefixes for key summaries' },
          { id: 'wri_s1_2', text: 'Bullet-pointing tasks for quick reading' },
          { id: 'wri_s1_3', text: 'Highlighting action items and owners explicitly' },
          { id: 'wri_s1_4', text: 'Crafting brief, clear subject headers' }
        ],
        needToKnow: [
          'Busy stakeholders read in an "F" pattern. Put critical results in the first two sentences',
          'Use bullet points for lists longer than two items',
          'Separate background context from direct action requests'
        ],
        whyItMatters: 'Poorly formatted blocks of text are ignored. Scannable messages receive faster reviews, approvals, and feedback.'
      },
      {
        id: 'wri_t2',
        title: 'Pull Request Descriptions & Code Reviews',
        importance: 'Important',
        time: '4-5 hrs',
        description: 'Explaining "Why" changes were made, detailing testing steps, and writing constructive review comments.',
        subtopics: [
          { id: 'wri_s2_1', text: 'Structuring PRs: Goal, Changes, and Testing Strategy' },
          { id: 'wri_s2_2', text: 'Constructive review suggestions (e.g., "Consider refactoring this to...")' },
          { id: 'wri_s2_3', text: 'Writing clear reproduction steps for bugs' },
          { id: 'wri_s2_4', text: 'Using polite, team-oriented phrasing in reviews' }
        ],
        needToKnow: [
          'A good PR template includes a high-level summary, list of changes, and verification commands',
          'Avoid defensive language in code review replies; frame modifications as collaborative improvements',
          'Ask open-ended questions in code reviews: "Could we optimize this loop?" instead of "Fix this loop"'
        ],
        whyItMatters: 'PR logs are permanent records of your architectural reasoning and collaborative attitude.'
      }
    ]
  }
];

const WEEKLY_12_PLAN = [
  { week: 'Weeks 1-2', subject: 'Pronunciation & Phonetics', goal: 'Isolate TH, V/W, and vowel contrasts. Drill tongue positions.', project: 'Record a 2-minute video daily introducing a project, focusing strictly on alveolar-ridge contacts.' },
  { week: 'Weeks 3-4', subject: 'Word Stress & Rhythm', goal: 'Learn stress-timed rhythm and Schwa reductions.', project: 'Shadow 5 minutes of technical podcasts daily. Record and compare syllable weights.' },
  { week: 'Weeks 5-6', subject: 'Grammar & Structure', goal: 'Master tenses (Present Perfect vs. Past Simple).', project: 'Rewrite past 10 status updates using transitions and clean tense relationships.' },
  { week: 'Weeks 7-8', subject: 'Business Vocabulary', goal: 'Eliminate lazy verbs (get/do/make) and integrate action verbs.', project: 'Compile a personal vocabulary cheatsheet replacing simple phrases with polished equivalents.' },
  { week: 'Weeks 9-10', subject: 'Executive Speaking', goal: 'Practice the CAR standup formula under 90 seconds.', project: 'Conduct daily voice updates using the CAR script. Record and benchmark against target pace.' },
  { week: 'Weeks 11-12', subject: 'Professional Writing', goal: 'Refactor Slack updates and code reviews for maximum scannability.', project: 'Create a custom scannable Slack update template and a structured Pull Request template.' }
];

export default function EnglishPrepRoadmap() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<string>('pronunciation');
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});
  const [checkedSubtopics, setCheckedSubtopics] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    const savedChecks = localStorage.getItem('evosan_english_checked_subtopics');
    if (savedChecks) {
      setCheckedSubtopics(JSON.parse(savedChecks));
    }
    // Expand the first topic of the default tab automatically
    const defaultSubject = ENGLISH_ROADMAP_DATA.find((s) => s.id === 'pronunciation');
    if (defaultSubject && defaultSubject.topics.length > 0) {
      setExpandedTopics({ [defaultSubject.topics[0].id]: true });
    }
    setMounted(true);
  }, []);

  const toggleSubtopic = (id: string) => {
    const updated = { ...checkedSubtopics, [id]: !checkedSubtopics[id] };
    setCheckedSubtopics(updated);
    localStorage.setItem('evosan_english_checked_subtopics', JSON.stringify(updated));
    if (updated[id]) {
      toast.success('Communication skill unlocked! Keep practicing 🗣️');
    }
  };

  const toggleTopicExpand = (id: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const activeSubject = ENGLISH_ROADMAP_DATA.find((s) => s.id === activeTab);

  // Overall calculations
  const totalSubtopicsCount = ENGLISH_ROADMAP_DATA.flatMap((s) => s.topics.flatMap((t) => t.subtopics)).length;
  const completedSubtopicsCount = Object.keys(checkedSubtopics).filter((k) => checkedSubtopics[k]).length;
  const overallPercentage = totalSubtopicsCount > 0 ? Math.round((completedSubtopicsCount / totalSubtopicsCount) * 100) : 0;

  // Active Subject calculations
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
      
      {/* HEADER BLOCK */}
      <div className="relative overflow-hidden bg-card/30 p-6 rounded-2xl border border-border/40 backdrop-blur-md">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-rose-500 mb-1.5">
              <Award size={18} className="animate-pulse" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary">
                Executive Presence
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
              English Prep & Communication Syllabus
            </h1>
            <p className="text-muted-foreground text-xs md:text-sm max-w-2xl mt-1">
              Structured path for career transformation. Target pronunciation muscle memory, logical grammatical linkages, refined corporate vocabulary, standup structures, and code review phrasing.
            </p>
          </div>

          {/* Master Progress Indicator */}
          <div className="flex items-center gap-4 bg-card/80 p-4 rounded-xl border border-border/80 shadow-md">
            <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  className="text-muted/20"
                  strokeWidth="3"
                  fill="transparent"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  className="text-primary transition-all duration-700"
                  strokeWidth="3.5"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 20}
                  strokeDashoffset={2 * Math.PI * 20 * (1 - overallPercentage / 100)}
                />
              </svg>
              <span className="text-[11px] font-mono font-extrabold text-foreground">
                {overallPercentage}%
              </span>
            </div>
            <div>
              <span className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground block">
                Total Communication Progress
              </span>
              <span className="text-sm font-extrabold text-foreground block">
                {completedSubtopicsCount} of {totalSubtopicsCount} Skills Unlocked
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SKEUOMORPHIC NAVIGATION TABS */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-border/40">
        {ENGLISH_ROADMAP_DATA.map((subject) => {
          const isActive = activeTab === subject.id;
          const SubIcon = subject.icon;
          const subjectSubtopicsList = subject.topics.flatMap((t) => t.subtopics);
          const subjectCompleted = subjectSubtopicsList.filter((s) => checkedSubtopics[s.id]).length;
          const subjectPct = subjectSubtopicsList.length > 0 ? Math.round((subjectCompleted / subjectSubtopicsList.length) * 100) : 0;

          return (
            <button
              key={subject.id}
              onClick={() => setActiveTab(subject.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold transition-all relative ${
                isActive
                  ? 'btn-plush-base btn-plush-blue text-sky-955 dark:text-sky-100 shadow-md border border-sky-400/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-xl border border-transparent'
              }`}
            >
              <SubIcon size={14} className={isActive ? 'text-sky-600 dark:text-sky-300' : 'text-muted-foreground'} />
              <span>{subject.name}</span>
              
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                isActive ? 'bg-sky-500/20 text-sky-850 dark:text-sky-200' : 'bg-muted text-muted-foreground'
              }`}>
                {subjectPct}%
              </span>
            </button>
          );
        })}
        <button
          onClick={() => setActiveTab('study-plan')}
          className={`flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold transition-all relative ${
            activeTab === 'study-plan'
              ? 'btn-plush-base btn-plush-blue text-sky-955 dark:text-sky-100 shadow-md border border-sky-400/20'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-xl border border-transparent'
          }`}
        >
          <Calendar size={14} className={activeTab === 'study-plan' ? 'text-sky-600 dark:text-sky-300' : 'text-muted-foreground'} />
          <span>12-Week Plan</span>
        </button>
      </div>

      {/* MAIN VIEW FOR SUBJECTS */}
      {activeTab !== 'study-plan' && activeSubject && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* LEFT CONTAINER (Syllabus Cards & Accordions) */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Subject Overview Card */}
            <div className={`p-5 rounded-2xl border bg-gradient-to-b ${activeSubject.bgGradient} space-y-3 shadow-sm`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border bg-card ${activeSubject.color}`}>
                    <activeSubject.icon size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">
                      {activeSubject.name} Curriculum
                    </h2>
                    <span className="text-[10px] text-muted-foreground block">
                      Targeted speech mechanisms, vocabulary enrichment, and logical structures.
                    </span>
                  </div>
                </div>
                
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase font-mono tracking-wider ${activeSubject.badgeColor}`}>
                  {activeSubject.badgeText}
                </span>
              </div>
              
              <p className="text-xs md:text-sm text-foreground/80 leading-relaxed font-medium">
                {activeSubject.description}
              </p>

              {/* Progress bar for this subject */}
              <div className="pt-2 border-t border-border/30 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-[10px] font-bold text-muted-foreground mb-1">
                    <span>Subject Progress</span>
                    <span>{activeSubjectCompletedCount} of {activeSubjectSubtopics.length} Mastered</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all duration-700"
                      style={{ width: `${activeSubjectPercentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-extrabold text-foreground font-mono">{activeSubjectPercentage}%</span>
                </div>
              </div>
            </div>

            {/* List of Topics */}
            <div className="space-y-4">
              {activeSubject.topics.map((topic) => {
                const isExpanded = !!expandedTopics[topic.id];
                const topicSubCount = topic.subtopics.length;
                const topicCompleted = topic.subtopics.filter((s) => checkedSubtopics[s.id]).length;
                const topicPct = topicSubCount > 0 ? Math.round((topicCompleted / topicSubCount) * 100) : 0;

                return (
                  <div
                    key={topic.id}
                    className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                      isExpanded
                        ? 'bg-card border-border/80 shadow-md'
                        : 'bg-card/45 border-border/40 hover:border-border/80'
                    }`}
                  >
                    
                    {/* Header bar of topic */}
                    <div
                      onClick={() => toggleTopicExpand(topic.id)}
                      className="p-4 flex items-center justify-between gap-3 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-1 h-8 rounded-full ${
                          topic.importance === 'Critical' ? 'bg-rose-500' : topic.importance === 'Important' ? 'bg-yellow-500' : 'bg-slate-400'
                        }`} />
                        <div>
                          <h3 className="text-xs md:text-sm font-extrabold text-foreground flex items-center gap-2">
                            {topic.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                              topic.importance === 'Critical' ? 'bg-rose-500/10 text-rose-500' : 'bg-yellow-500/10 text-yellow-500'
                            }`}>
                              {topic.importance}
                            </span>
                            <span className="text-[9px] text-muted-foreground flex items-center gap-1">
                              <Clock size={10} />
                              {topic.time}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded">
                          {topicCompleted}/{topicSubCount} Mastered ({topicPct}%)
                        </span>
                        {isExpanded ? <ChevronDown size={16} className="text-muted-foreground" /> : <ChevronRight size={16} className="text-muted-foreground" />}
                      </div>
                    </div>

                    {/* Expandable Area */}
                    {isExpanded && (
                      <div className="p-4 pt-0 border-t border-border/40 bg-muted/15 space-y-4 animate-in slide-in-from-top-1 duration-200">
                        
                        <p className="text-xs leading-relaxed text-muted-foreground mt-3 italic">
                          "{topic.description}"
                        </p>

                        {/* Interactive Subtopic Checklist */}
                        <div className="space-y-2">
                          <span className="text-[9px] uppercase font-mono font-bold text-primary tracking-wider block">
                            Subtopic Mastery Tracker
                          </span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {topic.subtopics.map((sub) => {
                              const isChecked = !!checkedSubtopics[sub.id];
                              return (
                                <div
                                  key={sub.id}
                                  onClick={() => toggleSubtopic(sub.id)}
                                  className={`flex items-start gap-2.5 p-3 rounded-lg border transition-all duration-300 cursor-pointer ${
                                    isChecked
                                      ? 'bg-primary/[0.02] border-primary/20 text-muted-foreground'
                                      : 'bg-card border-border/50 hover:border-primary/20 hover:bg-card'
                                  }`}
                                >
                                  <div className={`mt-0.5 flex-shrink-0 ${isChecked ? 'text-primary' : 'text-muted-foreground'}`}>
                                    <CheckCircle2
                                      size={14}
                                      fill={isChecked ? 'currentColor' : 'none'}
                                    />
                                  </div>
                                  <span className={`text-[11px] font-semibold leading-relaxed ${isChecked ? 'line-through text-muted-foreground/60' : 'text-foreground'}`}>
                                    {sub.text}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Need To Know & Why It Matters blocks */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          
                          {/* Need To Know */}
                          <div className="bg-card p-3 rounded-xl border border-border/60 space-y-2 shadow-sm">
                            <span className="text-[9px] font-mono font-extrabold uppercase text-rose-500 tracking-wider flex items-center gap-1">
                              <Info size={11} /> Need To Know
                            </span>
                            <ul className="space-y-1.5 pl-1">
                              {topic.needToKnow.map((item, idx) => (
                                <li key={idx} className="text-[10px] text-foreground leading-relaxed flex items-start gap-1.5">
                                  <span className="w-1 h-1 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Why It Matters */}
                          <div className="bg-card p-3 rounded-xl border border-border/60 space-y-2 shadow-sm">
                            <span className="text-[9px] font-mono font-extrabold uppercase text-secondary tracking-wider flex items-center gap-1">
                              <Flame size={11} /> Why It Matters
                            </span>
                            <p className="text-[10px] text-muted-foreground leading-relaxed">
                              {topic.whyItMatters}
                            </p>
                          </div>

                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

          {/* RIGHT CONTAINER (Study Advice & Quick Tips) */}
          <div className="space-y-6">
            
            {/* Skeuomorphic HUD Metrics card */}
            <div className="bg-card rounded-2xl p-5 border border-border/60 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border/40 pb-2">
                <Sparkles size={14} className="text-primary" />
                Vocal Workouts
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 border border-border/60">
                  <div className="w-6 h-6 rounded-full bg-rose-500/10 flex items-center justify-center flex-shrink-0 text-rose-500 text-[10px] font-bold">1</div>
                  <div>
                    <h4 className="text-[11px] font-bold text-foreground">Record and Compare</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                      Record yourself answering a simple question, then listen closely to detect vowel flattening or lazy alveolar contacts.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 border border-border/60">
                  <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 text-blue-500 text-[10px] font-bold">2</div>
                  <div>
                    <h4 className="text-[11px] font-bold text-foreground">The 10-Minute Shadow</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                      Listen to a native tech speaker and mimic their tempo, word groupings, and breath boundaries with a 0.5-second lag.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 border border-border/60">
                  <div className="w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0 text-purple-500 text-[10px] font-bold">3</div>
                  <div>
                    <h4 className="text-[11px] font-bold text-foreground">Pacing & Breathing</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                      Speak at 135 words per minute. Pause at punctuation boundaries rather than inserting fillers like "um", "ah", or "basically".
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Speaking Benchmarks Card */}
            <div className="bg-card rounded-2xl p-5 border border-border/60 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <Volume2 size={16} className="text-secondary" />
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Speaking Benchmarks
                </h3>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Aim for standard corporate communication parameters to ensure high comprehension rates during remote client calls:
              </p>
              <div className="bg-muted/40 p-2.5 rounded-lg border border-border/60 text-[9px] font-mono leading-relaxed text-foreground/80 flex flex-col gap-1">
                <span>- Target Pacing: 130–150 WPM</span>
                <span>- Filler Density: &lt; 2 per minute</span>
                <span>- Syllable Stress Accuracy: &gt; 90%</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 12-WEEK STUDY PLAN VIEW */}
      {activeTab === 'study-plan' && (
        <div className="bg-card rounded-2xl p-6 border border-border/60 shadow-sm space-y-6 animate-in fade-in duration-300">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Calendar size={18} className="text-primary" />
              12-Week Executive Communication Blueprint
            </h2>
            <p className="text-muted-foreground text-xs mt-0.5">
              Targeted exercises to permanently eliminate pronunciation issues and build structured professional speaking habits.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground font-semibold">
                  <th className="py-3 px-4 w-28">Timeline</th>
                  <th className="py-3 px-4 w-40">Focus Subject</th>
                  <th className="py-3 px-4">Core Objective</th>
                  <th className="py-3 px-4">Hands-on Practice Milestone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-medium">
                {WEEKLY_12_PLAN.map((item, idx) => (
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
              <strong>Execution Tip:</strong> Block <strong>15 minutes every morning</strong> for phonetic drills and standing vocal warm-ups. Use the ChatGPT Voice Commute Partner model to roleplay standup updates during your commute or walking breaks.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
