// ============================================================================
// CampusVault - In-Memory Demo Store
// Used when SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not configured yet,
// ensuring the app is 100% interactive and functional out-of-the-box.
// ============================================================================

export const mockVaults = [
  {
    id: 'v1',
    slug: 'placements',
    name: 'Placements & Interviews',
    category: 'Placement',
    description: 'Real interview questions, coding round debriefs, and on-campus placement strategy.'
  },
  {
    id: 'v2',
    slug: 'course-notes',
    name: 'Course Notes & Academics',
    category: 'Course Notes',
    description: 'High-yield subject notes, lab manuals, professor insights, and elective recommendations.'
  },
  {
    id: 'v3',
    slug: 'projects',
    name: 'Project Lessons & Architecture',
    category: 'Project',
    description: 'Capstone retrospectives, architecture decisions, bug fixes, and open-source starter repos.'
  },
  {
    id: 'v4',
    slug: 'general',
    name: 'Campus Wisdom & Life',
    category: 'General',
    description: 'Hostel hacks, scholarship guidance, club insights, and everything you wish you knew earlier.'
  }
];

export let mockEntries = [
  {
    id: 'e1',
    vault_id: 'v1',
    author_id: 'user_senior_1',
    author_name: 'Aarav Sharma',
    author_year: '4th Year',
    author_branch: 'CSE',
    title: 'Everything I wish I knew before my Amazon SDE Intern interview',
    content: `Here is the breakdown of my 3 rounds for Amazon on-campus:

1. Online Assessment: 2 LeetCode Medium questions (sliding window + graph BFS) and 20 Leadership Principles work style questions. Don't skip LP! They take it very seriously.
2. Technical Round 1: Live coding on Amazon Chime. Was asked to design an LRU Cache from scratch and optimize time complexity to O(1) for both get and put. Followed by deep questions on hash collision resolution.
3. Technical + Managerial Round 2: Focused on a past distributed systems project. Interviewer asked about database indexing, why PostgreSQL over MongoDB, and 3 LP scenarios ('Tell me about a time you disagreed with a team lead').

Key advice: Prepare 2 STAR-format stories for each of the top 6 Amazon Leadership Principles. Code in whatever language you are fastest in — syntax speed matters!`,
    resource_url: 'https://github.com/topics/amazon-interview-prep',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    vote_count: 42
  },
  {
    id: 'e2',
    vault_id: 'v1',
    author_id: 'user_alumni_1',
    author_name: 'Pooja Narayanan',
    author_year: 'Alumni',
    author_branch: 'ECE',
    title: 'How to crack Product Management roles from non-CS branches',
    content: `Many students assume campus placements for APM/PM roles require a pure CS degree. That is a myth!
Here is how I transitioned from ECE to an APM role at a Series B startup:
1. Product Teardowns: Write 3 public teardowns on Notion/Substack (e.g. Swiggy Instamart UX, Spotify recommendations). Share them on LinkedIn.
2. Metrics Mastery: Learn North Star metrics, LTV, CAC, retention cohorts, and funnel drop-off analysis.
3. Wireframing & PRDs: Practice writing 1-page Product Requirement Documents using Figma and Whimsical.
4. Case Interviews: Read 'Decode and Conquer' and 'Swipe to Unlock'. Do mock cases with peers weekly.`,
    resource_url: 'https://coda.io/@product-prep/campus-guide',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    vote_count: 29
  },
  {
    id: 'e3',
    vault_id: 'v2',
    author_id: 'user_senior_2',
    author_name: 'Rohan Gupta',
    author_year: '4th Year',
    author_branch: 'IT',
    title: 'Operating Systems: The 20% syllabus that covers 80% of exams and interviews',
    content: `Stop trying to memorize the entire 600-page Galvin textbook 2 days before internals!
Focus strictly on these four core pillars:
- Process Synchronization: Producer-Consumer, Dining Philosophers, Mutex vs Semaphore, Race Conditions.
- CPU Scheduling Algorithms: Round Robin, SJF, and Multi-level feedback queues.
- Deadlocks: Necessary conditions (Coffman conditions), Banker's algorithm, and deadlock recovery.
- Memory Management: Paging, Segmentation, TLB, Page replacement (LRU, FIFO, Optimal), and Thrashing.

Pro tip: Understand how Linux handles fork(), exec(), and copy-on-write. Profs love asking this in viva.`,
    resource_url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    vote_count: 38
  },
  {
    id: 'e4',
    vault_id: 'v3',
    author_id: 'user_senior_3',
    author_name: 'Sneha Patel',
    author_year: '4th Year',
    author_branch: 'CSE-AIML',
    title: 'Lessons from building our Capstone: Why you shouldn’t over-engineer microservices early',
    content: `For our 3rd year capstone, our team spent 3 weeks orchestrating Docker containers, Kafka, and 5 separate microservices for an app that had exactly zero users.
Result? We ran out of time to finish the actual core recommendation engine.

If you are starting your capstone or hackathon project:
- Build a clean modular monolith first.
- Use Next.js with a well-structured Express/FastAPI backend and Supabase/PostgreSQL.
- Only split into microservices if you legitimately need independent scaling or different runtime languages.
- Write end-to-end tests for critical paths early. It saves all-nighters before the review panel!`,
    resource_url: 'https://github.com/campus-capstone-template',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    vote_count: 23
  },
  {
    id: 'e5',
    vault_id: 'v4',
    author_id: 'user_alumni_2',
    author_name: 'Vikram Menon',
    author_year: 'Alumni',
    author_branch: 'Mechanical',
    title: 'SRM Campus Survival Guide: Hidden libraries, Wi-Fi spots, and club networking',
    content: `Four years fly by faster than you think. Here are the unwritten rules of campus:
1. The 4th floor reading room in UB is the only place with absolute silence and reliable AC during peak exam weeks.
2. Join technical and cultural clubs in your 1st and 2nd year not just for certificates, but for the senior network — your seniors are the ones who refer you to your first internships!
3. Keep your attendance strictly above 80% to have safety buffer during placement season.
4. Work on at least one side-project that you actually publish online and show to real people.`,
    resource_url: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    vote_count: 56
  }
];

export let mockVotes = [
  { entry_id: 'e1', user_id: 'user_guest_1' },
  { entry_id: 'e1', user_id: 'user_guest_2' },
  { entry_id: 'e3', user_id: 'user_guest_1' },
  { entry_id: 'e5', user_id: 'user_guest_1' }
];

export let mockComments = [
  {
    id: 'c1',
    entry_id: 'e1',
    author_id: 'user_junior_1',
    author_name: 'Tanvi Verma',
    author_year: '2nd Year',
    author_branch: 'CSE',
    content: 'Thank you so much! Did they ask about system design for intern roles or just data structures?',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString()
  },
  {
    id: 'c2',
    entry_id: 'e1',
    author_id: 'user_senior_1',
    author_name: 'Aarav Sharma',
    author_year: '4th Year',
    author_branch: 'CSE',
    content: 'For interns, it was strictly OOP / Low-Level Design (like LRU Cache, Parking Lot classes) rather than large-scale distributed system design.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString()
  },
  {
    id: 'c3',
    entry_id: 'e3',
    author_id: 'user_junior_2',
    author_name: 'Karan Mehra',
    author_year: '2nd Year',
    author_branch: 'IT',
    content: 'The OSTEP book recommendation is gold. Saved my midterms.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString()
  }
];
