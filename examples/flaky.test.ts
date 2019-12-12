import { expect } from '@oclif/test'
const Chance = require('chance');
const chance = new Chance()

describe('flaky', () => {
    it('should fail 1/10 times', function () {
        expect(chance.natural({ min: 1, max: 10 })).to.be.lessThan(10)
    })
})
