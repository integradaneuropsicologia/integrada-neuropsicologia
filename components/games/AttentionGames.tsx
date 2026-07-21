"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./AttentionGames.module.css";

type GamePhase = "ready" | "playing" | "complete";

type Metric = {
  label: string;
  value: string | number;
};

type ColorOption = {
  name: string;
  value: string;
};

type NamedSymbol = {
  glyph: string;
  name: string;
};

function randomIndex(length: number) {
  return Math.floor(Math.random() * length);
}

function differentIndex(current: number, length: number) {
  if (length < 2) return 0;
  let next = randomIndex(length);
  while (next === current) next = randomIndex(length);
  return next;
}

function shuffle<T>(items: readonly T[]) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const replacement = randomIndex(index + 1);
    [result[index], result[replacement]] = [result[replacement], result[index]];
  }
  return result;
}

function Metrics({ items }: { items: Metric[] }) {
  return (
    <dl className={styles.metrics} aria-label="Placar do jogo">
      {items.map((item) => (
        <div className={styles.metric} key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function GameHeader({ id, title, metrics }: { id: string; title: string; metrics: Metric[] }) {
  return (
    <header className={styles.header}>
      <div>
        <span className={styles.eyebrow}>Exercício de atenção</span>
        <h2 id={id}>{title}</h2>
      </div>
      <Metrics items={metrics} />
    </header>
  );
}

function StartPanel({ children, onStart }: { children: React.ReactNode; onStart: () => void }) {
  return (
    <div className={styles.startPanel}>
      <p>{children}</p>
      <button className={styles.primaryButton} type="button" onClick={onStart}>
        Começar exercício
      </button>
    </div>
  );
}

const STROOP_COLORS: ColorOption[] = [
  { name: "Azul", value: "#1769c2" },
  { name: "Verde", value: "#138a45" },
  { name: "Vermelho", value: "#c72c32" },
  { name: "Amarelo", value: "#b17800" },
];

const STROOP_ROUNDS = 10;

function createStroopTrial(previousInk = -1) {
  const inkIndex = differentIndex(previousInk, STROOP_COLORS.length);
  const isCongruent = Math.random() < 0.25;
  const wordIndex = isCongruent ? inkIndex : differentIndex(inkIndex, STROOP_COLORS.length);
  return { inkIndex, wordIndex };
}

function StroopGame() {
  const [phase, setPhase] = useState<GamePhase>("ready");
  const [trial, setTrial] = useState<{ inkIndex: number; wordIndex: number } | null>(null);
  const [round, setRound] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [errors, setErrors] = useState(0);
  const [feedback, setFeedback] = useState("Escolha a cor da tinta, não a palavra escrita.");

  function start() {
    setTrial(createStroopTrial());
    setRound(0);
    setCorrect(0);
    setErrors(0);
    setFeedback("Qual é a cor da tinta?");
    setPhase("playing");
  }

  function answer(colorIndex: number) {
    if (phase !== "playing" || !trial) return;
    const isCorrect = colorIndex === trial.inkIndex;
    if (isCorrect) setCorrect((value) => value + 1);
    else setErrors((value) => value + 1);

    const nextRound = round + 1;
    if (nextRound === STROOP_ROUNDS) {
      setRound(nextRound);
      setFeedback(
        isCorrect
          ? "Resposta correta. Rodada concluída."
          : `A cor da tinta era ${STROOP_COLORS[trial.inkIndex].name.toLowerCase()}.`,
      );
      setPhase("complete");
      return;
    }

    setRound(nextRound);
    setFeedback(
      isCorrect
        ? "Correta. Continue olhando apenas para a tinta."
        : `A tinta era ${STROOP_COLORS[trial.inkIndex].name.toLowerCase()}. Próxima palavra.`,
    );
    setTrial(createStroopTrial(trial.inkIndex));
  }

  return (
    <section className={styles.shell} aria-labelledby="stroop-title">
      <GameHeader
        id="stroop-title"
        title="Desafio das cores"
        metrics={[
          { label: "Rodada", value: phase === "playing" ? `${round + 1}/${STROOP_ROUNDS}` : `${round}/${STROOP_ROUNDS}` },
          { label: "Acertos", value: correct },
          { label: "Erros", value: errors },
        ]}
      />
      <p className={styles.instructions}>
        Ignore o significado da palavra e escolha o nome da cor em que ela está pintada.
      </p>

      {phase === "ready" && (
        <StartPanel onStart={start}>As palavras podem dizer uma cor diferente da tinta. São 10 rodadas.</StartPanel>
      )}

      {phase === "playing" && trial && (
        <div className={styles.stroopStage}>
          <p className={styles.stroopWord} style={{ color: STROOP_COLORS[trial.inkIndex].value }} aria-label={`Palavra ${STROOP_COLORS[trial.wordIndex].name}`}>
            {STROOP_COLORS[trial.wordIndex].name.toUpperCase()}
          </p>
          <div className={styles.choiceRow} aria-label="Opções de cor">
            {STROOP_COLORS.map((color, index) => (
              <button className={styles.choiceButton} key={color.name} type="button" onClick={() => answer(index)}>
                {color.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === "complete" && (
        <div className={styles.result}>
          <strong>{correct} de {STROOP_ROUNDS} respostas corretas</strong>
          <p>O resultado considera somente as escolhas feitas nesta rodada.</p>
          <button className={styles.primaryButton} type="button" onClick={start}>Jogar novamente</button>
        </div>
      )}
      <p className={styles.feedback} role="status" aria-live="polite">{feedback}</p>
    </section>
  );
}

const GHOST_CELLS = 16;
const GHOST_DURATION = 20_000;

function GhostHuntGame() {
  const [phase, setPhase] = useState<GamePhase>("ready");
  const [ghostPosition, setGhostPosition] = useState<number | null>(null);
  const [caught, setCaught] = useState(0);
  const [falseClicks, setFalseClicks] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(GHOST_DURATION / 1000);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (phase !== "playing") return;

    const startedAt = performance.now();
    const movement = window.setInterval(() => {
      setGhostPosition((current) => differentIndex(current ?? -1, GHOST_CELLS));
    }, 760);
    const clock = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;
      setSecondsLeft(Math.max(0, Math.ceil((GHOST_DURATION - elapsed) / 1000)));
    }, 100);
    const ending = window.setTimeout(() => {
      setSecondsLeft(0);
      setGhostPosition(null);
      setPhase("complete");
    }, GHOST_DURATION);

    return () => {
      window.clearInterval(movement);
      window.clearInterval(clock);
      window.clearTimeout(ending);
    };
  }, [phase, run]);

  function start() {
    setCaught(0);
    setFalseClicks(0);
    setSecondsLeft(GHOST_DURATION / 1000);
    setGhostPosition(randomIndex(GHOST_CELLS));
    setRun((value) => value + 1);
    setPhase("playing");
  }

  function chooseCell(index: number) {
    if (phase !== "playing") return;
    if (index === ghostPosition) {
      setCaught((value) => value + 1);
      setGhostPosition((current) => differentIndex(current ?? -1, GHOST_CELLS));
      return;
    }
    setFalseClicks((value) => value + 1);
  }

  return (
    <section className={styles.shell} aria-labelledby="ghost-title">
      <GameHeader
        id="ghost-title"
        title="Caça-fantasmas"
        metrics={[
          { label: "Tempo", value: `${secondsLeft}s` },
          { label: "Capturados", value: caught },
          { label: "Cliques vazios", value: falseClicks },
        ]}
      />
      <p className={styles.instructions}>
        Clique no fantasma sempre que ele aparecer. Cliques em casas vazias são registrados separadamente.
      </p>

      {phase === "ready" && <StartPanel onStart={start}>Você terá 20 segundos. O fantasma muda de lugar rapidamente.</StartPanel>}

      {phase === "playing" && (
        <div className={styles.ghostGrid} aria-label="Tabuleiro de caça-fantasmas">
          {Array.from({ length: GHOST_CELLS }, (_, index) => {
            const hasGhost = index === ghostPosition;
            return (
              <button
                className={`${styles.ghostCell} ${hasGhost ? styles.ghostVisible : ""}`}
                key={index}
                type="button"
                onClick={() => chooseCell(index)}
                aria-label={hasGhost ? `Fantasma na casa ${index + 1}. Capturar.` : `Casa ${index + 1} vazia.`}
              >
                <span aria-hidden="true">{hasGhost ? "👻" : "·"}</span>
              </button>
            );
          })}
        </div>
      )}

      {phase === "complete" && (
        <div className={styles.result} role="status">
          <strong>{caught} fantasma{caught === 1 ? "" : "s"} capturado{caught === 1 ? "" : "s"}</strong>
          <p>{falseClicks === 0 ? "Nenhum clique em casa vazia." : `${falseClicks} clique${falseClicks === 1 ? "" : "s"} em casa vazia.`}</p>
          <button className={styles.primaryButton} type="button" onClick={start}>Tentar novamente</button>
        </div>
      )}
    </section>
  );
}

const MATCH_SYMBOLS: NamedSymbol[] = [
  { glyph: "▲", name: "triângulo" },
  { glyph: "●", name: "círculo" },
  { glyph: "◆", name: "losango" },
  { glyph: "■", name: "quadrado" },
  { glyph: "★", name: "estrela" },
  { glyph: "✚", name: "cruz" },
];

const MATCH_ROUNDS = 12;

function createMatchTrial() {
  const leftIndex = randomIndex(MATCH_SYMBOLS.length);
  const matches = Math.random() < 0.5;
  const rightIndex = matches ? leftIndex : differentIndex(leftIndex, MATCH_SYMBOLS.length);
  return { leftIndex, rightIndex, matches };
}

function MatchJudgementGame() {
  const [phase, setPhase] = useState<GamePhase>("ready");
  const [trial, setTrial] = useState<ReturnType<typeof createMatchTrial> | null>(null);
  const [round, setRound] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [errors, setErrors] = useState(0);
  const [feedback, setFeedback] = useState("Compare os dois estímulos.");

  function start() {
    setTrial(createMatchTrial());
    setRound(0);
    setCorrect(0);
    setErrors(0);
    setFeedback("Os estímulos são iguais ou diferentes?");
    setPhase("playing");
  }

  function judge(answer: boolean) {
    if (phase !== "playing" || !trial) return;
    const isCorrect = answer === trial.matches;
    if (isCorrect) setCorrect((value) => value + 1);
    else setErrors((value) => value + 1);

    const nextRound = round + 1;
    setRound(nextRound);
    setFeedback(isCorrect ? "Correto." : `Eram ${trial.matches ? "iguais" : "diferentes"}.`);
    if (nextRound === MATCH_ROUNDS) {
      setPhase("complete");
      return;
    }
    setTrial(createMatchTrial());
  }

  return (
    <section className={styles.shell} aria-labelledby="match-title">
      <GameHeader
        id="match-title"
        title="Afirmou, bateu"
        metrics={[
          { label: "Rodada", value: phase === "playing" ? `${round + 1}/${MATCH_ROUNDS}` : `${round}/${MATCH_ROUNDS}` },
          { label: "Acertos", value: correct },
          { label: "Erros", value: errors },
        ]}
      />
      <p className={styles.instructions}>Observe os dois símbolos e julgue se eles são iguais ou diferentes.</p>

      {phase === "ready" && <StartPanel onStart={start}>Responda a 12 pares, um de cada vez.</StartPanel>}

      {phase === "playing" && trial && (
        <div className={styles.matchStage}>
          <div className={styles.stimulusPair} aria-label={`${MATCH_SYMBOLS[trial.leftIndex].name} e ${MATCH_SYMBOLS[trial.rightIndex].name}`}>
            <span aria-hidden="true">{MATCH_SYMBOLS[trial.leftIndex].glyph}</span>
            <span aria-hidden="true">{MATCH_SYMBOLS[trial.rightIndex].glyph}</span>
          </div>
          <div className={styles.binaryChoices}>
            <button className={styles.choiceButton} type="button" onClick={() => judge(true)}>Iguais</button>
            <button className={styles.choiceButton} type="button" onClick={() => judge(false)}>Diferentes</button>
          </div>
        </div>
      )}

      {phase === "complete" && (
        <div className={styles.result}>
          <strong>{correct} de {MATCH_ROUNDS} julgamentos corretos</strong>
          <p>Você pode repetir para praticar a comparação visual.</p>
          <button className={styles.primaryButton} type="button" onClick={start}>Jogar novamente</button>
        </div>
      )}
      <p className={styles.feedback} role="status" aria-live="polite">{feedback}</p>
    </section>
  );
}

const EMOJIS: NamedSymbol[] = [
  { glyph: "🙂", name: "rosto sorrindo suavemente" },
  { glyph: "😊", name: "rosto sorrindo com olhos fechados" },
  { glyph: "😌", name: "rosto aliviado" },
  { glyph: "🙃", name: "rosto de cabeça para baixo" },
  { glyph: "😎", name: "rosto com óculos escuros" },
  { glyph: "🤓", name: "rosto com óculos" },
  { glyph: "🧐", name: "rosto com monóculo" },
  { glyph: "🤔", name: "rosto pensativo" },
];

const EMOJI_ROUNDS = 8;

function createEmojiTrial() {
  const targetIndex = randomIndex(EMOJIS.length);
  const distractors = shuffle(
    EMOJIS.map((_, index) => index).filter((index) => index !== targetIndex),
  ).slice(0, 3);
  return { targetIndex, options: shuffle([targetIndex, ...distractors]) };
}

function EmojiTargetGame() {
  const [phase, setPhase] = useState<GamePhase>("ready");
  const [trial, setTrial] = useState<ReturnType<typeof createEmojiTrial> | null>(null);
  const [round, setRound] = useState(0);
  const [errors, setErrors] = useState(0);
  const [tried, setTried] = useState<number[]>([]);
  const [feedback, setFeedback] = useState("Compare cada opção com o emoji-alvo.");

  function start() {
    setTrial(createEmojiTrial());
    setRound(0);
    setErrors(0);
    setTried([]);
    setFeedback("Encontre o emoji exatamente igual ao alvo.");
    setPhase("playing");
  }

  function choose(optionIndex: number) {
    if (phase !== "playing" || !trial || tried.includes(optionIndex)) return;
    if (optionIndex !== trial.targetIndex) {
      setErrors((value) => value + 1);
      setTried((values) => [...values, optionIndex]);
      setFeedback("Esse emoji é diferente. Compare os detalhes e tente outra opção.");
      return;
    }

    const nextRound = round + 1;
    setRound(nextRound);
    setFeedback("Alvo encontrado.");
    if (nextRound === EMOJI_ROUNDS) {
      setPhase("complete");
      return;
    }
    setTrial(createEmojiTrial());
    setTried([]);
  }

  return (
    <section className={styles.shell} aria-labelledby="emoji-title">
      <GameHeader
        id="emoji-title"
        title="Emoji-alvo"
        metrics={[
          { label: "Alvos", value: `${round}/${EMOJI_ROUNDS}` },
          { label: "Tentativas incorretas", value: errors },
        ]}
      />
      <p className={styles.instructions}>Observe o alvo e selecione, entre quatro opções, o emoji exatamente igual.</p>

      {phase === "ready" && <StartPanel onStart={start}>São 8 alvos. Algumas opções têm diferenças bem discretas.</StartPanel>}

      {phase === "playing" && trial && (
        <div className={styles.emojiStage}>
          <div className={styles.emojiTarget}>
            <span>Alvo</span>
            <strong aria-label={EMOJIS[trial.targetIndex].name}>{EMOJIS[trial.targetIndex].glyph}</strong>
          </div>
          <div className={styles.emojiChoices} aria-label="Opções de emoji">
            {trial.options.map((optionIndex) => (
              <button
                className={styles.emojiButton}
                key={optionIndex}
                type="button"
                onClick={() => choose(optionIndex)}
                disabled={tried.includes(optionIndex)}
                aria-label={EMOJIS[optionIndex].name}
              >
                <span aria-hidden="true">{EMOJIS[optionIndex].glyph}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === "complete" && (
        <div className={styles.result}>
          <strong>{EMOJI_ROUNDS} alvos encontrados</strong>
          <p>{errors === 0 ? "Sem tentativas incorretas." : `${errors} tentativa${errors === 1 ? "" : "s"} incorreta${errors === 1 ? "" : "s"} durante a rodada.`}</p>
          <button className={styles.primaryButton} type="button" onClick={start}>Jogar novamente</button>
        </div>
      )}
      <p className={styles.feedback} role="status" aria-live="polite">{feedback}</p>
    </section>
  );
}

type TimingPhase = "ready" | "waiting" | "signal" | "result" | "early";

function TimingGame() {
  const [phase, setPhase] = useState<TimingPhase>("ready");
  const [delay, setDelay] = useState(2_000);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<number | null>(null);
  const [best, setBest] = useState<number | null>(null);
  const signalAt = useRef<number | null>(null);

  useEffect(() => {
    if (phase !== "waiting") return;
    const timer = window.setTimeout(() => {
      signalAt.current = performance.now();
      setPhase("signal");
    }, delay);
    return () => window.clearTimeout(timer);
  }, [delay, phase]);

  useEffect(() => {
    if (phase !== "signal") return;
    const timer = window.setTimeout(() => {
      signalAt.current = null;
      setResult(null);
      setPhase("result");
    }, 3_000);
    return () => window.clearTimeout(timer);
  }, [phase]);

  function begin() {
    signalAt.current = null;
    setDelay(1_800 + randomIndex(2_401));
    setAttempt((value) => value + 1);
    setResult(null);
    setPhase("waiting");
  }

  function press() {
    if (phase === "ready" || phase === "result" || phase === "early") {
      begin();
      return;
    }
    if (phase === "waiting") {
      setPhase("early");
      return;
    }
    if (phase === "signal" && signalAt.current !== null) {
      const elapsed = Math.round(performance.now() - signalAt.current);
      signalAt.current = null;
      setResult(elapsed);
      setBest((current) => current === null ? elapsed : Math.min(current, elapsed));
      setPhase("result");
    }
  }

  const buttonText = {
    ready: "Começar",
    waiting: "Espere…",
    signal: "CLIQUE AGORA",
    result: result === null ? "Tempo esgotado — tentar novamente" : `${result} ms — tentar novamente`,
    early: "Antes do sinal — tentar novamente",
  }[phase];

  const statusText = {
    ready: "Ao começar, espere a palavra AGORA aparecer.",
    waiting: "Aguarde o sinal. Não clique ainda.",
    signal: "Agora! Clique o mais rápido que conseguir.",
    result: result === null ? "Não houve clique nos três segundos após o sinal." : `Tempo de reação desta tentativa: ${result} milissegundos.`,
    early: "Você clicou antes do sinal. Essa tentativa não gerou um tempo.",
  }[phase];
  const timingStateClass = phase === "signal" ? styles.timing_signal : phase === "early" ? styles.timing_early : "";

  return (
    <section className={styles.shell} aria-labelledby="timing-title">
      <GameHeader
        id="timing-title"
        title="Clique no momento certo"
        metrics={[
          { label: "Tentativas", value: attempt },
          { label: "Melhor tempo", value: best === null ? "—" : `${best} ms` },
        ]}
      />
      <p className={styles.instructions}>Comece, espere o sinal e clique somente quando a tela mostrar “CLIQUE AGORA”.</p>
      <div className={`${styles.timingStage} ${timingStateClass}`}>
        <button type="button" onClick={press} aria-describedby="timing-status">
          {buttonText}
        </button>
      </div>
      <p className={styles.feedback} id="timing-status" role="status" aria-live="assertive">{statusText}</p>
      <p className={styles.dataNote}>O tempo é medido pelo navegador neste dispositivo e pode variar conforme tela, hardware e método de entrada.</p>
    </section>
  );
}

const CIRCLE_HITS = 15;
const CIRCLE_CELLS = 25;

function CircleHuntGame() {
  const [phase, setPhase] = useState<GamePhase>("ready");
  const [position, setPosition] = useState(0);
  const [hits, setHits] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const startedAt = useRef(0);

  useEffect(() => {
    if (phase !== "playing") return;
    const timer = window.setInterval(() => {
      setElapsed(performance.now() - startedAt.current);
    }, 100);
    return () => window.clearInterval(timer);
  }, [phase]);

  function start() {
    startedAt.current = performance.now();
    setPosition(randomIndex(CIRCLE_CELLS));
    setHits(0);
    setElapsed(0);
    setPhase("playing");
  }

  function hitCircle() {
    if (phase !== "playing") return;
    const nextHits = hits + 1;
    const nextElapsed = performance.now() - startedAt.current;
    setHits(nextHits);
    setElapsed(nextElapsed);
    if (nextHits === CIRCLE_HITS) {
      setPhase("complete");
      return;
    }
    setPosition((current) => differentIndex(current, CIRCLE_CELLS));
  }

  const row = Math.floor(position / 5) + 1;
  const column = (position % 5) + 1;

  return (
    <section className={styles.shell} aria-labelledby="circle-title">
      <GameHeader
        id="circle-title"
        title="Caça-círculos"
        metrics={[
          { label: "Círculos", value: `${hits}/${CIRCLE_HITS}` },
          { label: "Tempo", value: `${(elapsed / 1000).toFixed(1)}s` },
        ]}
      />
      <p className={styles.instructions}>Clique no círculo verde. A cada acerto, ele muda para uma nova posição.</p>

      {phase === "ready" && <StartPanel onStart={start}>Encontre 15 círculos. O cronômetro começa junto com o primeiro alvo.</StartPanel>}

      {phase === "playing" && (
        <div className={styles.circleGrid} aria-label="Área do caça-círculos">
          <button
            className={styles.circleTarget}
            type="button"
            onClick={hitCircle}
            style={{ gridColumn: column, gridRow: row }}
            aria-label={`Círculo ${hits + 1} de ${CIRCLE_HITS}, linha ${row}, coluna ${column}`}
          />
        </div>
      )}

      {phase === "complete" && (
        <div className={styles.result} role="status">
          <strong>15 círculos em {(elapsed / 1000).toFixed(1)} segundos</strong>
          <p>O cronômetro registra o intervalo entre o início e o último clique.</p>
          <button className={styles.primaryButton} type="button" onClick={start}>Tentar novamente</button>
        </div>
      )}
    </section>
  );
}

const SEARCH_SYMBOLS: NamedSymbol[] = [
  { glyph: "◇", name: "losango vazio" },
  { glyph: "◆", name: "losango preenchido" },
  { glyph: "○", name: "círculo vazio" },
  { glyph: "●", name: "círculo preenchido" },
  { glyph: "□", name: "quadrado vazio" },
  { glyph: "■", name: "quadrado preenchido" },
  { glyph: "△", name: "triângulo vazio" },
  { glyph: "▲", name: "triângulo preenchido" },
  { glyph: "☆", name: "estrela vazia" },
  { glyph: "★", name: "estrela preenchida" },
];

const SEARCH_CELLS = 30;
const SEARCH_ROUNDS = 6;

function createSearchPuzzle() {
  const targetIndex = randomIndex(SEARCH_SYMBOLS.length);
  const distractorIndices = SEARCH_SYMBOLS.map((_, index) => index).filter((index) => index !== targetIndex);
  const cells = Array.from({ length: SEARCH_CELLS }, () => distractorIndices[randomIndex(distractorIndices.length)]);
  const targetCell = randomIndex(SEARCH_CELLS);
  cells[targetCell] = targetIndex;
  return { targetIndex, targetCell, cells };
}

function SymbolSearchGame() {
  const [phase, setPhase] = useState<GamePhase>("ready");
  const [puzzle, setPuzzle] = useState<ReturnType<typeof createSearchPuzzle> | null>(null);
  const [round, setRound] = useState(0);
  const [errors, setErrors] = useState(0);
  const [feedback, setFeedback] = useState("Localize o símbolo-alvo na grade.");

  function start() {
    setPuzzle(createSearchPuzzle());
    setRound(0);
    setErrors(0);
    setFeedback("Há uma ocorrência do alvo na grade.");
    setPhase("playing");
  }

  function chooseCell(cellIndex: number) {
    if (phase !== "playing" || !puzzle) return;
    if (cellIndex !== puzzle.targetCell) {
      setErrors((value) => value + 1);
      setFeedback("Esse não é o alvo. Continue procurando.");
      return;
    }

    const nextRound = round + 1;
    setRound(nextRound);
    setFeedback("Símbolo encontrado.");
    if (nextRound === SEARCH_ROUNDS) {
      setPhase("complete");
      return;
    }
    setPuzzle(createSearchPuzzle());
  }

  return (
    <section className={styles.shell} aria-labelledby="search-title">
      <GameHeader
        id="search-title"
        title="Busca do símbolo"
        metrics={[
          { label: "Encontrados", value: `${round}/${SEARCH_ROUNDS}` },
          { label: "Tentativas incorretas", value: errors },
        ]}
      />
      <p className={styles.instructions}>Encontre na grade o símbolo exatamente igual ao alvo mostrado.</p>

      {phase === "ready" && <StartPanel onStart={start}>São 6 grades, cada uma com um único alvo entre símbolos parecidos.</StartPanel>}

      {phase === "playing" && puzzle && (
        <div className={styles.searchStage}>
          <div className={styles.symbolTarget}>
            <span>Procure</span>
            <strong aria-label={SEARCH_SYMBOLS[puzzle.targetIndex].name}>{SEARCH_SYMBOLS[puzzle.targetIndex].glyph}</strong>
          </div>
          <div className={styles.symbolGrid} aria-label="Grade de símbolos">
            {puzzle.cells.map((symbolIndex, cellIndex) => (
              <button
                key={cellIndex}
                type="button"
                onClick={() => chooseCell(cellIndex)}
                aria-label={`Posição ${cellIndex + 1}: ${SEARCH_SYMBOLS[symbolIndex].name}`}
              >
                <span aria-hidden="true">{SEARCH_SYMBOLS[symbolIndex].glyph}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === "complete" && (
        <div className={styles.result}>
          <strong>{SEARCH_ROUNDS} símbolos encontrados</strong>
          <p>{errors === 0 ? "Nenhuma tentativa incorreta." : `${errors} tentativa${errors === 1 ? "" : "s"} incorreta${errors === 1 ? "" : "s"}.`}</p>
          <button className={styles.primaryButton} type="button" onClick={start}>Jogar novamente</button>
        </div>
      )}
      <p className={styles.feedback} role="status" aria-live="polite">{feedback}</p>
    </section>
  );
}

export function AttentionGame({ slug }: { slug: string }) {
  const normalizedSlug = slug.replace(/^\/+|\/+$/g, "").toLowerCase();

  if (normalizedSlug === "desafiodascores") return <StroopGame />;
  if (normalizedSlug === "caca-fantasmas-agilidade-atencao") return <GhostHuntGame />;
  if (normalizedSlug === "afirmou-bateu") return <MatchJudgementGame />;
  if (normalizedSlug === "emojialvo") return <EmojiTargetGame />;
  if (normalizedSlug === "cliquenomomentocerto") return <TimingGame />;
  if (normalizedSlug === "cacacirculos") return <CircleHuntGame />;
  if (normalizedSlug === "buscadosímbolo") return <SymbolSearchGame />;
  return null;
}
