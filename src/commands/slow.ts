import { Command, flags } from '@oclif/command';

export default class Slow extends Command {
    static description = 'Find tests that take a long time to execute (not implemented yet)';

    static examples = [
        `$ btf slow --dir=/some/test/dir --milliSeconds=500 --top=20
# outputs the 20 slowest tests from the given directory that take at least 500 milliseconds
`,
    ];

    static flags = {
        help: flags.help({ char: 'h' }),
        dir: flags.string({ char: 'd', description: 'the directory containing tests to search' }),
        milliSeconds: flags.integer({ char: 'm', description: 'number of milliseconds to execute that is too many' }),
        top: flags.integer({ char: 't', description: 'number of tests to find' }),
    };

    async run() {
        const { flags } = this.parse(Slow);

        const milliSeconds = flags.milliSeconds || 500;
        const directory = flags.dir || '.';
        const top = flags.top || 20;

        this.log(`Finding ${top} tests that take at least ${milliSeconds}ms to execute in directory ${directory}`);
        // TODO: implement
    }
}
