// Keep the deployed Sites origin canonical until the custom-domain DNS and TLS
// are active. The cutover changes only this constant after the smoke test.
export const SITE_URL = "https://integrada-neuropsicologia.elieltonlimacosta.chatgpt.site";
export const MAIN_SITE_URL = "https://www.integradaneuropsicologia.com.br";
export const LANDING_PATH = "/avaliacao-neuropsicologica-online-adultos";
export const LANDING_URL = `${SITE_URL}${LANDING_PATH}`;
export const SITE_NAME = "Integrada Neuropsicologia";

export const HOME_TITLE = "Avaliação Neuropsicológica Online para Adultos | Integrada";
export const HOME_DESCRIPTION =
  "Avaliação neuropsicológica 100% online para brasileiros com 18 anos ou mais, no Brasil e no exterior. Conheça as etapas, a profissional e como iniciar.";

export const absoluteUrl = (pathname = "/") => new URL(pathname, `${SITE_URL}/`).toString();
export const mainSiteUrl = (pathname = "/") => new URL(pathname, `${MAIN_SITE_URL}/`).toString();
