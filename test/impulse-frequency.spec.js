/* global describe, it, before */

import chai from 'chai'
import spies from 'chai-spies'
import { Frequency as classToTest } from '../src/impulse_/frequency'

chai.use(spies);
chai.expect();

const expect = chai.expect;
const sandbox = chai.spy.sandbox();

let lib

const ENTITY = {
    CORRECT: 'CORRECT_ENTITY',
    WRONG: 'WRONG_ENTITY',
}

const CHANNEL = {
    CORRECT: 'CORRECT_CHANNEL',
    WRONG: 'WRONG_CHANNEL',
}
const serializedObject = {
    entity: ENTITY.CORRECT, 
    channel: CHANNEL.CORRECT
}

let objFrequencyEntityCorrect = true
let objFrequencyChannelCorrect = true
const objFrequency = {
    getEntity: () => objFrequencyEntityCorrect ? ENTITY.CORRECT : ENTITY.WRONG,
    getChannel: () => objFrequencyChannelCorrect ? CHANNEL.CORRECT: CHANNEL.WRONG,
};

const tests = () => {
    it('it should have the correct entity', () => {
        const test = lib.getEntity()
        expect(test).to.be.equal(ENTITY.CORRECT)
    })
    it('it should have the correct channel', () => {
        const test = lib.getChannel()
        expect(test).to.be.equal(CHANNEL.CORRECT)
    })
    it('it should return the correct serialized object', () => {
        const test = lib.serialize()
        expect(test).to.be.eql(serializedObject)
    })

    describe('and checking if it is the same', () => {
        it('it should succeed when valid', () => {
            const test = lib.is(ENTITY.CORRECT, CHANNEL.CORRECT)
            expect(test).to.be.equal(true)
        })
        it('it should fail when entity is invalid', () => {
            const test = lib.is(ENTITY.WRONG, CHANNEL.CORRECT)
            expect(test).to.be.equal(false)
        })
        it('it should fail when channel is invalid', () => {
            const test = lib.is(ENTITY.CORRECT, CHANNEL.WRONG)
            expect(test).to.be.equal(false)
        })
        it('it should fail when entity and channel is invalid', () => {
            const test = lib.is(ENTITY.WRONG, CHANNEL.WRONG)
            expect(test).to.be.equal(false)
        })
    })

    describe('and checking if it is the same frequency', () => {
        it('it should succeed when is the same', () => {
            const test = lib.isEqual(objFrequency)
            expect(test).to.be.equal(true)
            expect(objFrequency.getEntity).to.have.been.called()
            expect(objFrequency.getChannel).to.have.been.called()
        })
        it('it should fail when frequency entity is invalid', () => {
            objFrequencyEntityCorrect = false
            const test = lib.isEqual(objFrequency)
            expect(test).to.be.equal(false)
            expect(objFrequency.getEntity).to.have.been.called()
            expect(objFrequency.getChannel).to.have.been.called()
        })
        it('it should fail when frequency channel is invalid', () => {
            objFrequencyChannelCorrect = false
            const test = lib.isEqual(objFrequency)
            expect(test).to.be.equal(false)
            expect(objFrequency.getEntity).to.have.been.called()
            expect(objFrequency.getChannel).to.have.been.called()
        })
        it('it should fail when frequency channel is invalid', () => {
            objFrequencyEntityCorrect = false
            objFrequencyChannelCorrect = false
            const test = lib.isEqual(objFrequency)
            expect(test).to.be.equal(false)
            expect(objFrequency.getEntity).to.have.been.called()
            expect(objFrequency.getChannel).to.have.been.called()
        })
    })
}

describe('IMPULSE-FREQUENCY', () => {
    beforeEach(() => {
        objFrequencyEntityCorrect = true
        objFrequencyChannelCorrect = true
        sandbox.on(objFrequency, ['getEntity', 'getChannel']);
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('After I have an instance from an invalid serialized object', () => {
        beforeEach(() => {
            lib = new classToTest({})
        })
    
        it('it should not return any entity', () => {
            expect(lib.getEntity()).to.be.equal(undefined)
        })
        it('it should not return any channel', () => {
            expect(lib.getChannel()).to.be.equal(undefined)
        })
    })

    describe('After I have an instance from an invalid input', () => {
        beforeEach(() => {
            lib = new classToTest(undefined, 'CHANNEL_NAME')
        })
    
        it('it should not return any entity', () => {
            expect(lib.getEntity()).to.be.equal(undefined)
        })
        it('it should not return any channel', () => {
            expect(lib.getChannel()).to.be.equal(undefined)
        })
    })

    describe('After I have an instance from a serialized content', () => {
        beforeEach(() => {
            lib = new classToTest(serializedObject)
        })
    
        tests()
    })

    describe('After I have an instance with entity and channel', () => {
        beforeEach(() => {
            lib = new classToTest(ENTITY.CORRECT, CHANNEL.CORRECT)
        })
    
        tests()
    })
})
