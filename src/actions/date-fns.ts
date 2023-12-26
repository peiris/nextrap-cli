import { startSpinner } from '@/utils'
import { $ } from 'execa'

export const setupDateFns = async (pkgMgr: string) => {
  const spinner = startSpinner(`Setting up date-fns`)

  try {
    const command = await $`${pkgMgr} install date-fns`
    return command?.stderr
  } finally {
    spinner.stop()
  }
}

export default setupDateFns