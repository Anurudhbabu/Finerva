export const initialUserData = {
  name: "Anurudh Babu",
  email: "anurudh@finerva.ai",
  team: "Team 07 (WOBBLE)",
  currency: "USD",
  currencySymbol: "$",
  monthlyIncome: 6500,
  netWorth: 85230.90,
  healthScore: 88,
  monthlySavingsTarget: 1800,
};

export const initialTransactions = [
  { id: 'tx-1', title: 'Monthly Salary Deposit', amount: 6500.00, type: 'credit', category: 'Income', date: '2026-10-01', merchant: 'Tech Corp' },
  { id: 'tx-2', title: 'Apartment Rent', amount: 1450.00, type: 'debit', category: 'Housing', date: '2026-10-02', merchant: 'Highland Living' },
  { id: 'tx-3', title: 'Whole Foods Grocery', amount: 184.50, type: 'debit', category: 'Food & Dining', date: '2026-10-03', merchant: 'Whole Foods' },
  { id: 'tx-4', title: 'Vanguard Index Fund SIP', amount: 500.00, type: 'debit', category: 'Investments', date: '2026-10-04', merchant: 'Vanguard' },
  { id: 'tx-5', title: 'GitHub Copilot / Pro', amount: 20.00, type: 'debit', category: 'Subscriptions', date: '2026-10-04', merchant: 'GitHub' },
  { id: 'tx-6', title: 'Electricity & High-speed Fiber', amount: 125.40, type: 'debit', category: 'Utilities', date: '2026-10-05', merchant: 'City Power & Net' },
  { id: 'tx-7', title: 'Coffee & Books', amount: 32.80, type: 'debit', category: 'Entertainment', date: '2026-10-05', merchant: 'Blue Bottle' },
];

export const initialBudgets = [
  { id: 'b-1', category: 'Housing', allocated: 1600, spent: 1450, color: 'emerald' },
  { id: 'b-2', category: 'Food & Dining', allocated: 600, spent: 485, color: 'blue' },
  { id: 'b-3', category: 'Investments & Savings', allocated: 2000, spent: 1800, color: 'purple' },
  { id: 'b-4', category: 'Utilities & Bills', allocated: 350, spent: 260, color: 'cyan' },
  { id: 'b-5', category: 'Transportation', allocated: 300, spent: 190, color: 'amber' },
  { id: 'b-6', category: 'Entertainment & Shopping', allocated: 400, spent: 340, color: 'rose' },
];

export const initialGoals = [
  { id: 'g-1', title: 'Emergency Safety Cushion (6 Months)', target: 20000, current: 15500, category: 'Security', deadline: 'Dec 2026', icon: 'ShieldCheck' },
  { id: 'g-2', title: 'High-Performance AI Dev Rig', target: 3500, current: 2800, category: 'Tech', deadline: 'Nov 2026', icon: 'Laptop' },
  { id: 'g-3', title: 'Global Tech Conference Travel', target: 2200, current: 950, category: 'Travel', deadline: 'Feb 2027', icon: 'Plane' },
  { id: 'g-4', title: 'Long-Term ETF Wealth Compounder', target: 50000, current: 28400, category: 'Wealth', deadline: 'Dec 2028', icon: 'TrendingUp' },
];

export const initialSubscriptions = [
  { id: 'sub-1', name: 'GitHub Enterprise / Copilot', cost: 20.00, billingCycle: 'monthly', nextBilling: '2026-10-18', category: 'Developer Tools', status: 'Active' },
  { id: 'sub-2', name: 'Spotify Premium Student', cost: 5.99, billingCycle: 'monthly', nextBilling: '2026-10-22', category: 'Media', status: 'Active' },
  { id: 'sub-3', name: 'AWS Cloud Hosting', cost: 45.00, billingCycle: 'monthly', nextBilling: '2026-10-25', category: 'Cloud Infrastructure', status: 'Active' },
  { id: 'sub-4', name: 'Gym & Fitness Center', cost: 55.00, billingCycle: 'monthly', nextBilling: '2026-11-01', category: 'Health', status: 'Active' },
  { id: 'sub-5', name: 'Unused Streaming Service', cost: 14.99, billingCycle: 'monthly', nextBilling: '2026-10-14', category: 'Entertainment', status: 'Flagged for cancellation' },
];

export const studentOffers = [
  {
    id: 'so-1',
    title: 'GitHub Student Developer Pack',
    partner: 'GitHub Education',
    benefit: 'Free access to GitHub Copilot, Namecheap domain, DigitalOcean $200 credits',
    tag: 'Developer Tier',
    validity: 'Valid with .edu / student email',
    linkText: 'Claim Offer'
  },
  {
    id: 'so-2',
    title: 'Zero-Fee Student High Yield Savings',
    partner: 'Finerva Apex Bank',
    benefit: '4.85% APY with no minimum balance requirement and no maintenance fees',
    tag: 'Banking',
    validity: 'Age 18-25',
    linkText: 'Open Account'
  },
  {
    id: 'so-3',
    title: 'AWS Educate Cloud Credit Program',
    partner: 'Amazon Web Services',
    benefit: '$300 free compute credits for students building live machine learning prototypes',
    tag: 'Cloud & AI',
    validity: 'Annual Renewal',
    linkText: 'Apply Now'
  },
  {
    id: 'so-4',
    title: 'Spotify + Hulu Student Bundle',
    partner: 'Spotify / Hulu',
    benefit: '$5.99/mo for combined music streaming and entertainment package',
    tag: 'Entertainment',
    validity: 'SheerID Verification',
    linkText: 'Subscribe'
  },
];

export const marketWatchlist = [
  { symbol: 'S&P 500', name: 'S&P 500 Index', price: 5864.20, change: '+0.84%', positive: true, volume: '2.4B' },
  { symbol: 'NIFTY 50', name: 'NSE Nifty Index', price: 25120.40, change: '+1.12%', positive: true, volume: '840M' },
  { symbol: 'NVDA', name: 'Nvidia Corp', price: 138.25, change: '+3.45%', positive: true, volume: '48.2M' },
  { symbol: 'AAPL', name: 'Apple Inc', price: 231.80, change: '-0.32%', positive: false, volume: '32.1M' },
  { symbol: 'GOOGL', name: 'Alphabet Inc', price: 168.90, change: '+1.65%', positive: true, volume: '21.5M' },
  { symbol: 'MSFT', name: 'Microsoft Corp', price: 422.10, change: '+0.42%', positive: true, volume: '18.9M' },
  { symbol: 'BTC/USD', name: 'Bitcoin Network', price: 65420.00, change: '+2.88%', positive: true, volume: '$28B' },
];
