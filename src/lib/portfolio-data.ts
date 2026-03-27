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
  title: "Data Analyst • Strategy Consultant • Analytics Engineer",
  tagline: "Turning Data Into Strategy",
  summary:
    "I help organizations make smarter decisions through analytics, dashboards, and business intelligence.",
  location: "Germany • Remote / On-site",
  email: "islam.monaim@example.com",
  linkedinUrl: "https://www.linkedin.com/in/islam-md-monaim",
  githubUrl: "https://github.com/islam-md-monaim",
} as const;

export const metrics: Metric[] = [
  { value: "30+", label: "Analytics Dashboards Built", icon: "dashboard" },
  { value: "5+ Years", label: "in Data & Strategy", icon: "briefcase" },
  {
    value: "3",
    label: "Master’s Degrees (Data Science, Analytics, International Trade)",
    icon: "degree",
  },
  { value: "50+", label: "Research & Coding Projects", icon: "code" },
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
    tools: ["SQL", "Power BI / Tableau", "Python", "Data modeling", "ETL/ELT"],
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
    tools: ["Python", "NLP basics", "Taxonomy design", "QA sampling", "Dashboards"],
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
    tools: ["Python", "Time-series modeling", "Experiment tracking", "CI patterns", "Monitoring"],
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
    title: "Tableau Dashboards",
    description:
      "Executive-ready dashboards for KPI tracking, cohort analysis, and operational performance with strong narrative structure.",
    tags: ["Tableau", "KPI Design", "Storytelling"],
    githubUrl: "https://github.com/islam-md-monaim",
  },
  {
    title: "SQL Subquery Workbooks",
    description:
      "Practical SQL exercises covering joins, subqueries, window functions, and performance patterns for analytics engineering.",
    tags: ["SQL", "Analytics Engineering", "Practice"],
    githubUrl: "https://github.com/islam-md-monaim",
  },
  {
    title: "Windows Automation Scripts",
    description:
      "Reliable PowerShell automations for reporting, file workflows, and repeatable local data tasks.",
    tags: ["PowerShell", "Automation", "Ops"],
    githubUrl: "https://github.com/islam-md-monaim",
  },
  {
    title: "Web Development Tools",
    description:
      "Next.js utilities and UI patterns for content-driven analytics platforms, designed for speed and maintainability.",
    tags: ["Next.js", "TypeScript", "UI"],
    githubUrl: "https://github.com/islam-md-monaim",
  },
  {
    title: "Data Pipelines",
    description:
      "Reusable pipeline patterns for ingestion, transformation, validation, and reporting with measurable data quality.",
    tags: ["ETL/ELT", "Python", "Data Modeling"],
    githubUrl: "https://github.com/islam-md-monaim",
  },
];

