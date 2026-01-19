/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      // Design tokens mapped from CSS custom properties
      colors: {
        // Backgrounds
        background: 'rgb(var(--color-background) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        'surface-elevated': 'rgb(var(--color-surface-elevated) / <alpha-value>)',

        // Text colors
        text: {
          DEFAULT: 'rgb(var(--color-text) / <alpha-value>)',
          muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
          subtle: 'rgb(var(--color-text-subtle) / <alpha-value>)',
        },

        // Primary accent
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          hover: 'rgb(var(--color-primary-hover) / <alpha-value>)',
          muted: 'rgb(var(--color-primary-muted))',
        },

        // UI Elements
        border: 'rgb(var(--color-border))',
        'border-focus': 'rgb(var(--color-border-focus))',

        // Tags
        tag: {
          bg: 'rgb(var(--color-tag-bg))',
          text: 'rgb(var(--color-tag-text) / <alpha-value>)',
        },

        // Status colors
        success: 'rgb(var(--color-success) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        error: 'rgb(var(--color-error) / <alpha-value>)',
      },

      // Container widths
      maxWidth: {
        content: '1200px',
        'content-narrow': '900px',
      },

      // Custom spacing
      spacing: {
        section: '4rem', // 64px - standard section padding
        'section-sm': '3rem', // 48px - mobile section padding
        18: '4.5rem', // 72px
        22: '5.5rem', // 88px
      },

      // Border radius
      borderRadius: {
        card: '0.75rem', // 12px
        tag: '0.375rem', // 6px
        btn: '1.5rem', // 24px - for pill buttons
      },

      // Font sizes matching the design
      fontSize: {
        'section-title': ['2rem', { lineHeight: '1.2', fontWeight: '700' }],
        'section-title-sm': ['1.75rem', { lineHeight: '1.2', fontWeight: '700' }],
        'card-title': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'card-title-sm': ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }],
      },

      // Box shadows
      boxShadow: {
        card: '0 8px 24px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 12px 32px rgba(0, 0, 0, 0.12)',
        glass: '0 2px 8px rgba(var(--shadow-color), 0.1)',
        'glass-hover': '0 4px 12px rgba(var(--shadow-color), 0.15)',
      },

      // Transitions
      transitionDuration: {
        DEFAULT: '200ms',
      },

      // Backdrop blur
      backdropBlur: {
        glass: '10px',
      },
    },
  },
  plugins: [],
};
