"use client";

import { FormEvent, SyntheticEvent, useId, useState } from "react";
import { TrackedWhatsAppLink } from "@/components/TrackedLandingLink";
import {
  appendGoogleAdsClickReference,
  createLeadFormTrackingController,
  type FormLocation,
} from "@/lib/data-layer";
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
  const formLocation: FormLocation = placement === "hero" ? "hero" : "contact_section";
  const ctaLocation = placement === "hero" ? "hero" : "contact";
  const [trackingController] = useState(() => createLeadFormTrackingController(formLocation));
  const [submitted, setSubmitted] = useState(false);

  function handleFieldInteraction(event: SyntheticEvent<HTMLFormElement>) {
    const element = event.target;
    if (!(element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement)) return;
    trackingController.start();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.checkValidity()) {
      event.currentTarget.reportValidity();
      return;
    }

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

    const whatsappDestination = appendGoogleAdsClickReference(whatsappUrl(text));
    const accepted = trackingController.submit(whatsappDestination);
    if (!accepted) return;
    setSubmitted(true);
  }

  return (
    <form
      className={`lp-lead-form lp-lead-form-${placement}`}
      data-form-location={formLocation}
      onFocusCapture={handleFieldInteraction}
      onInputCapture={handleFieldInteraction}
      onSubmit={handleSubmit}
    >
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

      <button type="submit" className="lp-primary-button lp-form-submit" disabled={submitted}>{submitted ? "Abrindo o WhatsApp…" : "Quero conversar sobre a avaliação"} {!submitted && <span aria-hidden="true">→</span>}</button>
      <p className="lp-form-note">Os dados preenchidos apenas preparam a mensagem que você poderá revisar antes de enviá-la pelo WhatsApp. O conteúdo do formulário não é armazenado no servidor deste site. Se você chegou por um anúncio e autorizou cookies de publicidade, uma referência técnica do clique pode ser incluída no rascunho para medir leads qualificados; você poderá revisá-la e removê-la antes do envio. Na qualificação offline, nenhum nome, telefone, texto clínico ou dado de saúde é enviado ao Google. Depois do envio, a conversa será tratada pela Integrada Neuropsicologia e pelo WhatsApp/Meta. Informações de navegação e cookies são tratadas conforme suas preferências e nossa <a href="/politica-de-privacidade" target="_blank" rel="noreferrer">Política de Privacidade</a>. Não envie exames ou documentos neste primeiro contato.</p>
      <p className="lp-form-alternative">Prefere não informar sua dificuldade aqui? <TrackedWhatsAppLink href={whatsappUrl("Olá! Gostaria de entender como funciona a avaliação neuropsicológica on-line para adultos.")} ctaLocation={ctaLocation} target="_blank" rel="noreferrer">Inicie uma conversa no WhatsApp sem preencher o formulário.</TrackedWhatsAppLink></p>
      {submitted && <p className="lp-form-status" role="status">Conversa preparada. O WhatsApp será aberto nesta mesma aba.</p>}
    </form>
  );
}
