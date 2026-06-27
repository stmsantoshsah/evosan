export interface Subtopic {
  id: string;
  text: string;
}

export interface TopicDetail {
  id: string;
  title: string;
  importance: 'Critical' | 'Important' | 'Recommended';
  time: string;
  description: string;
  subtopics: Subtopic[];
  needToKnow: string[];
  whyItMatters: string;
}

export interface Subject {
  id: string;
  name: string;
  iconName: string;
  color: string;
  bgGradient: string;
  badgeColor: string;
  badgeText: string;
  description: string;
  topics: TopicDetail[];
}

export const INTERVIEW_ROADMAP_DATA: Subject[] = [
  {
    id: 'behavioral',
    name: 'Behavioral & STAR',
    iconName: 'MessageSquare',
    color: 'text-rose-500',
    bgGradient: 'from-rose-500/10 to-rose-500/[0.02] border-rose-500/20',
    badgeColor: 'bg-rose-500/15 text-rose-500 border border-rose-500/20',
    badgeText: 'Week 1–2 Priority',
    description: 'Master the STAR method, craft compelling career narratives, and handle tough behavioral questions with structured confidence.',
    topics: [
      {
        id: 'beh_t1',
        title: 'STAR Method Mastery',
        importance: 'Critical',
        time: '4-5 hrs',
        description: 'Structure every behavioral answer using Situation, Task, Action, Result with quantified outcomes.',
        subtopics: [
          { id: 'beh_s1_1', text: 'Situation: Setting context concisely (30 seconds max)' },
          { id: 'beh_s1_2', text: 'Task: Defining your specific responsibility in the scenario' },
          { id: 'beh_s1_3', text: 'Action: Leading with "I" not "we" — your individual contribution' },
          { id: 'beh_s1_4', text: 'Result: Quantified business impact (%, time saved, revenue, reliability)' },
        ],
        needToKnow: [
          'Each STAR story should be 90–120 seconds maximum',
          'Always end with a result that ties to business value, not personal satisfaction',
          'Prepare at least 8 unique STAR stories covering leadership, conflict, failure, and innovation',
        ],
        whyItMatters: 'Behavioral interviews account for 40–60% of the hiring decision at senior levels. Hiring managers use them to assess EQ, ownership, and engineering judgment.',
      },
      {
        id: 'beh_t2',
        title: 'Common Question Frameworks',
        importance: 'Critical',
        time: '3-4 hrs',
        description: 'Prepare structured answers for the most frequently asked behavioral categories.',
        subtopics: [
          { id: 'beh_s2_1', text: '"Tell me about yourself" — 60-second professional narrative arc' },
          { id: 'beh_s2_2', text: '"Greatest weakness" — real weakness + active mitigation strategy' },
          { id: 'beh_s2_3', text: '"Conflict with teammate" — resolution-focused framing' },
          { id: 'beh_s2_4', text: '"Why this company?" — mission alignment + specific product knowledge' },
        ],
        needToKnow: [
          'Never say "I work too hard" for weakness — it reads as dishonest',
          'Link your "tell me about yourself" directly to why you are a fit for THIS role',
          'Research 2–3 specific company products/initiatives before answering "why us"',
        ],
        whyItMatters: 'These questions appear in every interview. Fumbling them signals poor preparation and low self-awareness — even if your technical skills are strong.',
      },
    ],
  },
  {
    id: 'system_design',
    name: 'System Design',
    iconName: 'Cpu',
    color: 'text-blue-500',
    bgGradient: 'from-blue-500/10 to-blue-500/[0.02] border-blue-500/20',
    badgeColor: 'bg-blue-500/15 text-blue-500 border border-blue-500/20',
    badgeText: 'Senior Differentiator',
    description: 'Design scalable distributed systems under time pressure, covering requirements gathering, capacity estimation, and component tradeoffs.',
    topics: [
      {
        id: 'sys_t1',
        title: 'The System Design Framework',
        importance: 'Critical',
        time: '6-8 hrs',
        description: 'A repeatable step-by-step process for any system design problem in 45 minutes.',
        subtopics: [
          { id: 'sys_s1_1', text: 'Step 1: Clarify requirements (functional vs. non-functional, 5 mins)' },
          { id: 'sys_s1_2', text: 'Step 2: Capacity estimation (QPS, storage, bandwidth math)' },
          { id: 'sys_s1_3', text: 'Step 3: High-level architecture (clients, API gateway, services, DB, cache)' },
          { id: 'sys_s1_4', text: 'Step 4: Deep dive on bottlenecks (sharding, CDN, consistency models)' },
        ],
        needToKnow: [
          'Always ask "how many users?" and "what is the read/write ratio?" before drawing anything',
          'Estimate: 1M DAU × 100 req/day ÷ 86,400 sec ≈ ~1,200 QPS baseline',
          'State tradeoffs explicitly: "I am choosing eventual consistency here because..."',
        ],
        whyItMatters: 'System design rounds directly evaluate your seniority. Candidates who skip requirements or jump to solutions fail immediately with senior interviewers.',
      },
      {
        id: 'sys_t2',
        title: 'Core Design Patterns',
        importance: 'Critical',
        time: '7-9 hrs',
        description: 'Master the building blocks: caching, message queues, database strategies, and CAP theorem.',
        subtopics: [
          { id: 'sys_s2_1', text: 'Caching strategies: Read-through, Write-through, Write-behind, Cache-aside' },
          { id: 'sys_s2_2', text: 'Message queues: Kafka vs. RabbitMQ, fan-out, at-least-once delivery' },
          { id: 'sys_s2_3', text: 'Database: SQL vs. NoSQL, sharding, replication, consistent hashing' },
          { id: 'sys_s2_4', text: 'CAP Theorem: Consistency, Availability, Partition tolerance tradeoffs' },
        ],
        needToKnow: [
          'Cache eviction policies: LRU, LFU — know when to use each',
          'Consistent hashing minimizes key remapping when nodes are added or removed',
          'In CAP theorem, you always sacrifice one during a network partition',
        ],
        whyItMatters: 'These patterns appear in almost every system design interview. Not knowing them signals a gap in distributed systems experience.',
      },
    ],
  },
  {
    id: 'dsa',
    name: 'Algorithms & DSA',
    iconName: 'Activity',
    color: 'text-purple-500',
    bgGradient: 'from-purple-500/10 to-purple-500/[0.02] border-purple-500/20',
    badgeColor: 'bg-purple-500/15 text-purple-500 border border-purple-500/20',
    badgeText: 'Technical Screen',
    description: 'Core data structures and algorithm patterns required to pass FAANG-level and product company technical screens.',
    topics: [
      {
        id: 'dsa_t1',
        title: 'Essential Data Structures',
        importance: 'Critical',
        time: '8-10 hrs',
        description: 'Arrays, Linked Lists, Trees, Graphs, Hash Maps, Heaps, and Stacks/Queues with complexity awareness.',
        subtopics: [
          { id: 'dsa_s1_1', text: 'Arrays & Strings: Two-pointer, sliding window, prefix sums' },
          { id: 'dsa_s1_2', text: 'Trees: BFS, DFS (inorder, preorder, postorder), LCA problems' },
          { id: 'dsa_s1_3', text: 'Hash Maps: Frequency counting, anagram detection, grouping' },
          { id: 'dsa_s1_4', text: 'Graphs: Topological sort, Dijkstra, Union-Find (DSU)' },
        ],
        needToKnow: [
          'Sliding window reduces O(n²) brute force to O(n) for subarray problems',
          'BFS for shortest path in unweighted graphs; Dijkstra for weighted graphs',
          'Hash Map lookups are O(1) average — use them to eliminate nested loops',
        ],
        whyItMatters: 'Most coding rounds are solvable with fewer than 10 patterns. Recognizing the right pattern within 2 minutes is the actual skill being tested.',
      },
      {
        id: 'dsa_t2',
        title: 'Algorithm Patterns',
        importance: 'Critical',
        time: '8-10 hrs',
        description: 'Binary search variants, dynamic programming, backtracking, and greedy approaches.',
        subtopics: [
          { id: 'dsa_s2_1', text: 'Binary Search on answer space (e.g., "minimize the maximum")' },
          { id: 'dsa_s2_2', text: 'Dynamic Programming: Memoization vs. Tabulation, state definition' },
          { id: 'dsa_s2_3', text: 'Backtracking: Permutations, combinations, N-Queens template' },
          { id: 'dsa_s2_4', text: 'Greedy: Interval scheduling, activity selection, Huffman encoding' },
        ],
        needToKnow: [
          'DP state definition is the hardest part — define dp[i] precisely before coding',
          'Backtracking template: choose → explore → unchoose',
          'Binary search on answer: when the problem says "minimum/maximum feasible value"',
        ],
        whyItMatters: 'DP and graph problems appear in 70%+ of FAANG screens. Recognizing the subproblem structure is more important than memorizing solutions.',
      },
    ],
  },
  {
    id: 'technical',
    name: 'Technical Core',
    iconName: 'Sparkles',
    color: 'text-teal-500',
    bgGradient: 'from-teal-500/10 to-teal-500/[0.02] border-teal-500/20',
    badgeColor: 'bg-teal-500/15 text-teal-500 border border-teal-500/20',
    badgeText: 'Domain Depth',
    description: 'Role-specific technical depth: OOP, concurrency, API design, databases, and cloud infrastructure.',
    topics: [
      {
        id: 'tech_t1',
        title: 'OOP, SOLID & Design Patterns',
        importance: 'Critical',
        time: '5-6 hrs',
        description: 'Object-oriented design principles and Gang of Four patterns for clean, extensible code.',
        subtopics: [
          { id: 'tech_s1_1', text: 'SOLID: Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion' },
          { id: 'tech_s1_2', text: 'Creational: Factory, Abstract Factory, Builder, Singleton' },
          { id: 'tech_s1_3', text: 'Structural: Adapter, Decorator, Facade, Proxy' },
          { id: 'tech_s1_4', text: 'Behavioral: Observer, Strategy, Command, Iterator' },
        ],
        needToKnow: [
          'Prefer composition over inheritance — concrete example with code sketch',
          'Singleton is considered an anti-pattern in multi-threaded environments — explain why',
          'Strategy pattern replaces conditionals with polymorphic behavior',
        ],
        whyItMatters: 'Mid-to-senior roles frequently include low-level design (LLD) rounds that directly test SOLID and pattern knowledge.',
      },
      {
        id: 'tech_t2',
        title: 'APIs, Databases & Cloud',
        importance: 'Important',
        time: '5-7 hrs',
        description: 'REST vs GraphQL, SQL optimization, indexing, and cloud services (AWS/GCP/Azure basics).',
        subtopics: [
          { id: 'tech_s2_1', text: 'REST principles: statelessness, resource naming, HTTP verb semantics' },
          { id: 'tech_s2_2', text: 'SQL: EXPLAIN ANALYZE, indexing strategies, N+1 query problem' },
          { id: 'tech_s2_3', text: 'Transactions: ACID, isolation levels (Read Committed, Serializable)' },
          { id: 'tech_s2_4', text: 'Cloud: S3, EC2, Lambda, RDS, SQS, and managed Kubernetes (EKS/GKE)' },
        ],
        needToKnow: [
          'Composite indexes serve queries in left-to-right column order only',
          'N+1 problem: fetching a list + individual detail queries = O(n) extra DB calls',
          'Idempotent API design: repeated identical requests should produce the same result',
        ],
        whyItMatters: 'Full-stack and backend roles validate API and database depth in every technical screen — it is not optional even for senior engineers.',
      },
    ],
  },
  {
    id: 'live_coding',
    name: 'Live Coding Skills',
    iconName: 'Target',
    color: 'text-orange-500',
    bgGradient: 'from-orange-500/10 to-orange-500/[0.02] border-orange-500/20',
    badgeColor: 'bg-orange-500/15 text-orange-500 border border-orange-500/20',
    badgeText: 'Performance Under Pressure',
    description: 'Verbal think-aloud discipline, edge case identification, and code quality habits under live interview conditions.',
    topics: [
      {
        id: 'live_t1',
        title: 'Think-Aloud Protocol',
        importance: 'Critical',
        time: '4-5 hrs',
        description: 'Narrating your problem-solving process so interviewers can follow your reasoning even when you are stuck.',
        subtopics: [
          { id: 'live_s1_1', text: 'Restate the problem back in your own words before touching the keyboard' },
          { id: 'live_s1_2', text: 'Walk through a brute force solution first, then optimize' },
          { id: 'live_s1_3', text: 'Explain complexity (time and space) before finishing your solution' },
          { id: 'live_s1_4', text: 'Ask clarifying questions: input size, null cases, integer overflow' },
        ],
        needToKnow: [
          'Silence kills your score — keep narrating even when you are thinking',
          'Brute force spoken out loud is better than silence while hunting for optimal',
          'Announce edge cases proactively: empty array, single element, duplicates',
        ],
        whyItMatters: 'Interviewers score your communication process as heavily as your final solution. A clean but silent solution scores lower than a messy but well-narrated one.',
      },
      {
        id: 'live_t2',
        title: 'Code Quality Under Pressure',
        importance: 'Important',
        time: '3-4 hrs',
        description: 'Writing readable, modular code with meaningful variable names even in a timed environment.',
        subtopics: [
          { id: 'live_s2_1', text: 'Use descriptive variable names (left, right, not i, j in complex code)' },
          { id: 'live_s2_2', text: 'Extract helper functions to keep main logic readable' },
          { id: 'live_s2_3', text: 'Write test cases before coding (test-first mindset)' },
          { id: 'live_s2_4', text: 'Dry-run on your example input after coding to catch off-by-one errors' },
        ],
        needToKnow: [
          'Meaningful names signal seniority — "windowStart" beats "i" in a sliding window',
          'A helper function with a clear name is documentation in itself',
          'Always trace through at least one example manually before submitting',
        ],
        whyItMatters: 'Code readability is part of the rubric at every company. Messy code suggests poor collaboration habits and low professional code quality standards.',
      },
    ],
  },
];

