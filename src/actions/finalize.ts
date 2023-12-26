import fs from 'fs'
import { log, startSpinner } from '@/utils'
import { $ } from 'execa'

export const finalize = async (pkgMgr: string) => {
  const spinner = startSpinner(`Finalizing`)
  await fs.promises.rm('./package-lock.json')
  await fs.promises.rm('./pnpm-lock.yaml')

  try {
    await $`${pkgMgr} install`
  } catch (error: any) {
    log.error(error?.stderr || error?.message)
  } finally {
    spinner.stop()
  }
}

export default finalize