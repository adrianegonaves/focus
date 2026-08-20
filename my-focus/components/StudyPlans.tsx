import { useEffect, useMemo, useState } from "react";
import { ClipboardList, Plus, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useLocale, useTranslations } from "next-intl";
import { formatMinutes, WEEKDAYS } from "@/lib/study-storege";
import {
    createActivity,
    createBlock,
    createPlan,
    createTopic,
    interviewTemplate,
    loadPlans,
    savePlans,
    type StudyPlan,
} from "@/lib/plans-storage";

export function StudyPlans() {

    const t = useTranslations("dashboard");
    const dayLabel = useTranslations("days");
    const locale = useLocale() as "pt" | "en";
    const [plans, setPlans] = useState<StudyPlan[]>([]);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [hydrated, setHydrated] = useState(false);

    const [planTitle, setPlanTitle] = useState("");
    const [topicTitle, setTopicTitle] = useState("");
    const [blockTitle, setBlockTitle] = useState("");
    const [blockDay, setBlockDay] = useState<string>(WEEKDAYS[0]);
    const [blockMinutes, setBlockMinutes] = useState("90");
    const [blockFocus, setBlockFocus] = useState("");
    const [activityDrafts, setActivityDrafts] = useState<Record<string, string>>({});

    useEffect(() => {
        const stored = loadPlans();
        setPlans(stored);
        const savedId =
            typeof window !== "undefined" ? window.localStorage.getItem("foco.plans.current") : null;
        setCurrentId(
            savedId && stored.some((p) => p.id === savedId) ? savedId : (stored[0]?.id ?? null),
        );
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (hydrated) savePlans(plans);
    }, [plans, hydrated]);

    useEffect(() => {
        if (!hydrated || typeof window === "undefined") return;
        if (currentId) window.localStorage.setItem("foco.plans.current", currentId);
        else window.localStorage.removeItem("foco.plans.current");
    }, [currentId, hydrated]);

    const plan = plans.find((p) => p.id === currentId) ?? null;

    const update = (fn: (p: StudyPlan) => StudyPlan) =>
        setPlans((prev) => prev.map((p) => (p.id === currentId ? fn(p) : p)));

    const addPlan = (next: StudyPlan) => {
        setPlans((prev) => [...prev, next]);
        setCurrentId(next.id);
    };

    const totals = useMemo(() => {
        if (!plan) return { minutes: 0, topicsDone: 0, acts: 0, actsDone: 0 };
        const acts = plan.blocks.flatMap((b) => b.activities);
        return {
            minutes: plan.blocks.reduce((s, b) => s + b.minutes, 0),
            topicsDone: plan.topics.filter((x) => x.done).length,
            acts: acts.length,
            actsDone: acts.filter((a) => a.done).length,
        };
    }, [plan]);

    return (
        <Card className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h2 className="flex items-center gap-2 text-lg font-semibold">
                        <ClipboardList className="size-5 text-primary" />
                        {t("plansTitle")}
                    </h2>
                    <p className="mt-1 max-w-xl text-sm text-muted-foreground">{t("plansSubtitle")}</p>
                </div>
                <Button type="button" variant="secondary" onClick={() => addPlan(interviewTemplate(locale))}>
                    <Sparkles />
                    {t("useTemplate")}
                </Button>
            </div>

            <form
                className="mt-5 flex flex-wrap items-end gap-3"
                onSubmit={(e) => {
                    e.preventDefault();
                    if (!planTitle.trim()) return;
                    addPlan(createPlan(planTitle.trim()));
                    setPlanTitle("");
                }}
            >
                <div className="min-w-[220px] flex-1 space-y-2">
                    <Label htmlFor="plan-title">{t("newPlan")}</Label>
                    <Input
                        id="plan-title"
                        placeholder={t("newPlanPlaceholder")}
                        value={planTitle}
                        onChange={(e) => setPlanTitle(e.target.value)}
                    />
                </div>
                <Button type="submit" disabled={!planTitle.trim()}>
                    <Plus />
                    {t("createPlan")}
                </Button>
            </form>

            {plans.length > 0 && (
                <div className="mt-5 flex flex-wrap items-center gap-2">
                    {plans.map((p) => (
                        <Button
                            key={p.id}
                            type="button"
                            size="sm"
                            variant={p.id === currentId ? "default" : "secondary"}
                            onClick={() => setCurrentId(p.id)}
                        >
                            {p.title}
                        </Button>
                    ))}
                </div>
            )}

            {!plan ? (
                <p className="mt-6 rounded-lg border border-dashed border-border/70 p-8 text-center text-sm text-muted-foreground">
                    {t("plansEmpty")}
                </p>
            ) : (
                <div className="mt-6 space-y-8">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-2 text-xs">
                            <span className="rounded-full bg-secondary px-3 py-1">
                                {t("planWeeklyLoad")}: {formatMinutes(totals.minutes)}
                            </span>
                            <span className="rounded-full bg-secondary px-3 py-1">
                                {t("planTopics")}: {totals.topicsDone}/{plan.topics.length}
                            </span>
                            <span className="rounded-full bg-secondary px-3 py-1">
                                {t("planChecklist")}: {totals.actsDone}/{totals.acts}
                            </span>
                        </div>
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                                setPlans((prev) => {
                                    const next = prev.filter((p) => p.id !== plan.id);
                                    setCurrentId(next[0]?.id ?? null);
                                    return next;
                                });
                            }}
                        >
                            <Trash2 />
                            {t("deletePlan")}
                        </Button>
                    </div>
                    <Progress
                        value={totals.acts ? Math.round((totals.actsDone / totals.acts) * 100) : 0}
                        className="h-2"
                    />

                    {/* Topics */}
                    <section>
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                            {t("themes")}
                        </h3>
                        <form
                            className="mt-3 flex flex-wrap items-end gap-2"
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (!topicTitle.trim()) return;
                                update((p) => ({ ...p, topics: [...p.topics, createTopic(topicTitle.trim())] }));
                                setTopicTitle("");
                            }}
                        >
                            <Input
                                className="min-w-[220px] flex-1"
                                placeholder={t("themePlaceholder")}
                                value={topicTitle}
                                onChange={(e) => setTopicTitle(e.target.value)}
                            />
                            <Button type="submit" variant="secondary">
                                <Plus />
                                {t("addTheme")}
                            </Button>
                        </form>
                        <ul className="mt-3 space-y-2">
                            {plan.topics.map((topic) => (
                                <li
                                    key={topic.id}
                                    className="flex items-center gap-3 rounded-lg border border-border/60 px-3 py-2"
                                >
                                    <Checkbox
                                        checked={topic.done}
                                        onCheckedChange={() =>
                                            update((p) => ({
                                                ...p,
                                                topics: p.topics.map((x) =>
                                                    x.id === topic.id ? { ...x, done: !x.done } : x,
                                                ),
                                            }))
                                        }
                                    />
                                    <span className={`flex-1 text-sm ${topic.done ? "line-through opacity-60" : ""}`}>
                                        {topic.title}
                                    </span>
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                        aria-label={t("remove")}
                                        onClick={() =>
                                            update((p) => ({
                                                ...p,
                                                topics: p.topics.filter((x) => x.id !== topic.id),
                                            }))
                                        }
                                    >
                                        <Trash2 />
                                    </Button>
                                </li>
                            ))}
                            {plan.topics.length === 0 && (
                                <li className="text-sm text-muted-foreground">{t("noThemes")}</li>
                            )}
                        </ul>
                    </section>

                    {/* Schedule builder */}
                    <section>
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                            {t("scheduleBuilder")}
                        </h3>
                        <form
                            className="mt-3 grid gap-3 sm:grid-cols-2"
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (!blockTitle.trim()) return;
                                update((p) => ({
                                    ...p,
                                    blocks: [
                                        ...p.blocks,
                                        createBlock(
                                            blockDay,
                                            blockTitle.trim(),
                                            Number(blockMinutes) || 60,
                                            blockFocus.trim(),
                                        ),
                                    ],
                                }));
                                setBlockTitle("");
                                setBlockFocus("");
                            }}
                        >
                            <div className="space-y-2">
                                <Label>{t("weekday")}</Label>
                                <Select
                                    value={blockDay}
                                    onValueChange={(value) => {
                                        if (value !== null) setBlockDay(value);
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {WEEKDAYS.map((d) => (
                                            <SelectItem key={d} value={d}>
                                                {dayLabel(d)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="block-minutes">{t("minutes")}</Label>
                                <Input
                                    id="block-minutes"
                                    type="number"
                                    min={0}
                                    step={5}
                                    value={blockMinutes}
                                    onChange={(e) => setBlockMinutes(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="block-title">{t("blockTitle")}</Label>
                                <Input
                                    id="block-title"
                                    placeholder={t("blockTitlePlaceholder")}
                                    value={blockTitle}
                                    onChange={(e) => setBlockTitle(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="block-focus">{t("blockFocus")}</Label>
                                <Input
                                    id="block-focus"
                                    placeholder={t("blockFocusPlaceholder")}
                                    value={blockFocus}
                                    onChange={(e) => setBlockFocus(e.target.value)}
                                />
                            </div>
                            <Button type="submit" className="sm:col-span-2">
                                <Plus />
                                {t("addBlock")}
                            </Button>
                        </form>

                        <div className="mt-5 space-y-4">
                            {WEEKDAYS.filter((d) => plan.blocks.some((b) => b.day === d)).map((d) => (
                                <div key={d}>
                                    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
                                        {dayLabel(d)}
                                    </p>
                                    <div className="space-y-3">
                                        {plan.blocks
                                            .filter((b) => b.day === d)
                                            .map((block) => (
                                                <Card key={block.id} className="border-border/60 p-4">
                                                    <div className="flex flex-wrap items-start justify-between gap-2">
                                                        <div className="min-w-0">
                                                            <p className="font-semibold">{block.title}</p>
                                                            {block.focus && (
                                                                <p className="text-sm text-muted-foreground">{block.focus}</p>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="rounded-full bg-secondary px-3 py-1 text-xs">
                                                                {formatMinutes(block.minutes)}
                                                            </span>
                                                            <Button
                                                                type="button"
                                                                size="icon"
                                                                variant="ghost"
                                                                aria-label={t("remove")}
                                                                onClick={() =>
                                                                    update((p) => ({
                                                                        ...p,
                                                                        blocks: p.blocks.filter((x) => x.id !== block.id),
                                                                    }))
                                                                }
                                                            >
                                                                <Trash2 />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <ul className="mt-3 space-y-2">
                                                        {block.activities.map((act) => (
                                                            <li key={act.id} className="flex items-center gap-3">
                                                                <Checkbox
                                                                    checked={act.done}
                                                                    onCheckedChange={() =>
                                                                        update((p) => ({
                                                                            ...p,
                                                                            blocks: p.blocks.map((b) =>
                                                                                b.id === block.id
                                                                                    ? {
                                                                                        ...b,
                                                                                        activities: b.activities.map((a) =>
                                                                                            a.id === act.id ? { ...a, done: !a.done } : a,
                                                                                        ),
                                                                                    }
                                                                                    : b,
                                                                            ),
                                                                        }))
                                                                    }
                                                                />
                                                                <span
                                                                    className={`flex-1 text-sm ${act.done ? "line-through opacity-60" : ""}`}
                                                                >
                                                                    {act.text}
                                                                </span>
                                                                <Button
                                                                    type="button"
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    aria-label={t("remove")}
                                                                    onClick={() =>
                                                                        update((p) => ({
                                                                            ...p,
                                                                            blocks: p.blocks.map((b) =>
                                                                                b.id === block.id
                                                                                    ? {
                                                                                        ...b,
                                                                                        activities: b.activities.filter(
                                                                                            (a) => a.id !== act.id,
                                                                                        ),
                                                                                    }
                                                                                    : b,
                                                                            ),
                                                                        }))
                                                                    }
                                                                >
                                                                    <Trash2 />
                                                                </Button>
                                                            </li>
                                                        ))}
                                                    </ul>

                                                    <form
                                                        className="mt-3 flex gap-2"
                                                        onSubmit={(e) => {
                                                            e.preventDefault();
                                                            const text = (activityDrafts[block.id] ?? "").trim();
                                                            if (!text) return;
                                                            update((p) => ({
                                                                ...p,
                                                                blocks: p.blocks.map((b) =>
                                                                    b.id === block.id
                                                                        ? { ...b, activities: [...b.activities, createActivity(text)] }
                                                                        : b,
                                                                ),
                                                            }));
                                                            setActivityDrafts((prev) => ({ ...prev, [block.id]: "" }));
                                                        }}
                                                    >
                                                        <Input
                                                            placeholder={t("activityPlaceholder")}
                                                            value={activityDrafts[block.id] ?? ""}
                                                            onChange={(e) =>
                                                                setActivityDrafts((prev) => ({
                                                                    ...prev,
                                                                    [block.id]: e.target.value,
                                                                }))
                                                            }
                                                        />
                                                        <Button type="submit" size="sm" variant="secondary">
                                                            <Plus />
                                                            {t("addActivity")}
                                                        </Button>
                                                    </form>
                                                </Card>
                                            ))}
                                    </div>
                                </div>
                            ))}
                            {plan.blocks.length === 0 && (
                                <p className="text-sm text-muted-foreground">{t("noBlocks")}</p>
                            )}
                        </div>
                    </section>
                </div>
            )}
        </Card>
    );
}
