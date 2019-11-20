import { expect, test } from '@oclif/test'

describe.skip('large', () => {
    test
        .stdout()
        .command(['large'])
        .it('runs hello', ctx => {
            expect(true).to.be.true
        })

    test
        .stdout()
        .command(['large'])
        .it('is a large test', ctx => {
            let test = 3
            test++
            test++
            test++
            test++
            test++
            test++
            test++
            test++
            test++
            test++
            test++
            test++
            test++
            test++
            test++
            test++
            test++
            test++
            test++
            test++
            test++
            test++
            test++
            test++
            expect(true).to.be.true
        })
})
