import * as fs from 'fs';
import path from 'path';

export const isTestFile = (fileName: string) => {
    if (!fileName) {
        return false;
    }
    const testFileSuffixes = ['test.js', 'spec.js', 'test.ts', 'spec.ts'];
    const lowerCase = fileName.toLowerCase();
    return testFileSuffixes.some((suffix: string) => lowerCase.endsWith(suffix));
};

export const isDirectory = (path: string) => fs.existsSync(path) && fs.lstatSync(path).isDirectory();

export const getTestFiles = (parentDirectory: string) => {
    const files = fs.readdirSync(parentDirectory);
    let testFiles = files.filter((f: string) => isTestFile(f)).map((f: string) => path.join(parentDirectory, f));
    const directories = files.filter((f: string) => isDirectory(path.join(parentDirectory, f)) && !f.startsWith('.') && f !== 'node_modules');
    directories.forEach((directory) => {
        const subFiles = getTestFiles(path.join(parentDirectory, directory));
        testFiles = testFiles.concat(subFiles);
    });

    return testFiles;
};

export const isTestLine = (line: string) => {
    const regex = /^\s*\.?it\(/;
    return regex.test(line);
};

export const isTestBlock = (line: string) => {
    const regex = /^\s*(\.?it|\.?describe|\.?beforeEach|\.?afterEach)\(/;
    return regex.test(line);
};
