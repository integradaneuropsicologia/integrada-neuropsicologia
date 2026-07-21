"use client";

import { useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import styles from "./SpatialGames.module.css";

type Position = readonly [row: number, column: number];

const MAZE = [
  ".......",
  "#####..",
  "....#..",
  ".##.#.#",
  ".#....#",
  ".####..",
  "......E",
] as const;
const MAZE_START: Position = [0, 0];
const MAZE_EXIT: Position = [6, 6];
const KEY_MOVES: Record<string, Position> = {
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1],
};

function MazeGame() {
  const [player, setPlayer] = useState<Position>(MAZE_START);
  const [moves, setMoves] = useState(0);
  const [message, setMessage] = useState("Leve o ponto verde até a bandeira.");
  const complete = player[0] === MAZE_EXIT[0] && player[1] === MAZE_EXIT[1];

  function move([rowDelta, columnDelta]: Position) {
    if (complete) return;
    const nextRow = player[0] + rowDelta;
    const nextColumn = player[1] + columnDelta;
    const nextCell = MAZE[nextRow]?.[nextColumn];

    if (!nextCell || nextCell === "#") {
      setMessage("Há uma parede nessa direção. Tente outra rota.");
      return;
    }

    setPlayer([nextRow, nextColumn]);
    setMoves((current) => current + 1);
    setMessage(
      nextRow === MAZE_EXIT[0] && nextColumn === MAZE_EXIT[1]
        ? "Saída encontrada!"
        : "Caminho livre. Continue.",
    );
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    const direction = KEY_MOVES[event.key];
    if (!direction) return;
    event.preventDefault();
    move(direction);
  }

  function reset() {
    setPlayer(MAZE_START);
    setMoves(0);
    setMessage("Leve o ponto verde até a bandeira.");
  }

  return (
    <GameFrame
      eyebrow="Orientação visuoespacial"
      title="Encontre a saída"
      score={`${moves} movimento${moves === 1 ? "" : "s"}`}
      onReset={reset}
    >
      <p id="maze-instructions" className={styles.instructions}>
        Selecione o tabuleiro e use as setas do teclado, ou use os controles abaixo.
      </p>
      <div className={styles.mazeLayout}>
        <div
          className={styles.maze}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          aria-label="Labirinto de sete linhas e sete colunas"
          aria-describedby="maze-instructions maze-status"
        >
          {MAZE.flatMap((row, rowIndex) =>
            [...row].map((cell, columnIndex) => {
              const isPlayer = player[0] === rowIndex && player[1] === columnIndex;
              const isStart = rowIndex === MAZE_START[0] && columnIndex === MAZE_START[1];
              const isExit = cell === "E";
              const classNames = [
                styles.mazeCell,
                cell === "#" ? styles.mazeWall : styles.mazePath,
                isStart ? styles.mazeStart : "",
                isExit ? styles.mazeExit : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <span key={`${rowIndex}-${columnIndex}`} className={classNames} aria-hidden="true">
                  {isPlayer ? <span className={styles.player}>●</span> : isExit ? "⚑" : ""}
                </span>
              );
            }),
          )}
        </div>
        <div className={styles.dpad} aria-label="Controles do labirinto">
          <button className={styles.up} type="button" onClick={() => move([-1, 0])} aria-label="Mover para cima">↑</button>
          <button className={styles.left} type="button" onClick={() => move([0, -1])} aria-label="Mover para a esquerda">←</button>
          <button className={styles.down} type="button" onClick={() => move([1, 0])} aria-label="Mover para baixo">↓</button>
          <button className={styles.right} type="button" onClick={() => move([0, 1])} aria-label="Mover para a direita">→</button>
        </div>
      </div>
      <GameStatus id="maze-status" message={message} complete={complete} />
    </GameFrame>
  );
}

type Disk = 1 | 2 | 3;
type HanoiPegs = [Disk[], Disk[], Disk[]];
const HANOI_START: HanoiPegs = [[3, 2, 1], [], []];
const diskClasses: Record<Disk, string> = {
  1: styles.discSmall,
  2: styles.discMedium,
  3: styles.discLarge,
};

function cloneHanoiStart(): HanoiPegs {
  return HANOI_START.map((peg) => [...peg]) as HanoiPegs;
}

