import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import ts from 'typescript'
export default defineConfig({
  publicDir: false,
  define: { 'import.meta.env.VITE_CLOUD_API_URL': JSON.stringify(''), 'import.meta.env.VITE_OPERATOR_CONSOLE': 'false', 'import.meta.env.BASE_URL': JSON.stringify('/') },
  plugins: [{
    name: 'cloud-panel-message-keys',
    generateBundle() {
      const keys = new Set<string>()
      for (const name of ['cloud.ts', 'cloudTestAccess.ts', 'cloudLocalization.ts']) {
        const source = ts.createSourceFile(name, readFileSync(resolve('src', name), 'utf8'), ts.ScriptTarget.Latest, true)
        const visit = (node: ts.Node) => {
          if ((ts.isCallExpression(node) || ts.isNewExpression(node)) && ['tr', 'cloudMessage', 'CloudPanelError', 'sentence'].includes(node.expression.getText(source))) {
            const argument = node.arguments?.[0]
            if (argument && ts.isStringLiteralLike(argument)) keys.add(argument.text)
          }
          ts.forEachChild(node, visit)
        }
        visit(source)
      }
      this.emitFile({ type: 'asset', fileName: 'cloud-panel-messages.json', source: JSON.stringify([...keys].sort()) })
    },
  }],
  build: { outDir: 'dist-panels', lib: { entry: resolve('src/cloud.ts'), formats: ['es'], fileName: () => 'cloud-panels.js' }, cssCodeSplit: false },
})
