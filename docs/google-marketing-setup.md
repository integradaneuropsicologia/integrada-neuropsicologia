# Google Tag Manager, GA4 e Google Ads

Este projeto contém a `dataLayer`, os eventos sanitizados, o Consent Mode v2 e o contêiner real do Google Tag Manager instalado em todas as páginas. O GA4 e o Google Ads não são carregados diretamente pelo código do site: suas tags devem ser configuradas dentro do GTM.

## Identificadores

Recebidos e validados por formato:

- Google Tag Manager: `GTM-KHPMDWM9`;
- GA4 – ID de mensuração: `G-KN0F1TETG2`;
- Google Tag do GA4: `GT-NCN22HRP`;
- Google Ads: `AW-16711609590`;
- Google Tag do Google Ads: `GT-WF83BXXS`;
- conversão “Formulário para WhatsApp”: `u7ZRCJK1utQcEPbZ26A-`;
- conversão “WhatsApp direto”: `w6oWCJW1utQcEPbZ26A-`.

Somente o ID do contêiner entra no código do site. Os demais identificadores ficam nas tags nativas do próprio GTM. Não instalar o snippet manual de `gtag.js`, pois isso duplicaria a arquitetura gerenciada pelo GTM.

## Contrato da página

URL final para anúncios:

`https://integradaneuropsicologia.com.br/avaliacao-neuropsicologica-online-adultos`

O subdomínio `www` continua hospedado no Wix; por isso, ele não deve ser usado na URL final desta campanha.

Eventos disponíveis:

| Evento | Uso | Parâmetros permitidos |
| --- | --- | --- |
| `whatsapp_click` | CTA direto para WhatsApp | `cta_location`, `contact_method`, `page_type` |
| `lead_form_start` | primeira interação, uma vez por formulário | `form_location`, `page_type` |
| `lead_form_submit` | envio válido antes do redirecionamento | `form_location`, `contact_method`, `page_type` |
| `phone_click` | telefone do rodapé | `cta_location`, `contact_method`, `page_type` |
| `google_reviews_click` | avaliações no Google | `cta_location`, `destination`, `page_type` |

Não criar variáveis de formulário, DOM, clique ou URL que capturem nome, interesse, texto, telefone pessoal, mensagem ou destino completo do WhatsApp.

## Configuração do contêiner

1. Tag nativa **Google Tag** com `GT-NCN22HRP` e acionamento `Initialization – All Pages`; ela está associada ao fluxo `G-KN0F1TETG2`.
2. Tag nativa **Google Tag** com `AW-16711609590` e acionamento `Initialization – All Pages`.
3. Tag nativa **Conversion Linker** com acionamento `All Pages`.
4. Acionadores de evento personalizado, com correspondência exata, para os cinco eventos da tabela acima.
5. Somente estas variáveis de camada de dados: `cta_location`, `form_location`, `contact_method`, `page_type` e `destination`.
6. Eventos do GA4:
   - `whatsapp_click` a partir do evento homônimo;
   - `generate_lead` a partir de `lead_form_submit`;
   - os três eventos secundários com seus nomes originais.
7. Duas tags nativas de conversão do Google Ads:
   - formulário para WhatsApp, acionada somente por `lead_form_submit`;
   - WhatsApp direto, acionada somente por `whatsapp_click`.
8. Nas configurações de consentimento, GA4 exige `analytics_storage` e as conversões de Ads respeitam `ad_storage` e `ad_user_data`. `ad_personalization` permanece negado.

Não importar as duas conversões do GA4 para o Google Ads. A fonte oficial de conversão é a tag direta do Google Ads no GTM.

## Restrições de privacidade

- Desativar cliques de saída e interações com formulários na Medição otimizada do GA4.
- Não ativar conversões otimizadas, coleta automática de dados fornecidos pelo usuário, User-ID, Google Signals, remarketing ou públicos personalizados.
- Não usar Custom HTML, variáveis de DOM, Form variables ou Click URL para esta landing page.
- Não colocar conteúdo clínico, nome ou dados do formulário em UTMs.

## Validação obrigatória

Antes de publicar o site com o ID real, usar o Preview do GTM e o DebugView do GA4 para confirmar:

- um único carregamento do GTM, Google Tag e Conversion Linker;
- nenhuma conversão no carregamento da página;
- `lead_form_start` apenas uma vez em cada formulário;
- envio inválido sem `lead_form_submit`;
- envio válido com um único `lead_form_submit` antes do WhatsApp;
- CTA direto com somente `whatsapp_click`;
- ausência de nome, interesse, mensagem, conteúdo clínico e URL do WhatsApp na `dataLayer` e na rede;
- consentimento negado e concedido em sessões separadas;
- fluxo completo em Android, iPhone/Safari e computador.

Depois do Preview, criar e publicar uma versão nomeada do contêiner. Só então publicar esta versão instrumentada da landing page.
