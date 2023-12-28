import fs from 'fs'
import { startSpinner } from '@/utils'
import { $, execa } from 'execa'

export const setupPrisma = async (pkgMgr: string, db: string) => {
  const spinner = startSpinner(`Setting up prisma`)

  try {
    try {
      await fs.promises.access('./prisma/schema.prisma')
      spinner.stop()
      return { message: 'Prisma already exist' }
    } catch {
      if (pkgMgr === 'npm') {
        const cmd = await execa(pkgMgr, ['install', '--save-dev', 'prisma'])
        await $`npx prisma init --datasource-provider ${db}`
        return cmd?.stderr
      } else {
        const cmd = await execa(pkgMgr, ['add', '-D', 'prisma'])
        await $`npx prisma init --datasource-provider ${db}`
        return cmd?.stderr
      }
    }
  } finally {
    spinner.stop()
  }
}

export default setupPrisma
