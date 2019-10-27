'use strict'

const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const utils = require('./utils')

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
        if (!utils.isDirectory(dir)) {
            // TODO: look at process.cwd(), process.env.INIT_CWD, $INIT_CWD
            dir = path.join(process.cwd(), this.directory)
        }
        validateInputs(this.directory, this.numLines, this.numTests)

        const fullDir = dir

        const allTestFiles = utils.getTestFiles(fullDir)

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

// TODO: not any
const findLargeTests = (testFile: string, lengths: any) => {
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
        const isTest = utils.isTestLine(line)
        const isBlock = utils.isTestBlock(line)

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
    if (!utils.isDirectory(dir)) {
        throw new Error(`${dir} is not a directory`)
    }

    if (lines < 0) {
        throw new Error(`Number of lines (${lines}) cannot be negative`)
    }

    if (numTests < 0) {
        throw new Error(`Number of tests (${numTests}) cannot be negative`)
    }
}
