import type { Lang } from '../i18n';

export interface ParsedDateRange {
  startDate: Date;
  endDate: Date | null;
  isOngoing: boolean;
}

const MONTHS_EN: Record<string, number> = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
};

const MONTHS_ES: Record<string, number> = {
  enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
  julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11
};

const PRESENT_KEYWORDS = [
  'present', 'presente', 'current', 'actual', 'now', 'ahora',
  'in progress', 'en curso', 'cursando', 'ongoing',
];

function getMonthsMap(lang: Lang): Record<string, number> {
  return lang === 'es' ? MONTHS_ES : MONTHS_EN;
}

function cleanPart(s: string): string {
  // keep left side of pipes, remove parentheses, commas, double spaces
  return s
    .split('|')[0]
    .replace(/[(),]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parsePartialDate(str: string, months: Record<string, number>): Date {
  const cleaned = cleanPart(str).toLowerCase();

  // Extract year if present
  const yearMatch = cleaned.match(/\b(\d{4})\b/);
  const year = yearMatch ? parseInt(yearMatch[1], 10) : new Date().getFullYear();

  // Extract month if present
  let month: number | null = null;
  for (const token of cleaned.split(/\s+/)) {
    if (months[token] !== undefined) {
      month = months[token];
      break;
    }
  }

  // If month is missing (year-only), use mid-year to reduce bias (June)
  const finalMonth = month ?? 5;

  return new Date(year, finalMonth, 1);
}

export function parseDateRange(dateStr: string, lang: Lang): ParsedDateRange {
  const months = getMonthsMap(lang);

  // Split by range separators (hyphen/en-dash/em-dash)
  const parts = dateStr.split(/\s*[-–—]\s*/).map(p => p.trim());

  const startDate = parsePartialDate(parts[0], months);

  let endDate: Date | null = null;
  let isOngoing = false;

  if (parts.length > 1) {
    const endRaw = parts[1].toLowerCase();

    if (PRESENT_KEYWORDS.some(kw => endRaw.includes(kw))) {
      isOngoing = true;
      endDate = null;
    } else {
      endDate = parsePartialDate(parts[1], months);
    }
  } else {
    endDate = new Date(startDate);
  }

  return { startDate, endDate, isOngoing };
}
