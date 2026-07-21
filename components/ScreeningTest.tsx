"use client";

import { useState } from "react";
import { Screening, whatsappUrl } from "@/lib/site-data";

const options = ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Quase sempre"];

export function ScreeningTest({ screening }: { screening: Screening }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const complete = Object.keys(answers).length === screening.questions.length;

  return (
    <div className="screening-card">
      {!showResult ? <>
        <div className="screening-progress"><span style={{ width: `${(Object.keys(answers).length / screening.questions.length) * 100}%` }} /></div>
        <ol className="question-list">
          {screening.questions.map((question, index) => <li key={question}>
            <p>{question}</p>
            <div className="answer-options" role="radiogroup" aria-label={`Pergunta ${index + 1}`}>
              {options.map((option, value) => <label key={option} className={answers[index] === value ? "selected" : ""}><input type="radio" name={`q-${index}`} value={value} checked={answers[index] === value} onChange={() => setAnswers((current) => ({ ...current, [index]: value }))} /><span>{option}</span></label>)}
            </div>
          </li>)}
        </ol>
        <button className="button button-dark" disabled={!complete} onClick={() => setShowResult(true)}>Concluir reflexão</button>
        {!complete && <p className="screening-hint">Responda todas as perguntas para concluir o checklist.</p>}
      </> : <div className="screening-result" aria-live="polite">
        <span className="result-label">Checklist concluído</span><h2>Leve o contexto em conta.</h2>
        <p>Este conteúdo não calcula uma pontuação clínica nem interpreta suas respostas. Um sinal isolado não confirma ou exclui qualquer condição. Se as situações observadas são persistentes e prejudicam a rotina, uma conversa profissional pode ajudar a definir o próximo passo.</p>
        <div className="result-actions"><a className="button button-green" href={whatsappUrl(`Olá! Preenchi o ${screening.title.toLowerCase()} no site e gostaria de orientação.`)} target="_blank" rel="noreferrer">Conversar com a clínica</a><button className="text-button" onClick={() => { setAnswers({}); setShowResult(false); }}>Refazer checklist</button></div>
      </div>}
    </div>
  );
}
