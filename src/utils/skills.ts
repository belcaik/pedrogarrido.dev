export type SkillCategory =
  | "languages"
  | "backend"
  | "frontend"
  | "databases"
  | "devops"
  | "tools"
  | "ai";

export interface FlatSkill {
  name: string;
  category: SkillCategory;
}
