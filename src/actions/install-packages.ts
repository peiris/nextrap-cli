import { $ } from 'execa'

import { requiredPkgs } from '@/config'
import { print, startSpinner } from '@/utils'

export const installPackages = async (pkgMgr: string) => {
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

export default installPackages