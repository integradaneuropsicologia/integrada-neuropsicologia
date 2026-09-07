"use client";

import { FormEvent, useState } from "react";
import { whatsappUrl } from "@/lib/site-data";

export function LeadForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = [
      "Olá! Preenchi o formulário do site.",
      `Nome: ${data.get("name")}`,
      `Interesse: ${data.get("interest")}`,
      `Mensagem: ${data.get("message") || "Não informada"}`,
    ].join("\n");
    setSent(true);
    window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
  }

  return (
    <section className="lead-section" id="contato">
      <div className="lead-copy">
        <span className="eyebrow">Vamos conversar</span>
        <h2>Entenda qual é o próximo passo mais adequado</h2>
        <p>Informe seu nome e o assunto. Ao enviar, uma conversa já preparada será aberta com nossa equipe no WhatsApp.</p>
        <div className="lead-contact"><strong>Prefere falar agora?</strong><a href="tel:+5541992113665">(41) 99211-3665</a></div>
      </div>
      <form className="lead-form" onSubmit={handleSubmit}>
        <label>Nome completo<input name="name" required autoComplete="name" placeholder="Seu nome" /></label>
        <label>Qual seu interesse?
          <select name="interest" required defaultValue="">
            <option value="" disabled>Escolha uma opção</option>
            <option>Avaliação infantil</option><option>Avaliação adulta</option><option>Avaliação on-line</option>
            <option>Avaliação TDAH</option><option>Avaliação TEA</option><option>Psicoterapia</option><option>Outro assunto</option>
          </select>
        </label>
        <label>Como podemos ajudar? <span className="optional-label">(opcional)</span><textarea name="message" rows={3} placeholder="Conte brevemente o que você busca" /></label>
        <button className="button button-dark" type="submit">Receber orientação no WhatsApp</button>
        {sent && <p className="form-status" role="status">Conversa preparada. Se o WhatsApp não abriu, tente novamente.</p>}
      </form>
    </section>
  );
}