export const WEEKLY_10_PLAN = [
  { week: 'Week 1', subject: 'Behavioral & STAR', goal: 'Draft 8 STAR stories. Record yourself telling each one.', project: 'Build a personal story bank document with STAR columns for each scenario.' },
  { week: 'Week 2', subject: 'Behavioral & STAR', goal: 'Practice "tell me about yourself" and "why this company" for 5 target companies.', project: 'Record mock answers. Eliminate filler words ("um", "so", "basically").' },
  { week: 'Week 3', subject: 'System Design Basics', goal: 'Learn the 4-step framework. Study URL shortener, Twitter feed, and Rate Limiter.', project: 'Draw a complete system design for "Design Instagram" in 45 minutes from scratch.' },
  { week: 'Week 4', subject: 'System Design Depth', goal: 'Master caching, Kafka, consistent hashing, and CAP theorem.', project: 'Design a notification service with fan-out, at-least-once delivery, and idempotency.' },
  { week: 'Week 5', subject: 'DSA — Core Patterns', goal: 'Complete 20 LeetCode problems: arrays, two-pointer, sliding window, hash maps.', project: 'Solve 3 medium problems daily under 25 minutes each with think-aloud narration.' },
  { week: 'Week 6', subject: 'DSA — Trees & Graphs', goal: 'Master BFS, DFS, topological sort, and Dijkstra.', project: 'Solve 15 tree and graph LeetCode mediums. Diagram the traversal order for each.' },
  { week: 'Week 7', subject: 'DSA — DP & Backtracking', goal: 'Master memoization, tabulation, permutations, and combinations templates.', project: 'Solve 10 DP problems. Write the state definition for each before coding.' },
  { week: 'Week 8', subject: 'Technical Core (OOP & APIs)', goal: 'Review SOLID principles and design 3 low-level design questions.', project: 'Design a Parking Lot, Elevator System, and Library Management System class structure.' },
  { week: 'Week 9', subject: 'Live Coding Simulation', goal: 'Complete 5 full mock interviews (timed, narrated, no hints).', project: 'Use Pramp, Interviewing.io, or a peer for timed mock sessions. Record and review.' },
  { week: 'Week 10', subject: 'Full Loop Mock + Review', goal: 'Simulate a complete interview loop: behavioral → system design → coding × 2.', project: 'Submit results to a peer for scoring. Target: 4/5 on communication and 3/5 on optimality.' },
];