function HanoiGame() {
  const [pegs, setPegs] = useState<HanoiPegs>(cloneHanoiStart);
  const [selected, setSelected] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [message, setMessage] = useState("Escolha o pino que contém o disco que deseja mover.");
  const complete = pegs[2].length === 3;

  function choosePeg(index: number) {
    if (complete) return;

    if (selected === null) {
      if (pegs[index].length === 0) {
        setMessage("Esse pino está vazio. Escolha outro.");
        return;
      }
      setSelected(index);
      setMessage(`Pino ${index + 1} selecionado. Agora escolha o destino.`);
      return;
    }

    if (selected === index) {
      setSelected(null);
      setMessage("Seleção cancelada. Escolha um pino de origem.");
      return;
    }

    const source = pegs[selected];
    const target = pegs[index];
    const disk = source[source.length - 1];
    const targetTop = target[target.length - 1];

    if (targetTop !== undefined && targetTop < disk) {
      setMessage("Um disco maior não pode ficar sobre um menor.");
      return;
    }

    const next = pegs.map((peg) => [...peg]) as HanoiPegs;
    next[selected].pop();
    next[index].push(disk);
    const nextMoves = moves + 1;
    const solved = next[2].length === 3;
    setPegs(next);
    setSelected(null);
    setMoves(nextMoves);
    setMessage(solved ? `Desafio concluído em ${nextMoves} movimentos!` : "Movimento válido. Escolha a próxima origem.");
  }

  function reset() {
    setPegs(cloneHanoiStart());
    setSelected(null);
    setMoves(0);
    setMessage("Escolha o pino que contém o disco que deseja mover.");
  }

  return (
    <GameFrame eyebrow="Planejamento e lógica" title="Torre de Hanói" score={`${moves} de no mínimo 7`} onReset={reset}>
      <p className={styles.instructions}>
        Leve os três discos ao último pino. Mova um disco por vez e nunca coloque um disco maior sobre um menor.
      </p>
      <div className={styles.pegBoard} aria-label="Torre de Hanói com três pinos">
        {pegs.map((peg, index) => (
          <button
            key={index}
            type="button"
            className={`${styles.pegButton} ${selected === index ? styles.selectedPeg : ""}`}
            onClick={() => choosePeg(index)}
            aria-pressed={selected === index}
            aria-label={`Pino ${index + 1}: ${peg.length ? `discos ${[...peg].reverse().join(", ")} do topo para a base` : "vazio"}`}
          >
            <span className={styles.peg} aria-hidden="true" />
            <span className={styles.discStack} aria-hidden="true">
              {peg.map((disk) => <span key={disk} className={`${styles.disc} ${diskClasses[disk]}`}>{disk}</span>)}
            </span>
            <strong>Pino {index + 1}</strong>
          </button>
        ))}
      </div>
      <GameStatus message={message} complete={complete} />
    </GameFrame>
  );
}

const RESTA_VALID = [
  [false, true, true, true, false],
  [true, true, true, true, true],
  [true, true, true, true, true],
  [true, true, true, true, true],
  [false, true, true, true, false],
] as const;
const RESTA_CENTER = "2-2";

function holeKey(row: number, column: number) {
  return `${row}-${column}`;
}

function initialPegs() {
  const pegs = new Set<string>();
  RESTA_VALID.forEach((row, rowIndex) => {
    row.forEach((valid, columnIndex) => {
      const key = holeKey(rowIndex, columnIndex);
      if (valid && key !== RESTA_CENTER) pegs.add(key);
    });
  });
  return pegs;
}

function parseHole(value: string): Position {
  const [row, column] = value.split("-").map(Number);
  return [row, column];
}

function isLegalJump(from: string, to: string, pegs: Set<string>) {
  if (!pegs.has(from) || pegs.has(to)) return false;
  const [fromRow, fromColumn] = parseHole(from);
  const [toRow, toColumn] = parseHole(to);
  const rowDistance = toRow - fromRow;
  const columnDistance = toColumn - fromColumn;
  const isStraightJump =
    (Math.abs(rowDistance) === 2 && columnDistance === 0) ||
    (Math.abs(columnDistance) === 2 && rowDistance === 0);
  if (!isStraightJump || !RESTA_VALID[toRow]?.[toColumn]) return false;
  const middle = holeKey(fromRow + rowDistance / 2, fromColumn + columnDistance / 2);
  return pegs.has(middle);
}

function legalJumps(pegs: Set<string>) {
  const jumps: Array<readonly [string, string]> = [];
  pegs.forEach((from) => {
    const [row, column] = parseHole(from);
    [[-2, 0], [2, 0], [0, -2], [0, 2]].forEach(([rowDelta, columnDelta]) => {
      const to = holeKey(row + rowDelta, column + columnDelta);
      if (isLegalJump(from, to, pegs)) jumps.push([from, to]);
    });
  });
  return jumps;
}

