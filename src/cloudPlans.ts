import type { Locale } from './localization.ts'

// Public offer and pricing share the same advertised plans. Web checkout is not enabled.
export const cloudPaidPlans = [
  { id: 'lite', name: 'Cloud Lite', priceRUB: 250, monthlyCredits: 250, description: 'A little Cloud AI for your first ideas.', action: 'Ask about Lite' },
  { id: 'pro', name: 'Cloud Pro', priceRUB: 500, monthlyCredits: 500, description: 'Share a playable build. Bring AI into your workflow.', action: 'Ask about Pro' },
  { id: 'max', name: 'Cloud Max', priceRUB: 1000, monthlyCredits: 1000, description: 'More Cloud AI for a busier creative workflow.', action: 'Ask about Max' },
] as const

export function formatPlanNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === 'ru' ? 'ru-RU' : 'en-US').format(value)
}
