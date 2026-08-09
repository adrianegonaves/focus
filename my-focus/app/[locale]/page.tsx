"use client";
import { PreferencesBar } from "@/components/PreferencesBar";
import { StudyPlans } from "@/components/StudyPlans";
import { useTranslations } from "next-intl";

export default function Home() {

  const t = useTranslations("dashboard");

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

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="space-y-8">
            <StudyPlans />
            <section>
              <h2 className="mb-4 text-lg font-semibold">{t("scheduleTitle")}</h2>

            </section>
          </div>

          <div className="lg:sticky lg:top-8 lg:self-start">

          </div>
        </div>
      </main>
    </div>
  );
}

