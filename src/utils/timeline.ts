import type { Lang } from '../i18n';
import { parseDateRange, type ParsedDateRange } from './dateParser';

// Input types (matching JSON structure)
export interface Job {
  company: string;
  via?: string;
  position: string;
  date: string;
  location: string;
  description: string[];
  tech: string[];
}

export interface School {
  institution: string;
  degree: string;
  date: string;
  honors?: string;
  status?: string;
}

// Unified timeline entry
export interface TimelineEntry {
  id: string;
  type: 'position' | 'degree';
  title: string;
  subtitle: string;
  via?: string;
  dateString: string;
  parsedDates: ParsedDateRange;
  location?: string;
  description?: string[];
  tech?: string[];
  honors?: string;
  status?: string;
}

export function transformJobToEntry(job: Job, index: number, lang: Lang): TimelineEntry {
  return {
    id: `position-${index}`,
    type: 'position',
    title: job.position,
    subtitle: job.company,
    via: job.via,
    dateString: job.date,
    parsedDates: parseDateRange(job.date, lang),
    location: job.location,
    description: job.description,
    tech: job.tech,
  };
}

export function transformSchoolToEntry(school: School, index: number, lang: Lang): TimelineEntry {
  return {
    id: `degree-${index}`,
    type: 'degree',
    title: school.degree,
    subtitle: school.institution,
    dateString: school.date,
    parsedDates: parseDateRange(school.date, lang),
    honors: school.honors,
    status: school.status,
  };
}

export function sortTimelineEntries(entries: TimelineEntry[]): TimelineEntry[] {
  return [...entries].sort((a, b) => {
    // Primary: startDate DESC (most recent first)
    const dateCompare = b.parsedDates.startDate.getTime() - a.parsedDates.startDate.getTime();

    if (dateCompare !== 0) return dateCompare;

    // Secondary: ongoing entries first on tie
    if (a.parsedDates.isOngoing && !b.parsedDates.isOngoing) return -1;
    if (!a.parsedDates.isOngoing && b.parsedDates.isOngoing) return 1;

    // Tertiary: if both have endDate, later endDate first
    if (a.parsedDates.endDate && b.parsedDates.endDate) {
      return b.parsedDates.endDate.getTime() - a.parsedDates.endDate.getTime();
    }

    return 0;
  });
}

export interface TimelineSlot {
  row: number;
  left?: TimelineEntry;
  right?: TimelineEntry;
}

export interface TimelineContext {
  allEntries: TimelineEntry[];
  slots: TimelineSlot[];
  totalRows: number;
}

function rangesOverlap(a: ParsedDateRange, b: ParsedDateRange): boolean {
  // Treat ongoing entries as having an end date of "infinity"
  const aEnd = a.endDate ?? new Date(8640000000000000);
  const bEnd = b.endDate ?? new Date(8640000000000000);

  // Ranges overlap if: startA <= endB AND startB <= endA
  return a.startDate <= bEnd && b.startDate <= aEnd;
}

export function createTimelineContext(jobs: Job[], schools: School[], lang: Lang): TimelineContext {
  const positionEntries = jobs.map((job, i) => transformJobToEntry(job, i, lang));
  const degreeEntries = schools.map((school, i) => transformSchoolToEntry(school, i, lang));

  // Sort all entries by startDate DESC (newest first)
  const allEntries = sortTimelineEntries([...positionEntries, ...degreeEntries]);

  // Sort each column independently
  const leftEntries = sortTimelineEntries([...degreeEntries]);  // degrees
  const rightEntries = sortTimelineEntries([...positionEntries]); // positions

  // Create slots by interleaving based on startDate
  const slots: TimelineSlot[] = [];
  let leftIdx = 0;
  let rightIdx = 0;
  let currentRow = 1;

  while (leftIdx < leftEntries.length || rightIdx < rightEntries.length) {
    const leftEntry = leftEntries[leftIdx];
    const rightEntry = rightEntries[rightIdx];

    const slot: TimelineSlot = { row: currentRow };

    if (!leftEntry) {
      // Only right entries remaining
      slot.right = rightEntry;
      rightIdx++;
    } else if (!rightEntry) {
      // Only left entries remaining
      slot.left = leftEntry;
      leftIdx++;
    } else {
      // Both columns have entries - check if date ranges overlap
      const areConcurrent = rangesOverlap(
        leftEntry.parsedDates,
        rightEntry.parsedDates
      );

      if (areConcurrent) {
        // Ranges overlap - place both in same slot
        slot.left = leftEntry;
        slot.right = rightEntry;
        leftIdx++;
        rightIdx++;
      } else {
        // No overlap - place the more recent one alone
        const leftStart = leftEntry.parsedDates.startDate.getTime();
        const rightStart = rightEntry.parsedDates.startDate.getTime();

        if (leftStart > rightStart) {
          slot.left = leftEntry;
          leftIdx++;
        } else {
          slot.right = rightEntry;
          rightIdx++;
        }
      }
    }

    slots.push(slot);
    currentRow++;
  }

  return {
    allEntries,
    slots,
    totalRows: slots.length,
  };
}
