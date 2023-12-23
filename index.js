#!/usr/bin/env node
import chalk from "chalk";
import inquirer from "inquirer";
import { setupPrettier, } from "./utils.js";
inquirer
    .prompt([
/* Pass your questions in here */
])
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
    const rc = await setupPrettier();
    console.log(rc);
    console.log(chalk.green("Successfully setup prettier!"));
})
    .catch((error) => {
    if (error.isTtyError) {
    }
    else {
    }
});
