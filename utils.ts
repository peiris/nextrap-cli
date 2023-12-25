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

export const folderExists = async (folderName: string): Promise<boolean> => {
  try {
    await fs.promises.access(folderName)
    return true
  } catch {
    return false
  }
}

export const baseSetup = async (templates: {
  utils: string
  tailwindconfig: string
}) => {
  const spinner = startSpinner(`Setting up utils and tailwind plugins
  ${print.hint(`— lib/utils.ts \n  — tailwind.config.ts`)}
  `)

  try {
    try {
      await fs.promises.access('./lib')
    } catch {
      await fs.promises.mkdir('./lib')
    }

    await fs.promises.writeFile('./lib/utils.ts', templates.utils)
    await fs.promises.writeFile(
      './tailwind.config.ts',
      templates.tailwindconfig,
    )

    return 'Files created'
  } finally {
    spinner.stop()
  }
}

export const createNextApp = async (projectName: string) => {
  if (projectName !== '.' && (await folderExists(projectName))) {
    log.error(
      `Folder with name "${projectName}" already exist. Please choose another name or delete the folder and try again.`,
    )
    return process.exit(1)
  }

  const spinner = startSpinner(`Setting up next.js app ${chalk.gray(
    '(This may take a while)',
  )}
  ${print.hint(
    `— Typescript \n  — TailwindCSS \n  — ESLint \n  — Import alias [@/*] \n  — App directory`,
  )}
  `)

  try {
    const cmd =
      await $`npx --yes create-next-app@latest ${projectName} --ts --tailwind --eslint --app --no-src-dir --import-alias @/*`
    return cmd
  } finally {
    spinner.stop()
  }
}

export const installRequiredPkgs = async (pkgMgr: string) => {
  const spinner = startSpinner(`Setting up essential packages
  ${print.hint(`— ${requiredPkgs.join('\n  — ')}`)}
  `)

  try {
    const command = await $`${pkgMgr} install --save-dev ${requiredPkgs}`
    return command?.stderr
  } finally {
    spinner.stop()
  }
}

export const setupShadCnUI = async (template: string) => {
  await fs.promises.writeFile('./components.json', template)
  const defaults = config?.shadcn?.components

  let existing: string[] = []
  try {
    const existingFiles = await fs.promises.readdir('./components/ui')
    existing = existingFiles.map((component) => component.replace('.tsx', ''))
  } catch {
    // Directory does not exist or other error occurred, existing remains empty
  }

  const filtered = defaults?.filter(
    (component) => !existing.includes(component),
  )

  if (filtered?.length > 0) {
    const chunks = filtered.reduce((resultArray: string[][], item, index) => {
      const chunkIndex = Math.floor(index / 4)

      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [] // start a new chunk
      }

      resultArray[chunkIndex].push(item)

      return resultArray
    }, [])

    const spinner = startSpinner(`Setting up shadcn-ui
  ${print.hint(`— ${chunks.join('\n  — ')}`)}
    `)

    try {
      const command = await $`npx --yes shadcn-ui@latest add ${filtered}`
      return command?.stderr
    } finally {
      spinner.stop()
    }
  }
}

export const setupIcons = async (pkgMgr: string) => {
  const spinner = startSpinner(`Setting up lucide icons`)

  try {
    const command = await $`${pkgMgr} install lucide-react`
    return command?.stderr
  } finally {
    spinner.stop()
  }
}

export const setupPrisma = async (pkgMgr: string) => {
  const spinner = startSpinner(`Setting up prisma`)

  try {
    try {
      await fs.promises.access('./prisma/schema.prisma')
      spinner.stop()
      return { message: 'Prisma already exist' }
    } catch {
      const installPrisma = await $`${pkgMgr} install --save-dev prisma`
      await $`npx prisma init --datasource-provider mysql`
      return installPrisma?.stderr
    }
  } finally {
    spinner.stop()
  }
}

export const setupDateFns = async (pkgMgr: string) => {
  const spinner = startSpinner(`Setting up date-fns`)

  try {
    const command = await $`${pkgMgr} install date-fns`
    return command?.stderr
  } finally {
    spinner.stop()
  }
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
  const spinner = startSpinner(`Setting up prettier
  ${print.hint(`— .prettierrc \n  — .prettierignore`)}
  `)

  try {
    await fs.promises.writeFile('./.prettierrc', prettierrc)
    await fs.promises.writeFile('./.prettierignore', prettierignore)
    await $`${pkgMgr} install --save-dev ${prettierPkgs}`
    return 'Prettier setup complete'
  } finally {
    spinner.stop()
  }
}

const fetchText = async (url: string) => {
  try {
    const response = await fetch(url)
    return response.text()
  } catch (error) {
    log.error((error as Error).message)
    process.exit(1)
  }
}

export const fetchTemplates = async () => {
  const spinner = startSpinner(`Fetching config templates`)

  try {
    const [shadcn, prettierrc, prettierignore, utils, tailwindconfig] =
      await Promise.all([
        fetchText(config?.templates?.shadcn?.components),
        fetchText(config?.templates?.prettier?.rc),
        fetchText(config?.templates?.prettier?.ignore),
        fetchText(config?.templates?.utils),
        fetchText(config?.templates?.tailwind),
      ])

    return {
      shadcn,
      prettierrc,
      prettierignore,
      utils,
      tailwindconfig,
    }
  } finally {
    spinner.stop()
  }
}

export const finalize = async (pkgMgr: string) => {
  const spinner = startSpinner(`Finalizing`)
  await fs.promises.rm('./package-lock.json')
  await fs.promises.rm('./pnpm-lock.yaml')

  try {
    await $`${pkgMgr} install`
  } catch (error: any) {
    log.error(error?.stderr || error?.message)
  } finally {
    spinner.stop()
  }
}
