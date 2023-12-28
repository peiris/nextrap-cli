import { requiredPkgs } from '@/config'
import { print, startSpinner } from '@/utils'
import { $ } from 'execa'

export const installPackages = async (pkgMgr: string) => {
  const spinner = startSpinner(`Setting up essential packages
  ${print.hint(`— ${requiredPkgs.join('\n  — ')}`)}
  `)

  try {
    const commandString = pkgMgr === 'npm' ? 'install --save-dev' : 'add -D'
    const command = await $`${pkgMgr} ${commandString} ${requiredPkgs}`
    return command?.stderr
  } finally {
    spinner.stop()
  }
}

export default installPackages
