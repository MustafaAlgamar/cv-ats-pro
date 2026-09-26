// Deterministic ATS analysis engine.
// No API calls, no external dependencies.
// Designed to work with the resume object used by ATSCVBuilderPro.jsx.

const STOP_WORDS = new Set(
  `a an and are as at be been being by for from had has have he her his i if in into is it its me my of on or our she that the their them they this to was we were will with you your about after again all also am any because before between both but can could did do does doing during each few further get got here how however just more most no not now only other ought own same should so some such than too under until very what when where which while who why would`
    .split(/\s+/)
);

const SKILL_TERMS = [
  "javascript",
  "typescript",
  "python",
  "java",
  "c#",
  "c++",
  "php",
  "go",
  "rust",
  "kotlin",
  "swift",

  "react",
  "react.js",
  "next.js",
  "vue",
  "angular",
  "node.js",
  "node",
  "express",
  "fastapi",
  "django",
  "flask",

  "html",
  "css",
  "bootstrap",
  "tailwind",
  "graphql",
  "rest api",
  "restful api",
  "websocket",

  "sql",
  "mysql",
  "postgresql",
  "mongodb",
  "redis",
  "firebase",
  "supabase",

  "aws",
  "azure",
  "gcp",
  "google cloud",

  "docker",
  "kubernetes",
  "terraform",
  "jenkins",
  "github actions",
  "ci/cd",
  "git",
  "github",
  "gitlab",

  "figma",
  "photoshop",
  "illustrator",
  "canva",
  "pixellab",
  "graphic design",
  "ui design",
  "ux design",

  "machine learning",
  "deep learning",
  "data analysis",
  "pandas",
  "numpy",
  "tensorflow",
  "pytorch",

  "agile",
  "scrum",
  "jira",
  "project management",
  "product management",
  "leadership",
  "communication",

  "seo",
  "content marketing",
  "social media",
  "copywriting",
  "sales",
  "customer service",
  "research",
];

const ACTION_VERBS = [
  "built",
  "developed",
  "designed",
  "implemented",
  "created",
  "launched",
  "led",
  "managed",
  "optimized",
  "improved",
  "increased",
  "reduced",
  "delivered",
  "automated",
  "engineered",
  "architected",
  "migrated",
  "deployed",
  "integrated",
  "analyzed",
  "coordinated",
  "mentored",
  "streamlined",
  "generated",
  "achieved",
];

const SECTION_ALIASES = {
  summary: [
    "summary",
    "professional summary",
    "profile",
    "objective",
    "career objective",
  ],

  experience: [
    "experience",
    "work experience",
    "professional experience",
    "employment history",
    "work history",
  ],

  education: [
    "education",
    "academic background",
    "academic history",
  ],

  skills: [
    "skills",
    "technical skills",
    "core skills",
    "competencies",
    "expertise",
  ],

  projects: [
    "projects",
    "selected projects",
    "personal projects",
  ],

  certifications: [
    "certifications",
    "certificates",
    "credentials",
  ],

  languages: [
    "languages",
    "language skills",
  ],
};

