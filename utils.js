import { createSpinner } from "nanospinner";
import fs from "fs";
import { execa } from "execa";
export const readPackageJson = async () => {
    const spinner = createSpinner("Loading package.json");
    spinner.start();
    const packageJson = await fs.promises.readFile("package.json", "utf-8");
    const parsedPackageJson = JSON.parse(packageJson);
    spinner.stop();
    return parsedPackageJson;
};
export const installDependencies = async (dependencies) => {
    const spinner = createSpinner("Installing dependencies");
    spinner.start();
    await execa("pnpm", ["install", "--save-dev", ...dependencies]);
    spinner.stop();
};
export const installDevDependencies = async (dependencies) => {
    const spinner = createSpinner("Installing dev dependencies");
    spinner.start();
    await execa("pnpm", ["install", "--save-dev", ...dependencies]);
    spinner.stop();
};
export const setupPrettier = async () => {
    const spinner = createSpinner("Setting up prettier");
    spinner.start();
    const prettierRc = await fs.promises.readFile("./templates/.prettierrc", "utf-8");
    const prettierIgnore = await fs.promises.readFile("./templates/.prettierignore", "utf-8");
    // add .prettierrc and prettierIgnore to root
    await fs.promises.writeFile("./.prettierrc", prettierRc);
    await fs.promises.writeFile("./.prettierignore", prettierIgnore);
    spinner.stop();
    return prettierRc;
};
