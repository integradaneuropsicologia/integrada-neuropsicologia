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
- conversão “WhatsApp direto”: `w6oWCJW1utQcEPbZ26A-`;
- conversão offline “Neuro Online | Lead qualificado”: criada em 31/08/2026 como secundária, sem valor, contagem “uma”, janela de clique de 30 dias e atribuição baseada em dados.

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
2. Tag nativa **Google Tag** com `AW-16711609590`, acionamento `Initialization – All Pages` e parâmetro de configuração `send_page_view = false`. A conta do Ads também está ligada ao fluxo do site Wix; esse parâmetro mantém a tag base e a atribuição do Ads sem enviar uma segunda visualização da landing ao fluxo `G-B608CFXF76`.
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

## Qualificação offline de leads

A fonte de dados **Neuro Online | Leads qualificados** foi conectada diretamente ao Google Ads Data Manager. A conexão é executada diariamente entre 13:00 e 14:00 (GMT-03:00) e importa somente registros cujo campo **qualification_status** seja igual a **qualified**.

Cabeçalhos da planilha:

    conversion_action | conversion_date_time | gclid | gbraid | wbraid | order_id | qualification_status

Campos enviados ao Google Ads:

- **conversion_date_time** → data/hora da conversão;
- **gclid** → GCLID;
- **gbraid** → GBRAID;
- **wbraid** → WBRAID;
- **order_id** → ID da transação, usado para deduplicação.

O campo **qualification_status** é usado apenas no filtro da conexão. A ação de conversão já foi escolhida na configuração, portanto **conversion_action** funciona como referência operacional da planilha.

Fluxo de operação:

1. Quando a pessoa autoriza publicidade e chega por anúncio, a landing pode acrescentar ao rascunho do WhatsApp uma linha “Referência do anúncio” com GCLID, GBRAID ou WBRAID.
2. A pessoa revisa o rascunho e pode remover essa linha antes de enviar.
3. A equipe só cria uma linha na planilha quando o contato for efetivamente classificado como lead qualificado.
4. Usar a data e a hora em que a qualificação ocorreu, com fuso explícito, por exemplo: **2026-08-31T14:30:00-03:00**.
5. Preencher apenas um identificador de clique por linha, salvo quando houver mais de um identificador realmente recebido.
6. Criar um **order_id** opaco e único, sem nome, telefone ou iniciais, por exemplo: **ql-20260831-0001**.
7. Preencher **qualification_status** exatamente como **qualified**.
8. Atualizar a planilha antes do horário da execução diária e conferir diagnósticos no Google Ads após o processamento.

Não copiar para a planilha nome, telefone, e-mail, país de residência, texto do WhatsApp, queixa, hipótese diagnóstica ou qualquer informação clínica. A conversão permanece secundária e fora da otimização de lances durante 2 a 3 ciclos de validação. Só depois de uploads estáveis deve ser avaliada a migração do objetivo da campanha para o lead qualificado.

## Validação obrigatória

Antes de publicar o site com o ID real, usar o Preview do GTM e o DebugView do GA4 para confirmar:

- um único carregamento do GTM, de cada Google Tag e do Conversion Linker;
- `page_view` da landing enviado somente ao fluxo `G-KN0F1TETG2`, sem cópia para `G-B608CFXF76`;
- nenhuma conversão no carregamento da página;
- `lead_form_start` apenas uma vez em cada formulário;
- envio inválido sem `lead_form_submit`;
- envio válido com um único `lead_form_submit` antes do WhatsApp;
- CTA direto com somente `whatsapp_click`;
- ausência de nome, interesse, mensagem, conteúdo clínico e URL do WhatsApp na `dataLayer` e na rede;
- GCLID, GBRAID ou WBRAID acrescentado ao rascunho somente com consentimento de anúncios válido;
- referência visível e removível antes do envio;
- ausência de nome, telefone, texto clínico e dados de saúde na planilha mapeada para o Data Manager;
- consentimento negado e concedido em sessões separadas;
- fluxo completo em Android, iPhone/Safari e computador.

Depois do Preview, criar e publicar uma versão nomeada do contêiner. Só então publicar esta versão instrumentada da landing page.
