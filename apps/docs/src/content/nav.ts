import type { Locale } from '../i18n/ui.ts';
import type { NavGroup } from '../layouts/DocPage.astro';

/** The Components area's side navigation. It grows as each component moves to the new site. */
export function componentsNav(lang: Locale, base: string, current: string): NavGroup[] {
  const titles: Record<Locale, [string, string, string]> = {
    pt: ['Ações', 'Texto e estrutura da página', 'Retorno e erros'],
    en: ['Actions', 'Text and page structure', 'Feedback and errors'],
    es: ['Acciones', 'Texto y estructura de la página', 'Retorno y errores'],
    fr: ['Actions', 'Texte et structure de la page', 'Retour et erreurs'],
    de: ['Aktionen', 'Text und Seitenstruktur', 'Rückmeldung und Fehler'],
  };
  const [actions, , feedback] = titles[lang];
  const item = (name: string) => ({
    text: name,
    href: `${base}${lang}/components/${name.toLowerCase()}/`,
    current: name === current,
  });
  return [
    { title: actions, items: [item('Button')] },
    { title: feedback, items: [item('Notice')] },
  ];
}
