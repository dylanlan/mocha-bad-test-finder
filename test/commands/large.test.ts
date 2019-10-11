import { expect, test } from '@oclif/test'

describe('large', () => {
    test
        .stdout()
        .command(['large'])
        .it('runs hello', ctx => {
            expect(ctx.stdout).to.contain('hello world')
        })

    test
        .stdout()
        .command(['large', '--name', 'jeff'])
        .it('runs hello --name jeff', ctx => {
            expect(ctx.stdout).to.contain('hello jeff')
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
            expect(test).to.eq(3)
        })
})
