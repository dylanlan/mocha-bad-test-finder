'use strict'

const fs = require('fs')
const path = require('path')
const _ = require('lodash')

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

const isTestFile = (fileName: string) => {
    if (!fileName) {
        return false
    }
    const testFileSuffixes = ['test.js', 'spec.js', 'test.ts']
    const lowerCase = fileName.toLowerCase()
    return testFileSuffixes.some((suffix: string) => lowerCase.endsWith(suffix))
}

const isDirectory = (path: string) => {
    return fs.existsSync(path) && fs.lstatSync(path).isDirectory()
}

const getTestFiles = (parentDirectory: string) => {
    const files = fs.readdirSync(parentDirectory)
    let testFiles = files.filter((f: string) => isTestFile(f)).map((f: string) => path.join(parentDirectory, f))
    const directories = files.filter((f: string) => isDirectory(path.join(parentDirectory, f)) && !f.startsWith('.') && f !== 'node_modules')
    directories.forEach((dir: string) => {
        const subFiles = getTestFiles(path.join(parentDirectory, dir))
        testFiles = testFiles.concat(subFiles)
    })

    return testFiles
}

const isTestLine = (line: string) => {
    const regex = /^\s*\.?it\(/
    return regex.test(line)
}

const isTestBlock = (line: string) => {
    const regex = /^\s*(\.?it|\.?describe|\.?beforeEach|\.?afterEach)\(/
    return regex.test(line)
}

const findLargeTests = (testFile: string, lengths: LineLengths) => {
    const testText = fs.readFileSync(testFile).toString()
    if (!testText) {
        return
    }

    const lines = testText.split('\n')
    if (!lines || !lines.length) {
        return
    }

    const numLines = lines.length
    let testLength = 0
    let currentTest = ''
    let fileLine
    for (let i = 0; i < numLines; i++) {
        const line = lines[i]
        const lineNumber = i + 1
        fileLine = `${testFile}:${lineNumber} - ${line.trim()}`.trim()
        const isTest = isTestLine(line)
        const isBlock = isTestBlock(line)

        if (!isBlock) {
            if (currentTest) {
                // if found regular code, and we're in a test, increment line count
                testLength++
            }
        } else {
            if (currentTest) {
                // if we found a block and we're in a test, let's end the line count
                lengths[currentTest] = testLength
                testLength = 0
                currentTest = ''
            }

            if (isTest) {
                // found a new test block
                currentTest = fileLine
            }
        }
    }

    if (currentTest) {
        // if we reached end of file, end line count for any ongoing test
        lengths[currentTest] = testLength
        testLength = 0
        currentTest = ''
    }
}

const validateInputs = (dir: string, lines: number, numTests: number) => {
    if (!isDirectory(dir)) {
        throw new Error(`${dir} is not a directory`)
    }

    if (lines < 0) {
        throw new Error(`Number of lines (${lines}) cannot be negative`)
    }

    if (numTests < 0) {
        throw new Error(`Number of tests (${numTests}) cannot be negative`)
    }
}
