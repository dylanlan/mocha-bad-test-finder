import { expect, test } from '@oclif/test';

describe('interactive', () => {
    test
        .stdout()
        .command(['interactive'])
        .it('runs interactive', () => {
            expect(true).to.be.true;
        });
});
