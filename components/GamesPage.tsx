import Link from "next/link";
import { BrainGames } from "@/components/BrainGames";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { gameLibrary } from "@/lib/game-data";

export function GamesPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="simple-hero">
          <span className="eyebrow">Estimulação mental</span>
          <h1>Jogos rápidos para colocar a mente em movimento.</h1>
          <p>Escolha uma atividade gratuita de memória, atenção, linguagem ou planejamento. Jogue no seu ritmo e volte quando quiser.</p>
        </section>
        <section className="content-section game-library-section">
          <div className="section-heading">
            <span className="eyebrow">Biblioteca gratuita</span>
            <h2>20 atividades, diferentes formas de estimular.</h2>
            <p>Cada jogo propõe um treino curto. Escolha pelo tipo de habilidade que deseja exercitar.</p>
          </div>
          <div className="game-library-grid">
            {gameLibrary.map((game, index) => (
              <Link key={game.slug} href={`/${game.slug}`} className="game-library-card">
                <span className="game-card-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="game-card-category">{game.category}</span>
                <h3>{game.title}</h3>
                <p>{game.description}</p>
                <strong>Jogar agora →</strong>
              </Link>
            ))}
          </div>
        </section>
        <section className="games-section games-featured">
          <div className="section-heading">
            <span className="eyebrow">Comece por aqui</span>
            <h2>Encontre os pares.</h2>
            <p>Uma rodada curta de memória visual, disponível diretamente nesta página.</p>
          </div>
          <BrainGames />
        </section>
        <section className="content-section compact game-disclaimer">
          <div className="section-heading">
            <span className="eyebrow">Importante</span>
            <h2>Jogos são estímulo, não diagnóstico.</h2>
            <p>O desempenho varia por muitos fatores e não substitui testes validados nem avaliação clínica. Alterações persistentes de memória, atenção ou organização merecem orientação profissional.</p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
