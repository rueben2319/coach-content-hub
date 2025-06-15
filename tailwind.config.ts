
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
					foreground: 'hsl(var(--primary-foreground))',
					50: 'hsl(221, 100%, 97%)',
					100: 'hsl(221, 91%, 91%)',
					200: 'hsl(221, 84%, 83%)',
					300: 'hsl(221, 84%, 73%)',
					400: 'hsl(221, 83%, 63%)',
					500: 'hsl(221, 83%, 53%)',
					600: 'hsl(221, 83%, 43%)',
					700: 'hsl(221, 83%, 33%)',
					800: 'hsl(221, 83%, 23%)',
					900: 'hsl(221, 83%, 13%)',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
					50: 'hsl(210, 40%, 98%)',
					100: 'hsl(210, 40%, 96%)',
					200: 'hsl(210, 40%, 93%)',
					300: 'hsl(210, 40%, 88%)',
					400: 'hsl(210, 40%, 78%)',
					500: 'hsl(210, 40%, 68%)',
					600: 'hsl(210, 40%, 58%)',
					700: 'hsl(210, 40%, 48%)',
					800: 'hsl(210, 40%, 38%)',
					900: 'hsl(210, 40%, 28%)',
				},
				success: {
					50: 'hsl(138, 76%, 97%)',
					100: 'hsl(141, 84%, 93%)',
					200: 'hsl(141, 79%, 85%)',
					300: 'hsl(142, 77%, 73%)',
					400: 'hsl(142, 69%, 58%)',
					500: 'hsl(142, 71%, 45%)',
					600: 'hsl(142, 76%, 36%)',
					700: 'hsl(142, 72%, 29%)',
					800: 'hsl(143, 64%, 24%)',
					900: 'hsl(144, 61%, 20%)',
				},
				warning: {
					50: 'hsl(48, 96%, 95%)',
					100: 'hsl(48, 100%, 88%)',
					200: 'hsl(48, 95%, 76%)',
					300: 'hsl(46, 92%, 64%)',
					400: 'hsl(43, 89%, 56%)',
					500: 'hsl(38, 92%, 50%)',
					600: 'hsl(32, 95%, 44%)',
					700: 'hsl(26, 90%, 37%)',
					800: 'hsl(23, 83%, 31%)',
					900: 'hsl(22, 78%, 26%)',
				},
				error: {
					50: 'hsl(0, 86%, 97%)',
					100: 'hsl(0, 93%, 94%)',
					200: 'hsl(0, 96%, 89%)',
					300: 'hsl(0, 94%, 82%)',
					400: 'hsl(0, 91%, 71%)',
					500: 'hsl(0, 84%, 60%)',
					600: 'hsl(0, 72%, 51%)',
					700: 'hsl(0, 74%, 42%)',
					800: 'hsl(0, 70%, 35%)',
					900: 'hsl(0, 63%, 31%)',
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
				}
			},
			fontSize: {
				'xs': ['0.75rem', { lineHeight: '1rem' }],
				'sm': ['0.875rem', { lineHeight: '1.25rem' }],
				'base': ['1rem', { lineHeight: '1.5rem' }],
				'lg': ['1.125rem', { lineHeight: '1.75rem' }],
				'xl': ['1.25rem', { lineHeight: '1.75rem' }],
				'2xl': ['1.5rem', { lineHeight: '2rem' }],
				'3xl': ['1.875rem', { lineHeight: '2.25rem' }],
				'4xl': ['2.25rem', { lineHeight: '2.5rem' }],
				'5xl': ['3rem', { lineHeight: '1' }],
				'6xl': ['3.75rem', { lineHeight: '1' }],
				'7xl': ['4.5rem', { lineHeight: '1' }],
				'8xl': ['6rem', { lineHeight: '1' }],
				'9xl': ['8rem', { lineHeight: '1' }],
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
				'128': '32rem',
				'144': '36rem',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-in': {
					'0%': {
						transform: 'translateX(-100%)'
					},
					'100%': {
						transform: 'translateX(0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-in': 'slide-in 0.3s ease-out',
			},
			boxShadow: {
				'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
				'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 30px -5px rgba(0, 0, 0, 0.05)',
				'strong': '0 10px 50px -12px rgba(0, 0, 0, 0.25)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
