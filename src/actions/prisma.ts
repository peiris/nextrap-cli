import fs from 'fs'
import { $ } from 'execa'

import { startSpinner } from '@/utils'

export const setupPrisma = async (pkgMgr: string, db: string) => {
  const spinner = startSpinner(`Setting up prisma`)

  try {
    try {
      await fs.promises.access('./prisma/schema.prisma')
      spinner.stop()
      return { message: 'Prisma already exist' }
    } catch {
      // Determine the correct command string based on the package manager
      const commandString = pkgMgr === 'npm' ? 'install --save-dev' : 'add --save-dev';

      const installPrisma = await $`${pkgMgr} ${commandString} prisma`
      await $`npx prisma init --datasource-provider ${db}`
      return installPrisma?.stderr
    }
  } finally {
    spinner.stop()
  }
}

export default setupPrisma