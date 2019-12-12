import { expect, test } from '@oclif/test'

describe('large', () => {
    test
        .stdout()
        .command(['large'])
        .it('runs hello', ctx => {
            expect(true).to.be.true
        })
})
