/** @type {import('tailwindcss').Config} */
import type {PluginAPI} from "tailwindcss/types/config";

function withOpacity(variableName: string) {
    return ({opacityValue}: { opacityValue?: number }): string => {
        if (opacityValue !== undefined) {
            return `rgba(var(--${variableName}), ${opacityValue})`;
        }
        return `rgb(var(--${variableName}))`;
    };
}


module.exports = {
    content: [
        './components/**/*.{vue,js,ts}', // Vue components
        './layouts/**/*.vue',            // Nuxt layouts
        './pages/**/*.vue',              // Nuxt pages
        './composables/**/*.{js,ts}',    // Composables
        './plugins/**/*.{js,ts}',        // Plugins
        './app.vue',                     // Main app file
    ],
    theme: {
        extend: {

            screens: {
                '3xl': '1600px',
                '6xl': '1900px',
            },

            transitionDuration: {
                '1500': '1500ms',
                '2000': '2000ms',
                '2500': '2500ms',
                '3000': '3000ms',
            },

            writingMode: {
                'vertical-rl': 'vertical-rl',
                'vertical-lr': 'vertical-lr',
                'vertical-tb': 'vertical-up',
            },
            minHeight: {
                'nav-offset': 'calc(100vh - 5rem)',
                'screen-4': 'calc(100vh - 1rem)',
                'screen-8': 'calc(100vh - 2rem)',
                'screen-12': 'calc(100vh - 3rem)',
                'screen-16': 'calc(100vh - 4rem)',
                'screen-20': 'calc(100vh - 5rem)',
                'screen-24': 'calc(100vh - 6rem)',

            },

            gridTemplateColumns: {
                '13': 'repeat(13, minmax(0, 1fr))',
                '14': 'repeat(14, minmax(0, 1fr))',
                '15': 'repeat(15, minmax(0, 1fr))',
            },
            textColor: {
                skin: {
                    'base': withOpacity('text-base'),
                    'muted': withOpacity('text-muted'),
                    'primary': withOpacity('text-primary'),
                    'secondary': withOpacity('text-secondary'),
                    'tertiary': withOpacity('text-tertiary'),
                    'accent': withOpacity('text-accent'),
                    'error': withOpacity('text-error'),
                    'success': withOpacity('text-success'),
                    'warning': withOpacity('text-warning'),
                    'info': withOpacity('text-info'),
                    'link': withOpacity('text-link'),
                    'link-hover': withOpacity('text-link-hover'),
                    'link-active': withOpacity('text-link-active'),
                },
            },
            backgroundColor: {
                skin: {
                    'base': withOpacity('bg-base'),
                    'muted': withOpacity('bg-muted'),
                    'primary': withOpacity('bg-primary'),
                    'secondary': withOpacity('bg-secondary'),
                    'tertiary': withOpacity('bg-tertiary'),
                    'accent': withOpacity('bg-accent'),
                    'error': withOpacity('bg-error'),
                    'success': withOpacity('bg-success'),
                    'warning': withOpacity('bg-warning'),
                    'info': withOpacity('bg-info'),
                    'surface': withOpacity('bg-surface'),
                    'surface-hover': withOpacity('bg-surface-hover'),
                    'overlay': withOpacity('bg-overlay'),
                },
            },
            borderColor: {
                skin: {
                    'base': withOpacity('border-base'),
                    'muted': withOpacity('border-muted'),
                    'primary': withOpacity('border-primary'),
                    'secondary': withOpacity('border-secondary'),
                    'tertiary': withOpacity('border-tertiary'),
                    'accent': withOpacity('border-accent'),
                    'error': withOpacity('border-error'),
                    'success': withOpacity('border-success'),
                    'warning': withOpacity('border-warning'),
                    'info': withOpacity('border-info'),
                },
            },
            ringColor: {
                skin: {
                    'base': withOpacity('border-base'),
                    'muted': withOpacity('border-muted'),
                    'primary': withOpacity('border-primary'),
                    'secondary': withOpacity('border-secondary'),
                    'tertiary': withOpacity('border-tertiary'),
                    'accent': withOpacity('border-accent'),
                    'error': withOpacity('border-error'),
                    'success': withOpacity('border-success'),
                    'warning': withOpacity('border-warning'),
                    'info': withOpacity('border-info'),
                },
            },
            fill: {
                skin: {
                    'base': withOpacity('icon-base'),
                    'muted': withOpacity('icon-muted'),
                    'primary': withOpacity('icon-primary'),
                    'secondary': withOpacity('icon-secondary'),
                    'tertiary': withOpacity('icon-tertiary'),
                    'accent': withOpacity('icon-accent'),
                    'error': withOpacity('icon-error'),
                    'success': withOpacity('icon-success'),
                    'warning': withOpacity('icon-warning'),
                    'info': withOpacity('icon-info'),
                },
            },
            typography: () => ({
                skin: {
                    css: {
                        '--tw-prose-body': `rgb(var(--text-base))`,
                        '--tw-prose-headings': `rgb(var(--text-base))`,
                        '--tw-prose-lead': `rgb(var(--text-muted))`,
                        '--tw-prose-links': `rgb(var(--text-link))`,
                        '--tw-prose-bold': `rgb(var(--text-accent))`,
                        '--tw-prose-counters': `rgb(var(--text-muted))`,
                        '--tw-prose-bullets': `rgb(var(--text-muted))`,
                        '--tw-prose-hr': `rgb(var(--border-base))`,
                        '--tw-prose-quotes': `rgb(var(--text-secondary))`,
                        '--tw-prose-quote-borders': `rgb(var(--border-base))`,
                        '--tw-prose-captions': `rgb(var(--text-muted))`,
                        '--tw-prose-code': `rgb(var(--text-secondary))`,
                        '--tw-prose-pre-code': `rgb(var(--text-base))`,
                        '--tw-prose-pre-bg': `rgb(var(--bg-surface))`,
                        '--tw-prose-th-borders': `rgb(var(--border-base))`,
                        '--tw-prose-td-borders': `rgb(var(--border-base))`,

                        // Invert colors
                        '--tw-prose-invert-body': `rgb(var(--text-muted))`,
                        '--tw-prose-invert-headings': `rgb(var(--text-base))`,
                        '--tw-prose-invert-lead': `rgb(var(--text-muted))`,
                        '--tw-prose-invert-links': `rgb(var(--text-link))`,
                        '--tw-prose-invert-bold': `rgb(var(--text-accent))`,
                        '--tw-prose-invert-counters': `rgb(var(--text-muted))`,
                        '--tw-prose-invert-bullets': `rgb(var(--text-muted))`,
                        '--tw-prose-invert-hr': `rgb(var(--border-muted))`,
                        '--tw-prose-invert-quotes': `rgb(var(--text-base))`,
                        '--tw-prose-invert-quote-borders': `rgb(var(--border-muted))`,
                        '--tw-prose-invert-captions': `rgb(var(--text-muted))`,
                        '--tw-prose-invert-code': `rgb(var(--text-secondary))`,
                        '--tw-prose-invert-pre-code': `rgb(var(--text-muted))`,
                        '--tw-prose-invert-pre-bg': 'rgba(0, 0, 0, 0.5)',
                        '--tw-prose-invert-th-borders': `rgb(var(--border-muted))`,
                        '--tw-prose-invert-td-borders': `rgb(var(--border-muted))`,
                    },
                },
            }),

        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
        require('@tailwindcss/aspect-ratio'),
        function (api: PluginAPI) {
            const {addUtilities} = api;
            addUtilities({
                '.writing-mode-vertical-rl': {
                    'writing-mode': 'vertical-rl',
                    'text-orientation': 'mixed',
                },
                '.writing-mode-vertical-lr': {
                    'writing-mode': 'vertical-lr',
                    'text-orientation': 'mixed',
                    'transform': 'rotate(180deg)',
                },
                '.writing-mode-vertical-up': {
                    'writing-mode': 'vertical-rl',
                    'transform': 'rotate(180deg)',
                    'text-orientation': 'upright',
                },
            });
        },

    ],
}
