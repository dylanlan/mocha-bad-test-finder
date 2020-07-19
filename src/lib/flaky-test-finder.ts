import _ from 'lodash';
import Mocha from 'mocha';
import * as path from 'path';

import * as utils from './utils';

export class FlakyTestFinder {
    directory: string;

    numRuns: number;

    constructor(directory: string, numberRuns: number) {
        // TODO: validate in constructor!
        this.directory = directory;
        this.numRuns = numberRuns;
    }

    async find() {
        validateInputs(this.directory, this.numRuns);
        let { directory } = this;
        if (!utils.isDirectory(directory)) {
            // TODO: compare process.cwd(), process.env.INIT_CWD, $INIT_CWD
            directory = path.join(process.cwd(), this.directory);
        }

        return findFlakyTests(directory, this.numRuns);
    }
}

const resetTests = (mocha: any, allTestFiles: Array<string>) => {
    mocha.suite.suites = [];
    allTestFiles.forEach((file) => {
        const testPath = require.resolve(path.join(process.cwd(), file));
        delete require.cache[testPath];
    });
};

const runTests = (
    allTestFiles: Array<string>,
    currentRun: number,
    totalRuns: number,
    testFailures: any = {},
): any => new Promise((resolve, reject) => {
        let numberRunFailures = 0;
        const options: any = {
            // tslint:disable-next-line:object-literal-shorthand
            reporter() {
                // empty to prevent test output
            },
        };
        const mocha = new Mocha(options);

        allTestFiles.forEach((file) => {
            mocha.addFile(file);
        });

        if (currentRun > 0) {
            resetTests(mocha, allTestFiles);
        }

        return mocha.run()
            .on('fail', (test: any) => {
                const testKey = `${test.file} - ${test.title}`;
                const numberFailures = _.get(testFailures, [testKey, 'numFailures'], 0);
                const testValue = {
                    test,
                    numFailures: numberFailures + 1,
                };
                testFailures[testKey] = testValue;
                numberRunFailures += 1;
            })
            .on('end', () => {
                currentRun += 1;
                if (numberRunFailures > 0) {
                    console.log(`Finished run ${currentRun}, number of test failures: ${numberRunFailures}`);
                }

                if (currentRun < totalRuns) {
                    return resolve(runTests(allTestFiles, currentRun, totalRuns, testFailures));
                }
                    return resolve(testFailures);
            })
            .on('error', (error: Error) => {
                console.error('Error while running tests');
                console.error(error);
                return reject(error);
            });
    });

const validateInputs = (testDirectory: string, totalRuns: number) => {
    if (!utils.isDirectory(testDirectory)) {
        throw new Error(`${testDirectory} is not a directory`);
    }

    if (totalRuns < 0) {
        throw new Error(`Number of runs (${totalRuns}) cannot be negative`);
    }
};

const findFlakyTests = async (testDirectory: string, totalRuns: number) => {
    const allTestFiles = utils.getTestFiles(testDirectory);
    return runTests(allTestFiles, 0, totalRuns);
};
