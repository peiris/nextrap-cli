import { requiredPkgs } from '@/config'
import { print, startSpinner } from '@/utils'
import { $, execa } from 'execa'

export const installPackages = async (pkgMgr: string) => {
  const spinner = startSpinner(`Setting up essential packages
  ${print.hint(`— ${requiredPkgs.join('\n  — ')}`)}
  `)

  try {
    if (pkgMgr === 'npm') {
      const cmd = await execa(pkgMgr, ['install', '--save-dev', ...requiredPkgs])
      return cmd?.stderr
    } else {
      const cmd = await execa(pkgMgr, ['add', '-D', ...requiredPkgs])
      return cmd?.stderr
    }
  } finally {
    spinner.stop()
  }
}

export default installPackages
