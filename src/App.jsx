import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  BookOpenCheck,
  BrainCircuit,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  CircleDollarSign,
  CreditCard,
  Fingerprint,
  Goal,
  HeartHandshake,
  Lightbulb,
  LockKeyhole,
  Moon,
  PiggyBank,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  TrendingUp,
  Wallet,
  WandSparkles,
  Waves,
  Zap,
} from "lucide-react";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";

const skyNames = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  night: "Night",
};

function getSkyForHour(hour) {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

function useSky() {
  const location = useLocation();
  const navigate = useNavigate();
  const [now, setNow] = useState(() => new Date());
  const querySky = useMemo(() => {
    const requested = new URLSearchParams(location.search).get("sky");
    return ["morning", "afternoon", "evening", "night"].includes(requested) ? requested : null;
  }, [location.search]);
  const sky = querySky || getSkyForHour(now.getHours());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const setPreview = (value) => {
    const nextPath = value === "auto" ? location.pathname : `${location.pathname}?sky=${value}`;
    navigate(nextPath, { replace: true });
  };

  return { sky, querySky, setPreview };
}

const featureList = [
  {
    title: "Budget Analysis",
    description: "Intelligent budget tracking with personalized insights and spending pattern analysis",
    icon: BarChart3,
    note: "See the shape of your spending",
  },
  {
    title: "Smart Spending Insights",
    description: "AI-powered recommendations to optimize your spending and find savings opportunities",
    icon: Lightbulb,
    note: "Find room for what matters",
  },
  {
    title: "Goal-Based Planning",
    description: "Set and track financial goals with step-by-step guidance tailored to your timeline",
    icon: Goal,
    note: "Make the long game feel closer",
  },
  {
    title: "Investment Guidance",
    description: "Student-friendly investment advice with risk-appropriate recommendations",
    icon: TrendingUp,
    note: "Explore your next best step",
  },
  {
    title: "Debt Management",
    description: "Strategic debt repayment plans and credit building advice for students",
    icon: CreditCard,
    note: "Build confidence, one move at a time",
  },
  {
    title: "Dual AI System",
    description: "Google Gemini for advanced insights, Granite for reliable fallback responses",
    icon: BrainCircuit,
    note: "A thoughtful second opinion",
  },
];

const trustList = [
  {
    title: "Data Security First",
    description: "Your financial data is protected with enterprise-grade security and privacy measures",
    icon: Fingerprint,
    color: "mint",
  },
  {
    title: "AI-Powered Precision",
    description: "Cutting-edge AI technology provides accurate, contextual financial advice",
    icon: BadgeCheck,
    color: "blue",
  },
  {
    title: "Built for Students",
    description: "Designed specifically for student financial challenges and opportunities",
    icon: BookOpenCheck,
    color: "peach",
  },
  {
    title: "Always Improving",
    description: "Continuous learning AI that gets better at helping you over time",
    icon: Sparkles,
    color: "lavender",
  },
];

function Brand({ light = false }) {
  return (
    <Link className={`brand${light ? " brand-light" : ""}`} to="/" aria-label="SmartSpends home">
      <span className="brand-mark" aria-hidden="true">
        <Waves size={19} strokeWidth={2.2} />
      </span>
      <span className="brand-word">smart<span>spends</span></span>
      <span className="brand-ai">AI</span>
    </Link>
  );
}

function SkyControl({ sky, querySky, setPreview, compact = false }) {
  const SkyIcon = sky === "night" ? Moon : sky === "morning" ? Sun : Sparkles;
  return (
    <label className={`sky-control${compact ? " sky-control-compact" : ""}`}>
      <span className="sky-control-icon" aria-hidden="true"><SkyIcon size={14} /></span>
      <span className="sky-control-text">{compact ? "Sky" : `Live sky · ${skyNames[sky]}`}</span>
      <select
        aria-label="Preview the sky at a different time of day"
        value={querySky || "auto"}
        onChange={(event) => setPreview(event.target.value)}
      >
        <option value="auto">Live · {skyNames[sky]}</option>
        <option value="morning">Morning</option>
        <option value="afternoon">Afternoon</option>
        <option value="evening">Evening</option>
        <option value="night">Night</option>
      </select>
      <ChevronDown size={13} aria-hidden="true" />
    </label>
  );
}

function SkyArtwork({ sky, className = "" }) {
  return (
    <div className={`sky-scene sky-${sky} ${className}`} data-sky={sky} aria-hidden="true">
      <div className="sky-haze sky-haze-one" />
      <div className="sky-haze sky-haze-two" />
      <div className="sky-orbit sky-orbit-one" />
      <div className="sky-orbit sky-orbit-two" />
      <div className="sky-sun" />
      <svg className="sky-moon" viewBox="0 0 100 100" focusable="false">
        <path d="M70 9a41 41 0 1 0 21 74A39 39 0 0 1 70 9Z" />
      </svg>
      <svg className="sky-stars" viewBox="0 0 500 260" focusable="false">
        <circle cx="40" cy="57" r="1.7" /><circle cx="114" cy="31" r="1.15" />
        <circle cx="174" cy="89" r="1.8" /><circle cx="238" cy="48" r="1.2" />
        <circle cx="319" cy="78" r="1.7" /><circle cx="388" cy="36" r="1.1" />
        <circle cx="449" cy="111" r="1.8" /><circle cx="70" cy="154" r="1.1" />
        <circle cx="205" cy="139" r="1.4" /><circle cx="277" cy="177" r="1.2" />
        <circle cx="425" cy="198" r="1.1" /><circle cx="350" cy="120" r="1.2" />
        <path d="m115 31 13 6 7 15m184 26 16-4 10 4" fill="none" />
      </svg>
      <div className="sky-planet sky-planet-one" />
      <div className="sky-planet sky-planet-two"><span /></div>
      <div className="sky-shooting-star" />
      <svg className="sky-clouds sky-clouds-back" viewBox="0 0 960 280" preserveAspectRatio="none" focusable="false">
        <g className="cloud-drift cloud-drift-slow">
          <path d="M-40 196c12-24 43-32 68-17 4-35 31-60 67-60 34 0 63 22 70 54 25-18 67-15 87 9 27-26 83-25 107 9h88c34 0 58 22 58 48H-40Z" />
          <path d="M518 215c13-24 44-32 69-17 3-35 31-60 67-60 34 0 63 22 69 54 26-18 68-15 88 9 26-26 82-25 107 9h88c33 0 57 22 57 48H518Z" />
        </g>
      </svg>
      <svg className="sky-clouds sky-clouds-front" viewBox="0 0 960 280" preserveAspectRatio="none" focusable="false">
        <g className="cloud-drift cloud-drift-fast">
          <path d="M-88 243c14-27 48-36 76-19 4-40 35-67 75-67 39 0 70 25 78 61 29-20 77-16 99 10 31-29 94-28 122 10h104c36 0 65 23 65 55H-88Z" />
          <path d="M446 249c14-27 48-36 76-19 4-40 35-67 75-67 39 0 70 25 78 61 29-20 77-16 99 10 31-29 94-28 122 10h104c36 0 65 23 65 55H446Z" />
        </g>
      </svg>
      <div className="sky-horizon" />
    </div>
  );
}

function SiteHeader({ sky, querySky, setPreview, onNotice }) {
  return (
    <header className="site-header page-frame">
      <Brand />
      <nav className="site-nav" aria-label="Main navigation">
        <a href="#features">What it can do</a>
        <a href="#why-choose">Why SmartSpends</a>
      </nav>
      <div className="header-actions">
        <SkyControl sky={sky} querySky={querySky} setPreview={setPreview} compact />
        <button className="header-privacy" type="button" onClick={() => onNotice("SmartSpends is a static presentation demo. It does not collect or store financial data.")}>
          <LockKeyhole size={14} aria-hidden="true" />
          <span>Private by design</span>
        </button>
        <Link className="button button-dark button-header" to="/dashboard">
          Open the demo <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </header>
  );
}

function FeatureCard({ feature, index }) {
  const Icon = feature.icon;
  return (
    <article className={`feature-card feature-card-${index + 1}`}>
      <div className="feature-card-top">
        <span className="icon-tile"><Icon size={20} strokeWidth={1.8} aria-hidden="true" /></span>
        <span className="feature-index">0{index + 1}</span>
      </div>
      <div>
        <p className="feature-note">{feature.note}</p>
        <h3>{feature.title}</h3>
        <p className="feature-description">{feature.description}</p>
      </div>
      <span className="feature-arrow" aria-hidden="true"><ArrowUpRight size={17} /></span>
    </article>
  );
}

function LandingPage({ sky, querySky, setPreview, onNotice }) {
  return (
    <>
      <SiteHeader sky={sky} querySky={querySky} setPreview={setPreview} onNotice={onNotice} />
      <main>
        <section className="hero page-frame">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> YOUR MONEY, IN YOUR CORNER</div>
            <p className="hero-product">Personal Finance AI</p>
            <h1>Money clearer.<br /><span>Momentum closer.</span></h1>
            <p className="hero-description">
              Your Intelligent Money Companion powered by Google Gemini 1.5 Flash with Granite AI fallback for reliable, personalized financial guidance.
            </p>
            <p className="hero-tagline">Plan smarter. Spend better. Save faster.</p>
            <div className="hero-buttons">
              <Link className="button button-lime" to="/dashboard">
                Get Started <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <a className="button button-quiet" href="#features">Explore what’s possible <ArrowDownRight size={16} aria-hidden="true" /></a>
            </div>
            <div className="hero-trust-note">
              <span className="trust-dot"><Check size={10} aria-hidden="true" /></span>
              <span>Made for real life, not just spreadsheets</span>
            </div>
            <div className="hero-stats" aria-label="SmartSpends highlights">
              <div><span className="stat-value">AI</span><span className="stat-label">a clearer point of view</span></div>
              <div><span className="stat-value">24/7</span><span className="stat-label">here when questions come up</span></div>
              <div><span className="stat-value">100%</span><span className="stat-label">focused on your next step</span></div>
            </div>
          </div>
        </section>

        <section className="features-section section-frame" id="features">
          <div className="section-heading">
            <div>
              <div className="eyebrow"><span className="eyebrow-line" /> THE EVERYDAY STUFF, MADE EASIER</div>
              <h2>More room for <em>your</em> life.</h2>
            </div>
            <p className="section-intro">Money is personal. The way you make sense of it should be, too.</p>
          </div>
          <div className="feature-grid">
            {featureList.map((feature, index) => <FeatureCard feature={feature} index={index} key={feature.title} />)}
          </div>
        </section>

        <section className="why-section section-frame" id="why-choose">
          <div className="why-intro">
            <div className="eyebrow"><span className="eyebrow-line" /> A BETTER KIND OF MONEY TOOL</div>
            <h2>Why choose<br /><span>SMARTSPENDS?</span></h2>
            <p>A steady voice for the money decisions that show up in real life — from your first paycheck to the plans you’re building toward.</p>
            <Link className="text-link" to="/dashboard">Take a look around <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
          <div className="trust-grid">
            {trustList.map((item, index) => {
              const Icon = item.icon;
              return (
                <article className={`trust-card trust-${item.color}`} key={item.title}>
                  <div className="trust-card-head">
                    <span className="trust-icon"><Icon size={18} strokeWidth={1.8} aria-hidden="true" /></span>
                    <span className="feature-index">0{index + 1}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="closing-cta section-frame">
          <div className="cta-orbit cta-orbit-one" aria-hidden="true" />
          <div className="cta-orbit cta-orbit-two" aria-hidden="true" />
          <div className="closing-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> YOUR NEXT CHAPTER STARTS HERE</div>
            <h2>Plan smarter.<br /><em>Spend better.</em><br />Save faster.</h2>
            <p>Join thousands of students who are already taking control of their financial future with AI-powered guidance.</p>
            <Link className="button button-dark closing-button" to="/dashboard">
              Start with SmartSpends <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <div className="cta-side" aria-hidden="true">
            <div className="cta-sun" />
            <Sparkles className="cta-spark cta-spark-one" size={21} />
            <Sparkles className="cta-spark cta-spark-two" size={15} />
            <span className="cta-side-note">Small steps.<br />Good momentum.</span>
          </div>
        </section>
      </main>
      <Footer onNotice={onNotice} />
    </>
  );
}

const money = (value) => new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
}).format(value);

function DashboardPage({ sky, querySky, setPreview, onNotice }) {
  const profile = {
    currentBalance: 54000,
    userIncome: 120000,
    monthlySpending: 36000,
    investments: 180000,
    savingsGoal: 150000,
    userName: "Aarav",
  };
  const netWorth = profile.currentBalance + profile.investments;
  const monthlySurplus = profile.userIncome - profile.monthlySpending;
  const spendingPct = profile.userIncome > 0 ? (profile.monthlySpending / profile.userIncome) * 100 : 0;
  const currentSavings = profile.currentBalance - profile.monthlySpending;
  const savingsProgress = profile.savingsGoal > 0 ? (currentSavings / profile.savingsGoal) * 100 : 0;
  const score = 82;

  const metrics = [
    { name: "Current Balance", value: money(profile.currentBalance), detail: "Available today", icon: Wallet, color: "mint", marker: "Balance" },
    { name: "Monthly Spending", value: money(profile.monthlySpending), detail: `${spendingPct.toFixed(0)}% of monthly income`, icon: CircleDollarSign, color: "coral", marker: "Spending" },
    { name: "Savings Goal", value: money(profile.savingsGoal), detail: `${savingsProgress.toFixed(0)}% of goal set aside`, icon: PiggyBank, color: "sky", marker: "Savings" },
    { name: "Investments", value: money(profile.investments), detail: "Across your portfolio", icon: TrendingUp, color: "lilac", marker: "Invested" },
  ];

  const actions = [
    { title: "AI Chat", icon: BrainCircuit, detail: "Talk through a money question" },
    { title: "Budgets", icon: BarChart3, detail: "A steadier monthly plan" },
    { title: "Subscriptions", icon: CreditCard, detail: "Know what’s recurring" },
    { title: "Bill Split", icon: HeartHandshake, detail: "Make shared costs simple" },
    { title: "Stock Market", icon: TrendingUp, detail: "Explore investing basics" },
    { title: "Edit Profile", icon: BriefcaseBusiness, detail: "Keep your details current" },
  ];
  const moreActions = [
    { title: "Goals", icon: Goal, detail: "Keep a future plan in sight" },
    { title: "Insights", icon: Lightbulb, detail: "Notice the small patterns" },
    { title: "Student Offers", icon: Star, detail: "Find student-friendly perks" },
    { title: "Watchlist", icon: BookOpenCheck, detail: "Keep an eye on what interests you" },
  ];

  return (
    <main className="dashboard-page">
      <header className="dashboard-header page-frame">
        <Brand />
        <div className="dashboard-header-right">
          <SkyControl sky={sky} querySky={querySky} setPreview={setPreview} compact />
          <span className="demo-pill"><span /> SAMPLE PROFILE</span>
          <Link to="/" className="button button-outline button-home">Home <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
      </header>

      <div className="dashboard-main page-frame">
        <section className="dashboard-hero">
          <div className="dashboard-hero-copy">
            <div className="eyebrow eyebrow-light"><span className="eyebrow-line" /> PERSONAL FINANCE AI</div>
            <p className="dashboard-brand-title">SmartSpends-AI</p>
            <h1>Your Intelligent<br /><em>Money Companion</em></h1>
            <p className="dashboard-welcome">Welcome back, {profile.userName}! Here's your financial overview</p>
            <div className="dashboard-sample-note"><LockKeyhole size={13} aria-hidden="true" /> A sample view. Your finances aren’t connected.</div>
          </div>
          <div className="hero-decoration hero-decoration-one" aria-hidden="true" />
          <div className="hero-decoration hero-decoration-two" aria-hidden="true" />
        </section>

        <section className="financial-summary dashboard-section" aria-labelledby="financial-health">
          <div className="summary-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> THE BIG PICTURE</div>
            <h2 id="financial-health">Financial Health Score</h2>
            <p>Good things are adding up. Keep your monthly rhythm going.</p>
            <div className="score-legend"><span className="score-dot" /> On a steady track</div>
          </div>
          <div className="score-ring" aria-label={`Financial health score ${score} out of 100`}>
            <svg viewBox="0 0 152 152" role="img" aria-hidden="true">
              <circle className="score-track" cx="76" cy="76" r="66" />
              <circle className="score-progress" cx="76" cy="76" r="66" />
            </svg>
            <div className="score-inner"><strong>{score}</strong><span>out of 100</span></div>
          </div>
          <div className="summary-values">
            <div className="summary-value">
              <span>Net Worth</span><strong>{money(netWorth)}</strong>
              <small>Balance + investments</small>
            </div>
            <div className="summary-value">
              <span>Monthly Surplus</span><strong>{money(monthlySurplus)}</strong>
              <small>Income less spending</small>
            </div>
          </div>
        </section>

        <section className="dashboard-section" aria-labelledby="dashboard-heading">
          <div className="dashboard-section-heading">
            <div>
              <div className="eyebrow"><span className="eyebrow-line" /> YOUR MONEY, AT A GLANCE</div>
              <h2 id="dashboard-heading">Your Financial Dashboard</h2>
            </div>
            <span className="period-label"><span className="period-dot" /> This month <ChevronDown size={14} aria-hidden="true" /></span>
          </div>
          <div className="metric-grid">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <article className={`metric-card metric-${metric.color}`} key={metric.name}>
                  <div className="metric-card-top">
                    <span className="metric-icon"><Icon size={18} strokeWidth={1.8} aria-hidden="true" /></span>
                    <span className="metric-index">0{index + 1}</span>
                  </div>
                  <p>{metric.name}</p>
                  <strong className="metric-value">{metric.value}</strong>
                  <div className="metric-foot"><span className="metric-indicator" />{metric.detail}</div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="ai-card" aria-label="SmartSpends AI assistant">
          <div className="ai-orbit ai-orbit-a" aria-hidden="true" />
          <div className="ai-orbit ai-orbit-b" aria-hidden="true" />
          <div className="ai-emblem"><WandSparkles size={24} strokeWidth={1.6} aria-hidden="true" /></div>
          <div className="ai-copy">
            <div className="ai-title-line"><h2>SmartSpends AI</h2><span className="local-pill"><span /> LOCAL AI</span></div>
            <p>Get instant personalized financial advice • Investing • Saving • Taxes • Budgeting</p>
            <span className="ai-disclaimer">Concept preview only — AI advice is not running in this demo.</span>
          </div>
          <button className="button button-lime ai-button" type="button" onClick={() => onNotice("AI Chat is a concept preview. No AI service or financial account is connected.")}>
            Explore the idea <ArrowRight size={16} aria-hidden="true" />
          </button>
        </section>

        <section className="dashboard-section action-section" aria-labelledby="quick-actions-heading">
          <div className="dashboard-section-heading">
            <div>
              <div className="eyebrow"><span className="eyebrow-line" /> ONE TAP FROM A NEXT STEP</div>
              <h2 id="quick-actions-heading">Quick actions</h2>
            </div>
            <span className="static-caption">A first look at what’s possible</span>
          </div>
          <div className="action-grid">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button className="action-card" type="button" key={action.title} onClick={() => onNotice(`${action.title} is shown as a visual preview. It isn't connected to a service.`)}>
                  <span className={`action-icon action-icon-${index}`}><Icon size={19} strokeWidth={1.8} aria-hidden="true" /></span>
                  <span className="action-copy"><strong>{action.title}</strong><small>{action.detail}</small></span>
                  <ArrowUpRight className="action-arrow" size={16} aria-hidden="true" />
                </button>
              );
            })}
          </div>
        </section>

        <section className="dashboard-section more-section" aria-labelledby="more-heading">
          <div className="dashboard-section-heading">
            <div>
              <div className="eyebrow"><span className="eyebrow-line" /> MORE WAYS TO FIND YOUR FLOW</div>
              <h2 id="more-heading">A little more for your money</h2>
            </div>
          </div>
          <div className="more-grid">
            {moreActions.map((action) => {
              const Icon = action.icon;
              return (
                <button className="more-card" type="button" key={action.title} onClick={() => onNotice(`${action.title} is a concept preview in this demo.`)}>
                  <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
                  <span><strong>{action.title}</strong><small>{action.detail}</small></span>
                  <ArrowRight size={15} className="more-arrow" aria-hidden="true" />
                </button>
              );
            })}
          </div>
        </section>
        <p className="dashboard-footnote"><ShieldCheck size={14} aria-hidden="true" /> A design preview with illustrative sample values. No data is stored or used to provide financial advice.</p>
      </div>
      <Footer onNotice={onNotice} compact />
    </main>
  );
}

