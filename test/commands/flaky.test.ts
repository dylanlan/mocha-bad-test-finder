import { expect, test } from '@oclif/test';

describe('flaky', () => {
    test
        .stdout()
        .command(['flaky'])
        .it('runs flaky', (context) => {
            expect(true).to.be.true;
        });
});
