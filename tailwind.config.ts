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
        'sans': ['Inter', 'SF Pro', 'system-ui', 'sans-serif'],
        'display': ['Bebas Neue', 'system-ui', 'sans-serif']
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
        'slide-up': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' }
        },
        'scale-in': {
          from: { transform: 'scale(0.9)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' }
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
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'subtle-hover': 'subtle-bounce 0.3s ease-in-out',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slide-up 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'logo-entrance': 'logo-entrance 0.8s ease-out',
        'bee-hover': 'bee-hover 0.6s ease-in-out',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
        'content-fade-in': 'content-fade-in 0.5s ease-out',
        'stagger-fade': 'stagger-fade 0.4s ease-out'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
