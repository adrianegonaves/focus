"use client";
import { PreferencesBar } from "@/components/PreferencesBar";
import { StudyPlans } from "@/components/StudyPlans";
import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import { Card } from "@/components/ui/card";
import { formatMinutes, loadTasks, StudyTask } from "@/lib/study-storege";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

export default function Home() {

  const t = useTranslations("dashboard");
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    setTasks(loadTasks());

  }, []);

  const totals = useMemo(() => {
    const planned = tasks.reduce((s, t) => s + t.minutesPlanned, 0);
    const done = tasks.reduce((s, t) => s + t.minutesDone, 0);
    return { planned, done, completed: tasks.filter((t) => t.done).length };
  }, [tasks]);


  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-background font-sans text-foreground">
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-16">
        <header className="mb-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <p className="text-sm uppercase tracking-[0.3em] text-primary">{t("brand")}</p>
            <div className="flex items-center gap-2">
              <PreferencesBar />
            </div>
          </div>

          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">{t("heroTitle")}</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">{t("heroSubtitle")}</p>
        </header>


        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          {[
            { label: t("statPlanned"), value: formatMinutes(totals.planned) },
            { label: t("statDone"), value: formatMinutes(totals.done) },
            { label: t("statSessions"), value: `${totals.completed}/${tasks.length}` },
          ].map((s) => (
            <Card key={s.label} className="p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{s.label}</p>
              <p className="mt-2 text-2xl font-semibold text-primary">{s.value}</p>
            </Card>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="space-y-8">
            <StudyPlans />
            <TaskForm onAdd={(task) => setTasks((prev) => [...prev, task])} />
            <section>
              <h2 className="mb-4 text-lg font-semibold">{t("scheduleTitle")}</h2>
              <TaskList
                tasks={tasks}
                activeId={activeId}
                onSelect={(id) => setActiveId((cur) => (cur === id ? null : id))}
                onToggle={(id) =>
                  setTasks((prev) =>
                    prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
                  )
                }
                onRemove={(id) => {
                  setTasks((prev) => prev.filter((t) => t.id !== id));
                  setActiveId((cur) => (cur === id ? null : cur));
                }}
              />
            </section>
          </div>

          <div className="lg:sticky lg:top-8 lg:self-start">

          </div>
        </div>


      </main>
    </div>
  );
}

