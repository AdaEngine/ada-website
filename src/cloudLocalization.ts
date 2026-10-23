import { getLocale, message } from './localization'
// Standalone Cloud uses the website catalog; embedded Studio can supply its own.
export type CloudText = string | Text
export type CloudTranslate = (key: string, ...values: unknown[]) => string
let translate: CloudTranslate = message
let language: () => string = getLocale
type Binding = { node: Text; key: string; values: unknown[] }
const bindings = new Set<Binding>()
const tokens = new WeakMap<Text, Binding>()
const attributes = new Set<{node: Element; name: string; key: string; values: unknown[]}>()
const computedAttributes = new Set<{node: Element; name: string; value: () => string}>()

export function configureCloudLocalization(translator?: CloudTranslate, getLanguage?: () => string) {
  translate = translator ?? message
  language = getLanguage ?? getLocale
  bindings.clear(); attributes.clear(); computedAttributes.clear(); sentences.clear()
}
export function cloudLanguage() { return language() }
function resolved(values: unknown[]) { return values.map(value => typeof value === 'function' ? value() : value) }
export function cloudMessage(key: string, ...values: unknown[]) { return translate(key, ...resolved(values)) }
export function tr(key: string, ...values: unknown[]): Text {
  const node = document.createTextNode(cloudMessage(key, ...values))
  const binding = {node, key, values}
  tokens.set(node, binding); bindings.add(binding)
  return node
}
export function textValue(value: CloudText): string { return typeof value === 'string' ? value : value.data }
export function setText(node: Element, value: CloudText) { node.replaceChildren(value) }
export function textAttribute(node: Element, name: string, value: CloudText) {
  node.setAttribute(name, textValue(value))
  if (typeof value !== 'string') {
    const token = tokens.get(value)
    if (token) attributes.add({node, name, key: token.key, values: token.values})
  }
}
export function computedAttribute(node: Element, name: string, value: () => string) {
  node.setAttribute(name, value())
  computedAttributes.add({ node, name, value })
}
export function refreshCloudTranslations() {
  for (const binding of computedAttributes) {
    if (!binding.node.isConnected) { computedAttributes.delete(binding); continue }
    binding.node.setAttribute(binding.name, binding.value())
  }
  for (const item of sentences) {
    if (!item.node.isConnected) { sentences.delete(item); continue }
    renderSentence(item.node, item.key, item.slots)
  }
  for (const binding of bindings) {
    if (!binding.node.isConnected) { bindings.delete(binding); continue }
    binding.node.data = cloudMessage(binding.key, ...binding.values)
  }
  for (const binding of attributes) {
    if (!binding.node.isConnected) { attributes.delete(binding); continue }
    binding.node.setAttribute(binding.name, cloudMessage(binding.key, ...binding.values))
  }
}
export class CloudPanelError extends Error {
  constructor(public key: string, ...values: unknown[]) {
    super(key)
    this.values = values
    Object.defineProperty(this, 'message', {get: () => cloudMessage(key, ...values)})
  }
  values: unknown[]
}
export function errorText(error: unknown, fallback: CloudText = tr("Request failed")): CloudText {
  return error instanceof CloudPanelError ? tr(error.key, ...error.values) : error instanceof Error ? error.message : fallback
}

const sentences = new Set<{node: HTMLElement; key: string; slots: Node[]}>()
function renderSentence(node: HTMLElement, key: string, slots: Node[]) {
  const template = cloudMessage(key, ...slots.map((_, index) => `{${index}}`))
  const parts = template.split(/(\{\d+\})/g)
  node.replaceChildren(...parts.map(part => /^\{\d+\}$/.test(part) ? slots[Number(part.slice(1, -1))] ?? part : part))
}
export function sentence(key: string, ...slots: Node[]) {
  const node = document.createElement('span')
  sentences.add({node, key, slots}); renderSentence(node, key, slots)
  return node
}
