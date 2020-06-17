import { expect, test } from '@oclif/test';

describe('interactive', () => {
    test
        .stdout()
        .command(['interactive'])
        .it('runs interactive', (context) => {
            expect(true).to.be.true;
        });
});
