export declare const readPackageJson: () => Promise<any>;
export declare const installDependencies: (dependencies: string[]) => Promise<void>;
export declare const installDevDependencies: (dependencies: string[]) => Promise<void>;
export declare const setupPrettier: () => Promise<string>;
export declare const setupShadCnUI: () => Promise<void>;
