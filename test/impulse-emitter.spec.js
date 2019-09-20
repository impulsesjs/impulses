/* global describe, it, before */

import chai from 'chai'
import spies from 'chai-spies'
import classToTest from '../src/impulse_/emitter'

chai.use(spies);
chai.expect();

const expect = chai.expect;
const sandbox = chai.spy.sandbox();

let lib

const EMITTER = {
    GOOD: [
        {
            emitter: 'EMITTER_TITLE',
            version: 'EMITTER_VERSION',
        },
    ],
    BAD: [
        {},
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

describe('IMPULSE-EMITTER', () => {
    beforeEach(() => {
        lib = new classToTest()
        sandbox.on(lib.__test__.validator, ['validateEmitter']);
    })

    afterEach(() => {
        sandbox.restore()
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
            const test1 = lib.isEqual({})
            const test2 = lib.isEqual({version: '1.0'})
            expect(test1).to.be.equal(true)
            expect(test2).to.be.equal(false)
        })
        it('it return false when checked as an non empty object', () => {
            const test = lib.isEqual({version: '1.0'})
            expect(test).to.be.equal(false)
        })
        it('it return false when trying to set an invalid emitter format', () => {
            EMITTER.BAD.forEach(emitter => {
                const test = lib.setEmitter(emitter)
                expect(test).to.be.equal(false)
                expect(lib.__test__.validator.validateEmitter).to.have.been.called.with(emitter)
            })
        })
        it('it return true when trying to set an valid emitter format', () => {
            const test = lib.setEmitter(EMITTER.GOOD[0])
            expect(test).to.be.equal(true)
            expect(lib.__test__.validator.validateEmitter).to.have.been.called.with(EMITTER.GOOD[0])
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

    EMITTER.BAD.forEach((emitterInfo, index) => {
        describe(`After I have an instance with invalid information (${JSON.stringify(emitterInfo)})`, () => {
            beforeEach(() => {
                lib = new classToTest(emitterInfo)
                sandbox.on(lib.__test__.validator, ['validateEmitter']);
            })
    
            afterEach(() => {
                sandbox.restore()
            })
        
            it('it should provide an empty object when the info is requested', () => {
                const test = lib.getEmitter()
                expect(test).to.eql({})
            })
            it('it return true when checked as an empty object', () => {
                const test1 = lib.isEqual({})
                const test2 = lib.isEqual({att1: '1', att2: '2', att3: '3'})
                expect(test1).to.be.equal(true)
                expect(test2).to.be.equal(false)
            })
            it('it return false when checked as an non empty object', () => {
                const test = lib.isEqual({version: '1.0'})
                expect(test).to.be.equal(false)
            })
            it('it return false when trying to set an invalid emitter format', () => {
                EMITTER.BAD.forEach(emitter => {
                    const test = lib.setEmitter(emitter)
                    expect(test).to.be.equal(false)
                    expect(lib.__test__.validator.validateEmitter).to.have.been.called.with(emitter)
                })
            })
            it('it return true when trying to set an valid emitter format', () => {
                const test = lib.setEmitter(EMITTER.GOOD[0])
                expect(test).to.be.equal(true)
                expect(lib.__test__.validator.validateEmitter).to.have.been.called.with(EMITTER.GOOD[0])
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

    describe('After I have an instance with valid information', () => {
        beforeEach(() => {
            lib = new classToTest(EMITTER.GOOD[0])
        })

        it('it should provide the correct information object when the info is requested', () => {
            const test = lib.getEmitter()
            expect(test).to.eql(EMITTER.GOOD[0])
        })
        it('it return true when checked as an empty object', () => {
            const test = lib.isEqual({})
            expect(test).to.be.equal(false)
        })
        it('it return false when checked as an non empty and different object', () => {
            EMITTER.BAD.forEach(emitter => {
                const test = lib.isEqual(emitter)
                expect(test).to.be.equal(false)
            })
        })
    })
})
