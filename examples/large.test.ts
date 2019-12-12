import { expect } from '@oclif/test'

describe('large', function () {
    it('is a large test with 25 lines', function () {
        let test = 0
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
        expect(test).to.be.eq(24)
    })
})
