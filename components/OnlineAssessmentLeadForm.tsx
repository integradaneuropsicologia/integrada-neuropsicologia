"use client";

import { FormEvent, useId, useState } from "react";
import { canMeasureGenericEvents } from "@/components/CookieConsent";
import { whatsappUrl } from "@/lib/site-data";

type OnlineAssessmentLeadFormProps = {
  placement: "hero" | "section";
};

const interestOptions = [
  "Atenção, foco ou organização",
  "Suspeita de TDAH",
  "Suspeita de autismo (TEA)",
  "Relacionamentos ou interação social",
  "Sensibilidade sensorial ou necessidade de rotina",
  "Memória ou desempenho cognitivo",
  "Diferenciar ansiedade, burnout ou outro quadro",
  "Outro motivo",
] as const;

export function OnlineAssessmentLeadForm({ placement }: OnlineAssessmentLeadFormProps) {
  const formId = useId();
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const interest = String(data.get("interest") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const text = [
      "Olá! Tenho interesse na avaliação neuropsicológica on-line para brasileiros com 18 anos ou mais.",
      `Nome: ${name}`,
      `Quero compreender melhor: ${interest}`,
      message ? `Contexto: ${message}` : null,
      "Consentimento: autorizo o tratamento destes dados para preparar esta mensagem e responder ao meu contato pelo WhatsApp.",
    ].filter(Boolean).join("\n");

    if (canMeasureGenericEvents()) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "whatsapp_lead_open", form_location: placement });
    }
    setSubmitted(true);
    const opened = window.open(whatsappUrl(text), "_blank");
    if (opened) opened.opener = null;
    if (!opened) window.location.href = whatsappUrl(text);
  }

  return (
    <form className={`lp-lead-form lp-lead-form-${placement}`} onSubmit={handleSubmit}>
      <div className="lp-form-heading">
        <span>Primeiro contato</span>
        <h2>Conte o que você quer entender.</h2>
        <p>A equipe conhece sua demanda, explica como funciona a avaliação 100% on-line e orienta sobre os próximos passos.</p>
      </div>

      <label htmlFor={`${formId}-name`}>Como podemos chamar você?</label>
      <input id={`${formId}-name`} name="name" autoComplete="name" required placeholder="Seu nome" />

      <label htmlFor={`${formId}-interest`}>Qual é sua principal dúvida hoje?</label>
      <select id={`${formId}-interest`} name="interest" required defaultValue="">
        <option value="" disabled>Selecione uma opção</option>
        {interestOptions.map((option) => <option key={option}>{option}</option>)}
      </select>

      <label htmlFor={`${formId}-message`}>Quer acrescentar algo? <span>(opcional)</span></label>
      <textarea id={`${formId}-message`} name="message" rows={3} placeholder="Ex.: isso está afetando meu trabalho e minha rotina" />

      <label className="lp-form-consent" htmlFor={`${formId}-privacy`}>
        <input id={`${formId}-privacy`} name="privacy-consent" type="checkbox" required />
        <span>Autorizo, de forma específica, o tratamento do meu nome e das informações de saúde que eu escolher informar, exclusivamente para preparar esta mensagem e responder ao meu contato pelo WhatsApp. Posso revogar esta autorização pelo canal indicado na <a href="/politica-de-privacidade" target="_blank" rel="noreferrer">Política de Privacidade</a>.</span>
      </label>

      <button type="submit" className="lp-primary-button lp-form-submit">Quero conversar sobre a avaliação <span aria-hidden="true">→</span></button>
      <p className="lp-form-note">Os dados preenchidos apenas preparam a mensagem que você poderá revisar antes de enviá-la pelo WhatsApp. O conteúdo do formulário não é armazenado no servidor deste site. Depois do envio, a conversa será tratada pela Integrada Neuropsicologia e pelo WhatsApp/Meta. Informações de navegação e cookies são tratadas conforme suas preferências e nossa <a href="/politica-de-privacidade" target="_blank" rel="noreferrer">Política de Privacidade</a>. Não envie exames ou documentos neste primeiro contato.</p>
      <p className="lp-form-alternative">Prefere não informar sua dificuldade aqui? <a href={whatsappUrl("Olá! Gostaria de entender como funciona a avaliação neuropsicológica on-line para adultos.")} target="_blank" rel="noreferrer">Inicie uma conversa no WhatsApp sem preencher o formulário.</a></p>
      {submitted && <p className="lp-form-status" role="status">Conversa preparada. Se o WhatsApp não abriu, envie novamente.</p>}
    </form>
  );
}
