/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'paper-base': 'var(--color-paper-base)',
        'paper-border': 'var(--color-paper-border)',
        'ink-black': 'var(--color-ink-black)',
        'ink-light': 'var(--color-ink-light)',
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': 'var(--color-ink-light)',
            '--tw-prose-headings': 'var(--color-ink-black)',
            '--tw-prose-lead': 'var(--color-ink-light)',
            '--tw-prose-links': 'var(--color-ink-black)',
            '--tw-prose-bold': 'var(--color-ink-black)',
            '--tw-prose-counters': 'var(--color-ink-light)',
            '--tw-prose-bullets': 'var(--color-ink-light)',
            '--tw-prose-hr': 'var(--color-paper-border)',
            '--tw-prose-quotes': 'var(--color-ink-black)',
            '--tw-prose-quote-borders': 'var(--color-paper-border)',
            '--tw-prose-captions': 'var(--color-ink-light)',
            '--tw-prose-code': 'var(--color-ink-black)',
            '--tw-prose-pre-code': 'var(--color-paper-base)',
            '--tw-prose-pre-bg': 'var(--color-ink-black)',
            '--tw-prose-th-borders': 'var(--color-paper-border)',
            '--tw-prose-td-borders': 'var(--color-paper-border)',
          },
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  darkMode: 'class',
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
