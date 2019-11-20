import { expect, test } from '@oclif/test'
const Chance = require('chance')
const chance = new Chance();

describe('flaky', () => {
    it('should sometimes fail', function () {
        expect(chance.natural({min: 1, max: 100})).to.be.lessThan(100)
    })
})