function Footer({ onNotice, compact = false }) {
  return (
    <footer className={`site-footer page-frame${compact ? " site-footer-compact" : ""}`}>
      <Brand />
      <div className="footer-middle"><span>Money clarity for the next generation.</span><span>Designed for real life.</span></div>
      <div className="footer-links">
        <a href={compact ? "/" : "#why-choose"}>{compact ? "Home" : "About"}</a>
        <button type="button" onClick={() => onNotice("This presentation demo does not collect or store financial data.")}>Privacy Policy</button>
        <button type="button" onClick={() => onNotice("Contact details aren't configured for this presentation demo.")}>Contact</button>
      </div>
      <span className="copyright">© 2025 Finerva. All rights reserved.</span>
    </footer>
  );
}

function NotFound() {
  return (
    <main className="not-found page-frame">
      <Brand />
      <div>
        <div className="eyebrow"><span className="eyebrow-line" /> A SMALL DETOUR</div>
        <h1>That page isn’t<br /><em>on this map.</em></h1>
        <p>This preview has two stops: the welcome page and your sample dashboard.</p>
        <Link className="button button-lime" to="/">Back to SmartSpends <ArrowRight size={16} aria-hidden="true" /></Link>
      </div>
    </main>
  );
}

export default function App() {
  const { sky, querySky, setPreview } = useSky();
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(""), 3800);
    return () => window.clearTimeout(timer);
  }, [notice]);

  return (
    <div className="app-shell" data-sky={sky}>
      <SkyArtwork sky={sky} className="ambient-background" />
      <Routes>
        <Route path="/" element={<LandingPage sky={sky} querySky={querySky} setPreview={setPreview} onNotice={setNotice} />} />
        <Route path="/dashboard" element={<DashboardPage sky={sky} querySky={querySky} setPreview={setPreview} onNotice={setNotice} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <div className={`notice${notice ? " notice-visible" : ""}`} aria-live="polite" aria-atomic="true" role="status">
        <span className="notice-mark"><Check size={13} aria-hidden="true" /></span>{notice}
      </div>
    </div>
  );
}

