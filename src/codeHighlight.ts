import hljs from 'highlight.js/lib/core'
import bash from 'highlight.js/lib/languages/bash'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import markdown from 'highlight.js/lib/languages/markdown'
import swift from 'highlight.js/lib/languages/swift'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'

hljs.registerLanguage('bash', bash)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('json', json)
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('swift', (hljsApi: Parameters<typeof swift>[0]) => {
  const grammar = swift(hljsApi)

  grammar.contains = [
    { scope: 'property', begin: /\.[A-Za-z_]\w*/ },
    ...(grammar.contains ?? []),
  ]

  return grammar
})
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('xml', xml)

const languageAliases: Record<string, string> = {
  html: 'xml',
  js: 'javascript',
  md: 'markdown',
  sh: 'bash',
  shell: 'bash',
  ts: 'typescript',
  txt: 'plaintext',
}

function normalizeLanguage(language: string): string {
  const normalized = language.trim().toLowerCase()
  return languageAliases[normalized] ?? normalized
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function languageClass(language: string): string {
  const normalized = normalizeLanguage(language)
  return normalized ? `language-${escapeHtml(normalized)}` : 'language-plaintext'
}

export function highlightCode(value: string, language: string): string {
  const normalized = normalizeLanguage(language)

  if (!normalized || normalized === 'plaintext' || !hljs.getLanguage(normalized)) {
    return escapeHtml(value)
  }

  return hljs.highlight(value, { language: normalized, ignoreIllegals: true }).value
}

export function renderHighlightedCodeLines(value: string, language: string): string {
  const lines = value.replace(/\r\n?/g, '\n').split('\n')

  if (lines.length > 1 && lines[lines.length - 1] === '') {
    lines.pop()
  }

  return lines
    .map(
      (line, index) =>
        `<span class="code-line"><span class="code-line-number" aria-hidden="true">${index + 1}</span><span class="code-line-content">${highlightCode(line, language)}</span></span>`,
    )
    .join('')
}
