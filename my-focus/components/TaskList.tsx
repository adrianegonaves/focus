import { Check, Target, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatMinutes, StudyTask, WEEKDAYS } from "@/lib/study-storege";
import { useTranslations } from "next-intl";

export function TaskList({
  tasks,
  activeId,
  onSelect,
  onToggle,
  onRemove,
}: {
  tasks: StudyTask[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const t = useTranslations("dashboard");
  const dayLabel = useTranslations("days");

  if (tasks.length === 0) {
    return (
      <Card className="p-10 text-center text-sm text-muted-foreground">
        {t("emptyList")}
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {WEEKDAYS.filter((d) => tasks.some((t) => t.day === d)).map((day) => (
        <section key={day}>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            {dayLabel(day)}
          </h3>
          <div className="space-y-3">
            {tasks
              .filter((t) => t.day === day)
              .map((task) => {
                const pct = Math.min(
                  100,
                  Math.round((task.minutesDone / task.minutesPlanned) * 100),
                );
                const active = task.id === activeId;
                return (
                  <Card
                    key={task.id}
                    className={`p-4 transition-colors ${
                      active ? "border-primary shadow-soft" : "border-border/60"
                    } ${task.done ? "opacity-60" : ""}`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{task.subject}</p>
                        {task.topic && (
                          <p className="truncate text-sm text-muted-foreground">{task.topic}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-secondary px-3 py-1 text-xs">
                          {formatMinutes(task.minutesDone)} / {formatMinutes(task.minutesPlanned)}
                        </span>
                        <Button
                          size="icon"
                          variant={active ? "default" : "secondary"}
                          aria-label={t("study")}
                          onClick={() => onSelect(task.id)}
                        >
                          <Target />
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          aria-label={t("markDone")}
                          onClick={() => onToggle(task.id)}
                        >
                          <Check />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={t("remove")}
                          onClick={() => onRemove(task.id)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </div>
                    <Progress value={task.done ? 100 : pct} className="mt-3 h-2" />
                  </Card>
                );
              })}
          </div>
        </section>
      ))}
    </div>
  );
}
