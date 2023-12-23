#!/usr/bin/env node
import chalk from 'chalk'
import inquirer from 'inquirer'

import {
  installDevDependencies,
  readPackageJson,
  setupPrettier,
  setupShadCnUI,
} from './utils.js'

inquirer
  .prompt([])
  .then(async (answers) => {
    // await installDevDependencies([
    // 	"tailwindcss",
    // 	"postcss",
    // 	"autoprefixer",
    // 	"prettier",
    // 	"prettier-plugin-prisma",
    // 	"prettier-plugin-tailwindcss",
    // 	"prisma",
    // 	"ts-node",
    // 	"@ianvs/prettier-plugin-sort-imports",
    // ]);

    await setupPrettier()
    await setupShadCnUI()
  })
  .catch((error) => {
    if (error.isTtyError) {
    } else {
    }
  })
