"use client";

import { useEffect, useState, type ReactNode } from "react";
import styles from "./ThinkingGames.module.css";

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function GameShell({
  eyebrow,
  title,
  instructions,
  metric,
  onReset,
  children,
}: {
  eyebrow: string;
  title: string;
  instructions: string;
  metric?: string;
  onReset?: () => void;
  children: ReactNode;
}) {
  return (
    <section className={styles.shell}>
      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>{eyebrow}</span>
          <h2>{title}</h2>
        </div>
        {(metric || onReset) && (
          <div className={styles.tools}>
            {metric && <strong>{metric}</strong>}
            {onReset && <button className={styles.resetButton} type="button" onClick={onReset}>Reiniciar</button>}
          </div>
        )}
      </header>
      <p className={styles.instructions}>{instructions}</p>
      {children}
    </section>
  );
}

const WORD_GRID = [
  "X", "F", "O", "C", "O", "L", "P", "Q",
  "R", "B", "D", "S", "Y", "U", "I", "A",
  "M", "E", "M", "O", "R", "I", "A", "T",
  "B", "C", "D", "F", "G", "H", "J", "E",
  "K", "L", "M", "P", "Q", "R", "S", "N",
  "T", "U", "V", "W", "X", "Y", "Z", "C",
  "H", "I", "J", "K", "L", "M", "N", "A",
  "P", "Q", "R", "S", "T", "U", "V", "O",
];

const WORD_TARGETS = [
  { word: "FOCO", positions: [1, 2, 3, 4] },
  { word: "MEMORIA", positions: [16, 17, 18, 19, 20, 21, 22] },
  { word: "ATENCAO", positions: [15, 23, 31, 39, 47, 55, 63] },
];

function WordSearchGame() {
  const [targetIndex, setTargetIndex] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [foundCells, setFoundCells] = useState<number[]>([]);
  const [foundCount, setFoundCount] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [feedback, setFeedback] = useState("Comece pela primeira letra da palavra.");
  const target = WORD_TARGETS[targetIndex];
  const currentFound = selected.length === target.positions.length;
  const complete = foundCount === WORD_TARGETS.length;

  function selectCell(index: number) {
    if (complete || currentFound) return;
    const expected = target.positions[selected.length];
    if (index !== expected) {
      setMistakes((value) => value + 1);
      setFeedback("Essa letra não continua a palavra. Procure uma casa vizinha na direção correta.");
      return;
    }
    const next = [...selected, index];
    setSelected(next);
    if (next.length === target.positions.length) {
      setFoundCells((cells) => [...cells, ...target.positions]);
      setFoundCount((value) => value + 1);
      setFeedback(`Você encontrou ${target.word}!`);
    } else {
      setFeedback(`${next.length} de ${target.positions.length} letras selecionadas.`);
    }
  }

  function nextWord() {
    if (foundCount === WORD_TARGETS.length) return;
    setTargetIndex((value) => value + 1);
    setSelected([]);
    setFeedback("Comece pela primeira letra da nova palavra.");
  }

  function reset() {
    setTargetIndex(0);
    setSelected([]);
    setFoundCells([]);
    setFoundCount(0);
    setMistakes(0);
    setFeedback("Comece pela primeira letra da palavra.");
  }

  return (
    <GameShell eyebrow="Linguagem e atenção" title="Caça-Rápida Verbal" instructions="Encontre cada palavra no diagrama. Selecione as letras em sequência, na horizontal ou na vertical." metric={`${foundCount}/3 palavras`} onReset={reset}>
      <div className={styles.wordTargets} aria-label="Palavras da rodada">
        {WORD_TARGETS.map((item, index) => <span key={item.word} className={index < foundCount ? styles.doneTag : index === targetIndex ? styles.activeTag : ""}>{item.word}</span>)}
      </div>
      <div className={styles.wordGrid} role="group" aria-label="Diagrama de caça-palavras com oito linhas e oito colunas">
        {WORD_GRID.map((letter, index) => {
          const isSelected = selected.includes(index);
          const isFound = foundCells.includes(index);
          return (
            <button
              key={`${letter}-${index}`}
              className={`${styles.wordCell} ${isSelected || isFound ? styles.selectedCell : ""}`}
              type="button"
              aria-label={`Letra ${letter}, linha ${Math.floor(index / 8) + 1}, coluna ${(index % 8) + 1}`}
              aria-pressed={isSelected || isFound}
              onClick={() => selectCell(index)}
            >
              {letter}
            </button>
          );
        })}
      </div>
      <p className={styles.status} role="status">{complete ? `Todas as palavras encontradas com ${mistakes} tentativa${mistakes === 1 ? "" : "s"} para revisar.` : feedback}</p>
      {currentFound && !complete && <button className={styles.primaryButton} type="button" onClick={nextWord}>Próxima palavra</button>}
    </GameShell>
  );
}

