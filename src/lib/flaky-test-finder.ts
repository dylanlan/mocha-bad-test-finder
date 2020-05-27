import _ from 'lodash'
import Mocha from 'mocha'
import * as path from 'path'

import * as utils from './utils'

export class FlakyTestFinder {
    directory: string
    numRuns: number

    constructor(directory: string, numRuns: number) {
        // TODO: validate in constructor!
        this.directory = directory
        this.numRuns = numRuns
    }

    async find() {
        validateInputs(this.directory, this.numRuns)
        let dir = this.directory
        if (!utils.isDirectory(dir)) {
            // TODO: compare process.cwd(), process.env.INIT_CWD, $INIT_CWD
            dir = path.join(process.cwd(), this.directory)
        }

        return findFlakyTests(dir, this.numRuns)
    }
}

const resetTests = (mocha: any, allTestFiles: Array<string>) => {
    mocha.suite.suites = []
    allTestFiles.forEach(file => {
        const testPath = require.resolve(path.join(process.cwd(), file))
        delete require.cache[testPath]
    })
}

const runTests = (allTestFiles: Array<string>, currentRun: number, totalRuns: number, testFailures: any = {}): any => {
    return new Promise((resolve, reject) => {
        let numRunFailures = 0
        const options: any = {
            // tslint:disable-next-line:object-literal-shorthand
            reporter: function () {
                //empty to prevent test output
            }
        }
        const mocha = new Mocha(options)

        allTestFiles.forEach(file => {
            mocha.addFile(file)
        })

        if (currentRun > 0) {
            resetTests(mocha, allTestFiles)
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
                    return resolve(runTests(allTestFiles, currentRun, totalRuns, testFailures))
                } else {
                    return resolve(testFailures)
                }
            })
            .on('error', (error: Error) => {
                console.error('Error while running tests')
                console.error(error)
                return reject(error)
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

const findFlakyTests = async (testDir: string, totalRuns: number) => {
    const allTestFiles = utils.getTestFiles(testDir)
    return runTests(allTestFiles, 0, totalRuns)
}
