import { expect, test } from '@oclif/test';

describe('slow', () => {
    test
        .stdout()
        .command(['slow'])
        .it('runs slow', (context) => {
            expect(true).to.be.true;
        });
});
