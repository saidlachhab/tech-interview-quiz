"use client";

import { useMemo, useState, useEffect } from "react";
import questions from "../data/questions.json";

const CATEGORIES = ["Toutes", ...Array.from(new Set(questions.map((q) => q.category)))];

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
  const [pool, setPool] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState({ good: 0, bad: 0 });

  const filtered = useMemo(() => questions.filter((q) => category === "Toutes" || q.category === category), [category]);

  useEffect(() => {
    setPool(shuffle(filtered));
    setIndex(0);
    setSelected(null);
    setScore({ good: 0, bad: 0 });
  }, [filtered]);

  const current = pool[index];

  function next() {
    setSelected(null);
    setIndex((i) => (i + 1) % Math.max(pool.length, 1));
  }

  function choose(i) {
    if (selected !== null || !current) return;
    setSelected(i);
    const good = i === current.answer;
    setScore((s) => ({ ...s, [good ? "good" : "bad"]: s[good ? "good" : "bad"] + 1 }));
  }

  function optionClass(i) {
    if (selected === null) return "option";
    if (i === current.answer) return "option correct";
    if (i === selected) return "option wrong";
    return "option disabled";
  }

  return (
    <div className="container">
      <h1>Tech Interview Quiz</h1>
      <p className="subtitle">Niveau senior</p>
      <div className="filters">
        {CATEGORIES.map((c) => (
          <button key={c} className={`chip ${category === c ? "active" : ""}`} onClick={() => setCategory(c)}>{c}</button>
        ))}
      </div>
      {current ? (
        <div className="card">
          <div className="meta"><span>{current.category}</span><span>{index + 1} / {pool.length}</span></div>
          <div className="question">{current.question}</div>
          <div className="options">
            {current.options.map((opt, i) => (
              <button key={i} className={optionClass(i)} onClick={() => choose(i)}>{opt}</button>
            ))}
          </div>
          {selected !== null && (
            <div className="explanation"><strong>{selected === current.answer ? "✅ Correct" : "❌ Incorrect"}</strong><p>{current.explanation}</p></div>
          )}
          <div className="actions"><button className="btn-ghost" onClick={next} disabled={selected === null}>Question suivante</button></div>
          <div className="score">Score : {score.good} bonnes · {score.bad} mauvaises</div>
        </div>
      ) : (<div className="empty">Aucune question pour ce filtre.</div>)}
    </div>
  );
}
