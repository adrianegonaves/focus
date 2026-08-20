const KEY = "foco.tasks.v1";
export const WEEKDAYS = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo",
] as const;


export function formatMinutes(total: number) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return h > 0 ? `${h}h${m.toString().padStart(2, "0")}` : `${m}min`;
}

export type StudyTask = {
  id: string;
  subject: string;
  topic: string;
  minutesPlanned: number;
  minutesDone: number;
  day: string;
  done: boolean;
};

export function loadTasks(): StudyTask[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StudyTask[]) : [];
  } catch {
    return [];
  }
}