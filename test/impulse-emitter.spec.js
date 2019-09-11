/* global describe, it, before */

import chai from 'chai'
// import spies from 'chai-spies'
// import Bus from '../src/bus';
import classToTest from '../src/impulse_/emitter'

// chai.use(spies);
chai.expect();

const expect = chai.expect;
// const sandbox = chai.spy.sandbox();

let lib

const EMITTER = {
    GOOD: [
        {
            emitter: 'EMITTER_TITLE',
            version: 'EMITTER_VERSION',
        },
    ],
    BAD: [
        {
            emitter: 'EMITTER_TITLE',
        },
        {
            version: 'EMITTER_VERSION',
        },
        {
            emitter: 21325,
            version: 'EMITTER_VERSION',
        },
        {
            emitter: 'EMITTER_TITLE',
            version: 5465413,
        },
    ]
}
// const ENTITY = {
//     CORRECT: 'CORRECT_ENTITY',
//     WRONG: 'WRONG_ENTITY',
// }

// const CHANNEL = {
//     CORRECT: 'CORRECT_CHANNEL',
//     WRONG: 'WRONG_CHANNEL',
// }

// let objFrequencyEntityCorrect = true
// let objFrequencyChannelCorrect = true
// const objFrequency = {
//     getEntity: () => objFrequencyEntityCorrect ? ENTITY.CORRECT : ENTITY.WRONG,
//     getChannel: () => objFrequencyChannelCorrect ? CHANNEL.CORRECT: CHANNEL.WRONG,
// };

describe('IMPULSE-EMITTER', () => {
    beforeEach(() => {
        lib = new classToTest()
    })

    describe('After I have an instance', () => {
        it('it should have an internal ID', () => {
            const test = lib.getId()
            expect(test).to.not.be.undefined
        })
    })

    describe('After I have an instance without any information', () => {
        it('it should provide an empty object when the info is requested', () => {
            const test = lib.getEmitter()
            expect(test).to.eql({})
        })
        it('it return true when checked as an empty object', () => {
            const test = lib.isEqual({})
            expect(test).to.be.equal(true)
        })
        it('it return false when checked as an non empty object', () => {
            const test = lib.isEqual({version: '1.0'})
            expect(test).to.be.equal(false)
        })
        it('it return false when trying to set an invalid emitter format', () => {
            EMITTER.BAD.forEach(emitter => {
                const test = lib.setEmitter(emitter)
                expect(test).to.be.equal(false)
            })
        })
        it('it return true when trying to set an valid emitter format', () => {
            const test = lib.setEmitter(EMITTER.GOOD[0])
            expect(test).to.be.equal(true)
        })

        describe('After having set a valid emitter', () => {
            beforeEach(() => {
                lib.setEmitter(EMITTER.GOOD[0])
            })
            it('it should provide the good emitter information', () => {
                const test = lib.getEmitter()
                expect(test).to.eql(EMITTER.GOOD[0])
            })
    
        })
    })
})
