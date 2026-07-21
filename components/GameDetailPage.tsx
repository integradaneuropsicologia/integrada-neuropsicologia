import Link from "next/link";
import { CognitiveGame } from "@/components/CognitiveGame";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import type { GameDefinition } from "@/lib/game-data";
import { whatsappUrl } from "@/lib/site-data";

export function GameDetailPage({ game }: { game: GameDefinition }) {
  const contactUrl = whatsappUrl(`Olá! Conheci o jogo ${game.title} no site e gostaria de orientação sobre atenção, memória ou planejamento.`);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="simple-hero game-detail-hero">
          <Link className="game-back-link" href="/jogosdeestimulaçãomental">← Todos os jogos</Link>
          <span className="eyebrow">{game.category}</span>
          <h1>{game.title}</h1>
          <p>{game.description}</p>
        </section>
        <section className="games-section"><CognitiveGame game={game} /></section>
        <section className="game-care-band">
          <div>
            <span className="eyebrow">Orientação responsável</span>
            <h2>Um exercício breve não avalia o funcionamento cognitivo.</h2>
            <p>Jogos podem oferecer estímulo e lazer, mas desempenho isolado não confirma nem descarta qualquer condição. Dificuldades persistentes no cotidiano merecem uma avaliação profissional individualizada.</p>
          </div>
          <div className="game-care-actions">
            <a className="button button-green" href={contactUrl} target="_blank" rel="noreferrer">Conversar com a equipe</a>
            <Link className="text-link" href="/jogosdeestimulaçãomental">Escolher outro jogo →</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