function RestaUmGame() {
  const [pegs, setPegs] = useState(initialPegs);
  const [selected, setSelected] = useState<string | null>(null);
  const [moves, setMoves] = useState(0);
  const [message, setMessage] = useState("Escolha uma peça que possa saltar sobre outra.");
  const complete = pegs.size === 1;
  const remainingJumps = legalJumps(pegs);
  const stuck = !complete && remainingJumps.length === 0;
  const destinations = new Set(
    selected ? remainingJumps.filter(([from]) => from === selected).map(([, to]) => to) : [],
  );

  function chooseHole(target: string) {
    if (complete || stuck) return;

    if (pegs.has(target)) {
      if (selected === target) {
        setSelected(null);
        setMessage("Seleção cancelada.");
        return;
      }
      setSelected(target);
      const options = remainingJumps.filter(([from]) => from === target).length;
      setMessage(options ? "Agora escolha o espaço vazio de destino." : "Essa peça não tem um salto disponível.");
      return;
    }

    if (!selected) {
      setMessage("Primeiro escolha uma peça.");
      return;
    }

    if (!isLegalJump(selected, target, pegs)) {
      setMessage("O salto precisa passar por uma peça e terminar em um espaço vazio.");
      return;
    }

    const [fromRow, fromColumn] = parseHole(selected);
    const [toRow, toColumn] = parseHole(target);
    const middle = holeKey((fromRow + toRow) / 2, (fromColumn + toColumn) / 2);
    const next = new Set(pegs);
    next.delete(selected);
    next.delete(middle);
    next.add(target);
    const nextJumps = legalJumps(next);
    const nextMoves = moves + 1;
    setPegs(next);
    setSelected(null);
    setMoves(nextMoves);
    if (next.size === 1) setMessage(`Você deixou apenas uma peça em ${nextMoves} movimentos!`);
    else if (nextJumps.length === 0) setMessage("Não há mais saltos disponíveis. Reinicie e tente outro caminho.");
    else setMessage("Salto realizado. Planeje a próxima jogada.");
  }

  function reset() {
    setPegs(initialPegs());
    setSelected(null);
    setMoves(0);
    setMessage("Escolha uma peça que possa saltar sobre outra.");
  }

  return (
    <GameFrame eyebrow="Raciocínio visual" title="Resta Um" score={`${pegs.size} peças restantes`} onReset={reset}>
      <p className={styles.instructions}>
        Selecione uma peça e depois um espaço vazio a duas casas de distância. A peça saltada sai do tabuleiro.
      </p>
      <div className={styles.restaBoard} role="grid" aria-label="Tabuleiro de Resta Um com cinco linhas">
        {RESTA_VALID.flatMap((row, rowIndex) =>
          row.map((valid, columnIndex) => {
            const key = holeKey(rowIndex, columnIndex);
            if (!valid) return <span key={key} className={styles.invalidHole} aria-hidden="true" />;
            const occupied = pegs.has(key);
            const isSelected = selected === key;
            const isDestination = destinations.has(key);
            return (
              <button
                key={key}
                type="button"
                className={`${styles.hole} ${occupied ? styles.occupiedHole : ""} ${isSelected ? styles.selectedHole : ""} ${isDestination ? styles.destinationHole : ""}`}
                onClick={() => chooseHole(key)}
                aria-pressed={isSelected}
                aria-label={`Linha ${rowIndex + 1}, coluna ${columnIndex + 1}: ${occupied ? "com peça" : "vazio"}${isDestination ? ", destino possível" : ""}`}
              >
                {occupied ? <span aria-hidden="true" /> : null}
              </button>
            );
          }),
        )}
      </div>
      <GameStatus message={message} complete={complete} warning={stuck} />
    </GameFrame>
  );
}

type Ball = "verde" | "azul" | "vermelha";
type LondonPegs = [Ball[], Ball[], Ball[]];
const LONDON_CAPACITIES = [3, 2, 1] as const;
const LONDON_START: LondonPegs = [["verde", "vermelha"], ["azul"], []];
const LONDON_GOAL: LondonPegs = [["verde", "azul"], ["vermelha"], []];
const ballLabels: Record<Ball, string> = { verde: "V", azul: "Az", vermelha: "Vm" };
const ballClasses: Record<Ball, string> = {
  verde: styles.ballGreen,
  azul: styles.ballBlue,
  vermelha: styles.ballRed,
};

function cloneLondon(pegs: LondonPegs): LondonPegs {
  return pegs.map((peg) => [...peg]) as LondonPegs;
}

