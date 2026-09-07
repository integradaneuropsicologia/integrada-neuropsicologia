"use client";

import { FormEvent, SyntheticEvent, useEffect, useId, useRef, useState } from "react";
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
  const resetTimer = useRef<number | null>(null);

  useEffect(() => {
    const resetSubmission = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
      resetTimer.current = null;
      trackingController.resetSubmission();
      setSubmitted(false);
    };

    window.addEventListener("pageshow", resetSubmission);
    return () => {
      window.removeEventListener("pageshow", resetSubmission);
      if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    };
  }, [trackingController]);

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
    if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => {
      trackingController.resetSubmission();
      setSubmitted(false);
      resetTimer.current = null;
    }, 3000);
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
      <textarea id={`${formId}-message`} name="message" rows={3} maxLength={500} placeholder="Ex.: isso está afetando meu trabalho e minha rotina" />

      <label className="lp-form-consent" htmlFor={`${formId}-privacy`}>
        <input id={`${formId}-privacy`} name="privacy-consent" type="checkbox" required />
        <span>Autorizo o tratamento do meu nome e das informações que eu escolher informar — inclusive dados de saúde — somente para preparar esta mensagem e responder ao meu contato pelo WhatsApp. Posso revogar esta autorização pelo canal indicado na <a href="/politica-de-privacidade#direitos" target="_blank" rel="noreferrer">Política de Privacidade</a>.</span>
      </label>

      <button type="submit" className="lp-primary-button lp-form-submit" disabled={submitted}>{submitted ? "Abrindo o WhatsApp…" : "Quero conversar sobre a avaliação"} {!submitted && <span aria-hidden="true">→</span>}</button>
      <p className="lp-form-note">Os dados apenas preparam o rascunho que você revisará no WhatsApp e não são armazenados neste site. Após o envio, a conversa será tratada pela Integrada e pelo WhatsApp/Meta. Não envie exames ou documentos. Cookies e informações de navegação seguem suas preferências e nossa <a href="/politica-de-privacidade#cookies" target="_blank" rel="noreferrer">Política de Privacidade</a>.</p>
      <details className="lp-form-measurement-details">
        <summary>Como funciona a medição de campanhas</summary>
        <p>Se a visita veio de um anúncio e você autorizou cookies de publicidade, uma referência técnica do clique pode ser mantida temporariamente nesta aba e incluída no rascunho. Você pode apagá-la antes de enviar. Na qualificação offline, nenhum nome, telefone, mensagem ou dado de saúde é enviado ao Google.</p>
      </details>
      <p className="lp-form-alternative">Prefere não informar sua dificuldade aqui? <TrackedWhatsAppLink href={whatsappUrl("Olá! Gostaria de entender como funciona a avaliação neuropsicológica on-line para adultos.")} ctaLocation={ctaLocation} target="_blank" rel="noreferrer">Inicie uma conversa no WhatsApp sem preencher o formulário.</TrackedWhatsAppLink></p>
      {submitted && <p className="lp-form-status" role="status">Conversa preparada. O WhatsApp será aberto nesta mesma aba.</p>}
    </form>
  );
}
