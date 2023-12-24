import { print } from './utils.js'

export const config = {
  templates: {
    prettier: {
      rc: 'https://raw.githubusercontent.com/peiris/nextrap-cli/main/templates/.prettierrc',
      ignore:
        'https://raw.githubusercontent.com/peiris/nextrap-cli/main/templates/.prettierignore',
    },
    shadcn: {
      components:
        'https://raw.githubusercontent.com/peiris/nextrap-cli/main/templates/shadcn-components.json',
    },
    utils:
      'https://raw.githubusercontent.com/peiris/nextrap-cli/main/templates/utils.ts',
    tailwind:
      'https://raw.githubusercontent.com/peiris/nextrap-cli/main/templates/tailwind.config.ts',
  },
  defaults: {
    shadcn: {
      components: ['button', 'avatar'],
    },
  },
}

export const cliPkgs = [
  {
    name: `Shadcn-UI ${print.hint('(ui.shadcn.com)')}`,
    value: 'shadcn-ui',
    checked: true,
  },
  {
    name: `Lucide Icons ${print.hint('(lucide.dev)')}`,
    value: 'lucide-icons',
    checked: true,
  },
  {
    name: `Prisma ${print.hint('(prisma.io)')}`,
    value: 'prisma',
    checked: true,
  },
  {
    name: `Next-Auth ${print.hint('(authjs.dev)')}`,
    value: 'next-auth',
    checked: true,
  },
  {
    name: `Resend ${print.hint('(resend.io)')}`,
    value: 'resend-email',
    checked: true,
  },
  {
    name: `Date-Fns ${print.hint('(date-fns.org)')}`,
    value: 'date-fns',
    checked: true,
  },
]

export const requiredPkgs = [
  '@tailwindcss/container-queries',
  '@tailwindcss/typography',
  'class-variance-authority',
  'clsx',
  'tailwind-merge',
  'tailwindcss-animate',
]

export const prettierPkgs = [
  'prettier',
  'prettier-plugin-tailwindcss',
  '@ianvs/prettier-plugin-sort-imports',
  'prettier-plugin-prisma',
]
