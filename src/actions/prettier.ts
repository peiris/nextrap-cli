import fs from 'fs'
import { prettierPkgs } from '@/config'
import { print, startSpinner } from '@/utils'
import { $ } from 'execa'

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

    const commandString = pkgMgr === 'npm' ? 'install --save-dev' : 'add -D'
    await $`${pkgMgr} ${commandString} ${prettierPkgs}`
    return 'Prettier setup complete'
  } finally {
    spinner.stop()
  }
}

export default setupPrettier
