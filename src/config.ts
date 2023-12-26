import { print } from '@/utils'

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
  shadcn: {
    components: [
      'button',
      'avatar',
      'accordion',
      'alert-dialog',
      'badge',
      'calendar',
      'carousel',
      'checkbox',
      'dialog',
      'drawer',
      'drawer',
      'dropdown-menu',
      'input',
      'label',
      'popover',
      'radio-group',
      'select',
      'separator',
      'slider',
      'sonner',
      'switch',
      'tabs',
      'textarea',
      'tooltip',
    ],
  },
}

export const cliPkgs = [
  {
    name: `shadcn-ui ${print.hint('(ui.shadcn.com)')}`,
    value: 'shadcn-ui',
    checked: true,
  },
  {
    name: `lucide-icons ${print.hint('(lucide.dev)')}`,
    value: 'lucide-icons',
    checked: true,
  },
  {
    name: `prisma ${print.hint('(prisma.io)')}`,
    value: 'prisma',
    checked: true,
  },
  {
    name: `next-auth ${print.hint('(authjs.dev)')}`,
    value: 'next-auth',
    checked: true,
  },
  {
    name: `resend-email ${print.hint('(resend.io)')}`,
    value: 'resend-email',
    checked: true,
  },
  {
    name: `date-fns ${print.hint('(date-fns.org)')}`,
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
