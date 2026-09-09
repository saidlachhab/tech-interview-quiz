"use client";

import { useMemo, useState, useEffect } from "react";
import questions from "../data/questions.json";

const CATEGORIES = ["Toutes", ...Array.from(new Set(questions.map((q) => q.category)))];
const DIFFICULTIES = ["Toutes", "junior", "medior", "senior"];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Page() {
  const [category, setCategory] = useState("Toutes");
  const [difficulty, setDifficulty] = useState("Toutes");
  const [pool, setPool] = useState([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState({ good: 0, bad: 0 });
  const [missed, setMissed] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem("quiz-missed");
    if (saved) setMissed(JSON.parse(saved));
  }, []);

  const filtered = useMemo(() => {
    return questions.filter(
      (q) =>
        (category === "Toutes" || q.category === category) &&
        (difficulty === "Toutes" || q.difficulty === difficulty)
    );
  }, [category, difficulty]);

  useEffect(() => {
    setPool(shuffle(filtered));
    setIndex(0);
    setShowAnswer(false);
    setScore({ good: 0, bad: 0 });
  }, [filtered]);

  const current = pool[index];

  function next() {
    setShowAnswer(false);
    setIndex((i) => (i + 1) % Math.max(pool.length, 1));
  }

  function mark(good) {
    if (!current) return;
    setScore((s) => ({ ...s, [good ? "good" : "bad"]: s[good ? "good" : "bad"] + 1 }));
    const updated = { ...missed, [current.question]: good ? 0 : (missed[current.question] || 0) + 1 };
    setMissed(updated);
    localStorage.setItem("quiz-missed", JSON.stringify(updated));
    next();
  }

  return (
    <div className="container">
      <h1>Tech Interview Quiz</h1>
      <p className="subtitle">
        Java · Spring Boot · Kafka · Redis · Kubernetes · CI/CD · IA/GenAI · Architecture
      </p>

      <div className="filters">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`chip ${category === c ? "active" : ""}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="filters">
        {DIFFICULTIES.map((d) => (
          <button
            key={d}
            className={`chip ${difficulty === d ? "active" : ""}`}
            onClick={() => setDifficulty(d)}
          >
            {d}
          </button>
        ))}
      </div>

      {current ? (
        <div className="card">
          <div className="meta">
            <span>{current.category} · {current.difficulty}</span>
            <span>{index + 1} / {pool.length}</span>
          </div>
          <div className="question">{current.question}</div>

          {showAnswer && <div className="answer">{current.answer}</div>}

          <div className="actions">
            {!showAnswer ? (
              <button className="btn-primary" onClick={() => setShowAnswer(true)}>
                Voir la réponse
              </button>
            ) : (
              <>
                <button className="btn-good" onClick={() => mark(true)}>
                  ✅ Je savais
                </button>
                <button className="btn-bad" onClick={() => mark(false)}>
                  ❌ À revoir
                </button>
              </>
            )}
            <button className="btn-ghost" onClick={next}>
              Passer
            </button>
          </div>

          <div className="score">
            Score de la session : {score.good} su · {score.bad} à revoir
          </div>
        </div>
      ) : (
        <div className="empty">Aucune question pour ce filtre.</div>
      )}
    </div>
  );
}
