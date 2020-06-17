import { Command, flags } from '@oclif/command';

export default class Interactive extends Command {
    static description = 'Find tests that interact with each other (not implemented yet)';

    static examples = [
        `$ btf interactive --dir=/some/test/dir
# outputs tests from the given directory which failed either when run individually or all together
`,
    ];

    static flags = {
        help: flags.help({ char: 'h' }),
        dir: flags.string({ char: 'd', description: 'the directory containing tests to search' }),
    };

    async run() {
        const { flags } = this.parse(Interactive);

        const directory = flags.dir || '.';

        this.log(`Finding tests that interact with each other in ${directory}`);
        // TODO: implement
    }
}