const normalize = (value = "") =>
  String(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[’']/g, "")
    .replace(/[–—]/g, "-")
    .replace(/\.(js|ts|py|net)/g, " $1")
    .replace(/[^a-z0-9+#./-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const escapeRegExp = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const countWords = (value = "") =>
  String(value)
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

/**
 * Convert the resume object into searchable plain text.
 */
const resumeToText = (resume = {}) => {
  const p = resume.personal || {};

  const parts = [
    p.fullName,
    p.jobTitle,
    p.email,
    p.phone,
    p.location,
    p.linkedin,
    p.github,
    p.portfolio,

    resume.summary,

    ...(resume.skills || []),

    ...(resume.experience || []).flatMap((e) => [
      e.title,
      e.company,
      e.location,
      e.startDate,
      e.endDate,
      e.description,
    ]),

    ...(resume.education || []).flatMap((e) => [
      e.degree,
      e.school,
      e.location,
      e.year,
      e.gpa,
    ]),

    ...(resume.certifications || []).flatMap((c) => [
      c.name,
      c.issuer,
      c.year,
    ]),

    ...(resume.projects || []).flatMap((project) => [
      project.name,
      project.description,
      project.link,
      project.tech,
    ]),

    ...(resume.languages || []).flatMap((language) => [
      language.name,
      language.level,
    ]),
  ];

  return parts.filter(Boolean).join(" ");
};

/**
 * Extract relevant terms from a Job Description.
 */
const extractTerms = (jobDescription = "") => {
  const raw = normalize(jobDescription);

  if (!raw) return [];

  const foundSkills = SKILL_TERMS.filter((term) => {
    const normalizedTerm = normalize(term);

    return new RegExp(
      `(^|\\s)${escapeRegExp(normalizedTerm)}(?=\\s|$)`,
      "i"
    ).test(raw);
  });

  const tokens = raw
    .split(" ")
    .filter(
      (token) =>
        token.length >= 4 &&
        !STOP_WORDS.has(token) &&
        !/^\d+$/.test(token)
    );

  const frequency = new Map();

  tokens.forEach((token) => {
    frequency.set(token, (frequency.get(token) || 0) + 1);
  });

  const genericTerms = new Set([
    "experience",
    "candidate",
    "company",
    "position",
    "role",
    "work",
    "team",
    "skills",
    "years",
    "ability",
    "responsibilities",
    "requirements",
    "preferred",
    "including",
    "using",
    "knowledge",
    "strong",
    "working",
  ]);

  const frequentTerms = [...frequency.entries()]
    .filter(
      ([token, count]) =>
        count >= 2 && !genericTerms.has(token)
    )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .map(([token]) => token);

  return [
    ...new Set([
      ...foundSkills,
      ...frequentTerms,
    ]),
  ].slice(0, 40);
};

/**
 * Check whether a term exists inside text.
 */
const matchTerm = (text, term) => {
  const haystack = normalize(text);
  const needle = normalize(term);

  if (!needle) return false;

  if (haystack.includes(needle)) {
    return true;
  }

  // Basic singular/plural tolerance.
  if (
    needle.endsWith("s") &&
    haystack.includes(needle.slice(0, -1))
  ) {
    return true;
  }

  return false;
};

/**
 * Detect which resume sections contain data.
 */
const detectSections = (resume) => {
  const result = {};

  result.summary = Boolean(
    String(resume.summary || "").trim()
  );

  result.experience = (
    resume.experience || []
  ).some((entry) =>
    Object.values(entry || {}).some(Boolean)
  );

  result.education = (
    resume.education || []
  ).some((entry) =>
    Object.values(entry || {}).some(Boolean)
  );

  result.skills =
    (resume.skills || []).filter(Boolean).length > 0;

  result.projects = (
    resume.projects || []
  ).some((entry) =>
    Object.values(entry || {}).some(Boolean)
  );

  result.certifications = (
    resume.certifications || []
  ).some((entry) =>
    Object.values(entry || {}).some(Boolean)
  );

  result.languages = (
    resume.languages || []
  ).some((entry) =>
    Object.values(entry || {}).some(Boolean)
  );

  return result;
};

/**
 * Analyze resume structure and formatting.
 */
const analyzeFormatting = (resume) => {
  const issues = [];
  const warnings = [];

  const p = resume.personal || {};

  const template = resume.template || "modern";

  const summaryWords = countWords(
    resume.summary
  );

  const skills = (
    resume.skills || []
  ).filter(Boolean);

  const experience = (
    resume.experience || []
  ).filter(
    (entry) =>
      entry &&
      (entry.title ||
        entry.company ||
        entry.description)
  );

  if (!p.fullName) {
    issues.push("Missing full name");
  }

  if (!p.email) {
    issues.push("Missing email address");
  }

  if (!p.phone) {
    warnings.push("Phone number is missing");
  }

  if (!p.location) {
    warnings.push("Location is missing");
  }

  if (!p.jobTitle) {
    warnings.push("Target job title is missing");
  }

  if (
    summaryWords > 0 &&
    (summaryWords < 25 ||
      summaryWords > 100)
  ) {
    warnings.push(
      "Summary length is outside the recommended 25–100 words"
    );
  }

  if (skills.length < 5) {
    warnings.push(
      "Skills section has fewer than 5 skills"
    );
  }

  if (experience.length === 0) {
    issues.push(
      "No experience entry found"
    );
  }

  if (
    experience.some(
      (entry) =>
        !entry.title ||
        !entry.company
    )
  ) {
    warnings.push(
      "One or more experience entries are missing a job title or company"
    );
  }

  if (
    experience.some(
      (entry) =>
        !entry.description ||
        countWords(entry.description) < 8
    )
  ) {
    warnings.push(
      "One or more experience entries have very little description"
    );
  }

  if (
    experience.some(
      (entry) =>
        entry.description &&
        !/[0-9%$]/.test(
          entry.description
        )
    )
  ) {
    warnings.push(
      "Add measurable results to experience bullets where truthful"
    );
  }

  // Based on the current builder's template metadata.
  if (
    ["creative", "tech"].includes(
      template
    )
  ) {
    warnings.push(
      `The ${template} template may be less conservative than a plain ATS-first layout`
    );
  }

  if (template === "creative") {
    warnings.push(
      "Prefer a simple one-column template for maximum parser compatibility"
    );
  }

  const sectionCount = Object.values(
    detectSections(resume)
  ).filter(Boolean).length;

  if (sectionCount < 3) {
    issues.push(
      "Resume has too few populated sections"
    );
  }

  const score = Math.max(
    0,
    100 -
      issues.length * 16 -
      warnings.length * 5
  );

  return {
    score,
    issues,
    warnings,
    sectionCount,
  };
};

/**
 * Analyze keywords against the Job Description.
 */
const analyzeKeywords = (
  resume,
  jobDescription
) => {
  const jd = String(
    jobDescription || ""
  ).trim();

  if (!jd) {
    return {
      enabled: false,
      matchRate: null,
      extracted: [],
      matched: [],
      missing: [],
      extra: [],
      criticalMissing: [],

      message:
        "Paste a job description to enable job-specific keyword matching.",
    };
  }

  const resumeText =
    resumeToText(resume);

  const extracted =
    extractTerms(jd);

  const matched =
    extracted.filter((term) =>
      matchTerm(resumeText, term)
    );

  const missing =
    extracted.filter(
      (term) =>
        !matchTerm(
          resumeText,
          term
        )
    );

  const resumeSkills =
    (resume.skills || []).filter(
      Boolean
    );

  const extra =
    resumeSkills.filter(
      (skill) =>
        !extracted.some(
          (term) =>
            matchTerm(term, skill)
        )
    );

  const criticalPool = new Set(
    SKILL_TERMS.map(normalize)
  );

  const criticalMissing =
    missing
      .filter((term) =>
        criticalPool.has(
          normalize(term)
        )
      )
      .slice(0, 12);

  const matchRate =
    extracted.length
      ? Math.round(
          (matched.length /
            extracted.length) *
            100
        )
      : 0;

  return {
    enabled: true,
    matchRate,
    extracted,
    matched,
    missing,
    extra,
    criticalMissing,
  };
};

/**
 * Main ATS engine.
 */
const analyzeATS = (
  resume = {},
  jobDescription = ""
) => {
  const p =
    resume.personal || {};

  const formatting =
    analyzeFormatting(resume);

  const keywords =
    analyzeKeywords(
      resume,
      jobDescription
    );

  const sections =
    detectSections(resume);

  // -----------------------------
  // CONTACT
  // -----------------------------

  const contactFields = [
    p.fullName,
    p.email,
    p.phone,
    p.location,
    p.jobTitle,
  ].filter(
    (value) =>
      String(value || "").trim()
  ).length;

  const contactScore = Math.round(
    (contactFields / 5) * 10
  );

  // -----------------------------
  // SUMMARY
  // -----------------------------

  const summaryWords =
    countWords(
      resume.summary
    );

  const summaryScore =
    !summaryWords
      ? 0
      : summaryWords >= 25 &&
        summaryWords <= 100
      ? 10
      : 6;

  // -----------------------------
  // SKILLS
  // -----------------------------

  const skillCount =
    (resume.skills || [])
      .filter(Boolean)
      .length;

  const skillBase = Math.min(
    10,
    Math.round(
      (skillCount / 10) * 10
    )
  );

  // -----------------------------
  // KEYWORDS
  // -----------------------------

  const keywordScore =
    keywords.enabled
      ? Math.round(
          (keywords.matchRate /
            100) *
            25
        )
      : 12;

  // -----------------------------
  // EXPERIENCE
  // -----------------------------

  const experience =
    (resume.experience || [])
      .filter(Boolean);

  const descriptions =
    experience.map(
      (entry) =>
        String(
          entry.description || ""
        )
    );

  const actionVerbHits =
    descriptions.reduce(
      (total, description) =>
        total +
        ACTION_VERBS.filter(
          (verb) =>
            matchTerm(
              description,
              verb
            )
        ).length,
      0
    );

  const quantified =
    descriptions.filter(
      (description) =>
        /[0-9%$]/.test(
          description
        )
    ).length;

  const experienceScore =
    Math.min(
      15,
      experience.length * 4 +
        Math.min(
          4,
          quantified * 2
        ) +
        Math.min(
          3,
          actionVerbHits
        )
    );

  // -----------------------------
  // STRUCTURE
  // -----------------------------

  const sectionScore =
    Math.min(
      10,
      Object.values(
        sections
      ).filter(Boolean).length +
        (sections.experience
          ? 3
          : 0) +
        (sections.skills
          ? 2
          : 0)
    );

  // -----------------------------
  // FORMATTING
  // -----------------------------

  const formattingScore =
    Math.round(
      (formatting.score /
        100) *
        15
    );

  // -----------------------------
  // FINAL SCORE
  // -----------------------------

  let score =
    contactScore +
    summaryScore +
    skillBase +
    keywordScore +
    experienceScore +
    sectionScore +
    formattingScore;

  // Without a Job Description,
  // this is not a job-specific score.
  if (!keywords.enabled) {
    score = Math.min(
      score,
      74
    );
  }

  score = Math.max(
    0,
    Math.min(100, score)
  );

  // -----------------------------
  // ISSUES
  // -----------------------------

  const issues = [];
  const suggestions = [];

  formatting.issues.forEach(
    (text) =>
      issues.push({
        type: "danger",
        text,
      })
  );

  formatting.warnings.forEach(
    (text) =>
      issues.push({
        type: "warning",
        text,
      })
  );

  if (keywords.enabled) {
    if (
      keywords.criticalMissing
        .length
    ) {
      issues.push({
        type: "danger",

        text: `Missing ${keywords.criticalMissing.length} job-relevant skill keyword${
          keywords.criticalMissing.length ===
          1
            ? ""
            : "s"
        }`,
      });
    }

    if (
      keywords.matchRate < 50
    ) {
      issues.push({
        type: "danger",

        text: `Only ${keywords.matchRate}% of extracted job keywords match your resume`,
      });
    } else if (
      keywords.matchRate < 75
    ) {
      issues.push({
        type: "warning",

        text: `Keyword match is ${keywords.matchRate}%; consider tailoring the resume to this job`,
      });
    }
  }

  // -----------------------------
  // SUGGESTIONS
  // -----------------------------

  if (summaryWords < 25) {
    suggestions.push(
      "Write a focused summary of roughly 25–100 words using the target role and relevant expertise."
    );
  }

  if (skillCount < 8) {
    suggestions.push(
      "Add relevant skills you genuinely possess, prioritizing those requested in the job description."
    );
  }

  if (
    experience.length &&
    quantified < experience.length
  ) {
    suggestions.push(
      "Where truthful, add measurable outcomes to experience bullets instead of listing duties only."
    );
  }

  if (
    keywords.enabled &&
    keywords.missing.length
  ) {
    suggestions.push(
      `Review these missing keywords and add only the ones that accurately describe your experience: ${keywords.missing
        .slice(0, 8)
        .join(", ")}.`
    );
  }

  if (
    keywords.enabled &&
    keywords.matched.length
  ) {
    suggestions.push(
      `${keywords.matched.length} extracted job terms currently match your resume.`
    );
  }

  if (!keywords.enabled) {
    suggestions.push(
      "Paste the target job description for a job-specific keyword and skill-gap analysis."
    );
  }

  // -----------------------------
  // BREAKDOWN
  // -----------------------------

  const breakdown = [
    {
      label: "Contact Info",
      score: contactScore,
      max: 10,
      color: "#2563EB",
    },

    {
      label: "Summary",
      score: summaryScore,
      max: 10,
      color: "#10B981",
    },

    {
      label: "Skills",
      score: skillBase,
      max: 10,
      color: "#F59E0B",
    },

    {
      label: "Job Keywords",
      score: keywordScore,
      max: 25,
      color: "#06B6D4",
    },

    {
      label: "Experience",
      score: experienceScore,
      max: 15,
      color: "#8B5CF6",
    },

    {
      label: "Structure",
      score: sectionScore,
      max: 10,
      color: "#EC4899",
    },

    {
      label: "ATS Formatting",
      score: formattingScore,
      max: 15,
      color: "#64748B",
    },
  ];

  return {
    score,

    sections,

    issues: issues.slice(
      0,
      20
    ),

    suggestions: [
      ...new Set(
        suggestions
      ),
    ].slice(0, 10),

    breakdown,

    formatting,

    keywords,

    meta: {
      engine:
        "deterministic-v1",

      jobSpecific:
        keywords.enabled,

      note:
        "This is a heuristic compatibility score, not a prediction of how a specific employer's ATS will rank a resume.",
    },
  };
};

export {
  analyzeATS,
  analyzeKeywords,
  analyzeFormatting,
  resumeToText,
  extractTerms,
};

export default analyzeATS;
