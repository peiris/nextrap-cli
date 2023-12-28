import fs from 'fs'
import { prettierPkgs } from '@/config'
import { print, startSpinner } from '@/utils'
import { $, execa } from 'execa'

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

    if (pkgMgr === 'npm') {
      const cmd = await execa(pkgMgr, [
        'install',
        '--save-dev',
        ...prettierPkgs,
      ])
      return cmd?.stderr
    } else {
      const cmd = await execa(pkgMgr, ['add', '-D', ...prettierPkgs])
      return cmd?.stderr
    }
  } finally {
    spinner.stop()
  }
}

export default setupPrettier
