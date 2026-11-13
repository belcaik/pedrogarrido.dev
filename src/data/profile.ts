import rawProfile from "./profile.json";
import type { Lang } from "../i18n";

type LocalizedText = Record<Lang, string>;

type ResolveLocalized<T> = T extends LocalizedText
  ? string
  : T extends Array<infer Item>
    ? ResolveLocalized<Item>[]
    : T extends object
      ? { [Key in keyof T]: ResolveLocalized<T[Key]> }
      : T;

type RawProfile = typeof rawProfile;
type ResolvedRawProfile = ResolveLocalized<RawProfile>;

export interface DatePoint {
  year: number;
  month?: number;
}

export interface DiagramNode {
  type: "node";
  state?: "before" | "after";
  tag?: string;
  title: string;
  sub?: string;
  figure?: string;
}

export interface DiagramLink {
  type: "link";
  label?: string;
  both?: boolean;
}

export interface DiagramGroup {
  type: "group";
  nodes: DiagramNode[];
}

export interface DiagramBoundary {
  type: "boundary";
  tag: string;
  items: (DiagramNode | DiagramLink)[];
}

export type DiagramItem = DiagramNode | DiagramLink | DiagramGroup | DiagramBoundary;

export interface Diagram {
  summary: string;
  title?: string;
  caption?: string;
  width?: "full" | "half";
  compact?: boolean;
  items: DiagramItem[];
}

export type ProfileExperience = Omit<
  ResolvedRawProfile["experience"][number],
  "tagline" | "intro" | "diagrams"
> & {
  date: string;
  description: string[];
  tagline?: string;
  intro?: string;
  diagrams: Diagram[];
};

export interface ProfileSystem {
  id: string;
  company: string;
  tagline?: string;
  years: string;
  roles: ProfileExperience[];
}

export type ProfileEducation = ResolvedRawProfile["education"][number] & {
  date: string;
};

export type ProfileProject = Omit<ResolvedRawProfile["projects"][number], "diagram"> & {
  diagram?: Diagram;
};

export type Profile = Omit<ResolvedRawProfile, "experience" | "education" | "projects"> & {
  experience: ProfileExperience[];
  education: ProfileEducation[];
  projects: ProfileProject[];
};

function isLocalizedText(value: unknown): value is LocalizedText {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;

  const keys = Object.keys(value);
  return keys.length === 2 && keys.includes("en") && keys.includes("es");
}

function resolveLocalized<T>(value: T, lang: Lang): ResolveLocalized<T> {
  if (isLocalizedText(value)) return value[lang] as ResolveLocalized<T>;

  if (Array.isArray(value)) {
    return value.map((item) => resolveLocalized(item, lang)) as ResolveLocalized<T>;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, resolveLocalized(item, lang)]),
    ) as ResolveLocalized<T>;
  }

  return value as ResolveLocalized<T>;
}

const monthNames: Record<Lang, string[]> = {
  en: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ],
  es: [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ],
};

function formatDate(point: DatePoint, lang: Lang): string {
  return point.month ? `${monthNames[lang][point.month - 1]} ${point.year}` : String(point.year);
}

export function formatDateRange(start: DatePoint, end: DatePoint | null, lang: Lang): string {
  if (end && !start.month && !end.month && start.year === end.year) {
    return String(start.year);
  }

  const endLabel = end ? formatDate(end, lang) : lang === "es" ? "Presente" : "Present";
  return `${formatDate(start, lang)} - ${endLabel}`;
}

export function getProfile(lang: Lang): Profile {
  const profile = resolveLocalized(rawProfile, lang);

  return {
    ...profile,
    experience: profile.experience.map((item) => ({
      ...item,
      date: formatDateRange(item.start, item.end, lang),
      description: item.achievements.filter((achievement) => achievement.site).map(({ text }) => text),
      // Diagram shape is guaranteed by profile.json; TypeScript cannot infer the tagged union from JSON.
      diagrams: item.diagrams as unknown as Diagram[],
    })),
    education: profile.education.map((item) => ({
      ...item,
      date: formatDateRange(item.start, item.end, lang),
    })),
    projects: profile.projects as unknown as ProfileProject[],
  };
}

/**
 * Groups experience entries by company, in profile order. The first entry of
 * each group is the lead role; later entries are earlier roles at the same company.
 */
export function getSystems(lang: Lang): ProfileSystem[] {
  const systems: ProfileSystem[] = [];

  for (const role of getProfile(lang).experience) {
    const existing = systems.find((system) => system.company === role.company);
    if (existing) {
      existing.roles.push(role);
    } else {
      systems.push({
        id: slugify(role.company),
        company: role.company,
        years: "",
        roles: [role],
      });
    }
  }

  return systems.map((system) => ({
    ...system,
    tagline: system.roles[0].tagline,
    years: yearRange(system.roles, lang),
  }));
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function yearRange(roles: ProfileExperience[], lang: Lang): string {
  const start = Math.min(...roles.map((role) => role.start.year));
  const ends = roles.map((role) => role.end);
  const end = ends.some((point) => point === null)
    ? lang === "es" ? "Presente" : "Present"
    : Math.max(...ends.map((point) => point?.year ?? 0));

  return `${start} - ${end}`;
}

/** Résumé PDF for a page language. The file is generated by `pnpm cv`. */
export function getResumeLink(lang: Lang): { href: string; download: string } {
  return {
    href: lang === "es" ? "/assets/cv/public_cv_es.pdf" : "/assets/cv/public_cv.pdf",
    download: `cv_pedro_garrido_dev_${lang}.pdf`,
  };
}
