import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        },
        /* Glass morphism colors */
        glass: {
          DEFAULT: 'var(--glass-bg)',
          border: 'var(--glass-border)'
        },
        bee: {
          yellow: {
            DEFAULT: '#FFD500',
            soft: '#FFF4CC',
          },
          blue: {
            DEFAULT: '#39D0EA',
            dark: '#2195B3',
            light: '#A5E8F3',
          },
          black: {
            DEFAULT: '#222222',
            soft: '#3A3A3A',
          }
        }
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'hover': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
        'glass': 'var(--glass-shadow)',
        'glow': '0 0 20px hsl(var(--primary) / 0.3)',
        'glow-lg': '0 0 40px hsl(var(--primary) / 0.4)',
      },
      backdropBlur: {
        xs: '2px',
      },
      fontFamily: {
        'sans': ['DM Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        'display': ['Space Grotesk', 'Outfit', 'system-ui', 'sans-serif'],
        'body': ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
        'heading': ['Space Grotesk', 'Outfit', 'Inter', 'system-ui', 'sans-serif']
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.25', letterSpacing: '0.025em' }],
        'sm': ['0.875rem', { lineHeight: '1.4', letterSpacing: '0.015em' }],
        'base': ['1rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'lg': ['1.125rem', { lineHeight: '1.5', letterSpacing: '0.005em' }],
        'xl': ['1.25rem', { lineHeight: '1.5', letterSpacing: '0' }],
        '2xl': ['1.5rem', { lineHeight: '1.4', letterSpacing: '-0.01em' }],
        '3xl': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.015em' }],
        '4xl': ['2.25rem', { lineHeight: '1.25', letterSpacing: '-0.02em' }],
        '5xl': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.025em' }],
        '6xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        '7xl': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.035em' }],
        '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.04em' }],
        '9xl': ['8rem', { lineHeight: '1', letterSpacing: '-0.045em' }],
      },
      fontWeight: {
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800'
      },
      letterSpacing: {
        'tighter': '-0.05em',
        'tight': '-0.025em',
        'normal': '0em',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.1em'
      },
      lineHeight: {
        'none': '1',
        'tight': '1.25',
        'snug': '1.375',
        'normal': '1.5',
        'relaxed': '1.625',
        'loose': '2'
      },
      transitionProperty: {
        'colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
        'all': 'all',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        'fade-in': {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'fade-in-left': {
          '0%': {
            opacity: '0',
            transform: 'translateX(-20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)'
          }
        },
        'fade-in-right': {
          '0%': {
            opacity: '0',
            transform: 'translateX(20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)'
          }
        },
        'subtle-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-3px)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow': {
          '0%': { 
            boxShadow: '0 0 5px hsl(var(--primary) / 0.2), 0 0 10px hsl(var(--primary) / 0.2), 0 0 15px hsl(var(--primary) / 0.2)'
          },
          '100%': { 
            boxShadow: '0 0 10px hsl(var(--primary) / 0.4), 0 0 20px hsl(var(--primary) / 0.4), 0 0 30px hsl(var(--primary) / 0.4)'
          }
        },
        'pulse-soft': {
          '0%, 100%': { 
            opacity: '1',
            transform: 'scale(1)'
          },
          '50%': { 
            opacity: '0.85',
            transform: 'scale(1.02)'
          }
        },
        'slide-up': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' }
        },
        'scale-in': {
          from: { transform: 'scale(0.9)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' }
        },
        'scale-up': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'bounce-in': {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' }
        },
        'logo-entrance': {
          '0%': { 
            transform: 'scale(0.8) rotate(-5deg)', 
            opacity: '0' 
          },
          '50%': { 
            transform: 'scale(1.05) rotate(2deg)', 
            opacity: '0.8' 
          },
          '100%': { 
            transform: 'scale(1) rotate(0deg)', 
            opacity: '1' 
          }
        },
        'bee-hover': {
          '0%': { transform: 'translateY(0px)' },
          '25%': { transform: 'translateY(-2px) rotate(1deg)' },
          '50%': { transform: 'translateY(-4px) rotate(0deg)' },
          '75%': { transform: 'translateY(-2px) rotate(-1deg)' },
          '100%': { transform: 'translateY(0px) rotate(0deg)' }
        },
        'micro-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' }
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        'shimmer-vertical': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' }
        },
        'shimmer-vertical-slow': {
          '0%': { transform: 'translateY(-100%) scale(1.2)', opacity: '0' },
          '50%': { opacity: '0.8', transform: 'translateY(0%) scale(1)' },
          '100%': { transform: 'translateY(100%) scale(1.2)', opacity: '0' }
        },
        'slide-in-from-bottom': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'slide-in-from-left': {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        'slide-in-from-right': {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        'text-reveal': {
          '0%': { opacity: '0', transform: 'translateY(8px)', filter: 'blur(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)', filter: 'blur(0)' }
        },
        'button-press': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.97)' }
        },
        'ripple': {
          '0%': { transform: 'scale(0)', opacity: '0.5' },
          '100%': { transform: 'scale(4)', opacity: '0' }
        },
        'bounce-x': {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(6px)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.15s ease-out',
        'accordion-up': 'accordion-up 0.15s ease-out',
        'fade-in': 'fade-in 0.2s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.25s ease-out forwards',
        'fade-in-down': 'fade-in-down 0.25s ease-out forwards',
        'fade-in-left': 'fade-in-left 0.25s ease-out forwards',
        'fade-in-right': 'fade-in-right 0.25s ease-out forwards',
        'subtle-hover': 'subtle-bounce 0.15s ease-in-out',
        'float': 'float 2s ease-in-out infinite',
        'glow': 'glow 1.5s ease-in-out infinite alternate',
        'pulse-soft': 'pulse-soft 1.5s ease-in-out infinite',
        'slide-up': 'slide-up 0.15s ease-out',
        'scale-in': 'scale-in 0.1s ease-out',
        'scale-up': 'scale-up 0.2s ease-out',
        'bounce-in': 'bounce-in 0.3s ease-out',
        'wiggle': 'wiggle 0.15s ease-in-out',
        'logo-entrance': 'logo-entrance 0.4s ease-out',
        'bee-hover': 'bee-hover 0.3s ease-in-out',
        'micro-bounce': 'micro-bounce 0.1s ease-in-out',
        'shimmer': 'shimmer 1.2s linear infinite',
        'shimmer-vertical': 'shimmer-vertical 1.5s ease-in-out infinite',
        'shimmer-vertical-slow': 'shimmer-vertical-slow 3s ease-in-out infinite',
        'content-fade-in': 'content-fade-in 0.25s ease-out',
        'stagger-fade': 'stagger-fade 0.2s ease-out forwards',
        'slide-in-bottom': 'slide-in-from-bottom 0.25s ease-out forwards',
        'slide-in-left': 'slide-in-from-left 0.25s ease-out forwards',
        'slide-in-right': 'slide-in-from-right 0.25s ease-out forwards',
        'pop-in': 'pop-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'text-reveal': 'text-reveal 0.3s ease-out forwards',
        'button-press': 'button-press 0.08s ease-in-out',
        'ripple': 'ripple 0.3s linear'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
