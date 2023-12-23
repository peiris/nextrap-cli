#!/usr/bin/env node

// This is a node script

import chalk from "chalk";
import inquirer from "inquirer";
import { createSpinner } from "nanospinner";
import fs from "fs";

const readPackageJson = async () => {
	const spinner = createSpinner("Loading package.json");
	spinner.start();

	// Read package.json from the current directory with fs
	const packageJson = await fs.promises.readFile("package.json", "utf-8");
	spinner.stop();
	return packageJson;
};

inquirer
	.prompt([
		/* Pass your questions in here */
	])
	.then(async (answers) => {
		const packageJson = await readPackageJson();
		console.log(packageJson);
	})
	.catch((error) => {
		if (error.isTtyError) {
			// Prompt couldn't be rendered in the current environment
		} else {
			// Something else went wrong
		}
	});
