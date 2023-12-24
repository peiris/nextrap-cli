export declare const print: {
    success: (text: string) => string;
    question: (text: string) => string;
    complete: (text: string) => string;
    error: (text: string) => string;
    progress: (text: string) => string;
    info: (text: string) => string;
    hint: (text: string) => string;
    default: (text: string) => string;
};
export declare const log: {
    success: (text: string) => void;
    complete: (text: string) => void;
    error: (text: string) => void;
    progress: (text: string) => void;
    info: (text: string) => void;
    hint: (text: string) => void;
    default: (text: string) => void;
};
export declare const installRequiredPkgs: (pkgMgr: string) => Promise<string>;
export declare const baseSetup: (templates: {
    utils: string;
}) => Promise<string>;
export declare const createNextApp: (projectName: string) => Promise<import("execa").ExecaReturnValue<string>>;
export declare const setupShadCnUI: (template: string) => Promise<string | import("nanospinner").Spinner>;
export declare const setupIcons: (pkgMgr: string) => Promise<string>;
export declare const setupPrisma: (pkgMgr: string) => Promise<string | import("nanospinner").Spinner>;
export declare const setupDateFns: (pkgMgr: string) => Promise<string>;
export declare const setupPrettier: ({ prettierignore, prettierrc, pkgMgr, pkgs, }: {
    prettierignore: string;
    prettierrc: string;
    pkgMgr: string;
    pkgs: string[];
}) => Promise<string>;
export declare const fetchTemplates: () => Promise<{
    shadcn: string;
    prettierrc: string;
    prettierignore: string;
    utils: string;
}>;
