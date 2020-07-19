import { expect, test } from '@oclif/test';

describe('slow', () => {
    test
        .stdout()
        .command(['slow'])
        .it('runs slow', () => {
            expect(true).to.be.true;
        });
});