function londonSolved(pegs: LondonPegs) {
  return pegs.every((peg, pegIndex) =>
    peg.length === LONDON_GOAL[pegIndex].length && peg.every((ball, ballIndex) => ball === LONDON_GOAL[pegIndex][ballIndex]),
  );
}

function BallStack({ balls, compact = false }: { balls: Ball[]; compact?: boolean }) {
  return (
    <span className={`${styles.ballStack} ${compact ? styles.compactStack : ""}`} aria-hidden="true">
      {balls.map((ball) => (
        <span key={ball} className={`${styles.ball} ${ballClasses[ball]}`}>{ballLabels[ball]}</span>
      ))}
    </span>
  );
}

function TowerOfLondonGame() {
  const [pegs, setPegs] = useState<LondonPegs>(() => cloneLondon(LONDON_START));
  const [selected, setSelected] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [message, setMessage] = useState("Compare o tabuleiro com o objetivo e escolha uma bola para mover.");
  const complete = londonSolved(pegs);

  function choosePeg(index: number) {
    if (complete) return;
    if (selected === null) {
      if (!pegs[index].length) {
        setMessage("Esse pino está vazio. Escolha um pino com bola.");
        return;
      }
      setSelected(index);
      setMessage(`Pino ${index + 1} selecionado. Escolha o destino.`);
      return;
    }
    if (selected === index) {
      setSelected(null);
      setMessage("Seleção cancelada.");
      return;
    }
    if (pegs[index].length >= LONDON_CAPACITIES[index]) {
      setMessage(`O pino ${index + 1} comporta apenas ${LONDON_CAPACITIES[index]} bola${LONDON_CAPACITIES[index] === 1 ? "" : "s"}.`);
      return;
    }

    const next = cloneLondon(pegs);
    const movedBall = next[selected].pop();
    if (!movedBall) return;
    next[index].push(movedBall);
    const nextMoves = moves + 1;
    const solved = londonSolved(next);
    setPegs(next);
    setSelected(null);
    setMoves(nextMoves);
    setMessage(solved ? `Objetivo alcançado em ${nextMoves} movimentos!` : "Movimento realizado. Compare novamente com o objetivo.");
  }

  function reset() {
    setPegs(cloneLondon(LONDON_START));
    setSelected(null);
    setMoves(0);
    setMessage("Compare o tabuleiro com o objetivo e escolha uma bola para mover.");
  }

  return (
    <GameFrame eyebrow="Planejamento" title="Torre de Londres" score={`${moves} movimento${moves === 1 ? "" : "s"}`} onReset={reset}>
      <p className={styles.instructions}>
        Reproduza o objetivo movendo apenas a bola do topo. Os pinos comportam três, duas e uma bola, respectivamente.
      </p>
      <div className={styles.londonPanels}>
        <div>
          <h3>Seu tabuleiro</h3>
          <div className={styles.londonBoard} aria-label="Tabuleiro atual da Torre de Londres">
            {pegs.map((peg, index) => (
              <button
                key={index}
                type="button"
                className={`${styles.londonPeg} ${selected === index ? styles.selectedPeg : ""}`}
                onClick={() => choosePeg(index)}
                aria-pressed={selected === index}
                aria-label={`Pino ${index + 1}, capacidade ${LONDON_CAPACITIES[index]}: ${peg.length ? peg.join(", ") : "vazio"}`}
              >
                <span className={styles.londonPost} aria-hidden="true" />
                <BallStack balls={peg} />
                <strong>{index + 1}</strong>
              </button>
            ))}
          </div>
        </div>
        <div className={styles.goalPanel} aria-label="Configuração objetivo">
          <h3>Objetivo</h3>
          <div className={styles.goalBoard}>
            {LONDON_GOAL.map((peg, index) => (
              <span key={index} className={styles.goalPeg}>
                <span className={styles.goalPost} aria-hidden="true" />
                <BallStack balls={peg} compact />
                <strong>{index + 1}</strong>
              </span>
            ))}
          </div>
          <p>É possível chegar ao objetivo em 3 movimentos.</p>
        </div>
      </div>
      <GameStatus message={message} complete={complete} />
    </GameFrame>
  );
}

type Emoji = "🌞" | "🌱" | "🌳" | "🌧️" | "🌈" | "☁️" | "🌙" | "⭐";
type PuzzleTile = Emoji | null;
const PUZZLE_GOAL: PuzzleTile[] = ["🌞", "🌱", "🌳", "🌧️", "🌈", "☁️", "🌙", "⭐", null];
const PUZZLE_START: PuzzleTile[] = ["🌱", "🌧️", "🌳", "🌙", "⭐", null, "☁️", "🌞", "🌈"];

