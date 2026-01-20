import type { SkillRadar } from "../types/skills";

export const engineeringSkills: SkillRadar = {
  title: "Engineering",
  color: "rgba(139, 92, 246, 0.6)", // purple
  categories: [
    {
      name: "Backend",
      level: 5,
      technologies: [".NET Core", "NestJS", "Node.js", "Express.js"],
    },
    {
      name: "DevOps",
      level: 4,
      technologies: [
        "Docker",
        "OpenShift",
        "Kubernetes",
        "Helm",
        "Jenkins",
        "TeamCity",
      ],
    },
    {
      name: "Databases",
      level: 4,
      technologies: ["PostgreSQL", "SQL Server", "MongoDB", "RabbitMQ"],
    },
    {
      name: "Cloud",
      level: 3,
      technologies: ["AWS ECS", "Azure basics"],
    },
    {
      name: "Frontend",
      level: 3,
      technologies: ["React", "Vue.js", "Angular", "HTML5", "CSS3"],
    },
    {
      name: "Languages",
      level: 4,
      technologies: [
        "C#",
        "TypeScript",
        "JavaScript",
        "Python",
        "Java",
        "SQL",
        "Rust",
      ],
    },
  ],
};

export const practicesSkills: SkillRadar = {
  title: "Practices",
  color: "rgba(236, 72, 153, 0.6)", // pink
  categories: [
    {
      name: "CI/CD",
      level: 5,
      technologies: ["Jenkins", "TeamCity", "Harness", "GitHub Actions"],
    },
    {
      name: "Automation",
      level: 5,
      technologies: [
        "PowerShell",
        "Bash",
        "Python scripts",
        "Headless browsers",
      ],
    },
    {
      name: "Architecture",
      level: 4,
      technologies: [
        "DDD",
        "Microservices",
        "Clean Architecture",
        "Event-Driven",
      ],
    },
    {
      name: "Testing",
      level: 4,
      technologies: ["TDD", "Unit Testing", "Integration Testing", "80% coverage"],
    },
    {
      name: "Security",
      level: 3,
      technologies: ["SonarQube", "BlackDuck", "Snyk", "OWASP basics"],
    },
    {
      name: "AI Tools",
      level: 4,
      technologies: ["Claude Code", "GitHub Copilot", "Cursor", "ChatGPT"],
    },
  ],
};
