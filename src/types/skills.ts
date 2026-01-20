export interface SkillCategory {
  name: string;
  level: number; // 1-5 scale
  technologies: string[];
}

export interface SkillRadar {
  title: string;
  categories: SkillCategory[];
  color: string; // Primary fill color (rgba format)
}