const NUMBER_PROBLEMS = [
  { sequence: [2, 4, 6, 8], answer: 10, options: [9, 10, 12], rule: "A sequência aumenta de 2 em 2." },
  { sequence: [3, 6, 12, 24], answer: 48, options: [36, 48, 52], rule: "Cada número é o dobro do anterior." },
  { sequence: [20, 17, 14, 11], answer: 8, options: [7, 8, 9], rule: "A sequência diminui de 3 em 3." },
  { sequence: [1, 4, 9, 16], answer: 25, options: [20, 24, 25], rule: "São os quadrados de 1, 2, 3, 4 e 5." },
  { sequence: [1, 1, 2, 3, 5], answer: 8, options: [7, 8, 10], rule: "Cada termo soma os dois anteriores." },
];

function IntelligentSequenceGame() {
  const [problemIndex, setProblemIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [complete, setComplete] = useState(false);
  const problem = NUMBER_PROBLEMS[problemIndex];
  const isCorrect = selected === problem.answer;

  function choose(option: number) {
    if (selected !== null) return;
    setSelected(option);
    if (option === problem.answer) setScore((value) => value + 1);
  }

  function advance() {
    if (problemIndex === NUMBER_PROBLEMS.length - 1) {
      setComplete(true);
      return;
    }
    setProblemIndex((value) => value + 1);
    setSelected(null);
  }

  function reset() {
    setProblemIndex(0);
    setSelected(null);
    setScore(0);
    setComplete(false);
  }

  return (
    <GameShell eyebrow="Raciocínio lógico" title="Sequência Inteligente" instructions="Observe os números, descubra a regra e escolha o próximo termo." metric={`${score}/${NUMBER_PROBLEMS.length} acertos`} onReset={reset}>
      {complete ? (
        <div className={styles.completion} role="status"><strong>Rodada concluída</strong><p>Você acertou {score} de {NUMBER_PROBLEMS.length} sequências.</p><button className={styles.primaryButton} type="button" onClick={reset}>Jogar novamente</button></div>
      ) : (
        <>
          <div className={styles.numberSequence} aria-label={`Sequência: ${problem.sequence.join(", ")}, qual é o próximo número?`}>
            {problem.sequence.map((number, index) => <span key={`${number}-${index}`}>{number}</span>)}<span className={styles.unknown}>?</span>
          </div>
          <div className={styles.choiceGrid} aria-label="Alternativas">
            {problem.options.map((option) => <button key={option} className={`${styles.optionButton} ${selected === option ? (isCorrect ? styles.correct : styles.incorrect) : ""}`} type="button" disabled={selected !== null} onClick={() => choose(option)}>{option}</button>)}
          </div>
          <p className={styles.status} role="status">{selected === null ? `Desafio ${problemIndex + 1} de ${NUMBER_PROBLEMS.length}.` : `${isCorrect ? "Correto!" : `A resposta era ${problem.answer}.`} ${problem.rule}`}</p>
          {selected !== null && <button className={styles.primaryButton} type="button" onClick={advance}>{problemIndex === NUMBER_PROBLEMS.length - 1 ? "Ver resultado" : "Próxima sequência"}</button>}
        </>
      )}
    </GameShell>
  );
}

const MEMORY_VALUES = ["7", "K", "🍋", "3", "M", "🌙"];
const INITIAL_MEMORY_DECK = [
  { id: "7-a", value: "7" }, { id: "lemon-a", value: "🍋" }, { id: "m-a", value: "M" }, { id: "3-a", value: "3" },
  { id: "k-a", value: "K" }, { id: "moon-a", value: "🌙" }, { id: "lemon-b", value: "🍋" }, { id: "7-b", value: "7" },
  { id: "moon-b", value: "🌙" }, { id: "k-b", value: "K" }, { id: "3-b", value: "3" }, { id: "m-b", value: "M" },
];

function createMemoryDeck() {
  return shuffle(MEMORY_VALUES.flatMap((value, index) => [
    { id: `${index}-a-${Date.now()}`, value },
    { id: `${index}-b-${Date.now()}`, value },
  ]));
}

function MemoryMixGame() {
  const [cards, setCards] = useState(INITIAL_MEMORY_DECK);
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const complete = matched.length === MEMORY_VALUES.length;

  useEffect(() => {
    if (open.length !== 2) return;
    const [first, second] = open;
    const delay = cards[first].value === cards[second].value ? 320 : 700;
    const timer = window.setTimeout(() => setOpen([]), delay);
    return () => window.clearTimeout(timer);
  }, [cards, open]);

  function chooseCard(index: number) {
    if (open.length === 2 || open.includes(index) || matched.includes(cards[index].value)) return;
    if (open.length === 1) {
      setMoves((value) => value + 1);
      if (cards[open[0]].value === cards[index].value) {
        setMatched((values) => [...values, cards[index].value]);
      }
    }
    setOpen((values) => [...values, index]);
  }

  function reset() {
    setCards(createMemoryDeck());
    setOpen([]);
    setMatched([]);
    setMoves(0);
  }

  return (
    <GameShell eyebrow="Memória visual" title="Memória Mix" instructions="Vire duas cartas por vez e encontre pares entre números, letras e emojis." metric={complete ? `${moves} jogadas` : `${matched.length}/6 pares`} onReset={reset}>
      <div className={styles.memoryGrid} aria-label="Cartas do jogo da memória">
        {cards.map((card, index) => {
          const revealed = open.includes(index) || matched.includes(card.value);
          const paired = matched.includes(card.value);
          return <button key={card.id} className={`${styles.memoryCard} ${revealed ? styles.revealedCard : ""}`} type="button" disabled={paired} aria-label={revealed ? `Carta ${card.value}${paired ? ", par encontrado" : ""}` : "Carta virada"} aria-pressed={revealed} onClick={() => chooseCard(index)}><span aria-hidden="true">{revealed ? card.value : "?"}</span></button>;
        })}
      </div>
      <p className={styles.status} role="status">{complete ? "Muito bem! Todos os pares foram encontrados." : open.length === 1 ? "Agora escolha a segunda carta." : "Escolha duas cartas para comparar."}</p>
    </GameShell>
  );
}

const INTRUDER_ROUNDS = [
  { category: "Frutas", words: ["Maçã", "Banana", "Cadeira", "Uva"], answer: "Cadeira" },
  { category: "Animais", words: ["Tartaruga", "Janela", "Gato", "Cavalo"], answer: "Janela" },
  { category: "Transportes", words: ["Ônibus", "Abacaxi", "Bicicleta", "Avião"], answer: "Abacaxi" },
  { category: "Instrumentos musicais", words: ["Violão", "Piano", "Sapato", "Tambor"], answer: "Sapato" },
];

function IntruderWordsGame() {
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [complete, setComplete] = useState(false);
  const challenge = INTRUDER_ROUNDS[round];

  function choose(word: string) {
    if (answered) return;
    setSelected(word);
    if (word === challenge.answer) {
      setAnswered(true);
      setScore((value) => value + 1);
    } else {
      setMistakes((value) => value + 1);
    }
  }

  function advance() {
    if (round === INTRUDER_ROUNDS.length - 1) {
      setComplete(true);
      return;
    }
    setRound((value) => value + 1);
    setSelected(null);
    setAnswered(false);
  }

  function reset() {
    setRound(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setMistakes(0);
    setComplete(false);
  }

  return (
    <GameShell eyebrow="Linguagem e raciocínio" title="Intruso das Palavras" instructions="Três palavras pertencem à categoria indicada. Encontre a única que não combina." metric={`${score}/${INTRUDER_ROUNDS.length} acertos`} onReset={reset}>
      {complete ? (
        <div className={styles.completion} role="status"><strong>Você completou os grupos</strong><p>{score} acertos e {mistakes} tentativa{mistakes === 1 ? "" : "s"} para revisar.</p><button className={styles.primaryButton} type="button" onClick={reset}>Jogar novamente</button></div>
      ) : (
        <>
          <div className={styles.categoryPrompt}><span>Categoria</span><strong>{challenge.category}</strong></div>
          <div className={styles.choiceGrid}>
            {challenge.words.map((word) => <button key={word} className={`${styles.optionButton} ${selected === word ? (word === challenge.answer ? styles.correct : styles.incorrect) : ""}`} type="button" disabled={answered} onClick={() => choose(word)}>{word}</button>)}
          </div>
          <p className={styles.status} role="status">{answered ? `Correto: ${challenge.answer} não pertence ao grupo.` : selected ? "Essa palavra pertence ao grupo. Tente outra." : `Grupo ${round + 1} de ${INTRUDER_ROUNDS.length}.`}</p>
          {answered && <button className={styles.primaryButton} type="button" onClick={advance}>{round === INTRUDER_ROUNDS.length - 1 ? "Ver resultado" : "Próximo grupo"}</button>}
        </>
      )}
    </GameShell>
  );
}

type NumberMemoryPhase = "idle" | "showing" | "input" | "success" | "failed";

function randomDigit() {
  return Math.floor(Math.random() * 10);
}

function NumberMemoryGame() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [phase, setPhase] = useState<NumberMemoryPhase>("idle");
  const [showIndex, setShowIndex] = useState(0);
  const [input, setInput] = useState<number[]>([]);
  const [best, setBest] = useState(0);

  useEffect(() => {
    if (phase !== "showing") return;
    if (showIndex < sequence.length) {
      const timer = window.setTimeout(() => setShowIndex((value) => value + 1), 720);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => {
      setPhase("input");
      setInput([]);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [phase, sequence.length, showIndex]);

  function start() {
    setSequence([randomDigit(), randomDigit(), randomDigit()]);
    setShowIndex(0);
    setInput([]);
    setBest(0);
    setPhase("showing");
  }

  function enterDigit(digit: number) {
    if (phase !== "input") return;
    const expected = sequence[input.length];
    if (digit !== expected) {
      setPhase("failed");
      return;
    }
    const next = [...input, digit];
    setInput(next);
    if (next.length === sequence.length) {
      setBest(Math.max(best, sequence.length));
      setPhase("success");
    }
  }

  function nextLevel() {
    setSequence((values) => [...values, randomDigit()]);
    setShowIndex(0);
    setInput([]);
    setPhase("showing");
  }

  const visibleNumber = phase === "showing" && showIndex < sequence.length ? sequence[showIndex] : "•";

  return (
    <GameShell eyebrow="Memória de trabalho" title="Memória Numérica" instructions="Observe a sequência, espere os números desaparecerem e repita na mesma ordem. A cada acerto, ela cresce." metric={sequence.length ? `Nível ${sequence.length}` : "3 números"} onReset={phase === "idle" ? undefined : start}>
      {phase === "idle" ? (
        <div className={styles.completion}><strong>Pronto para memorizar?</strong><p>Os números aparecem um de cada vez.</p><button className={styles.primaryButton} type="button" onClick={start}>Começar</button></div>
      ) : (
        <>
          <div className={styles.memoryDisplay} aria-live="polite" aria-label={phase === "showing" && showIndex < sequence.length ? `Número ${visibleNumber}` : "Sequência oculta"}>{visibleNumber}</div>
          {phase === "input" && <div className={styles.digitGrid} aria-label="Teclado numérico">{Array.from({ length: 10 }, (_, digit) => <button key={digit} type="button" onClick={() => enterDigit(digit)}>{digit}</button>)}</div>}
          <p className={styles.status} role="status">
            {phase === "showing" && "Observe com atenção."}
            {phase === "input" && `Repita a sequência: ${input.length} de ${sequence.length} números inseridos.`}
            {phase === "success" && `Correto! Você memorizou ${sequence.length} números.`}
            {phase === "failed" && `A sequência era ${sequence.join(" – ")}. ${best > 0 ? `Seu melhor nível nesta rodada foi ${best}.` : "Você ainda não concluiu um nível nesta rodada."}`}
          </p>
          {phase === "success" && <button className={styles.primaryButton} type="button" onClick={nextLevel}>Adicionar um número</button>}
          {phase === "failed" && <button className={styles.primaryButton} type="button" onClick={start}>Tentar nova sequência</button>}
        </>
      )}
    </GameShell>
  );
}

type ActionStep = { id: string; label: string };

const ACTION_SOLUTION: ActionStep[] = [
  { id: "check", label: "Verificar o compromisso" },
  { id: "separate", label: "Separar o que precisa levar" },
  { id: "confirm", label: "Conferir o endereço e o horário" },
  { id: "leave", label: "Sair com antecedência" },
  { id: "arrive", label: "Chegar e confirmar o local" },
];

const ACTION_START = [ACTION_SOLUTION[2], ACTION_SOLUTION[0], ACTION_SOLUTION[4], ACTION_SOLUTION[1], ACTION_SOLUTION[3]];

function ActionOrderGame() {
  const [steps, setSteps] = useState<ActionStep[]>(ACTION_START);
  const [attempts, setAttempts] = useState(0);
  const [complete, setComplete] = useState(false);
  const [feedback, setFeedback] = useState("Use as setas para reorganizar os passos.");

  function move(index: number, direction: -1 | 1) {
    const destination = index + direction;
    if (destination < 0 || destination >= steps.length || complete) return;
    const next = [...steps];
    [next[index], next[destination]] = [next[destination], next[index]];
    setSteps(next);
    setFeedback("Ordem alterada. Confira o encadeamento antes de validar.");
  }

  function checkOrder() {
    const correct = steps.every((step, index) => step.id === ACTION_SOLUTION[index].id);
    setAttempts((value) => value + 1);
    setComplete(correct);
    setFeedback(correct ? "Sequência correta! A rotina ficou organizada do início ao fim." : "Ainda há uma etapa fora de lugar. Observe o que depende do passo anterior.");
  }

  function reset() {
    setSteps(ACTION_START);
    setAttempts(0);
    setComplete(false);
    setFeedback("Use as setas para reorganizar os passos.");
  }

  return (
    <GameShell eyebrow="Funções executivas" title="Ordem das Ações" instructions="Organize uma saída para um compromisso. A solução segue uma ordem fixa e lógica; mova cada passo para a posição adequada." metric={complete ? `${attempts} verificação${attempts === 1 ? "" : "ões"}` : "5 passos"} onReset={reset}>
      <ol className={styles.actionList}>
        {steps.map((step, index) => (
          <li key={step.id}>
            <span className={styles.stepNumber}>{index + 1}</span>
            <span>{step.label}</span>
            <div className={styles.moveControls}>
              <button type="button" disabled={index === 0 || complete} aria-label={`Mover “${step.label}” para cima`} onClick={() => move(index, -1)}>↑</button>
              <button type="button" disabled={index === steps.length - 1 || complete} aria-label={`Mover “${step.label}” para baixo`} onClick={() => move(index, 1)}>↓</button>
            </div>
          </li>
        ))}
      </ol>
      <p className={styles.status} role="status">{feedback}</p>
      {!complete && <button className={styles.primaryButton} type="button" onClick={checkOrder}>Conferir ordem</button>}
    </GameShell>
  );
}

const EMOJI_ROUNDS = [
  { word: "CHUVA", answer: "🌧️", options: [{ symbol: "☀️", label: "sol" }, { symbol: "🌧️", label: "nuvem com chuva" }, { symbol: "🍕", label: "pizza" }, { symbol: "🚲", label: "bicicleta" }] },
  { word: "LIVRO", answer: "📚", options: [{ symbol: "🎵", label: "nota musical" }, { symbol: "📚", label: "livros" }, { symbol: "🌳", label: "árvore" }, { symbol: "⏰", label: "relógio" }] },
  { word: "MÚSICA", answer: "🎵", options: [{ symbol: "🎵", label: "nota musical" }, { symbol: "🔑", label: "chave" }, { symbol: "⚽", label: "bola" }, { symbol: "🥕", label: "cenoura" }] },
  { word: "SONO", answer: "😴", options: [{ symbol: "🎉", label: "festa" }, { symbol: "☕", label: "café" }, { symbol: "😴", label: "rosto dormindo" }, { symbol: "🏃", label: "pessoa correndo" }] },
];

function WordEmojiGame() {
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [complete, setComplete] = useState(false);
  const challenge = EMOJI_ROUNDS[round];

  function choose(symbol: string) {
    if (answered) return;
    setSelected(symbol);
    if (symbol === challenge.answer) {
      setAnswered(true);
      setScore((value) => value + 1);
    } else {
      setMistakes((value) => value + 1);
    }
  }

  function advance() {
    if (round === EMOJI_ROUNDS.length - 1) {
      setComplete(true);
      return;
    }
    setRound((value) => value + 1);
    setSelected(null);
    setAnswered(false);
  }

  function reset() {
    setRound(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setMistakes(0);
    setComplete(false);
  }

  return (
    <GameShell eyebrow="Linguagem e memória" title="Palavra & Emoji" instructions="Leia a palavra e escolha o emoji que representa melhor o seu significado." metric={`${score}/${EMOJI_ROUNDS.length} associações`} onReset={reset}>
      {complete ? (
        <div className={styles.completion} role="status"><strong>Associações concluídas</strong><p>{score} acertos e {mistakes} tentativa{mistakes === 1 ? "" : "s"} para revisar.</p><button className={styles.primaryButton} type="button" onClick={reset}>Jogar novamente</button></div>
      ) : (
        <>
          <div className={styles.wordPrompt}><span>Qual emoji combina com</span><strong>{challenge.word}?</strong></div>
          <div className={styles.emojiGrid}>
            {challenge.options.map((option) => <button key={option.symbol} className={`${selected === option.symbol ? (option.symbol === challenge.answer ? styles.correct : styles.incorrect) : ""}`} type="button" disabled={answered} aria-label={option.label} onClick={() => choose(option.symbol)}><span aria-hidden="true">{option.symbol}</span></button>)}
          </div>
          <p className={styles.status} role="status">{answered ? "Associação correta!" : selected ? "Esse emoji representa outra ideia. Tente novamente." : `Associação ${round + 1} de ${EMOJI_ROUNDS.length}.`}</p>
          {answered && <button className={styles.primaryButton} type="button" onClick={advance}>{round === EMOJI_ROUNDS.length - 1 ? "Ver resultado" : "Próxima palavra"}</button>}
        </>
      )}
    </GameShell>
  );
}

type SimonColor = "green" | "red" | "yellow" | "blue";
type SimonPhase = "idle" | "showing" | "input" | "success" | "failed";

const SIMON_COLORS: { id: SimonColor; label: string }[] = [
  { id: "green", label: "Verde" },
  { id: "red", label: "Vermelho" },
  { id: "yellow", label: "Amarelo" },
  { id: "blue", label: "Azul" },
];

function randomSimonColor(): SimonColor {
  return SIMON_COLORS[Math.floor(Math.random() * SIMON_COLORS.length)].id;
}

function ColorSequenceGame() {
  const [sequence, setSequence] = useState<SimonColor[]>([]);
  const [phase, setPhase] = useState<SimonPhase>("idle");
  const [playbackIndex, setPlaybackIndex] = useState(0);
  const [lit, setLit] = useState(false);
  const [inputIndex, setInputIndex] = useState(0);
  const [best, setBest] = useState(0);

  useEffect(() => {
    if (phase !== "showing") return;
    if (playbackIndex >= sequence.length) {
      const timer = window.setTimeout(() => {
        setPhase("input");
        setInputIndex(0);
      }, 320);
      return () => window.clearTimeout(timer);
    }
    if (!lit) {
      const timer = window.setTimeout(() => setLit(true), 220);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => {
      setLit(false);
      setPlaybackIndex((value) => value + 1);
    }, 560);
    return () => window.clearTimeout(timer);
  }, [lit, phase, playbackIndex, sequence.length]);

  function play(colors: SimonColor[]) {
    setSequence(colors);
    setPlaybackIndex(0);
    setInputIndex(0);
    setLit(false);
    setPhase("showing");
  }

  function start() {
    setBest(0);
    play([randomSimonColor()]);
  }

  function choose(color: SimonColor) {
    if (phase !== "input") return;
    if (color !== sequence[inputIndex]) {
      setPhase("failed");
      return;
    }
    if (inputIndex === sequence.length - 1) {
      setBest(Math.max(best, sequence.length));
      setPhase("success");
      return;
    }
    setInputIndex((value) => value + 1);
  }

  function nextRound() {
    play([...sequence, randomSimonColor()]);
  }

  const activeColor = phase === "showing" && lit ? sequence[playbackIndex] : null;

  return (
    <GameShell eyebrow="Memória e atenção" title="Sequência das Cores" instructions="Observe a ordem em que as cores acendem e depois repita a sequência. Cada rodada acrescenta uma cor." metric={sequence.length ? `Rodada ${sequence.length}` : "Simon"} onReset={phase === "idle" ? undefined : start}>
      {phase === "idle" ? (
        <div className={styles.completion}><strong>Observe, memorize e repita</strong><p>A primeira rodada começa com uma cor.</p><button className={styles.primaryButton} type="button" onClick={start}>Começar</button></div>
      ) : (
        <>
          <div className={styles.simonGrid} aria-label="Painel de quatro cores">
            {SIMON_COLORS.map((color) => (
              <button
                key={color.id}
                className={`${styles.simonButton} ${styles[color.id]} ${activeColor === color.id ? styles.lit : ""}`}
                type="button"
                disabled={phase !== "input"}
                aria-label={color.label}
                onClick={() => choose(color.id)}
              >
                <span>{color.label}</span>
              </button>
            ))}
          </div>
          <span className={styles.srOnly} aria-live="polite">{activeColor ? `Cor ${SIMON_COLORS.find((color) => color.id === activeColor)?.label}` : ""}</span>
          <p className={styles.status} role="status">
            {phase === "showing" && "Observe a sequência."}
            {phase === "input" && `Sua vez: ${inputIndex} de ${sequence.length} cores repetidas.`}
            {phase === "success" && `Sequência correta! Você completou ${sequence.length} ${sequence.length === 1 ? "cor" : "cores"}.`}
            {phase === "failed" && `A ordem não correspondeu. Melhor rodada: ${best} ${best === 1 ? "cor" : "cores"}.`}
          </p>
          {phase === "success" && <button className={styles.primaryButton} type="button" onClick={nextRound}>Acrescentar uma cor</button>}
          {phase === "failed" && <button className={styles.primaryButton} type="button" onClick={start}>Começar de novo</button>}
        </>
      )}
    </GameShell>
  );
}

export function ThinkingGame({ slug }: { slug: string }) {
  switch (slug) {
    case "caca-rapida": return <WordSearchGame />;
    case "sequênciainteligente": return <IntelligentSequenceGame />;
    case "memóriamix": return <MemoryMixGame />;
    case "intrusodaspalavras": return <IntruderWordsGame />;
    case "memorianumerica": return <NumberMemoryGame />;
    case "ordem-das-acoes": return <ActionOrderGame />;
    case "palavra-emoji": return <WordEmojiGame />;
    case "sequênciadascores": return <ColorSequenceGame />;
    default: return null;
  }
}
