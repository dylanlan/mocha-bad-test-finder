import { Command, flags } from '@oclif/command';

import { LargeTestFinder } from '../lib/large-test-finder';

export default class Large extends Command {
    static description = 'Find tests that have too many lines of code';

    static examples = [
        `$ btf large --dir=/some/test/dir --lines=50 --top=20
# outputs the 20 largest tests from the given directory that have at least 50 lines
`,
    ];

    static flags = {
        help: flags.help({ char: 'h' }),
        dir: flags.string({ char: 'd', description: 'the directory containing tests to search' }),
        lines: flags.integer({ char: 'l', description: 'number of lines of test code that is too many' }),
        top: flags.integer({ char: 't', description: 'number of tests to find' }),
    };

    async run() {
        const { flags: { lines, dir, top } } = this.parse(Large);

        const numLines = lines || 20;
        const directory = dir || '.';
        const numTests = top || 20;

        this.log(`Finding ${numTests} tests that have ${numLines} lines in directory ${directory}`);

        const testFinder = new LargeTestFinder(directory, numLines, numTests);
        const largeTests = testFinder.find();
        console.log(largeTests);
    }
}
