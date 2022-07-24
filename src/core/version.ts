import * as fs from 'node:fs/promises'
import colors from 'picocolors'
import { pkgUp } from 'pkg-up';
import pkgVersions from 'pkg-versions'
import * as semver from 'semver'
import type { PackageJson } from 'type-fest'

const getVersion = async (id: string, cwd: string): Promise<string> => {
  const pkgPath = await pkgUp({ cwd });
  if (!pkgPath)
    throw new Error(`Could not find ${colors.bold(colors.yellow('package.json'))} to resolve versions...`)

  const packageJson = JSON.parse(await fs.readFile(pkgPath, "utf8")) as PackageJson;

  const getDepVersion = packageJson.dependencies?.[id];
  if (!getDepVersion)
    throw new Error(`Could not find ${colors.bold(colors.yellow(id))} in package.json dependencies...`)

  const npmVersions = await pkgVersions(id);
  const fixedVersion = semver.maxSatisfying([...npmVersions], getDepVersion);

  if (!fixedVersion || !semver.valid(fixedVersion))
    throw new Error(`${colors.bold(colors.yellow(id))} version ${colors.red(colors.bold(getDepVersion))} is not valid semver...`)

  return fixedVersion;
}

export { getVersion }
