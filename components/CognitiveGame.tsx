import { AttentionGame } from "@/components/games/AttentionGames";
import { SpatialGame } from "@/components/games/SpatialGames";
import { ThinkingGame } from "@/components/games/ThinkingGames";
import type { GameDefinition } from "@/lib/game-data";

const spatialSlugs = new Set([
  "jogodolabirinto",
  "desafiohanoi",
  "resta-um-raciocinio-visual",
  "torredelondresdigital",
  "quebra-cabeçaemoji",
]);

const thinkingSlugs = new Set([
  "caca-rapida",
  "sequênciainteligente",
  "memóriamix",
  "intrusodaspalavras",
  "memorianumerica",
  "ordem-das-acoes",
  "palavra-emoji",
  "sequênciadascores",
]);

const attentionSlugs = new Set([
  "desafiodascores",
  "caca-fantasmas-agilidade-atencao",
  "afirmou-bateu",
  "emojialvo",
  "cliquenomomentocerto",
  "cacacirculos",
  "buscadosímbolo",
]);

export function CognitiveGame({ game }: { game: GameDefinition }) {
  if (spatialSlugs.has(game.slug)) return <SpatialGame slug={game.slug} />;
  if (thinkingSlugs.has(game.slug)) return <ThinkingGame slug={game.slug} />;
  if (attentionSlugs.has(game.slug)) return <AttentionGame slug={game.slug} />;

  return (
    <div className="game-shell">
      <h2>Atividade indisponível</h2>
      <p>Este exercício está sendo preparado. Escolha outro jogo na biblioteca.</p>
    </div>
  );
}
