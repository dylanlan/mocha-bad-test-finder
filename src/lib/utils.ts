'use strict'

const fs = require('fs')
const path = require('path')

exports.isTestFile = (fileName: string) => {
    if (!fileName) {
        return false
    }
    const testFileSuffixes = ['test.js', 'spec.js', 'test.ts']
    const lowerCase = fileName.toLowerCase()
    return testFileSuffixes.some((suffix: string) => lowerCase.endsWith(suffix))
}

exports.isDirectory = (path: string) => {
    return fs.existsSync(path) && fs.lstatSync(path).isDirectory()
}

exports.getTestFiles = (parentDirectory: string) => {
    const files = fs.readdirSync(parentDirectory)
    let testFiles = files.filter((f: string) => exports.isTestFile(f)).map((f: string) => path.join(parentDirectory, f))
    const directories = files.filter((f: string) => exports.isDirectory(path.join(parentDirectory, f)) && !f.startsWith('.') && f !== 'node_modules')
    directories.forEach((dir: string) => {
        const subFiles = exports.getTestFiles(path.join(parentDirectory, dir))
        testFiles = testFiles.concat(subFiles)
    })

    return testFiles
}

exports.isTestLine = (line: string) => {
    const regex = /^\s*\.?it\(/
    return regex.test(line)
}

exports.isTestBlock = (line: string) => {
    const regex = /^\s*(\.?it|\.?describe|\.?beforeEach|\.?afterEach)\(/
    return regex.test(line)
}
