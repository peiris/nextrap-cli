import { $ } from 'execa'

import { startSpinner } from '@/utils'

export const setupIcons = async (pkgMgr: string) => {
  const spinner = startSpinner(`Setting up lucide icons`)

  try {
    const commandString = pkgMgr === 'npm' ? 'install' : 'add';
    const command = await $`${pkgMgr} ${commandString} lucide-react`
    return command?.stderr
  } finally {
    spinner.stop()
  }
}

export default setupIcons