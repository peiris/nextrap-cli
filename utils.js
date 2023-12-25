import fs from 'fs';
import chalk from 'chalk';
import { $ } from 'execa';
import { createSpinner } from 'nanospinner';
import { config, prettierPkgs, requiredPkgs } from './config.js';
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
export const folderExists = async (folderName) => {
    try {
        await fs.promises.access(folderName);
        return true;
    }
    catch {
        return false;
    }
};
export const baseSetup = async (templates) => {
    const spinner = startSpinner(`Setting up utils and tailwind plugins
  ${print.hint(`— lib/utils.ts \n  — tailwind.config.ts`)}
  `);
    try {
        try {
            await fs.promises.access('./lib');
        }
        catch {
            await fs.promises.mkdir('./lib');
        }
        await fs.promises.writeFile('./lib/utils.ts', templates.utils);
        await fs.promises.writeFile('./tailwind.config.ts', templates.tailwindconfig);
        return 'Files created';
    }
    finally {
        spinner.stop();
    }
};
export const createNextApp = async (projectName) => {
    if (projectName !== '.' && (await folderExists(projectName))) {
        log.error(`Folder with name "${projectName}" already exist. Please choose another name or delete the folder and try again.`);
        return process.exit(1);
    }
    const spinner = startSpinner(`Setting up next.js app ${chalk.gray('(This may take a while)')}
  ${print.hint(`— Typescript \n  — TailwindCSS \n  — ESLint \n  — Import alias [@/*] \n  — App directory`)}
  `);
    try {
        const cmd = await $ `npx --yes create-next-app@latest ${projectName} --ts --tailwind --eslint --app --no-src-dir --import-alias @/*`;
        return cmd;
    }
    finally {
        spinner.stop();
    }
};
export const installRequiredPkgs = async (pkgMgr) => {
    const spinner = startSpinner(`Setting up essential packages
  ${print.hint(`— ${requiredPkgs.join('\n  — ')}`)}
  `);
    try {
        const command = await $ `${pkgMgr} install --save-dev ${requiredPkgs}`;
        return command?.stderr;
    }
    finally {
        spinner.stop();
    }
};
export const setupShadCnUI = async (template) => {
    await fs.promises.writeFile('./components.json', template);
    const defaults = config?.shadcn?.components;
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
        const chunks = filtered.reduce((resultArray, item, index) => {
            const chunkIndex = Math.floor(index / 4);
            if (!resultArray[chunkIndex]) {
                resultArray[chunkIndex] = []; // start a new chunk
            }
            resultArray[chunkIndex].push(item);
            return resultArray;
        }, []);
        const spinner = startSpinner(`Setting up essential packages
  ${print.hint(`— ${chunks.join('\n  — ')}`)}
  `);
        const command = await $ `npx --yes shadcn-ui@latest add ${filtered}`;
        spinner.stop();
        return command?.stderr;
    }
};
export const setupIcons = async (pkgMgr) => {
    const spinner = startSpinner(`Setting up lucide icons`);
    try {
        const command = await $ `${pkgMgr} install lucide-react`;
        return command?.stderr;
    }
    finally {
        spinner.stop();
    }
};
export const setupPrisma = async (pkgMgr) => {
    const spinner = startSpinner(`Setting up prisma`);
    try {
        try {
            await fs.promises.access('./prisma/schema.prisma');
            spinner.stop();
            return { message: 'Prisma already exist' };
        }
        catch {
            const installPrisma = await $ `${pkgMgr} install --save-dev prisma`;
            await $ `npx prisma init --datasource-provider mysql`;
            return installPrisma?.stderr;
        }
    }
    finally {
        spinner.stop();
    }
};
export const setupDateFns = async (pkgMgr) => {
    const spinner = startSpinner(`Setting up date-fns`);
    try {
        const command = await $ `${pkgMgr} install date-fns`;
        return command?.stderr;
    }
    finally {
        spinner.stop();
    }
};
export const setupPrettier = async ({ prettierignore, prettierrc, pkgMgr, pkgs, }) => {
    const spinner = startSpinner(`Setting up prettier
  ${print.hint(`— .prettierrc \n  — .prettierignore`)}
  `);
    try {
        await fs.promises.writeFile('./.prettierrc', prettierrc);
        await fs.promises.writeFile('./.prettierignore', prettierignore);
        await $ `${pkgMgr} install --save-dev ${prettierPkgs}`;
        return 'Prettier setup complete';
    }
    finally {
        spinner.stop();
    }
};
const fetchText = async (url) => {
    try {
        const response = await fetch(url);
        return response.text();
    }
    catch (error) {
        log.error(error.message);
        process.exit(1);
    }
};
export const fetchTemplates = async () => {
    const spinner = startSpinner(`Fetching config templates`);
    try {
        const [shadcn, prettierrc, prettierignore, utils, tailwindconfig] = await Promise.all([
            fetchText(config?.templates?.shadcn?.components),
            fetchText(config?.templates?.prettier?.rc),
            fetchText(config?.templates?.prettier?.ignore),
            fetchText(config?.templates?.utils),
            fetchText(config?.templates?.tailwind),
        ]);
        return {
            shadcn,
            prettierrc,
            prettierignore,
            utils,
            tailwindconfig,
        };
    }
    finally {
        spinner.stop();
    }
};
