import { defineConfig } from 'vite'

const base = process.env.VITE_BASE_PATH ?? '/adawebsite/'

export default defineConfig({
  base,
})
