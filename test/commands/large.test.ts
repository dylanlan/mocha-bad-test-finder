import { expect, test } from '@oclif/test';

describe('large', () => {
    test
        .stdout()
        .command(['large'])
        .it('runs large', (context) => {
            expect(true).to.be.true;
        });
});
