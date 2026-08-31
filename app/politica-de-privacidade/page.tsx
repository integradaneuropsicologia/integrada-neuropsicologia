import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CookieSettingsButton } from "@/components/CookieConsent";
import { LANDING_PATH } from "@/lib/seo";
import { whatsappUrl } from "@/lib/site-data";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Entenda como a Integrada Neuropsicologia trata dados pessoais, informações do formulário, cookies e preferências de medição.",
  alternates: { canonical: "/politica-de-privacidade" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Integrada Neuropsicologia",
    url: "/politica-de-privacidade",
    title: "Política de Privacidade | Integrada Neuropsicologia",
    description: "Informações sobre dados pessoais, formulário, WhatsApp, cookies e direitos de privacidade.",
  },
};

const privacyContact = whatsappUrl("Olá! Gostaria de falar sobre privacidade e tratamento de dados pessoais.");

export default function PrivacyPolicyPage() {
  return (
    <div className="privacy-page">
      <header className="lp-header privacy-header">
        <Link className="lp-brand" href={LANDING_PATH}>
          <Image src="/assets/logo.png" alt="" width={38} height={38} unoptimized />
          <span><strong>Integrada</strong><small>Neuropsicologia</small></span>
        </Link>
        <Link className="lp-header-cta" href={LANDING_PATH}>Voltar à avaliação</Link>
      </header>

      <main>
        <section className="privacy-hero">
          <span className="lp-section-label">Privacidade e proteção de dados</span>
          <h1>Política de Privacidade</h1>
          <p>Esta política explica, em linguagem direta, como dados pessoais, informações preenchidas no formulário e preferências de cookies são tratados nesta landing page de avaliação neuropsicológica on-line.</p>
          <time dateTime="2026-08-31">Última atualização: 31 de agosto de 2026</time>
        </section>

        <div className="privacy-content">
          <aside className="privacy-summary">
            <strong>Resumo do formulário</strong>
            <p>Os dados preenchidos apenas preparam a mensagem que você revisará no WhatsApp. O conteúdo do formulário não é armazenado neste site. Com sua autorização para publicidade, uma referência técnica do clique em anúncio pode ser incluída no rascunho para medir leads qualificados; ela pode ser revisada e removida antes do envio.</p>
          </aside>

          <section>
            <h2>1. Quem é responsável pelo tratamento</h2>
            <p>A Integrada Neuropsicologia é responsável pelas decisões de tratamento relacionadas ao contato inicial realizado por este site e aos atendimentos que venham a ser contratados.</p>
            <ul>
              <li><strong>Responsável técnica:</strong> Carla Luciana da Conceição Lima — Psicóloga, CRP 08/39739.</li>
              <li><strong>Endereço profissional:</strong> Rua Jacarezinho, 1266, Mercês, Curitiba/PR, CEP 80810-130.</li>
              <li><strong>Canal para privacidade:</strong> <a href={privacyContact} target="_blank" rel="noreferrer">WhatsApp (41) 99211-3665</a>.</li>
            </ul>
          </section>

          <section>
            <h2>2. Quais informações podem ser tratadas</h2>
            <p>Podemos tratar o nome informado, a opção escolhida sobre a principal dúvida e o contexto que você decidir escrever. Como esse contexto pode conter informação relacionada à saúde, pedimos que envie apenas o necessário para o primeiro contato e não inclua exames, documentos ou detalhes excessivos.</p>
            <p>Também podem existir dados técnicos de navegação, como endereço IP, data e horário, navegador, dispositivo, páginas acessadas e eventos gerais de interação. Quando a visita vem de um anúncio, os identificadores técnicos <code>GCLID</code>, <code>GBRAID</code> ou <code>WBRAID</code> podem ser tratados somente após sua autorização para publicidade. Dados de medição ou publicidade somente podem ser associados a cookies opcionais conforme a sua escolha.</p>
          </section>

          <section>
            <h2>3. Como funciona o formulário e o WhatsApp</h2>
            <p>O preenchimento acontece no seu navegador. Ao selecionar o botão de envio, o site monta um link com a mensagem e abre o ambiente do WhatsApp para sua revisão. O site não mantém uma cópia do conteúdo em banco de dados próprio.</p>
            <p>Se a visita veio de um anúncio e a autorização para publicidade estiver válida, o rascunho também pode receber uma linha de referência técnica com <code>GCLID</code>, <code>GBRAID</code> ou <code>WBRAID</code>. Essa linha não descreve sua saúde e pode ser revisada ou apagada por você antes do envio. Se ela for removida, a qualificação offline daquele contato não será atribuída ao anúncio.</p>
            <p>A mensagem é transferida ao ambiente do WhatsApp quando o link é aberto, e a equipe da Integrada recebe o conteúdo quando você confirma o envio. O WhatsApp é um serviço independente e aplica seus próprios termos e sua <a href="https://www.whatsapp.com/legal/privacy-policy?lang=pt_BR" target="_blank" rel="noreferrer">Política de Privacidade</a>.</p>
          </section>

          <section>
            <h2>4. Para quais finalidades usamos dados</h2>
            <ul>
              <li>responder ao contato e compreender, de forma inicial, o serviço procurado;</li>
              <li>explicar o funcionamento da avaliação e organizar os próximos passos solicitados;</li>
              <li>manter segurança, prevenir abuso e operar o site;</li>
              <li>cumprir deveres legais, regulatórios e profissionais;</li>
              <li>medir desempenho do site e de campanhas somente conforme as preferências escolhidas;</li>
              <li>atribuir ao anúncio, por identificador técnico, contatos que a equipe posteriormente classificar como leads qualificados.</li>
            </ul>
            <p>O tratamento pode se apoiar no consentimento, em providências solicitadas antes de uma eventual contratação e nas demais bases legais aplicáveis aos serviços de saúde e às obrigações profissionais. Quando o consentimento for a base utilizada, ele poderá ser revogado.</p>
          </section>

          <section>
            <h2>5. Cookies e armazenamento no navegador</h2>
            <p>A escolha de privacidade é guardada localmente no seu navegador por até 180 dias. Esse registro é necessário para lembrar a sua decisão e não contém a informação digitada no formulário.</p>
            <p>Essa escolha controla apenas esta landing page no domínio sem <code>www</code>. O site institucional em <a href="https://www.integradaneuropsicologia.com.br" target="_blank" rel="noreferrer">www.integradaneuropsicologia.com.br</a> é uma origem separada, hospedada no Wix, e pode apresentar preferências próprias.</p>
            <div className="privacy-table-wrap">
              <table>
                <thead><tr><th>Categoria</th><th>Finalidade</th><th>Quando é usada</th></tr></thead>
                <tbody>
                  <tr><td>Necessários</td><td>Lembrar preferências de privacidade e manter segurança e funcionamento. A hospedagem pode usar o cookie <code>__cf_bm</code> para proteção contra tráfego automatizado e abuso.</td><td>Sempre que necessário para operar e proteger o site. Esses recursos não são desligados pelo painel de preferências.</td></tr>
                  <tr><td>Medição de audiência</td><td>Entender visitas, páginas e desempenho geral, sem enviar o conteúdo do formulário.</td><td>Cookies e armazenamento analítico somente após autorização. Com a escolha negada, a configuração de consentimento informa esse estado às ferramentas.</td></tr>
                  <tr><td>Publicidade e conversões</td><td>Avaliar a efetividade de campanhas e medir leads qualificados por identificadores técnicos de clique, sem enviar ao Google o texto do formulário, nome, telefone ou informação clínica.</td><td>Cookies e armazenamento publicitário somente após autorização. Em visitas de anúncio, uma referência técnica pode ser incluída no rascunho do WhatsApp. Não usamos personalização de anúncios para condições de saúde.</td></tr>
                </tbody>
              </table>
            </div>
            <p>Você pode mudar ou retirar sua autorização a qualquer momento:</p>
            <CookieSettingsButton className="privacy-cookie-button" />
          </section>

          <section>
            <h2>6. Publicidade e informações de saúde</h2>
            <p>O conteúdo clínico digitado no formulário não é enviado às ferramentas de medição ou publicidade e não é usado pela Integrada para formar públicos de anúncios personalizados. Eventos genéricos, como a abertura do contato pelo WhatsApp, podem ser medidos quando houver ferramenta ativa e consentimento aplicável.</p>
            <p>Para medir a qualidade dos contatos, a equipe pode registrar em uma planilha técnica apenas o nome da ação de conversão, data e hora da qualificação, <code>GCLID</code>, <code>GBRAID</code> ou <code>WBRAID</code> disponível, um identificador de deduplicação e o estado “qualificado”. Essa planilha é conectada ao Google Ads Data Manager e não recebe nome, telefone, e-mail, mensagem do WhatsApp, queixa, hipótese diagnóstica ou outro dado clínico.</p>
          </section>

          <section>
            <h2>7. Compartilhamento e transferências</h2>
            <p>Dados podem ser processados por fornecedores necessários à operação, como hospedagem, WhatsApp/Meta e ferramentas do Google para gestão de tags, medição, planilha técnica e publicidade, configuradas para respeitar suas preferências de consentimento. Esses fornecedores podem operar infraestrutura fora do Brasil e possuem regras próprias de privacidade e segurança. Consulte também <a href="https://policies.google.com/technologies/partner-sites?hl=pt-BR" target="_blank" rel="noreferrer">como o Google usa informações de sites que utilizam seus serviços</a>.</p>
            <p>Não comercializamos as informações preenchidas no formulário.</p>
          </section>

          <section>
            <h2>8. Retenção e segurança</h2>
            <p>O conteúdo do formulário não é retido por este site. Depois do envio no WhatsApp, as mensagens e informações relacionadas a um atendimento podem ser mantidas pelo tempo necessário às finalidades informadas e ao cumprimento de obrigações legais, regulatórias e profissionais.</p>
            <p>As referências técnicas usadas para qualificação offline ficam separadas do conteúdo clínico e são mantidas somente pelo período necessário à importação, deduplicação e conferência da atribuição, observada a janela aplicável do Google Ads. O acesso à planilha é restrito às pessoas responsáveis pela medição.</p>
            <p>Adotamos medidas razoáveis para limitar acesso e proteger os dados. Nenhuma transmissão ou sistema, porém, pode ser considerado absolutamente livre de riscos.</p>
          </section>

          <section>
            <h2>9. Seus direitos</h2>
            <p>Nos termos aplicáveis, você pode solicitar confirmação de tratamento, acesso, correção, informação sobre compartilhamento, anonimização, bloqueio ou eliminação, portabilidade quando cabível e revogação do consentimento.</p>
            <p>Para exercer seus direitos, fale conosco pelo <a href={privacyContact} target="_blank" rel="noreferrer">canal de privacidade no WhatsApp</a>. Poderemos pedir informações mínimas para confirmar sua identidade e proteger seus dados.</p>
          </section>

          <section>
            <h2>10. Pessoas com menos de 18 anos e alterações</h2>
            <p>Esta landing page é direcionada a pessoas com 18 anos ou mais. A política pode ser atualizada para refletir mudanças nos serviços, nas ferramentas utilizadas ou nas regras aplicáveis. A data da versão mais recente será sempre informada no início desta página.</p>
          </section>
        </div>
      </main>

      <footer className="privacy-footer">
        <span>© {new Date().getFullYear()} Integrada Neuropsicologia</span>
        <Link href={LANDING_PATH}>Avaliação neuropsicológica on-line para adultos</Link>
      </footer>
    </div>
  );
}
