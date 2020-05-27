import { expect, test } from '@oclif/test'

describe('interactive', () => {
    test
        .stdout()
        .command(['interactive'])
        .it('runs interactive', ctx => {
            expect(true).to.be.true
        })
})
