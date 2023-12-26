import { config } from '@/config'
import { fetchText, startSpinner } from '@/utils'

export const fetchTemplates = async () => {
  const spinner = startSpinner(`Fetching config templates`)

  try {
    const [shadcn, prettierrc, prettierignore, utils, tailwindconfig] =
      await Promise.all([
        fetchText(config?.templates?.shadcn?.components),
        fetchText(config?.templates?.prettier?.rc),
        fetchText(config?.templates?.prettier?.ignore),
        fetchText(config?.templates?.utils),
        fetchText(config?.templates?.tailwind),
      ])

    return {
      shadcn,
      prettierrc,
      prettierignore,
      utils,
      tailwindconfig,
    }
  } finally {
    spinner.stop()
  }
}

export default fetchTemplates
