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

export type ProfileExperience = ResolvedRawProfile["experience"][number] & {
  date: string;
  description: string[];
};

export type ProfileEducation = ResolvedRawProfile["education"][number] & {
  date: string;
};

export type ProfileProject = ResolvedRawProfile["projects"][number];

export type Profile = Omit<ResolvedRawProfile, "experience" | "education"> & {
  experience: ProfileExperience[];
  education: ProfileEducation[];
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
    })),
    education: profile.education.map((item) => ({
      ...item,
      date: formatDateRange(item.start, item.end, lang),
    })),
  };
}
