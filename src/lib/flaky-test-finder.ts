'use strict';

const Mocha = require('mocha');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

export class LargeTestFinder {
    directory: string
    numLines: number
    numTests: number

    constructor(directory: string, numLines: number, numTests: number) {
        // TODO: validate in constructor!
        this.directory = directory
        this.numLines = numLines
        this.numTests = numTests
    }

    find() {
        let dir = this.directory
        if (!isDirectory(dir)) {
            // TODO: look at process.cwd(), process.env.INIT_CWD, $INIT_CWD
            dir = path.join(process.cwd(), this.directory)
        }
        validateInputs(this.directory, this.numLines, this.numTests)

        const fullDir = dir

        const allTestFiles = getTestFiles(fullDir)

        const lengths = {}
        allTestFiles.forEach((file: string) => {
            findLargeTests(file, lengths)
        })

        const testsWithManyLines = _.toPairs(lengths).filter((pair: any) => pair[1] >= this.numLines)
        const topLargeTests = testsWithManyLines.slice(0, this.numTests)
        const sorted = _.sortBy(topLargeTests, 1).reverse()

        return {
            largeTests: sorted,
            numTotalTests: testsWithManyLines.length
        }
    }
}

const resetTests = (mocha, allTestFiles) => {
    mocha.suite.suites = [];
    allTestFiles.forEach(file => {
        delete require.cache[require.resolve(path.join(__dirname, file))];
    });
};

const runTests = (allTestFiles, currentRun, totalRuns, testFailures = {}) => {
    return new Promise((resolve, reject) => {
        let numRunFailures = 0;

        const mocha = new Mocha({
            reporter: function () {
                //avoid logs
            },
        });
        
        allTestFiles.forEach(function(file) {
            mocha.addFile(file);
        });

        if (currentRun > 0) {
            resetTests(mocha, allTestFiles);
        } else {
            console.log(`Starting ${totalRuns} test runs...`);
        }

        return mocha.run()
            .on('fail', function(test, err) {
                const testKey = `${test.file} - ${test.title}`;
                const numFailures = _.get(testFailures, [testKey, 'numFailures'], 0);
                const testValue = {
                    test,
                    numFailures: numFailures + 1
                };
                testFailures[testKey] = testValue;
                numRunFailures++;
            })
            .on('end', function() {
                currentRun++;
                if (numRunFailures > 0) {
                    console.log(`Finished run ${currentRun}, number of test failures: ${numRunFailures}`);
                }

                if (currentRun < totalRuns) {
                    resolve(runTests(allTestFiles, currentRun, totalRuns, testFailures));
                } else {
                    resolve(testFailures);
                }
            });
    });
};

const validateInputs = (testDir, totalRuns) => {
    if (!isDirectory(testDir)) {
        // TODO: throw error instead of process exit
        console.error(`${testDir} is not a directory`);
        process.exit(1);
    }

    if (totalRuns < 0) {
        console.error(`Number of runs (${totalRuns}) cannot be negative`);
        process.exit(1);
    }
};

exports.findFlakyTests = (testDir, totalRuns) => {
    const allTestFiles = getTestFiles(testDir);
    return runTests(allTestFiles, 0, totalRuns);
};
