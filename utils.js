import fs from 'fs';
import chalk from 'chalk';
import { execa } from 'execa';
import { createSpinner } from 'nanospinner';
import { config } from './config.js';
export const readPackageJson = async () => {
    const spinner = createSpinner('Loading package.json');
    spinner.start();
    const packageJson = await fs.promises.readFile('package.json', 'utf-8');
    const parsedPackageJson = JSON.parse(packageJson);
    spinner.stop();
    return parsedPackageJson;
};
export const installDependencies = async (dependencies) => {
    const spinner = createSpinner('Installing dependencies');
    spinner.start();
    await execa('pnpm', ['install', '--save-dev', ...dependencies]);
    spinner.stop();
};
export const installDevDependencies = async (dependencies) => {
    const spinner = createSpinner('Installing dev dependencies');
    spinner.start();
    await execa('pnpm', ['install', '--save-dev', ...dependencies]);
    spinner.stop();
};
export const setupPrettier = async () => {
    const spinner = createSpinner(chalk.green('Setting up prettier \n'));
    spinner.start();
    // promise all to get both prettierRc and prettierIgnore
    const [prettierRc, prettierIgnore] = await Promise.all([
        await fetch(config?.templates?.prettier?.rc)
            .then((res) => res.text())
            .then((text) => text),
        await fetch(config?.templates?.prettier?.ignore)
            .then((res) => res.text())
            .then((text) => text),
    ]);
    // add .prettierrc and prettierIgnore to root
    await fs.promises.writeFile('./.prettierrc', prettierRc);
    await fs.promises.writeFile('./.prettierignore', prettierIgnore);
    spinner.stop();
    return prettierRc;
};
export const setupShadCnUI = async () => {
    const spinner = createSpinner(chalk.green('Setting up shadcn-ui \n'));
    spinner.start();
    const components_json = await fetch(config?.templates?.shadcn?.components)
        .then((res) => res.text())
        .then((text) => text);
    await fs.promises.writeFile('./.components.json', components_json);
    spinner.stop();
};
