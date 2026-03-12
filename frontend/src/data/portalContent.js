/**
 * AI Grievance Portal - shared content for landing page, chatbot, etc.
 * Aligned with https://ai-grievance-portal.onrender.com/
 */

export const PORTAL_CONTACT = {
  email: 'support@grievance.gov',
  phone: '1800-GRIEVANCE',
  address: 'Smart City HQ',
};

export const HERO = {
  title: 'Voice Your Complaints, Get Them Solved!',
  subtitle: 'Submit civic complaints and let our AI automatically route them to the right government department. Track progress in real-time with color-coded priorities and earn rewards for civic participation.',
  ctaPrimary: 'Submit Complaint',
  ctaSecondary: 'View Dashboard',
};

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: 'Submit Complaint',
    description: 'Describe your civic issue with location details and optional media uploads',
  },
  {
    step: 2,
    title: 'AI Analysis',
    description: 'Our NLP engine categorizes, prioritizes, and detects duplicate complaints',
  },
  {
    step: 3,
    title: 'Auto Routing',
    description: 'Complaint is automatically routed to the correct government department',
  },
  {
    step: 4,
    title: 'Track & Resolve',
    description: 'Monitor progress with color-coded status and earn reward points',
  },
];

export const DEPARTMENTS = [
  { name: 'Sanitation', desc: 'Garbage, waste, cleaning', emoji: '🗑️' },
  { name: 'Water', desc: 'Leakage, supply, pipes', emoji: '💧' },
  { name: 'Electrical', desc: 'Street lights, power', emoji: '💡' },
  { name: 'Public Works', desc: 'Roads, potholes, bridges', emoji: '🛣️' },
  { name: 'Traffic', desc: 'Signals, parking, transport', emoji: '🚦' },
  { name: 'Health', desc: 'Hospitals, diseases, pests', emoji: '🏥' },
  { name: 'Parks', desc: 'Gardens, playgrounds', emoji: '🌳' },
  { name: 'Housing', desc: 'Construction, permits', emoji: '🏗️' },
];

export const PRIORITIES = [
  {
    level: 'High',
    color: 'red',
    label: 'Urgent issues that pose danger or require immediate attention',
    tags: 'Dangerous · Emergency · Hazard',
  },
  {
    level: 'Medium',
    color: 'yellow',
    label: 'Important issues that need resolution within standard timeline',
    tags: 'Normal · Standard · Important',
  },
  {
    level: 'Resolved',
    color: 'green',
    label: 'Issues that have been successfully addressed and closed',
    tags: 'Solved · Closed · Complete',
  },
];

export const REWARDS = {
  points: [
    { amount: 10, label: 'Submit a Complaint', emoji: '📝' },
    { amount: 5, label: 'Complaint Resolved', emoji: '✅' },
    { amount: 2, label: 'Upvote a Complaint', emoji: '👍' },
  ],
  badges: [
    { name: 'New Citizen', desc: 'Join the portal', emoji: '🌟' },
    { name: 'Active Citizen', desc: 'Submit 5 complaints', emoji: '🏆' },
    { name: 'Civic Champion', desc: 'Submit 10 complaints', emoji: '👑' },
  ],
};

export const FOOTER = {
  tagline: 'AI-powered civic complaint management system for transparent and efficient governance.',
  quickLinks: ['Home', 'Submit Complaint', 'Dashboard'],
  departments: ['Sanitation', 'Water Supply', 'Electrical', 'Public Works'],
  contact: PORTAL_CONTACT,
};

export const STATS_DEFAULT = [
  { number: '12,450+', label: 'Complaints Filed' },
  { number: '9,200+', label: 'Issues Resolved' },
  { number: '8', label: 'Departments' },
];

/** Step-by-step procedure for submitting a complaint */
export const HOW_TO_SUBMIT = [
  {
    step: 1,
    title: 'Sign in or create an account',
    detail: 'Register with your email to get a unique complaint ID and track status. Your data is kept secure and used only for grievance resolution.',
  },
  {
    step: 2,
    title: 'Describe your issue clearly',
    detail: 'Write a short title and description. Include location (street, landmark, or area like "Madhapur") so we can route it correctly. Add photos if helpful (e.g. pothole, broken streetlight).',
  },
  {
    step: 3,
    title: 'Choose category (or let AI suggest)',
    detail: 'Pick from Sanitation, Water, Electrical, Public Works, Traffic, Health, Parks, or Housing. If unsure, leave it blank—our AI will suggest the best department from your description.',
  },
  {
    step: 4,
    title: 'Submit and get your ID',
    detail: 'Click Submit. You receive a complaint ID (e.g. GRV-2024-08472). Use this to track status on the dashboard or via GrievanceBot.',
  },
  {
    step: 5,
    title: 'Track and follow up',
    detail: 'Check your dashboard for status: Pending → In Progress → Resolved. You can add comments or ask for updates. Resolved complaints earn you +5 reward points.',
  },
];

