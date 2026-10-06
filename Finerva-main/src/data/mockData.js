export const initialTransactions = [];

export const initialBudgets = [];

export const initialGoals = [];

export const initialSubscriptions = [];

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
