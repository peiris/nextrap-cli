import fs from 'fs'
import chalk from 'chalk'
import { $ } from 'execa'
import { createSpinner } from 'nanospinner'

import { config, prettierPkgs, requiredPkgs } from './config.js'

export const print = {
  success: (text: string) => chalk.hex('#a3e635')(text),
  question: (text: string) => chalk.hex('#4ade80')(text),
  complete: (text: string) => chalk.hex('#8b5cf6')(text),
  error: (text: string) => chalk.red(text),
  progress: (text: string) => chalk.magentaBright(text),
  info: (text: string) => chalk.magentaBright(text),
  hint: (text: string) => chalk.gray(text),
  default: (text: string) => chalk.gray(text),
}

export const log = {
  success: (text: string) => console.log(print.success(text)),
  complete: (text: string) => console.log(print.complete(text)),
  error: (text: string) => console.log(print.error(text)),
  progress: (text: string) => console.log(print.progress(text)),
  info: (text: string) => console.log(print.info(text)),
  hint: (text: string) => console.log(print.hint(text)),
  default: (text: string) => console.log(print.default(text)),
}

const startSpinner = (text: string) => {
  const spinner = createSpinner(print.progress(text))
  spinner.start()
  return spinner
}

export const installRequiredPkgs = async (pkgMgr: string) => {
  const spinner = startSpinner(`Setting up essential packages
      ${print.hint(` \n  — ${requiredPkgs.join('\n  — ')}`)}
  `)
  const command = await $`${pkgMgr} install --save-dev ${requiredPkgs}`
  spinner.stop()
  return command?.stderr
}

export const baseSetup = async (templates: {
  utils: string
  tailwindconfig: string
}) => {
  const spinner = startSpinner(`Setting up utils and tailwind plugins
      ${print.hint(` \n  — lib/utils.ts \n  — tailwind.config.ts`)}
  `)

  await fs.promises
    .access('./lib')
    .then(() => true)
    .catch(async () => await fs.promises.mkdir('./lib'))

  await fs.promises.writeFile('./lib/utils.ts', templates.utils)
  await fs.promises.writeFile('./tailwind.config.ts', templates.tailwindconfig)

  spinner.stop()
  return 'Files created'
}

export const createNextApp = async (projectName: string) => {
  if (projectName !== '.') {
    await fs.promises
      .access(projectName)
      .then(() => {
        log.error(
          `Folder with name "${projectName}" already exist. Please choose another name or delete the folder and try again.`,
        )
        return process.exit(1)
      })
      .catch(() => false)
  }

  const spinner = startSpinner(
    `Setting up next.js app ${chalk.gray('(This may take a while)')}`,
  )

  const cmd =
    await $`npx --yes create-next-app@latest ${projectName} --ts --tailwind --eslint --app --no-src-dir --import-alias @/*`

  spinner.stop()

  return cmd
}

export const setupShadCnUI = async (template: string) => {
  const spinner = startSpinner(`Setting up shadcn-ui`)

  await fs.promises.writeFile('./components.json', template)
  const defaults = config?.shadcn?.components

  const existing: string[] = await fs.promises
    .access('./components/ui')
    .then(async () => {
      const existing = await fs.promises.readdir('./components/ui')
      const sanitized = (existing as string[]).map((component) =>
        component.replace('.tsx', ''),
      )
      return sanitized
    })
    .catch(() => {
      return []
    })

  const filtered = defaults?.filter(
    (component) => !existing.includes(component),
  )

  if (filtered?.length > 0) {
    const command = await $`npx --yes shadcn-ui@latest add ${filtered}`
    spinner.stop()
    return command?.stderr
  } else {
    return spinner.stop()
  }
}

export const setupIcons = async (pkgMgr: string) => {
  const spinner = startSpinner(`Setting up lucide icons`)
  const command = await $`${pkgMgr} install lucide-react`
  spinner.stop()
  return command?.stderr
}

export const setupPrisma = async (pkgMgr: string) => {
  const spinner = startSpinner(`Setting up prisma`)
  const prismaExist = await fs.promises
    .access('./prisma/schema.prisma')
    .then(() => true)
    .catch(() => ({
      message: 'Prisma already exist',
    }))

  if (!prismaExist) {
    const installPrisma = await $`${pkgMgr} install --save-dev prisma`.then(
      async () => await $`npx prisma init --datasource-provider mysql`,
    )
    return installPrisma?.stderr
  }

  return spinner.stop()
}

export const setupDateFns = async (pkgMgr: string) => {
  const spinner = startSpinner(`Setting up date-fns`)
  const command = await $`${pkgMgr} install date-fns`
  spinner.stop()
  return command?.stderr
}

export const setupPrettier = async ({
  prettierignore,
  prettierrc,
  pkgMgr,
  pkgs,
}: {
  prettierignore: string
  prettierrc: string
  pkgMgr: string
  pkgs: string[]
}) => {
  const spinner = startSpinner(`Setting up prettier`)

  await fs.promises.writeFile('./.prettierrc', prettierrc)
  await fs.promises.writeFile('./.prettierignore', prettierignore)
  await $`${pkgMgr} install --save-dev  ${prettierPkgs}`

  spinner.stop()
  return 'Prettier setup complete'
}

export const fetchTemplates = async () => {
  const spinner = startSpinner(`Fetching config templates`)

  const [shadcn, prettierrc, prettierignore, utils, tailwindconfig] =
    await Promise.all([
      await fetch(config?.templates?.shadcn?.components)
        .then((res) => res.text())
        .then((text) => text)
        .catch((error) => {
          log.error(error.message)
          process.exit(1)
        }),
      await fetch(config?.templates?.prettier?.rc)
        .then((res) => res.text())
        .then((text) => text),
      await fetch(config?.templates?.prettier?.ignore)
        .then((res) => res.text())
        .then((text) => text),
      await fetch(config?.templates?.utils)
        .then((res) => res.text())
        .then((text) => text),
      await fetch(config?.templates?.tailwind).then((res) => res.text()),
    ])

  spinner.stop()
  return {
    shadcn,
    prettierrc,
    prettierignore,
    utils,
    tailwindconfig,
  }
}
