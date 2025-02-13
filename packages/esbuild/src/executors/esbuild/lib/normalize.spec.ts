import { normalizeOptions } from './normalize';
import { ExecutorContext } from '@nrwl/devkit';

describe('normalizeOptions', () => {
  const context: ExecutorContext = {
    root: '/',
    cwd: '/',
    isVerbose: false,
    projectName: 'myapp',
    projectGraph: {
      nodes: {
        myapp: {
          type: 'app',
          name: 'myapp',
          data: {
            root: 'apps/myapp',
            files: [],
          },
        },
      },
      dependencies: {},
    },
  };

  it('should handle single entry point options', () => {
    expect(
      normalizeOptions(
        {
          main: 'apps/myapp/src/index.ts',
          outputPath: 'dist/apps/myapp',
          tsConfig: 'apps/myapp/tsconfig.app.json',
          generatePackageJson: true,
          assets: [],
        },
        context
      )
    ).toEqual({
      main: 'apps/myapp/src/index.ts',
      outputPath: 'dist/apps/myapp',
      tsConfig: 'apps/myapp/tsconfig.app.json',
      assets: [],
      generatePackageJson: true,
      outputFileName: 'index.js',
      singleEntry: true,
      external: [],
    });
  });

  it('should handle multiple entry point options', () => {
    expect(
      normalizeOptions(
        {
          main: 'apps/myapp/src/index.ts',
          outputPath: 'dist/apps/myapp',
          tsConfig: 'apps/myapp/tsconfig.app.json',
          assets: [],
          generatePackageJson: true,
          additionalEntryPoints: ['apps/myapp/src/extra-entry.ts'],
        },
        context
      )
    ).toEqual({
      main: 'apps/myapp/src/index.ts',
      outputPath: 'dist/apps/myapp',
      tsConfig: 'apps/myapp/tsconfig.app.json',
      assets: [],
      generatePackageJson: true,
      outputFileName: 'index.js',
      additionalEntryPoints: ['apps/myapp/src/extra-entry.ts'],
      singleEntry: false,
      external: [],
    });
  });

  it('should support custom output file name', () => {
    expect(
      normalizeOptions(
        {
          main: 'apps/myapp/src/index.ts',
          outputPath: 'dist/apps/myapp',
          tsConfig: 'apps/myapp/tsconfig.app.json',
          assets: [],
          generatePackageJson: true,
          outputFileName: 'test.js',
        },
        context
      )
    ).toEqual({
      main: 'apps/myapp/src/index.ts',
      outputPath: 'dist/apps/myapp',
      tsConfig: 'apps/myapp/tsconfig.app.json',
      assets: [],
      generatePackageJson: true,
      outputFileName: 'test.js',
      singleEntry: true,
      external: [],
    });
  });

  it('should validate against multiple entry points + outputFileName', () => {
    expect(() =>
      normalizeOptions(
        {
          main: 'apps/myapp/src/index.ts',
          outputPath: 'dist/apps/myapp',
          tsConfig: 'apps/myapp/tsconfig.app.json',
          assets: [],
          generatePackageJson: true,
          additionalEntryPoints: ['apps/myapp/src/extra-entry.ts'],
          outputFileName: 'test.js',
        },
        context
      )
    ).toThrow(/Cannot use/);
  });

  it('should add package.json to assets array if generatePackageJson is false', () => {
    expect(
      normalizeOptions(
        {
          main: 'apps/myapp/src/index.ts',
          outputPath: 'dist/apps/myapp',
          tsConfig: 'apps/myapp/tsconfig.app.json',
          generatePackageJson: false,
          assets: [],
        },
        context
      )
    ).toEqual({
      main: 'apps/myapp/src/index.ts',
      outputPath: 'dist/apps/myapp',
      tsConfig: 'apps/myapp/tsconfig.app.json',
      assets: ['apps/myapp/package.json'],
      generatePackageJson: false,
      outputFileName: 'index.js',
      singleEntry: true,
      external: [],
    });
  });
});
