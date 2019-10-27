'use strict';

const Mocha = require('mocha')
const path = require('path')
const _ = require('lodash')
const utils = require('./utils')

export class LargeTestFinder {
    directory: string
    numRuns: number

    constructor(directory: string, numRuns: number) {
        // TODO: validate in constructor!
        this.directory = directory
        this.numRuns = numRuns
    }

    find() {
        let dir = this.directory
        if (!utils.isDirectory(dir)) {
            // TODO: look at process.cwd(), process.env.INIT_CWD, $INIT_CWD
            dir = path.join(process.cwd(), this.directory)
        }
        validateInputs(this.directory, this.numRuns)

        const fullDir = dir

        const flakyTests = findFlakyTests(fullDir, this.numRuns)

        return {
            flakyTests
        }
    }
}

const resetTests = (mocha: any, allTestFiles: Array<string>) => {
    mocha.suite.suites = []
    allTestFiles.forEach(file => {
        delete require.cache[require.resolve(path.join(__dirname, file))]
    })
}

const runTests = (allTestFiles: Array<string>, currentRun: number, totalRuns: number, testFailures: any = {}) => {
    return new Promise((resolve, reject) => {
        let numRunFailures = 0

        const mocha = new Mocha({
            reporter: () => {
                //avoid logs
            },
        })

        allTestFiles.forEach(file => {
            mocha.addFile(file)
        })

        if (currentRun > 0) {
            resetTests(mocha, allTestFiles)
        } else {
            console.log(`Starting ${totalRuns} test runs...`)
        }

        return mocha.run()
            .on('fail', (test: any) => {
                const testKey = `${test.file} - ${test.title}`
                const numFailures = _.get(testFailures, [testKey, 'numFailures'], 0)
                const testValue = {
                    test,
                    numFailures: numFailures + 1
                }
                testFailures[testKey] = testValue
                numRunFailures++
            })
            .on('end', () => {
                currentRun++
                if (numRunFailures > 0) {
                    console.log(`Finished run ${currentRun}, number of test failures: ${numRunFailures}`)
                }

                if (currentRun < totalRuns) {
                    resolve(runTests(allTestFiles, currentRun, totalRuns, testFailures))
                } else {
                    resolve(testFailures)
                }
            })
            .on('error', (error) => {
                console.error(`Error while running tests`)
                console.error(error)
                reject(error)
            })
    })
}

const validateInputs = (testDir: string, totalRuns: number) => {
    if (!utils.isDirectory(testDir)) {
        throw new Error(`${testDir} is not a directory`)
    }

    if (totalRuns < 0) {
        throw new Error(`Number of runs (${totalRuns}) cannot be negative`)
    }
}

const findFlakyTests = (testDir: string, totalRuns: number) => {
    const allTestFiles = utils.getTestFiles(testDir)
    return runTests(allTestFiles, 0, totalRuns)
}
