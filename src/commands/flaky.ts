import { Command, flags } from '@oclif/command'

import { FlakyTestFinder } from '../lib/flaky-test-finder'

const _ = require('lodash')

export default class Flaky extends Command {
    static description = 'Find mocha tests that sometimes fail'

    static examples = [
        `$ btf flaky --dir=/some/test/dir --runs=10
# outputs any tests which failed from 10 runs
`,
    ]

    static flags = {
        help: flags.help({ char: 'h' }),
        dir: flags.string({ char: 'd', description: 'the directory containing tests to search' }),
        runs: flags.integer({ char: 'r', description: 'number of test runs to execute' }),
    }

    async run() {
        const { flags } = this.parse(Flaky)

        const dir = flags.dir || '.'
        const runs = flags.runs || 20

        this.log(`Finding tests that fail from ${runs} runs in directory "${dir}"`)

        const testFinder = new FlakyTestFinder(dir, runs)

        this.log(`Starting ${runs} test runs...`)
        const testFailures = await testFinder.find()
        console.log('Finished all runs!')
        if (Object.keys(testFailures).length) {
            console.log('Tests that failed:')
            _.each(testFailures, (value, key) => {
                console.log(`${key}, failures: ${value.numFailures}`)
            });
        } else {
            console.log('No failures!')
        }
        console.log('\n')
    }
}
