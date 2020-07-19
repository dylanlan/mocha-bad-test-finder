import * as fs from 'fs';
import _ from 'lodash';
import * as path from 'path';

import * as utils from './utils';

export class LargeTestFinder {
    directory: string;

    numLines: number;

    numTests: number;

    constructor(directory: string, numberLines, numberTests) {
        // TODO: validate in constructor!
        this.directory = directory;
        this.numLines = numberLines;
        this.numTests = numberTests;
    }

    find() {
        let { directory } = this;
        if (!utils.isDirectory(directory)) {
            // TODO: look at process.cwd(), process.env.INIT_CWD, $INIT_CWD
            directory = path.join(process.cwd(), this.directory);
        }
        validateInputs(this.directory, this.numLines, this.numTests);

        const fullDirectory = directory;

        const allTestFiles = utils.getTestFiles(fullDirectory);

        const lengths = {};
        allTestFiles.forEach((file: string) => {
            findLargeTests(file, lengths);
        });

        const testsWithManyLines = _.toPairs(lengths).filter((pair: any) => pair[1] >= this.numLines);
        const topLargeTests = testsWithManyLines.slice(0, this.numTests);
        const sorted = _.sortBy(topLargeTests, 1).reverse();

        return {
            largeTests: sorted,
            numTotalTests: testsWithManyLines.length,
        };
    }
}

// TODO: not any
const findLargeTests = (testFile: string, lengths: any) => {
    const testText = fs.readFileSync(testFile).toString();
    if (!testText) {
        return;
    }

    const lines = testText.split('\n');
    if (!lines || lines.length <= 0) {
        return;
    }

    const numberLines = lines.length;
    let testLength = 0;
    let currentTest = '';
    let fileLine;
    for (let i = 0; i < numberLines; i += 1) {
        const line = lines[i];
        const lineNumber = i + 1;
        fileLine = `${testFile}:${lineNumber} - ${line.trim()}`.trim();
        const isTest = utils.isTestLine(line);
        const isBlock = utils.isTestBlock(line);

        if (!isBlock) {
            if (currentTest) {
                // if found regular code, and we're in a test, increment line count
                testLength += 1;
            }
        } else {
            if (currentTest) {
                // if we found a block and we're in a test, let's end the line count
                lengths[currentTest] = testLength;
                testLength = 0;
                currentTest = '';
            }

            if (isTest) {
                // found a new test block
                currentTest = fileLine;
            }
        }
    }

    if (currentTest) {
        // if we reached end of file, end line count for any ongoing test
        lengths[currentTest] = testLength;
        testLength = 0;
        currentTest = '';
    }
};

const validateInputs = (directory: string, lines: number, numberTests: number) => {
    if (!utils.isDirectory(directory)) {
        throw new Error(`${directory} is not a directory`);
    }

    if (lines < 0) {
        throw new Error(`Number of lines (${lines}) cannot be negative`);
    }

    if (numberTests < 0) {
        throw new Error(`Number of tests (${numberTests}) cannot be negative`);
    }
};
