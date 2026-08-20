export type PlanTopic = {
  id: string;
  title: string;
  notes: string;
  done: boolean;
};

export type PlanActivity = {
  id: string;
  text: string;
  done: boolean;
};

export type PlanBlock = {
  id: string;
  day: string;
  title: string;
  minutes: number;
  focus: string;
  activities: PlanActivity[];
};

export type StudyPlan = {
  id: string;
  title: string;
  description: string;
  topics: PlanTopic[];
  blocks: PlanBlock[];
};

const KEY = "foco.plans.v1";

export function loadPlans(): StudyPlan[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StudyPlan[]) : [];
  } catch {
    return [];
  }
}

export function savePlans(plans: StudyPlan[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(plans));
}

const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

export function createPlan(title: string, description = ""): StudyPlan {
  return { id: uid(), title, description, topics: [], blocks: [] };
}

export function createTopic(title: string, notes = ""): PlanTopic {
  return { id: uid(), title, notes, done: false };
}

export function createActivity(text: string): PlanActivity {
  return { id: uid(), text, done: false };
}

export function createBlock(day: string, title: string, minutes: number, focus = ""): PlanBlock {
  return { id: uid(), day, title, minutes: Math.max(5, minutes || 0), focus, activities: [] };
}

/** Ready-made interview-prep plan (pt / en labels handled by caller). */
export function interviewTemplate(lang: "pt" | "en"): StudyPlan {
  const pt = lang === "pt";
  const plan = createPlan(
    pt ? "Entrevistas de emprego (Dev)" : "Job interviews (Dev)",
    pt
      ? "Cronograma semanal para preparação técnica e comportamental."
      : "Weekly schedule for technical and behavioral prep.",
  );

  plan.topics = (
    pt
      ? [
          "Estruturas de dados (Arrays, Hash, Listas, Árvores/Grafos)",
          "Padrões de algoritmos (Two Pointers, Sliding Window, Binary Search)",
          "Engenharia de software (SOLID, Clean Code)",
          "Banco de dados (ACID, indexação, SQL vs NoSQL)",
          "System Design (Load Balancer, Cache, Filas, Escalabilidade)",
          "Web & Redes (REST, HTTP, JWT/OAuth2, Cache)",
          "Histórias comportamentais (Método STAR)",
        ]
      : [
          "Data structures (Arrays, Hash, Lists, Trees/Graphs)",
          "Algorithm patterns (Two Pointers, Sliding Window, Binary Search)",
          "Software engineering (SOLID, Clean Code)",
          "Databases (ACID, indexing, SQL vs NoSQL)",
          "System Design (Load Balancer, Cache, Queues, Scaling)",
          "Web & Networking (REST, HTTP, JWT/OAuth2, Cache)",
          "Behavioral stories (STAR method)",
        ]
  ).map((title) => createTopic(title));

  const rows: Array<[string, string, number, string, string[]]> = pt
    ? [
        [
          "Segunda",
          "Fundamentos & Estruturas de Dados",
          90,
          "Base teórica para resolver problemas com eficiência.",
          [
            "30 min: revisar 1 estrutura de dados da semana",
            "1h: resolver 2 problemas Easy (LeetCode/HackerRank)",
            "Meta: entender custo de tempo e memória das operações",
          ],
        ],
        [
          "Terça",
          "Padrões de Algoritmos (Live Coding)",
          120,
          "Identificar e aplicar padrões de resolução.",
          [
            "30 min: estudar um padrão (Two Pointers, Sliding Window...)",
            "1h30: resolver 2 problemas (1 Easy + 1 Medium) do padrão",
            "Travou 20 min? Leia a dica, feche a tela e implemente sozinho",
          ],
        ],
        [
          "Quarta",
          "Engenharia de Software & Linguagem",
          90,
          "Perguntas teóricas e testes conceituais.",
          [
            "45 min: tópico da semana (SOLID, BD, linguagem, web/redes)",
            "45 min: explicar em voz alta (técnica Feynman)",
          ],
        ],
        [
          "Quinta",
          "System Design",
          90,
          "Arquitetura e visão global de produto.",
          [
            "45 min: sistemas distribuídos (LB, filas, Redis, escalonamento)",
            "45 min: analisar um sistema famoso (Twitter, encurtador de URL)",
          ],
        ],
        [
          "Sexta",
          "Soft Skills & Revisão",
          60,
          "Etapa HR / cultural fit e comunicação.",
          [
            "30 min: escrever respostas no Método STAR",
            "30 min: revisar algoritmos que errou na semana",
          ],
        ],
        [
          "Sábado",
          "Simulado Sob Pressão (Mock Interview)",
          120,
          "Vencer o nervosismo e simular a entrevista real.",
          [
            "1h: mock interview (Pramp, Interviewing.io ou colega)",
            "1h: 1 problema Medium em editor simples, timer de 35 min, falando em voz alta",
          ],
        ],
        [
          "Domingo",
          "Descanso Total",
          0,
          "Recuperação mental — sem codar.",
          ["Descansar: a assimilação acontece no descanso"],
        ],
      ]
    : [
        [
          "Segunda",
          "Fundamentals & Data Structures",
          90,
          "Theory base to solve problems efficiently.",
          [
            "30 min: review 1 data structure of the week",
            "1h: solve 2 Easy problems (LeetCode/HackerRank)",
            "Goal: understand time and memory cost of operations",
          ],
        ],
        [
          "Terça",
          "Algorithm Patterns (Live Coding)",
          120,
          "Spot and apply problem-solving patterns.",
          [
            "30 min: study one pattern (Two Pointers, Sliding Window...)",
            "1h30: solve 2 problems (1 Easy + 1 Medium) on the pattern",
            "Stuck 20 min? Read the hint, close it, implement from scratch",
          ],
        ],
        [
          "Quarta",
          "Software Engineering & Language",
          90,
          "Theory questions and concept tests.",
          [
            "45 min: weekly topic (SOLID, DB, language, web/networking)",
            "45 min: explain out loud (Feynman technique)",
          ],
        ],
        [
          "Quinta",
          "System Design",
          90,
          "Architecture and product-wide thinking.",
          [
            "45 min: distributed systems (LB, queues, Redis, scaling)",
            "45 min: analyze a famous system (Twitter, URL shortener)",
          ],
        ],
        [
          "Sexta",
          "Soft Skills & Review",
          60,
          "HR / cultural fit and communication.",
          ["30 min: write STAR method answers", "30 min: review algorithms you missed"],
        ],
        [
          "Sábado",
          "Mock Interview Under Pressure",
          120,
          "Beat the nerves, simulate the real thing.",
          [
            "1h: mock interview (Pramp, Interviewing.io or a peer)",
            "1h: 1 Medium problem in a plain editor, 35 min timer, thinking out loud",
          ],
        ],
        [
          "Domingo",
          "Full Rest",
          0,
          "Mental recovery — no coding.",
          ["Rest: knowledge settles while you recover"],
        ],
      ];

  plan.blocks = rows.map(([day, title, minutes, focus, acts]) => {
    const block = createBlock(day, title, minutes || 5, focus);
    block.minutes = minutes;
    block.activities = acts.map((a) => createActivity(a));
    return block;
  });

  return plan;
}
