"use client";

import { useMemo, useState, useEffect } from "react";
import questions from "../questions.json";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Page() {
  const [view, setView] = useState("home");
  const [category, setCategory] = useState(null);
  const [pool, setPool] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState({ good: 0, bad: 0 });

  const categoryCounts = useMemo(() => {
    const map = {};
    questions.forEach((q) => { map[q.category] = (map[q.category] || 0) + 1; });
    return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]));
  }, []);

  function startQuiz(cat) {
    const filtered = cat === "Toutes" ? questions : questions.filter((q) => q.category === cat);
    setCategory(cat);
    setPool(shuffle(filtered));
    setIndex(0);
    setSelected(null);
    setScore({ good: 0, bad: 0 });
    setView("quiz");
  }

  function backToHome() {
    setView("home");
  }

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

  if (view === "home") {
    const total = questions.length;
    return (
      <div className="container">
        <h1>Tech Interview Quiz</h1>
        <p className="subtitle">Choisis une techno pour t'entrainer (niveau senior)</p>
        <div className="grid">
          <button className="techcard techcard-all" onClick={() => startQuiz("Toutes")}>
            <span className="techcard-title">Toutes les technos</span>
            <span className="techcard-count">{total} questions</span>
          </button>
          {categoryCounts.map(([cat, count]) => (
            <button key={cat} className="techcard" onClick={() => startQuiz(cat)}>
              <span className="techcard-title">{cat}</span>
              <span className="techcard-count">{count} questions</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <button className="back-link" onClick={backToHome}>&larr; Choisir une autre techno</button>
      <h1>{category}</h1>
      <p className="subtitle">Niveau senior</p>

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
            <div className="explanation">
              <strong>{selected === current.answer ? "✅ Correct" : "❌ Incorrect"}</strong>
              <p>{current.explanation}</p>
            </div>
          )}
          <div className="actions">
            <button className="btn-ghost" onClick={next} disabled={selected === null}>Question suivante</button>
          </div>
          <div className="score">Score : {score.good} bonnes &middot; {score.bad} mauvaises</div>
        </div>
      ) : (
        <div className="empty">Aucune question pour ce filtre.</div>
      )}
    </div>
  );
}
