import fs from 'fs'
import { config } from '@/config'
import { print, startSpinner } from '@/utils'
import { $ } from 'execa'

export const setupShadCnUI = async (template: string) => {
  await fs.promises.writeFile('./components.json', template)
  const defaults = config?.shadcn?.components

  let existing: string[] = []
  try {
    const existingFiles = await fs.promises.readdir('./components/ui')
    existing = existingFiles.map((component) => component.replace('.tsx', ''))
  } catch {}

  const filtered = defaults?.filter(
    (component) => !existing.includes(component),
  )

  if (filtered?.length > 0) {
    const chunks = filtered.reduce((resultArray: string[][], item, index) => {
      const chunkIndex = Math.floor(index / 4)

      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [] // start a new chunk
      }

      resultArray[chunkIndex].push(item)

      return resultArray
    }, [])

    const spinner = startSpinner(`Setting up shadcn-ui
  ${print.hint(`— ${chunks.join('\n  — ')}`)}
    `)

    try {
      const command = await $`npx --yes shadcn-ui@latest add ${filtered}`
      return command?.stderr
    } finally {
      spinner.stop()
    }
  }
}

export default setupShadCnUI
