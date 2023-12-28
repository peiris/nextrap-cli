import { checkAndDeleteFile, log, startSpinner } from '@/utils'
import { $ } from 'execa'

export const finalize = async (pkgMgr: string) => {
  const spinner = startSpinner(`Finalizing`)

  // Check and delete lock files
  await checkAndDeleteFile('./package-lock.json')
  await checkAndDeleteFile('./pnpm-lock.yaml')
  await checkAndDeleteFile('./yarn-lock.yaml')

  try {
    await $`${pkgMgr} install`
  } catch (error: any) {
    log.error(error?.stderr || error?.message)
  } finally {
    spinner.stop()
  }
}

export default finalize
