import fs from 'fs'
import { $ } from 'execa'

import { prettierPkgs } from '@/config'
import { print, startSpinner } from '@/utils'

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

export default setupPrettier