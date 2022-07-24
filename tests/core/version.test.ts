import * as fs from 'node:fs/promises'
import colors from 'picocolors'
import { pkgUp } from 'pkg-up';
import pkgVersions from 'pkg-versions';
import { describe, expect, it, vi } from 'vitest';

import { getVersion } from '../../src/core/version';

vi.mock('node:fs/promises')
vi.mock('pkg-up')
vi.mock('pkg-versions')

describe.skip("Version", () => {

  const testPkgJson = JSON.stringify({
    dependencies: {
      "package-normal": "1.0.0",
      "package-caret": "^1.0.0",
      "package-range": "1.x || 2.5.0 || 5.0.0 - 7.2.3",
      // This tag actually works on jsDelivr (???) but our goal is fixed versions
      "package-range-redundant": "1.x || >=2.5.0 || 5.0.0 - 7.2.3",
      "package-invalid": "a.b.c",
    }
  })

  const depVersions = {
    "package-normal": new Set(["1.0.0", "1.0.1", "1.2.3"]),
    "package-caret": new Set(["1.0.0", "1.0.1", "1.1.1", "2.1.1"]),
    "package-range": new Set(["1.0.0", "1.0.1", "2.7.7", "6.5.2", "8.1.1"]),
    "package-range-redundant": new Set(["1.0.0", "1.0.1", "2.7.7", "6.5.2", "8.1.1"]),
  }

  vi.mocked(fs.readFile).mockResolvedValue(testPkgJson);
  vi.mocked(pkgUp).mockResolvedValue('testpath/package.json');

  it('should return the correct version', async () => {
    vi.mocked(pkgVersions).mockResolvedValue(depVersions["package-normal"]);
    const version = await getVersion('package-normal');
    expect(version).toBe("1.0.0");
  })

  it('should return the correct caret version', async () => {
    vi.mocked(pkgVersions).mockResolvedValue(depVersions["package-caret"]);
    const version = await getVersion('package-caret');
    expect(version).toBe("1.1.1");
  })

  it('should return the correct range version', async () => {
    vi.mocked(pkgVersions).mockResolvedValue(depVersions["package-range"]);
    const version = await getVersion('package-range');
    expect(version).toBe("6.5.2");
  })

  it('should return the correct range redundant version', async () => {
    vi.mocked(pkgVersions).mockResolvedValue(depVersions["package-range-redundant"]);
    const version = await getVersion('package-range-redundant');
    expect(version).toBe("8.1.1");
  })

  it('should throw for invalid package', () => {
    expect(() => getVersion('unplugin-jsdelivr')).rejects.toThrow(`Could not find ${colors.bold(colors.yellow('unplugin-jsdelivr'))} in package.json dependencies...`);
  })

  it('should throw for invalid package version', () => {
    expect(() => getVersion('package-invalid')).rejects.toThrow('not valid semver');
  })
})
