/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--color-primary-50, #eff6ff)',
          100: 'var(--color-primary-100, #dbeafe)',
          200: 'var(--color-primary-200, #bfdbfe)',
          300: 'var(--color-primary-300, #93c5fd)',
          400: 'var(--color-primary-400, #60a5fa)',
          500: 'var(--color-primary-500, #3b82f6)',
          600: 'var(--color-primary-600, #2563eb)',
          700: 'var(--color-primary-700, #1d4ed8)',
          800: 'var(--color-primary-800, #1e40af)',
          900: 'var(--color-primary-900, #1e3a8a)',
        },
        secondary: {
          50: 'var(--color-secondary-50, #faf5ff)',
          100: 'var(--color-secondary-100, #f3e8ff)',
          200: 'var(--color-secondary-200, #e9d5ff)',
          300: 'var(--color-secondary-300, #d8b4fe)',
          400: 'var(--color-secondary-400, #c084fc)',
          500: 'var(--color-secondary-500, #a855f7)',
          600: 'var(--color-secondary-600, #9333ea)',
          700: 'var(--color-secondary-700, #7e22ce)',
          800: 'var(--color-secondary-800, #6b21a8)',
          900: 'var(--color-secondary-900, #581c87)',
        },
      },
      spacing: {
        0: 'var(--spacing-0, 0)',
        1: 'var(--spacing-1, 0.25rem)',
        2: 'var(--spacing-2, 0.5rem)',
        3: 'var(--spacing-3, 0.75rem)',
        4: 'var(--spacing-4, 1rem)',
        5: 'var(--spacing-5, 1.25rem)',
        6: 'var(--spacing-6, 1.5rem)',
        8: 'var(--spacing-8, 2rem)',
        10: 'var(--spacing-10, 2.5rem)',
        12: 'var(--spacing-12, 3rem)',
        16: 'var(--spacing-16, 4rem)',
        20: 'var(--spacing-20, 5rem)',
        24: 'var(--spacing-24, 6rem)',
      },
      fontFamily: {
        sans: ['var(--fontFamily-sans, Inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--fontFamily-mono, Fira Code)', 'monospace'],
      },
    },
  },
  plugins: [],
};
