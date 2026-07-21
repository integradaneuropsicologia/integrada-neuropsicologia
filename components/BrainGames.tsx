"use client";

import { useEffect, useRef, useState } from "react";

const symbols = ["●", "▲", "■", "◆", "✦", "✚"];

const initialOrder = ["●", "▲", "■", "◆", "✦", "✚", "◆", "✚", "▲", "●", "■", "✦"];

function makeCards(order: string[]) {
  return order.map((symbol, index) => ({ id: `${symbol}-${index}`, symbol }));
}

function shuffledCards() {
  const order = [...symbols, ...symbols];
  for (let index = order.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [order[index], order[randomIndex]] = [order[randomIndex], order[index]];
  }
  return makeCards(order);
}

export function BrainGames() {
  const [cards, setCards] = useState(() => makeCards(initialOrder));
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const timerRef = useRef<number | null>(null);
  const complete = matched.length === symbols.length;
  const scoreLabel = complete ? `Concluído em ${moves} jogadas` : `${matched.length} de ${symbols.length} pares`;

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
  }, []);

  function choose(index: number) {
    if (locked || open.includes(index) || matched.includes(cards[index].symbol)) return;
    setMoves((current) => current + 1);
    if (open.length === 0) {
      setOpen([index]);
      return;
    }

    const first = open[0];
    setOpen([first, index]);
    setLocked(true);
    const isMatch = cards[first].symbol === cards[index].symbol;
    timerRef.current = window.setTimeout(() => {
      if (isMatch) setMatched((current) => [...current, cards[first].symbol]);
      setOpen([]);
      setLocked(false);
      timerRef.current = null;
    }, isMatch ? 350 : 700);
  }

  function reset() {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = null;
    setCards(shuffledCards());
    setOpen([]);
    setMatched([]);
    setMoves(0);
    setLocked(false);
  }

  return (
    <div className="game-shell">
      <div className="game-toolbar"><div><span className="eyebrow">Memória visual</span><h2>Encontre os pares</h2></div><div><strong>{scoreLabel}</strong><button className="text-button" type="button" onClick={reset}>Embaralhar e reiniciar</button></div></div>
      <div className="memory-grid">{cards.map((card, index) => { const revealed = open.includes(index) || matched.includes(card.symbol); return <button key={card.id} className={revealed ? "revealed" : ""} onClick={() => choose(index)} aria-label={revealed ? `Carta ${card.symbol}` : "Carta virada"} disabled={matched.includes(card.symbol)}><span>{revealed ? card.symbol : "?"}</span></button>; })}</div>
      {complete && <div className="game-complete" role="status"><strong>Muito bem!</strong><span>Você encontrou todos os pares.</span></div>}
    </div>
  );
}
