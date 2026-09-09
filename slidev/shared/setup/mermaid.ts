// setup/mermaid.ts
import { defineMermaidSetup } from '@slidev/types'

export default defineMermaidSetup(() => {
  return {
    theme: 'base',

    themeVariables: {
      fontFamily:
        'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial',
      fontSize: '16px',

      // Neutral defaults (won’t override your explicit styles)
      primaryColor: '#ffffff',
      primaryBorderColor: '#111827',
      primaryTextColor: '#111827',

      lineColor: '#374151',
      textColor: '#111827',

      // Decision/flow emphasis
      clusterBkg: '#f9fafb',
      clusterBorder: '#d1d5db',
    },
  }
})
