import { folderExists, log, print, startSpinner } from '@/utils'
import chalk from 'chalk'
import { $ } from 'execa'

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

export default createNextApp