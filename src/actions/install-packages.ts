import { $ } from 'execa'

import { requiredPkgs } from '@/config'
import { print, startSpinner } from '@/utils'

export const installPackages = async (pkgMgr: string) => {
  const spinner = startSpinner(`Setting up essential packages
  ${print.hint(`— ${requiredPkgs.join('\n  — ')}`)}
  `)

  try {
    // Determine the correct command string based on the package manager
    const commandString = pkgMgr === 'npm' ? 'install --save-dev' : 'add --save-dev';

    const command = await $`${pkgMgr} ${commandString} ${requiredPkgs}`;
    return command?.stderr;
  } finally {
    spinner.stop();
  }
}

export default installPackages