/** What happens after you submit – timelines and expectations */
export const AFTER_SUBMIT = [
  { phase: 'Acknowledgment', time: 'Within 24 hours', desc: 'You get an SMS/email confirming receipt and complaint ID.' },
  { phase: 'Department assignment', time: '1–2 working days', desc: 'AI routes to the right department; you can see the assigned department on your dashboard.' },
  { phase: 'First action', time: '3–7 days (varies by priority)', desc: 'High-priority issues get faster attention. You may get a request for more details or a site visit update.' },
  { phase: 'Resolution', time: 'Depends on issue type', desc: 'Simple issues (e.g. streetlight) may close in 1–2 weeks; complex ones (roads, water) may take longer. You are notified when status changes.' },
];

/** Sample / recent complaints for landing page (illustrative) */
export const SAMPLE_COMPLAINTS = [
  { id: 'GRV-2024-08472', title: 'Street light not working near Metro station', category: 'Electrical', location: 'Madhapur', status: 'Resolved', days: '8 days ago' },
  { id: 'GRV-2024-08401', title: 'Garbage pile on main road', category: 'Sanitation', location: 'Jubilee Hills', status: 'In Progress', days: '3 days ago' },
  { id: 'GRV-2024-08389', title: 'Water leakage at park entrance', category: 'Water', location: 'Banjara Hills', status: 'Resolved', days: '12 days ago' },
  { id: 'GRV-2024-08355', title: 'Large pothole causing accidents', category: 'Public Works', location: 'Gachibowli', status: 'In Progress', days: '5 days ago' },
  { id: 'GRV-2024-08312', title: 'Broken traffic signal', category: 'Traffic', location: 'Kukatpally', status: 'Resolved', days: '6 days ago' },
];

/** GrievanceBot – how the AI chat helps */
export const GRIEVANCEBOT_HELP = {
  intro: 'GrievanceBot is your 24/7 AI assistant. Ask in plain language—no forms needed. It uses portal data to give accurate, step-by-step answers.',
  capabilities: [
    {
      title: 'How to submit a complaint',
      examples: ['How do I file a complaint?', 'What information do I need to submit?', 'Can I add photos?'],
      response: 'Explains the 5-step procedure, what to include (title, description, location), and how to get your complaint ID.',
    },
    {
      title: 'Check status and track',
      examples: ['How do I check my complaint status?', 'Where can I track my grievance?', 'What does "In Progress" mean?'],
      response: 'Tells you how to use the dashboard and complaint ID, and what each status (Pending, In Progress, Resolved) means.',
    },
    {
      title: 'Departments and categories',
      examples: ['Which department handles street lights?', 'Who handles water issues?', 'List of departments'],
      response: 'Lists all 8 departments with short descriptions so you know where your issue will be routed.',
    },
    {
      title: 'Step-by-step guides',
      examples: ['Steps to submit', 'What happens after I submit?', 'How long until resolution?'],
      response: 'Gives the full procedure and typical timelines (acknowledgment in 24h, assignment in 1–2 days, resolution varies by priority).',
    },
    {
      title: 'Rewards and contact',
      examples: ['How do I earn points?', 'What are the badges?', 'Who do I contact for help?'],
      response: 'Explains +10 pts per complaint, +5 when resolved, +2 for upvote; badges (New Citizen, Active Citizen, Civic Champion); and support contact (email, phone).',
    },
  ],
  tip: 'Try: "How do I complain about street lights in my area?" or "What to do for a pothole?" — the bot understands location and issue type.',
};

/** FAQ for landing (optional use) */
export const FAQ_LANDING = [
  { q: 'Do I need to create an account to submit?', a: 'Yes. Sign up with your email to get a complaint ID and track status. It takes under a minute.' },
  { q: 'How is my complaint routed?', a: 'Our AI reads your description and category, then routes it to the correct department (Sanitation, Water, Electrical, etc.). You can also pick the category yourself.' },
  { q: 'How long until I get a response?', a: 'You get an acknowledgment within 24 hours. Department assignment usually in 1–2 working days. Resolution time depends on the issue and priority (high/medium).' },
  { q: 'Can I add photos or documents?', a: 'Yes. When submitting, you can attach photos (e.g. of a pothole or broken light) to help the department act faster.' },
  { q: 'What if I don’t know the right department?', a: 'Leave category blank or ask GrievanceBot. The AI will suggest the best department from your description.' },
  { q: 'How do I track my complaint?', a: 'Use your complaint ID on the dashboard or ask GrievanceBot. Status updates appear as Pending → In Progress → Resolved.' },
  { q: 'What are reward points?', a: '+10 pts per complaint submitted, +5 when resolved, +2 for upvoting. Unlock badges like Active Citizen and Civic Champion.' },
  { q: 'Is my data secure?', a: 'Yes. We use secure authentication and only use your data for grievance resolution and status updates.' },
  { q: 'Can I edit or withdraw a complaint?', a: 'You can add comments anytime. To withdraw, contact support with your complaint ID.' },
  { q: 'Who do I contact for help?', a: 'Use GrievanceBot 24/7 for guides, or email support@grievance.gov / call 1800-GRIEVANCE.' },
];
