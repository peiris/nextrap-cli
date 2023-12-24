import fs from 'fs';
import chalk from 'chalk';
import { $ } from 'execa';
import { createSpinner } from 'nanospinner';
import { config } from './config.js';
export const print = {
    success: (text) => chalk.hex('#a3e635')(text),
    question: (text) => chalk.hex('#4ade80')(text),
    complete: (text) => chalk.hex('#8b5cf6')(text),
    error: (text) => chalk.red(text),
    progress: (text) => chalk.magentaBright(text),
    info: (text) => chalk.magentaBright(text),
    hint: (text) => chalk.gray(text),
    default: (text) => chalk.gray(text),
};
export const log = {
    success: (text) => console.log(print.success(text)),
    complete: (text) => console.log(print.complete(text)),
    error: (text) => console.log(print.error(text)),
    progress: (text) => console.log(print.progress(text)),
    info: (text) => console.log(print.info(text)),
    hint: (text) => console.log(print.hint(text)),
    default: (text) => console.log(print.default(text)),
};
const startSpinner = (text) => {
    const spinner = createSpinner(print.progress(text));
    spinner.start();
    return spinner;
};
export const createNextApp = async (projectName) => {
    if (projectName !== '.') {
        await fs.promises
            .access(projectName)
            .then(() => {
            log.error(`Folder with name "${projectName}" already exist. Please choose another name or delete the folder and try again.`);
            return process.exit(1);
        })
            .catch(() => false);
    }
    const spinner = startSpinner(`Setting up next.js app ${chalk.gray('(This may take a while)')}`);
    const cmd = await $ `npx --yes create-next-app@latest ${projectName} --ts --tailwind --eslint --app --no-src-dir --import-alias @/*`;
    spinner.stop();
    return cmd;
};
export const setupShadCnUI = async (template) => {
    const spinner = startSpinner(`Setting up shadcn-ui`);
    await fs.promises.writeFile('./components.json', template);
    const defaults = config?.defaults?.shadcn?.components;
    const existing = await fs.promises
        .access('./components/ui')
        .then(async () => {
        const existing = await fs.promises.readdir('./components/ui');
        const sanitized = existing.map((component) => component.replace('.tsx', ''));
        return sanitized;
    })
        .catch(() => {
        return [];
    });
    const filtered = defaults?.filter((component) => !existing.includes(component));
    if (filtered?.length > 0) {
        const command = await $ `npx --yes shadcn-ui@latest add ${filtered}`;
        spinner.stop();
        return command?.stderr;
    }
    else {
        return spinner.stop();
    }
};
export const setupIcons = async (pkgMgr) => {
    const spinner = startSpinner(`Setting up Lucide Icons`);
    const command = await $ `${pkgMgr} install lucide-react`;
    spinner.stop();
    return command?.stderr;
};
export const setupPrisma = async (pkgMgr) => {
    const spinner = startSpinner(`Setting up Prisma`);
    const prismaExist = await fs.promises
        .access('./prisma/schema.prisma')
        .then(() => true)
        .catch(() => ({
        message: 'Prisma already exist',
    }));
    if (!prismaExist) {
        const installPrisma = await $ `${pkgMgr} install --save-dev prisma`.then(async () => await $ `npx prisma init --datasource-provider mysql`);
        return installPrisma?.stderr;
    }
    return spinner.stop();
};
export const setupDateFns = async (pkgMgr) => {
    const spinner = startSpinner(`Setting up Date-Fns`);
    const command = await $ `${pkgMgr} install date-fns`;
    spinner.stop();
    return command?.stderr;
};
export const setupPrettier = async ({ prettierignore, prettierrc, }) => {
    const spinner = startSpinner(`Setting up Prettier`);
    await fs.promises.writeFile('./.prettierrc', prettierrc);
    await fs.promises.writeFile('./.prettierignore', prettierignore);
    spinner.stop();
    return 'Files created';
};
export const fetchTemplates = async () => {
    const spinner = startSpinner(`Fetching config templates`);
    const [shadcn, prettierrc, prettierignore] = await Promise.all([
        await fetch(config?.templates?.shadcn?.components)
            .then((res) => res.text())
            .then((text) => text)
            .catch((error) => {
            log.error(error.message);
            process.exit(1);
        }),
        await fetch(config?.templates?.prettier?.rc)
            .then((res) => res.text())
            .then((text) => text),
        await fetch(config?.templates?.prettier?.ignore)
            .then((res) => res.text())
            .then((text) => text),
    ]);
    spinner.stop();
    return {
        shadcn,
        prettierrc,
        prettierignore,
    };
};
