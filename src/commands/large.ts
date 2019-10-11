import { Command, flags } from '@oclif/command'

import { LargeTestFinder } from '../lib/large-test-finder'

export default class Large extends Command {
    static description = 'Find mocha tests that have too many lines of code'

    static examples = [
        `$ btf large --dir=/some/test/dir --lines=50 --top=20
# outputs the 20 largest tests from the given directory that have at least 50 lines
`,
    ]

    static flags = {
        help: flags.help({ char: 'h' }),
        dir: flags.string({ char: 'd', description: 'the directory containing tests to search' }),
        lines: flags.integer({ char: 'l', description: 'number of lines of test code that is too many' }),
        top: flags.integer({ char: 't', description: 'number of tests to find' }),
    }

    async run() {
        const { flags } = this.parse(Large)

        const lines = flags.lines || 20
        const dir = flags.dir || '.'
        const top = flags.top || 20

        this.log(`Finding ${top} tests that have ${lines} lines in directory ${dir}`)

        const testFinder = new LargeTestFinder(dir, lines, top)
        const largeTests = testFinder.find()
        console.log(largeTests)
    }
}
