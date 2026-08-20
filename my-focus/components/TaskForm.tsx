import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { WEEKDAYS, type StudyTask } from "@/lib/study-storege";

export function TaskForm({ onAdd }: { onAdd: (task: StudyTask) => void }) {
  const t = useTranslations("dashboard");
  const dayLabel = useTranslations("days");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [minutes, setMinutes] = useState("50");
  const [day, setDay] = useState<string>(WEEKDAYS[0]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;
    onAdd({
      id: crypto.randomUUID(),
      subject: subject.trim(),
      topic: topic.trim(),
      minutesPlanned: Math.max(5, Number(minutes) || 0),
      minutesDone: 0,
      day,
      done: false,
    });
    setSubject("");
    setTopic("");
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold">{t("formTitle")}</h2>
      <form onSubmit={submit} className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="subject">{t("subject")}</Label>
          <Input
            id="subject"
            placeholder={t("subjectPlaceholder")}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="topic">{t("topic")}</Label>
          <Input
            id="topic"
            placeholder={t("topicPlaceholder")}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="minutes">{t("minutes")}</Label>
          <Input
            id="minutes"
            type="number"
            min={5}
            step={5}
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>{t("weekday")}</Label>
          <Select value={day} onValueChange={(value) =>{
            if(value !== null) setDay(value)
          }}>
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
        <Button type="submit" className="sm:col-span-2">
          <Plus />
          {t("addTask")}
        </Button>
      </form>
    </Card>
  );
}
