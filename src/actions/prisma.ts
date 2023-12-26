import fs from 'fs'
import { $ } from 'execa'

import { startSpinner } from '@/utils'

export const setupPrisma = async (pkgMgr: string) => {
  const spinner = startSpinner(`Setting up prisma`)

  try {
    try {
      await fs.promises.access('./prisma/schema.prisma')
      spinner.stop()
      return { message: 'Prisma already exist' }
    } catch {
      const installPrisma = await $`${pkgMgr} install --save-dev prisma`
      await $`npx prisma init --datasource-provider mysql`
      return installPrisma?.stderr
    }
  } finally {
    spinner.stop()
  }
}

export default setupPrisma