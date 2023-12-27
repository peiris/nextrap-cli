import { startSpinner } from '@/utils'
import { $ } from 'execa'

export const setupDateFns = async (pkgMgr: string) => {
  const spinner = startSpinner(`Setting up date-fns`)

  try {
    const commandString = pkgMgr === 'npm' ? 'install' : 'add';
    const command = await $`${pkgMgr} ${commandString} date-fns`
    return command?.stderr
  } finally {
    spinner.stop()
  }
}

export default setupDateFns