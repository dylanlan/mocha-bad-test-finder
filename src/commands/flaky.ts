import { Command, flags } from '@oclif/command';
import _ from 'lodash';

import { FlakyTestFinder } from '../lib/flaky-test-finder';

export default class Flaky extends Command {
    static description = 'Find tests that sometimes fail';

    static examples = [
        `$ btf flaky --dir=/some/test/dir --runs=10
# outputs any tests which failed from 10 runs
`,
    ];

    static flags = {
        help: flags.help({ char: 'h' }),
        dir: flags.string({ char: 'd', description: 'the directory containing tests to search' }),
        runs: flags.integer({ char: 'r', description: 'number of test runs to execute' }),
    };

    async run() {
        const { flags: { dir, runs } } = this.parse(Flaky);

        const directory = dir || '.';
        const numRuns = runs || 20;

        this.log(`Finding tests that fail from ${numRuns} runs in directory "${directory}"`);

        const testFinder = new FlakyTestFinder(directory, numRuns);

        this.log(`Starting ${numRuns} test runs...`);
        const testFailures: any = await testFinder.find();
        this.log('Finished all runs!');
        if (Object.keys(testFailures).length > 0) {
            this.log('Tests that failed:');
            _.each(testFailures, (value: { numFailures: number }, key: string) => {
                this.log(`${key}, failures: ${value.numFailures}`);
            });
        } else {
            this.log('No failures!');
        }
        this.log('\n');
    }
}
