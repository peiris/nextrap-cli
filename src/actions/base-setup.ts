import fs from 'fs'
import { print, startSpinner } from '@/utils'

export const baseSetup = async (templates: {
  utils: string
  tailwindconfig: string
}) => {
  const spinner = startSpinner(`Setting up utils and tailwind plugins
  ${print.hint(`— lib/utils.ts \n  — tailwind.config.ts`)}
  `)

  try {
    await fs.promises.mkdir('./lib', { recursive: true })
    await fs.promises.writeFile('./lib/utils.ts', templates.utils)
    await fs.promises.writeFile(
      './tailwind.config.ts',
      templates.tailwindconfig,
    )

    return 'Files created'
  } catch (error) {
    console.error('Error during setup:', error)
  } finally {
    spinner.stop()
  }
}

export default baseSetup