"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";

export function PreferencesBar() {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const { theme, setTheme } = useTheme()

  const currentLocale = pathname.startsWith("/en")
    ? "en"
    : pathname.startsWith("/pt")
    ? "pt"
    : "en";

  const changeLanguage = (newLocale: string) => {
    const newPath = pathname.replace(/^\/(pt|en)/, `/${newLocale}`);
    router.push(newPath);
  };

  const LANGS = [
    { value: "pt", label: "PT" },
    { value: "en", label: "EN" },
  ];

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center gap-1 rounded-full border border-border bg-card p-1"
        role="group"
        aria-label={t("language")}
      >
        {LANGS.map((l) => (
          <Button
            key={l.value}
            size="sm"
            variant={currentLocale === l.value ? "default" : "ghost"}
            className="h-7 rounded-full px-3 text-xs"
            onClick={() => changeLanguage(l.value)}
            aria-pressed={currentLocale === l.value}
          >
            {l.label}
          </Button>
        ))}
      </div>
      <Button
        size="icon"
        variant="secondary"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label={theme === "dark" ? t("lightTheme") : t("darkTheme")}
        title={theme === "dark" ? t("lightTheme") : t("darkTheme")}
      >
        {theme === "dark" ? <Sun /> : <Moon />}
      </Button>
    </div>
  );
}
