export type Metric = {
  label: string;
  value: string;
  icon: "dashboard" | "briefcase" | "degree" | "code";
};

export type CaseStudy = {
  slug: string;
  title: string;
  summary: string;
  problem: string;
  solution: string;
  tools: string[];
  results: string[];
  insights: string[];
};

export type Project = {
  title: string;
  description: string;
  tags: string[];
  githubUrl?: string;
};

export const brand = {
  name: "Islam Md Monaim",
  title: "Data Analyst · Marketing, Customer & Economic Analytics",
  tagline: "Turning Data Into Strategy",
  summary:
    "Data analyst based in Germany using SQL, R, Python, MySQL, and Tableau to transform complex data into clear, decision-oriented insights.",
  location: "Germany · Remote / Hybrid / On-site",
  email: "monaimk07@gmail.com",
  linkedinUrl: "https://www.linkedin.com/in/md-monaim-islam-295928161/",
  githubUrl: "https://github.com/Monaim-knight",
} as const;

export const metrics: Metric[] = [
  { value: "SQL · R · Python", label: "Core Analytical Stack", icon: "code" },
  { value: "Tableau & MySQL", label: "BI Dashboards & Data Modeling", icon: "dashboard" },
  {
    value: "Data Science & Trade",
    label: "M.Sc.-Level Quantitative & Economic Background",
    icon: "degree",
  },
  { value: "End-to-End", label: "Problem Framing to Business Decisions", icon: "briefcase" },
];

export const caseStudies: CaseStudy[] = [
  {
    slug: "clinic-kpi-automation-system",
    title: "Clinic KPI Automation System",
    summary:
      "Automated KPI ingestion, validation, and reporting for a multi-department clinic to improve operational visibility and decision cadence.",
    problem:
      "Leadership lacked consistent, timely KPIs across departments. Reporting was manual, error-prone, and too slow for weekly operational decisions.",
    solution:
      "Designed a KPI framework, built automated data pipelines, and delivered dashboards with standardized definitions, data quality checks, and governed access.",
    tools: ["SQL", "Tableau", "Python", "Data modeling", "ETL/ELT"],
    results: [
      "Reduced reporting cycle time from days to hours",
      "Standardized KPI definitions across departments",
      "Improved data trust with automated validation checks",
    ],
    insights: [
      "KPI governance is as important as visualization",
      "Data quality rules should be versioned and measurable",
      "Operational dashboards need a clear decision rhythm",
    ],
  },
  {
    slug: "annual-report-qualitative-coding-engine",
    title: "Annual Report Qualitative Coding Engine",
    summary:
      "Built a repeatable qualitative coding pipeline to turn narrative annual reports into structured insights and comparable themes over time.",
    problem:
      "Annual reports contained valuable strategic signals, but extracting themes was inconsistent and not comparable year-to-year.",
    solution:
      "Developed a structured coding taxonomy, automated extraction workflows, and produced theme-level dashboards and analysis summaries.",
    tools: ["Python", "Text Analysis", "Taxonomy design", "QA sampling", "Dashboards"],
    results: [
      "Made qualitative insights auditable and repeatable",
      "Enabled time-series comparison of strategic themes",
      "Accelerated analysis with standardized workflows",
    ],
    insights: [
      "Taxonomy design determines insight quality",
      "Sampling + QA prevents overfitting interpretations",
      "Narrative data becomes actionable when structured",
    ],
  },
  {
    slug: "trading-prediction-bot-architecture",
    title: "Trading Prediction Bot Architecture",
    summary:
      "Designed an end-to-end architecture for feature pipelines, model evaluation, and monitoring with a focus on risk, drift, and reproducibility.",
    problem:
      "Prototype models performed in backtests but lacked a production-ready architecture for monitoring, retraining, and risk controls.",
    solution:
      "Created a modular system design: data ingestion, feature store patterns, evaluation harness, alerting, and reporting with governance checkpoints.",
    tools: ["Python", "Time-series modeling", "Experiment tracking", "Validation", "Monitoring"],
    results: [
      "Improved reproducibility across experiments",
      "Added monitoring to detect drift and anomalies",
      "Established clear deployment and rollback criteria",
    ],
    insights: [
      "Model governance should be designed from day one",
      "Monitoring is a product feature, not an afterthought",
      "Backtest performance must be paired with risk metrics",
    ],
  },
];

export const projects: Project[] = [
  {
    title: "Germany Export Competitiveness & 5-Year Forecast",
    description:
      "HS2 international trade analysis and 2025–2029 forecasting (Naive, Drift, ETS) across Germany's top export sectors compared with the USA, China, and global peers, backed by MySQL and three interconnected Tableau dashboards.",
    tags: ["R", "MySQL", "Time-Series Forecasting", "Tableau"],
    githubUrl:
      "https://github.com/Monaim-knight/Germany-s-Top-Export-Products-Global-Position-5-Year-Forecast",
  },
  {
    title: "PuzzlePop Marketing & A/B Test Analytics",
    description:
      "End-to-end paid acquisition analysis across five marketing channels covering funnel conversion, retention, monetization, statistical A/B test evaluation, MySQL workflows, and executive Tableau dashboards.",
    tags: ["R", "MySQL", "SQL", "A/B Testing", "Tableau"],
    githubUrl: "https://github.com/Monaim-knight/PuzzlePop",
  },
  {
    title: "Cost-Sensitive Fraud Detection System",
    description:
      "Fraud review-policy study on card-not-present transactions featuring 20 point-in-time engineered features, strict temporal validation, rule baselines, and locked-test evaluation.",
    tags: ["Python", "Fraud Analytics", "Temporal Validation", "Modeling"],
    githubUrl: "https://github.com/Monaim-knight/Fraud-Detection-System",
  },
  {
    title: "Germany Energiewende: Market & Social Impact",
    description:
      "Quantitative investigation of Germany's energy transition, analyzing market dynamics, policy shifts, and social cohesion indicators across regions.",
    tags: ["Economic Analytics", "Policy Analysis", "Data Visualization"],
    githubUrl:
      "https://github.com/Monaim-knight/germany-energiewende-market-social-impact",
  },
  {
    title: "Customer Churn & Retention Modeling",
    description:
      "Predictive churn analysis on a ~20% churn customer dataset, identifying key behavioral drivers and translating model outputs into retention segments.",
    tags: ["Python", "Customer Analytics", "Churn Modeling"],
    githubUrl: "https://github.com/Monaim-knight/Customer-Churn",
  },
  {
    title: "E-Commerce KPI & Business Intelligence Suite",
    description:
      "E-commerce KPI framework and growth analytics project demonstrating structured metric definitions, conversion tracking, and executive BI reporting.",
    tags: ["SQL", "KPI Design", "E-Commerce BI"],
    githubUrl: "https://github.com/Monaim-knight/ecommerce-analytics",
  },
];

