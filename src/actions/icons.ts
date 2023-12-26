import { $ } from 'execa'

import { startSpinner } from '@/utils'

export const setupIcons = async (pkgMgr: string) => {
  const spinner = startSpinner(`Setting up lucide icons`)

  try {
    const command = await $`${pkgMgr} install lucide-react`
    return command?.stderr
  } finally {
    spinner.stop()
  }
}

export default setupIcons