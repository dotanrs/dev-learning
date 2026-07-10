import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Production builds are served from the GitHub Pages project subpath
// (https://<user>.github.io/dev-learning/), so assets must be referenced
// under /dev-learning/. Local dev/preview stays at the root path.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/dev-learning/' : '/',
  plugins: [react()],
}))
