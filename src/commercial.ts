import { draftLegal, legalDocument } from './cloudLegal.ts'
import { t, type Locale } from './localization.ts'
import type { LegalPageName } from './routing.ts'
import { cloudPaidPlans, formatPlanNumber } from './cloudPlans.ts'

const escapeHtml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
type Href = (path: string) => string

export function renderLegalLinks(href: Href, locale: Locale): string {
  return `<nav class="commercial-legal-links" aria-label="${t('Legal information', locale)}">${[
    ['/legal/offer', 'Public offer'], ['/legal/privacy', 'Privacy Policy'], ['/legal/details', 'Business details'], ['/legal/terms', 'Terms of Use'],
  ].map(([path, title]) => `<a href="${escapeHtml(href(path))}">${t(title, locale)}</a>`).join('')}</nav>`
}

export function renderPricingContent(href: Href, locale: Locale): string {
  const text = (value: string) => t(value, locale)
  const list = (items: string[]) => `<ul class="pricing-features">${items.map(item => `<li><span aria-hidden="true">✓</span>${text(item)}</li>`).join('')}</ul>`
  const planPrices = cloudPaidPlans.map(plan => `${plan.name} — ${formatPlanNumber(plan.priceRUB, locale)} ₽`).join(', ')
  const faq = [
    ['What am I paying for?', 'Ada Engine is free and open source. Lite, Pro and Max are subscriptions to Ada Cloud services with different monthly AI credit allowances. Publishing limits are the same across all paid plans. Your games and assets remain yours.'],
    ['How does billing work?', `${planPrices}. ${text('Prices are per month, with no trial period. Automatic renewal requires your consent. The total, billing period and next charge date are shown before payment.')}`],
    ['Can I cancel my subscription?', 'You can turn off renewal and keep your paid plan until the end of the paid period. For subscriptions purchased in the App Store, manage renewal through Apple. For web subscriptions, contact support@adaengine.org.'],
    ['How do refunds work?', 'You may request a full refund of your first paid Cloud subscription within seven days if you have not published builds. This extra guarantee does not limit your statutory rights. Contact support@adaengine.org with your account and purchase ID; never send card details.'],
    ['What happens when I reach a limit?', 'There are no automatic overage charges. Publishing traffic pauses when the monthly allowance runs out. Publication time limits continue to run.'],
  ]
  return `<main class="page-shell commercial-page pricing-page">
    <div class="container content-restriction">
      <header class="pricing-hero">
        <p class="commercial-eyebrow">${text('Ada Cloud · Pricing')}</p>
        <h1>${text('Create for free.')}<br><span>${text('Go further with Cloud.')}</span></h1>
        <p class="commercial-lead">${text('The engine is free and open source. Choose a Cloud plan to share playable builds and use Cloud AI in Ada Studio.')}</p>
        <span class="pricing-period">${text('Monthly billing · Prices in RUB')}</span>
      </header>
      <div class="pricing-grid">
        <section class="pricing-card pricing-card-free" aria-labelledby="free-title">
          <h2 id="free-title">Free</h2>
          <p class="pricing-description">${text('Everything you need to start making your game.')}</p>
          <p class="pricing-price">0 ₽ <span>${text('forever')}</span></p>
          <p class="pricing-caption">${text('No subscription required')}</p>
          <a class="pricing-action" href="${escapeHtml(href('/download'))}">${text('Download Ada')}</a>
          ${list(['Free and open-source Ada Engine', 'Create games locally with Ada tools', 'An Ada account and supported editor settings sync', 'Your games, code and assets remain yours'])}
        </section>
        ${cloudPaidPlans.map(plan => `<section class="pricing-card pricing-card-${plan.id}" aria-labelledby="${plan.id}-title" data-plan="${plan.id}">
          <h2 id="${plan.id}-title">${plan.name}</h2>
          <p class="pricing-description">${text(plan.description)}</p>
          <p class="pricing-price">${formatPlanNumber(plan.priceRUB, locale)} ₽ <span>${text('/ month')}</span></p>
          <p class="pricing-caption">${text('One account · Monthly subscription')}</p>
          <div class="pricing-credit"><strong>${formatPlanNumber(plan.monthlyCredits, locale)}</strong><span>${text('AI credits each month')}<small>${text('Shared across your Studio clients and devices')}</small></span></div>
          <a class="pricing-action${plan.id === 'pro' ? ' pricing-action-primary' : ''}" href="mailto:support@adaengine.org">${text(plan.action)}</a>
          ${list(['Everything in Free', 'Cloud AI within your monthly credit allowance; available tools are shown in Studio', 'Web build publishing with the limits below'])}
        </section>`).join('')}
      </div>
      <p class="pricing-availability pricing-payment-status">${text('Web payments are being connected. No online purchase is available yet.')}</p>
      <section class="pricing-publishing" aria-labelledby="publishing-title"><div><p class="commercial-eyebrow">${text('Lite · Pro · Max')}</p><h2 id="publishing-title">${text('Publishing included in every paid plan')}</h2><p>${text('Choose your AI allowance. The same publishing limits apply to Lite, Pro and Max.')}</p></div>${list(['One active web build per account', 'Up to 5 upload attempts per rolling 24 hours', 'Up to 300 MB per ZIP; 600 MB and 5,000 files unpacked', '10 GB of publishing traffic per billing month', '48-hour unlisted links or 96-hour public playtests'])}</section>
      <section class="pricing-included" aria-labelledby="pricing-ownership"><span aria-hidden="true">↗</span><div><h2 id="pricing-ownership">${text('Your work stays yours.')}</h2><p>${text('Publishing with Ada Cloud does not transfer ownership of your games, libraries or assets. Third-party licenses still apply.')}</p></div><a href="${escapeHtml(href('/legal/offer'))}">${text('Read the public offer')} ↗</a></section>
      <section class="pricing-faq" aria-labelledby="pricing-questions"><h2 id="pricing-questions">${text('A few things to know')}</h2><div>${faq.map(([question, answer]) => `<details><summary>${text(question)}</summary><p>${text(answer)}</p></details>`).join('')}</div></section>
      <div class="commercial-contact"><p>${text('Questions about billing or your account?')} <a href="mailto:support@adaengine.org">support@adaengine.org</a></p>${renderLegalLinks(href, locale)}</div>
    </div>
  </main>`
}

export function renderPublicLegalContent(kind: LegalPageName, href: Href, locale: Locale): string {
  const document = legalDocument(kind, draftLegal)
  return `<main class="page-shell commercial-page legal-page"><div class="container content-restriction">
    <header class="legal-hero"><a class="commercial-eyebrow" href="${escapeHtml(href('/pricing'))}">← ${t('Pricing', locale)}</a><h1 lang="ru">${escapeHtml(document.title)}</h1>${locale === 'en' ? '<p class="commercial-lead">These documents are provided in Russian for services offered in Russia.</p>' : ''}</header>
    ${renderLegalLinks(href, locale)}
    <article class="public-legal-document" lang="ru">${document.sections.map(section => `<section><h2>${escapeHtml(section.title)}</h2><p>${escapeHtml(section.text).replace(/\b(?:support|vp)@adaengine\.org\b/g, email => `<a href="mailto:${email}">${email}</a>`)}</p></section>`).join('')}</article>
    <div class="commercial-contact"><a href="mailto:support@adaengine.org">support@adaengine.org</a> · <a href="${escapeHtml(href('/pricing'))}">${t('Pricing', locale)}</a></div>
  </div></main>`
}
