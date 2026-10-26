export interface SampleCase {
  id: string;
  name: string;
  role: string;
  level: string;
  expectedScoreRange: string;
  description: string;
  resume: string;
  jobDesc: string;
  keyMismatchNote: string;
}

export const SAMPLE_CASES: SampleCase[] = [
  {
    id: 'case-1-junior-fullstack',
    name: 'Alex Chen',
    role: 'Full Stack Engineer',
    level: 'Junior → Mid (2 yrs exp)',
    expectedScoreRange: '72% - 78%',
    description: 'Junior React & Node dev applying to Mid-Level Full Stack role requiring AWS, Docker & Next.js.',
    keyMismatchNote: 'Lacks explicit AWS ECS/Terraform and Next.js App Router experience; strong React/Node basics.',
    resume: `Alex Chen
San Francisco, CA • alex.chen@example.com • linkedin.com/in/alexchen-dev • github.com/alexchen-code

PROFESSIONAL SUMMARY
Passionate Full Stack Developer with 2+ years of hands-on experience building performant web applications using React, Node.js, Express, and PostgreSQL. Proven track record of improving page load speeds by 30% and building RESTful APIs used by 20,000+ monthly active users.

TECHNICAL SKILLS
• Languages: JavaScript (ES6+), TypeScript, HTML5, CSS3, SQL
• Frontend: React 18, Redux Toolkit, Tailwind CSS, Vite, Webpack
• Backend: Node.js, Express.js, RESTful API Design, JWT Authentication
• Databases: PostgreSQL, MongoDB, Redis
• Tools: Git, GitHub, Jest, Postman, Linux CLI

WORK EXPERIENCE
Junior Software Engineer | CloudScale Tech | Austin, TX
July 2024 - Present
• Designed and developed 14+ reusable React UI components with TypeScript and Tailwind CSS, increasing design system adoption across 3 engineering squads.
• Built and maintained backend microservices using Node.js, Express, and PostgreSQL, reducing endpoint response latency from 450ms to 180ms.
• Integrated Stripe payment checkout flow with webhook idempotency, handling $120K+ in monthly customer subscriptions with zero transaction failures.
• Implemented client-side caching with React Query and Redis, cutting redundant API queries by 42%.
• Collaborated in bi-weekly Agile sprints, participating in PR code reviews, daily standups, and retrospective meetings.

Frontend Intern | WebForge Media | Remote
Jan 2024 - June 2024
• Converted legacy jQuery marketing pages to modern React components, resulting in a 35% improvement in Google Core Web Vitals score.
• Authored comprehensive unit tests with Jest and React Testing Library, boosting code coverage from 52% to 84%.
• Optimized bundle size by 28% via dynamic code splitting and tree-shaking techniques in Vite.

PROJECTS
• DevCollab: Real-time collaborative code editor with live syntax highlighting and WebRTC video chat built with React, Socket.io, and Express.
• TaskPulse: Kanban project management web app featuring drag-and-drop task reordering, team invites, and PostgreSQL persistence.

EDUCATION
B.S. in Computer Science | University of Texas at Austin | Graduated Dec 2023`,
    jobDesc: `Mid-Level Full Stack Software Engineer
VentureLink Technologies — San Francisco, CA (Hybrid)

ABOUT THE ROLE:
We are seeking an ambitious Mid-Level Full Stack Engineer with 3+ years of professional experience to join our core product engineering team. You will architect, develop, and scale customer-facing web applications serving 500k+ global users.

RESPONSIBILITIES:
• Build responsive, high-performance web applications using Next.js (App Router), TypeScript, and Tailwind CSS.
• Design robust RESTful and GraphQL APIs using Node.js / NestJS with PostgreSQL and Prisma ORM.
• Containerize services using Docker and orchestrate deployments on AWS (ECS, S3, RDS, CloudFront) using Terraform CI/CD pipelines.
• Implement monitoring and observability using Datadog and Sentry.
• Participate in architectural design discussions, peer code reviews, and mentor junior apprentices.

REQUIRED QUALIFICATIONS:
• 3+ years of professional software engineering experience in production web applications.
• Strong proficiency in TypeScript, React, and modern Next.js.
• Demonstrated backend experience with Node.js, relational databases (PostgreSQL), and complex query optimization.
• Hands-on experience with cloud infrastructure, specifically AWS (ECS, RDS, S3) and Docker containerization.
• Familiarity with CI/CD automation pipelines (GitHub Actions) and Infrastructure as Code (Terraform).
• Excellent communication skills and passion for engineering craft.`
  },
  {
    id: 'case-2-data-analyst',
    name: 'Priya Sharma',
    role: 'Data Analyst → Analytics Engineer',
    level: 'Mid-Senior (4 yrs exp)',
    expectedScoreRange: '80% - 86%',
    description: 'Experienced BI Analyst applying to modern Analytics Engineer role requiring dbt, Snowflake & Python.',
    keyMismatchNote: 'Strong SQL and Tableau; needs deeper dbt data modeling and automated testing demonstrations.',
    resume: `Priya Sharma
Chicago, IL • priya.sharma@analytics.io • linkedin.com/in/priyasharma-data

SUMMARY
Results-oriented Data Analyst with 4 years of experience translating messy transactional datasets into executive dashboards and automated KPI reporting. Proficient in SQL, Python, Tableau, and Snowflake, saving 15+ weekly hours of manual reporting.

SKILLS
• Analytics & Modeling: Advanced SQL (Window functions, CTEs), Data Warehousing, Dimensional Modeling (Star Schema), ETL/ELT pipelines
• Tools & Platforms: Snowflake, Tableau, Power BI, Google BigQuery, dbt (foundational), Excel VBA
• Programming: Python (Pandas, NumPy, Matplotlib, Seaborn), Git
• Business Domains: Customer Lifetime Value (LTV), Churn Analysis, Cohort Retention, Marketing Attribution

EXPERIENCE
Senior Business Intelligence Analyst | RetailHub Inc. | Chicago, IL
March 2023 - Present
• Spearheaded migration of 40+ legacy on-prem SQL Server reports to Snowflake data warehouse, cutting query runtimes by 65%.
• Architected 12 comprehensive Tableau dashboards tracking $85M annual revenue, used daily by VP of Sales and Chief Marketing Officer.
• Developed automated Python scripts for data hygiene and anomaly detection across 1.2M daily sales records, reducing reporting discrepancies by 90%.
• Authored initial dbt models to transform raw staging tables into documented production marts for the finance department.

Data Analyst | Nielsen IQ | Chicago, IL
June 2021 - Feb 2023
• Extracted and analyzed consumer purchasing behavior across 50,000 retail SKUs using PostgreSQL and Python Pandas.
• Designed A/B test experiments for email promotional campaigns, delivering an 18% lift in repeat customer checkout rate.
• Conducted weekly stakeholder syncs to communicate quantitative trends and product recommendations to brand managers.

EDUCATION
B.S. in Statistics & Data Science | University of Illinois Urbana-Champaign (2021)`,
    jobDesc: `Senior Analytics Engineer
FinScale Insights — New York, NY (Remote)

ROLE OVERVIEW:
FinScale is seeking a Senior Analytics Engineer to bridge the gap between software engineering best practices and business analytics. You will own the analytical data modeling layer, transformation pipelines, and data governance across our Snowflake warehouse.

CORE RESPONSIBILITIES:
• Write production-grade, modular, and tested dbt models applying dimensional modeling best practices.
• Build and maintain robust data transformation pipelines connecting Fivetran, Snowflake, and reverse-ETL tools (Census/Hightouch).
• Collaborate with data engineers and product analysts to define standardized semantic metrics and business logic.
• Implement continuous integration (CI) tests and documentation using dbt-expectations, GitHub Actions, and SQLFluff linters.
• Optimize Snowflake compute warehouses, clustering keys, and cost-allocation tagging.

REQUIREMENTS:
• 3-5 years of experience in data analytics, data modeling, or analytics engineering.
• Mastery of SQL, including performance tuning, indexing, and complex analytical window functions.
• In-depth production experience with dbt (Data Build Tool) and Snowflake or BigQuery.
• Working knowledge of Python for scripting and data validation.
• Experience applying software engineering practices to analytics: version control (Git), code reviews, and automated CI tests.`
  },
  {
    id: 'case-3-ml-engineer',
    name: 'Marcus Vance',
    role: 'Senior Machine Learning Engineer',
    level: 'Senior (6 yrs exp)',
    expectedScoreRange: '88% - 94%',
    description: 'Senior ML practitioner applying to Lead Generative AI / LLM Systems Engineer role.',
    keyMismatchNote: 'Extremely strong classical ML & deep learning; highly competitive match for LLM platform infrastructure.',
    resume: `Marcus Vance, M.S.
Seattle, WA • marcus.vance@mlengineer.ai • github.com/marcus-vance • linkedin.com/in/marcus-vance

PROFESSIONAL SUMMARY
Senior Machine Learning Engineer with 6 years of experience productionizing deep learning, NLP, and distributed LLM fine-tuning pipelines. Built real-time inference systems serving 4,000 QPS with sub-50ms p99 latency on Triton and vLLM.

CORE COMPETENCIES
• Generative AI & NLP: Transformer architectures, LoRA/QLoRA fine-tuning, RAG pipelines, LangChain, LlamaIndex, Vector DBs (Milvus, Pinecone)
• Frameworks: PyTorch, Hugging Face Transformers, DeepSpeed, Ray, ONNX Runtime, TensorRT-LLM
• MLOps & Infrastructure: Kubernetes (K8s), Docker, Kubeflow, MLflow, AWS SageMaker, GCP Vertex AI, Triton Inference Server
• Languages: Python (Expert), C++, CUDA (intermediate), SQL

WORK EXPERIENCE
Senior Machine Learning Engineer | OmniVision AI | Seattle, WA
Jan 2023 - Present
• Led the engineering of an enterprise multimodal RAG search engine combining embedding retrieval and quantized LLM generation, improving query answer relevance by 43%.
• Optimized model serving infrastructure with vLLM and TensorRT-LLM on AWS EKS with GPU node autoscaling, slashing inference compute costs by $180,000 annually.
• Designed synthetic data generation and automated evaluation benchmarks (LLM-as-a-judge) to monitor hallucinations across 2M monthly prompts.
• Fine-tuned 8B and 70B parameter open-weight models using QLoRA and DeepSpeed ZeRO-3 on custom domain datasets.

Machine Learning Engineer | Apex Signal Systems | San Jose, CA
Aug 2019 - Dec 2022
• Developed and deployed BERT-based semantic search and intent classification microservices handling 2,500 requests per second.
• Built end-to-end continuous retraining pipelines using Kubeflow and Feast feature store on AWS.
• Reduced inference latency by 60% through model quantization (INT8/FP16) and ONNX graph optimization.

EDUCATION
M.S. in Computer Science (Machine Learning Specialization) | University of Washington (2019)
B.S. in Electrical Engineering & CS | UC Berkeley (2017)`,
    jobDesc: `Lead AI / LLM Systems Engineer
Anthrosphere Labs — San Francisco, CA / Seattle, WA (Hybrid)

ROLE DESCRIPTION:
Anthrosphere Labs is building foundational agentic reasoning systems. We are looking for a Lead AI Systems Engineer to architect high-throughput LLM serving infrastructure, custom fine-tuning workflows, and high-performance vector retrieval pipelines.

RESPONSIBILITIES:
• Architect, deploy, and benchmark distributed LLM inference clusters using vLLM, TensorRT-LLM, or Triton on Kubernetes.
• Build robust Retrieval-Augmented Generation (RAG) architectures with hybrid dense/sparse search and re-ranking.
• Implement scalable fine-tuning pipelines (LoRA, DPO, RLHF) across multi-GPU clusters using PyTorch, Ray, and DeepSpeed.
• Build automated evaluation pipelines to detect hallucinations, toxicity, and model drift in real time.
• Partner with product engineers to define agentic tool-use protocols and structured JSON generation pipelines.

REQUIREMENTS:
• 5+ years of software/ML engineering experience, with 2+ years dedicated to LLMs, Transformers, and modern NLP.
• Expert mastery of PyTorch, Hugging Face ecosystem, and Python.
• Production experience with low-latency GPU serving engines (vLLM, TensorRT, Triton) on Kubernetes.
• Deep understanding of RAG architectures, embeddings, and vector databases.
• Experience mentoring engineers and leading technical architecture reviews.`
  },
  {
    id: 'case-4-career-changer',
    name: 'Sarah Jenkins',
    role: 'Marketing Operations → Associate Product Manager',
    level: 'Career Switcher (5 yrs non-eng exp)',
    expectedScoreRange: '64% - 71%',
    description: 'Marketing operations professional pivoting into Tech Product Management; strong transferrable skills.',
    keyMismatchNote: 'Strong stakeholder management & metrics; needs more explicit technical specifications, agile sprint ownership & user research.',
    resume: `Sarah Jenkins
Denver, CO • sarah.jenkins@productpivot.com • linkedin.com/in/sarahjenkins-co

PROFESSIONAL SUMMARY
Dynamic Growth & Operations Lead transitioning into Product Management. 5 years of experience leading cross-functional teams, analyzing customer funnels, and launching conversion-optimized digital campaigns that drove $3.2M in pipeline revenue. Proven capability in agile prioritization, user feedback synthesis, and roadmap planning.

KEY SKILLS
• Product & Strategy: Roadmap Prioritization, User Persona Mapping, Customer Journey Mapping, User Acceptance Testing (UAT)
• Analytics & Testing: A/B Testing (Optimizely), Google Analytics 4, Mixpanel, SQL (Basic querying), Hotjar heatmaps
• Collaboration & Tools: Jira, Confluence, Figma (Wireframing), Slack, Linear, Asana
• Core Competencies: Stakeholder Alignment, Data-Driven Decision Making, Product Lifecycle, User Empathy

EXPERIENCE
Growth Marketing & Operations Lead | Elevate SaaS | Denver, CO
Feb 2022 - Present
• Collaborated directly with Engineering and Product managers to define functional requirements for onboarding redesign, increasing trial-to-paid conversion from 4.1% to 6.8%.
• Analyzed product drop-off points using Mixpanel and session recordings, synthesizing qualitative insights into 8 high-priority Jira feature requests.
• Championed weekly cross-functional sprint planning meetings across marketing, sales, and customer success teams.
• Managed a quarterly experimentation budget of $250,000, achieving a 3.4x ROI across organic and paid customer acquisition channels.

Marketing Specialist | Peak Interactive | Boulder, CO
June 2019 - Jan 2022
• Managed end-to-end launch of 5 digital client portals, gathering customer requirements and writing clear scope documentation.
• Ran continuous multi-variant landing page experiments that improved qualified lead generation by 44%.
• Conducted 30+ 1-on-1 customer discovery interviews to uncover pain points and feature requests.

CERTIFICATIONS & PROJECTS
• Certified Scrum Product Owner (CSPO) — Scrum Alliance (2024)
• Product School: Product Analytics Micro-Certification
• Capstone Project: Spec'd and wireframed a mobile habit-tracker app in Figma with full user stories and acceptance criteria.

EDUCATION
B.A. in Communications & Media Studies | University of Colorado Boulder`,
    jobDesc: `Associate Product Manager (APM)
CloudFlow Technologies — Denver, CO (Hybrid)

ABOUT THE ROLE:
CloudFlow is looking for a collaborative Associate Product Manager to join our Growth & Monetization product team. You will work side-by-side with engineers, designers, and data scientists to build intuitive workflows that delight users.

RESPONSIBILITIES:
• Write clear, concise Product Requirement Documents (PRDs), user stories, and acceptance criteria.
• Partner with UX designers in Figma to prototype intuitive user flows and conduct usability testing sessions.
• Own sprint backlogs in Jira, leading daily standups, backlog grooming, and sprint retrospectives with engineering.
• Define quantitative success metrics (North Star KPI, engagement, churn) and monitor dashboard analytics in Mixpanel.
• Synthesize qualitative customer feedback and quantitative analytics to influence the product roadmap.

REQUIREMENTS:
• 1-3 years of experience in product management, marketing operations, consulting, or software engineering.
• Passion for customer empathy and solving complex workflow problems with clean software UX.
• Familiarity with Agile/Scrum development methodologies and tools (Jira, Linear, Confluence, Figma).
• Strong analytical mindset: ability to analyze metrics, build hypotheses, and evaluate experiment outcomes.
• Exceptional written and verbal communication skills across technical and executive audiences.`
  },
  {
    id: 'case-5-fresh-graduate',
    name: 'David Patel',
    role: 'Recent CS Graduate (2026)',
    level: 'Entry-Level / College Grad',
    expectedScoreRange: '58% - 66%',
    description: 'New Computer Science grad with academic projects and 1 internship applying to competitive SWE role.',
    keyMismatchNote: 'Lacks multi-year enterprise production track record; needs stronger emphasis on quantified outcomes in project bullets.',
    resume: `David Patel
Boston, MA • david.patel@alumni.edu • github.com/david-patel26 • linkedin.com/in/davidpatel-cs

EDUCATION
B.S. in Computer Science (Minor in Data Science) | Northeastern University | Graduated May 2026
GPA: 3.82/4.00 · Dean's List (All Semesters)
Relevant Coursework: Data Structures & Algorithms, Object-Oriented Design, Operating Systems, Database Management, Web Development, Computer Networks

TECHNICAL SKILLS
• Programming: Python, Java, TypeScript, C, SQL
• Web Technologies: React, Node.js, Express, HTML/CSS, REST APIs
• Database & Cloud: PostgreSQL, MongoDB, Docker, Git, Linux, AWS (EC2/S3 basics)
• Concepts: Agile/Scrum, CI/CD, Unit Testing (JUnit, Jest)

EXPERIENCE
Software Engineering Intern | Boston Fintech Solutions | Boston, MA
June 2025 - August 2025
• Developed internal REST API endpoints in Java Spring Boot to automate client identity verification, reducing verification delays by 25%.
• Wrote unit and integration test suites with JUnit and Mockito, increasing module test coverage from 60% to 85%.
• Participated in daily Agile standups, code reviews with senior engineers, and sprint planning sessions.

Undergraduate Teaching Assistant — Data Structures | Northeastern CS Dept
Jan 2025 - May 2025
• Held weekly office hours and lab sessions for 80+ students, explaining trees, graphs, dynamic programming, and complexity analysis.

FEATURED PROJECTS
• CampusBite (Hackathon 1st Place): Full-stack food ordering portal for university students using React, Node.js, Express, and MongoDB. Implemented real-time order tracking with WebSockets.
• CloudStorage Engine: Distributed file storage system written in Python supporting file chunking, replication across 3 nodes, and metadata persistence in SQLite.
• Algorithmic Visualizer: Interactive web tool built with React and HTML5 Canvas visualizing A*, Dijkstra, and Sorting algorithms with configurable execution speeds.`,
    jobDesc: `Associate Software Engineer (University Graduate 2026)
HubScale Systems — Boston, MA

THE OPPORTUNITY:
HubScale is seeking enthusiastic, high-aptitude recent college graduates to join our Engineering Development Program. You will write production software from day one with mentorship from staff engineers.

RESPONSIBILITIES:
• Write clean, testable, and maintainable code in Python, TypeScript/React, or Java.
• Build and support resilient RESTful microservices and database schemas.
• Write comprehensive automated unit and integration tests.
• Collaborate with cross-functional teams across product, QA, and DevOps to deliver weekly features.
• Continuously learn modern cloud paradigms, distributed systems, and CI/CD pipelines.

QUALIFICATIONS:
• B.S. or M.S. in Computer Science, Software Engineering, or related STEM field (Graduation: 2025 or 2026).
• Strong foundational grasp of data structures, algorithms, and object-oriented design.
• Practical coding proficiency in at least one modern language (Python, Java, TypeScript/JavaScript, C++).
• Experience with relational databases and web frameworks through internships, coursework, or open-source projects.
• Demonstrated curiosity, high learning velocity, and proactive problem-solving attitude.`
  }
];