function puzzleSolved(tiles: PuzzleTile[]) {
  return tiles.every((tile, index) => tile === PUZZLE_GOAL[index]);
}

function adjacent(index: number, blankIndex: number) {
  const row = Math.floor(index / 3);
  const column = index % 3;
  const blankRow = Math.floor(blankIndex / 3);
  const blankColumn = blankIndex % 3;
  return Math.abs(row - blankRow) + Math.abs(column - blankColumn) === 1;
}

function EmojiPuzzleGame() {
  const [tiles, setTiles] = useState<PuzzleTile[]>(() => [...PUZZLE_START]);
  const [moves, setMoves] = useState(0);
  const [message, setMessage] = useState("Mova uma peça vizinha para o espaço vazio.");
  const complete = puzzleSolved(tiles);
  const blankIndex = tiles.indexOf(null);

  function moveTile(index: number) {
    if (complete || !adjacent(index, blankIndex)) return;
    const next = [...tiles];
    [next[index], next[blankIndex]] = [next[blankIndex], next[index]];
    const nextMoves = moves + 1;
    const solved = puzzleSolved(next);
    setTiles(next);
    setMoves(nextMoves);
    setMessage(solved ? `Imagem organizada em ${nextMoves} movimentos!` : "Peça movida. Observe o modelo e continue.");
  }

  function reset() {
    setTiles([...PUZZLE_START]);
    setMoves(0);
    setMessage("Mova uma peça vizinha para o espaço vazio.");
  }

  return (
    <GameFrame eyebrow="Percepção visual" title="Quebra-cabeça Emoji" score={`${moves} movimento${moves === 1 ? "" : "s"}`} onReset={reset}>
      <p className={styles.instructions}>
        Organize os emojis como no modelo. Só as peças ao lado do espaço vazio podem se mover.
      </p>
      <div className={styles.puzzleLayout}>
        <div className={styles.puzzleBoard} aria-label="Quebra-cabeça deslizante três por três">
          {tiles.map((tile, index) =>
            tile ? (
              <button
                key={tile}
                type="button"
                className={`${styles.puzzleTile} ${adjacent(index, blankIndex) ? styles.movableTile : ""}`}
                onClick={() => moveTile(index)}
                disabled={!adjacent(index, blankIndex) || complete}
                aria-label={`Mover emoji ${tile}, posição ${index + 1}`}
              >
                <span aria-hidden="true">{tile}</span>
              </button>
            ) : (
              <span key="blank" className={styles.blankTile} aria-label="Espaço vazio" />
            ),
          )}
        </div>
        <div className={styles.puzzleGoal}>
          <h3>Modelo</h3>
          <div aria-label="Ordem correta dos emojis">
            {PUZZLE_GOAL.map((tile, index) => (
              <span key={tile ?? "goal-blank"} aria-label={tile ? `Posição ${index + 1}: ${tile}` : "Posição 9: vazia"}>{tile}</span>
            ))}
          </div>
        </div>
      </div>
      <GameStatus message={message} complete={complete} />
    </GameFrame>
  );
}

function GameFrame({
  eyebrow,
  title,
  score,
  onReset,
  children,
}: {
  eyebrow: string;
  title: string;
  score: string;
  onReset: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className={styles.game} aria-labelledby="spatial-game-title">
      <header className={styles.toolbar}>
        <div>
          <span className={styles.eyebrow}>{eyebrow}</span>
          <h2 id="spatial-game-title">{title}</h2>
        </div>
        <div className={styles.score}>
          <strong>{score}</strong>
          <button type="button" onClick={onReset}>Reiniciar</button>
        </div>
      </header>
      {children}
    </section>
  );
}

function GameStatus({ id, message, complete = false, warning = false }: { id?: string; message: string; complete?: boolean; warning?: boolean }) {
  return (
    <p id={id} className={`${styles.status} ${complete ? styles.success : ""} ${warning ? styles.warning : ""}`} role="status" aria-live="polite">
      <span aria-hidden="true">{complete ? "✓" : warning ? "!" : "→"}</span>
      {message}
    </p>
  );
}

export function SpatialGame({ slug }: { slug: string }) {
  if (slug === "jogodolabirinto") return <MazeGame />;
  if (slug === "desafiohanoi") return <HanoiGame />;
  if (slug === "resta-um-raciocinio-visual") return <RestaUmGame />;
  if (slug === "torredelondresdigital") return <TowerOfLondonGame />;
  if (slug === "quebra-cabeçaemoji") return <EmojiPuzzleGame />;
  return null;
}
