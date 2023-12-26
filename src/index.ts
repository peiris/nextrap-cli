#!/usr/bin/env node
import { cliPkgs } from '@/config'
import { log, print } from '@/utils'
import { faker } from '@faker-js/faker'
import { checkbox, confirm, input } from '@inquirer/prompts'
import select from '@inquirer/select'
import chalk from 'chalk'
import figlet from 'figlet'

import { baseSetup } from '@/actions/base-setup'
import { createNextApp } from '@/actions/create-next-app'
import { setupDateFns } from '@/actions/date-fns'
import { fetchTemplates } from '@/actions/fetch-templates'
import { finalize } from '@/actions/finalize'
import { setupIcons } from '@/actions/icons'
import { installPackages } from '@/actions/install-packages'
import { setupPrettier } from '@/actions/prettier'
import { setupPrisma } from '@/actions/prisma'
import { setupShadCnUI } from '@/actions/shad-cn'

const welcome = figlet.textSync('Nextrap!', {
  font: 'Standard',
  horizontalLayout: 'default',
  verticalLayout: 'default',
  width: 60,
  whitespaceBreak: true,
})

const complete = figlet.textSync('Completed', {
  font: 'Ogre',
  horizontalLayout: 'default',
  verticalLayout: 'default',
  width: 60,
  whitespaceBreak: true,
})

const configTemplates = await fetchTemplates().catch(() => {
  log.error('Could not fetch config templates')
  process.exit(1)
})

console.log(chalk.hex('#fde047')(welcome))
console.log(
  chalk.hex('#fde047')(`Bootstrap your next.js project faster than ever!\n`),
)

const isFresh = await confirm({
  message: print.question(
    `Is this a fresh install? ${chalk.gray(
      `(If not we will skip next.js install)`,
    )}`,
  ),
  default: true,
})
  .then((answers) => answers)
  .catch((error) => {
    log.error(error?.stderr || error?.message)
    process.exit(1)
  })

const name = isFresh
  ? await input({
      message: print.question(`What is your project name?`),
      default: `${faker.lorem.slug(2)}-app`,
    })
      .then((answers) => answers)
      .catch((error) => {
        log.error(error?.stderr || error?.message)
        process.exit(1)
      })
  : '.'

const pkgMgr = await select({
  message: print.question('Select your package manager'),
  choices: [
    { name: 'pnpm', value: 'pnpm' },
    { name: 'npm', value: 'npm' },
    { name: 'yarn', value: 'yarn' },
  ],
  default: 'pnpm',
})
  .then((answers) => answers)
  .catch((error) => {
    log.error(error?.stderr || error?.message)
    process.exit(1)
  })

const pkgs = await checkbox({
  message: print.question('Select the packages you want to install'),
  choices: cliPkgs,
})
  .then((answers) => answers)
  .catch((error) => {
    log.error(error?.stderr || error?.message)
    process.exit(1)
  })

isFresh
  ? await createNextApp(name)
      .then(async (std) => {
        process.chdir(name) // Change directory to the newly created folder
        return std
      })
      .catch((error) => {
        log.error(error.message)
        process.exit(1)
      })
  : null

await setupPrettier({
  prettierignore: configTemplates?.prettierignore,
  prettierrc: configTemplates?.prettierrc,
  pkgMgr,
  pkgs,
}).catch((error) => {
  log.error(error.message)
})

await installPackages(pkgMgr).catch((error) => {
  log.error(error.message)
  process.exit(1)
})

await baseSetup(configTemplates).catch((error) => {
  log.error(error.message)
})

if (pkgs.includes('shadcn-ui')) {
  await setupShadCnUI(configTemplates?.shadcn).catch((error) => {
    log.error(error.message)
  })
}

if (pkgs.includes('lucide-icons')) {
  await setupIcons(pkgMgr).catch((error) => {
    log.error(error.message)
  })
}

if (pkgs.includes('prisma')) {
  await setupPrisma(pkgMgr).catch((error) => {
    log.error(error.message)
  })
}

if (pkgs.includes('date-fns')) {
  await setupDateFns(pkgMgr).catch((error) => {
    log.error(error.message)
  })
}

await finalize(pkgMgr)

console.log(chalk.hex('#5eead4')(complete))
console.log(`\n${chalk.hex('#5eead4')('Happy hacking!')}\n`)
