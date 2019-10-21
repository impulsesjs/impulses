/* global describe, it, before */

import chai from 'chai'
import spies from 'chai-spies'
import classToTest from '../src/impulse_/emitter'

chai.use(spies);
chai.expect();

const expect = chai.expect;
const sandbox = chai.spy.sandbox();

let lib

let validatorValidateEmitter = true;
let validatorValidateEmitterType = true;

const EMITTER = {
    GOOD: [
        {
            id: 'ID', 
            info: {
                emitter: 'EMITTER_TITLE',
                version: 'EMITTER_VERSION',
            }
        },
        {
            id: 'ID', 
            info: {
                emitter: 'EMITTER_TITLE',
                version: 'EMITTER_VERSION',
                extra_attribute: 'EXTRA_ATTRIBUTE_VALUE',
            }
        },
        {
            id: 'ID', 
            info: {
                emitter: 'EMITTER_TITLE',
                version: 'EMITTER_VERSION',
                extra_attr: 'EXTRA_ATTRIBUTE_VALUE',
            }
        },
    ],
    BAD: [
        {},
        {
            id: 'ID', 
            info: {
                emitter: 'EMITTER_TITLE',
            },
        },
        {
            id: 'ID', 
            info: {
                version: 'EMITTER_VERSION',
            },
        },
        {
            id: 'ID', 
            info: {
                emitter: 21325,
                version: 'EMITTER_VERSION',
            },
        },
        {
            id: 'ID', 
            info: {
                emitter: 'EMITTER_TITLE',
                version: 5465413,
            },
        },
    ]
}

const installSandbox = () => {
    sandbox.on(lib.__test__.validator, 'validateEmitter', () => {
        return validatorValidateEmitter
    })
    sandbox.on(lib.__test__.validator, 'validateEmitterType', () => {
        return validatorValidateEmitterType
    })
}

const restoreSandbox = () => {
    sandbox.restore()
}

describe('IMPULSE-EMITTER', () => {
    beforeEach(() => {
        lib = new classToTest()
        installSandbox()
    })

    afterEach(() => {
        validatorValidateEmitter = true
        restoreSandbox()
    })

    describe('After I have an instance', () => {
        it('it should have an internal ID', () => {
            const test = lib.getId()
            expect(test).to.not.be.undefined
        })
    })

    describe('After I have an instance without any information', () => {
        it('it should provide an empty object when the info is requested', () => {
            const test = lib.getInfo()
            expect(test).to.eql({})
        })
        it('it return true when checked as an empty object', () => {
            const test1 = lib.isEqual(new classToTest())
            const test2 = lib.isEqual(new classToTest({version: '1.0'}))
            expect(test1).to.be.equal(true)
            expect(test2).to.be.equal(true)
        })
        it('it return false when checked as an non empty object', () => {
            const test = lib.isEqual(new classToTest({id: 'test', info: {version: '1.0', emitter: 'ME'}}))
            expect(test).to.be.equal(false)
        })
        EMITTER.BAD.forEach(emitter => {
            it(`it return false when trying to set an invalid emitter format ${JSON.stringify(emitter)}`, () => {
                validatorValidateEmitter = false
                const test = lib.setInfo(emitter.info)
                expect(test).to.be.equal(false)
                expect(lib.__test__.validator.validateEmitter).to.have.been.called.with(emitter.info)
            })
        })
        it('it return true when trying to set an valid emitter format', () => {
            validatorValidateEmitter = true
            const test = lib.setInfo(EMITTER.GOOD[0].info)
            expect(test).to.be.equal(true)
            expect(lib.__test__.validator.validateEmitter).to.have.been.called.with(EMITTER.GOOD[0].info)
        })

        describe('After having set a valid emitter', () => {
            beforeEach(() => {
                lib.setInfo(EMITTER.GOOD[0].info)
            })
            it('it should provide the good emitter information', () => {
                const test = lib.getInfo()
                expect(test).to.eql(EMITTER.GOOD[0].info)
            })    
        })
    })

    EMITTER.BAD.forEach((emitterInfo, index) => {
        describe(`After I have an instance with invalid information (${JSON.stringify(emitterInfo)})`, () => {
            beforeEach(() => {
                validatorValidateEmitter = false
                lib = new classToTest(emitterInfo)
                installSandbox()
            })

            afterEach(() => {
                validatorValidateEmitter = true
                restoreSandbox()
            })
        
            it('it should provide an empty object when the info is requested', () => {
                const test = lib.getInfo()
                expect(test).to.eql({})
            })
            it('it return true when checked as an empty object', () => {
                validatorValidateEmitter = true
                const test1 = lib.isEqual(new classToTest({}))
                expect(test1).to.be.equal(true)

                validatorValidateEmitter = false
                const test2 = lib.isEqual(new classToTest({id: 'ID', info: {att1: '1', att2: '2', att3: '3'}}))
                expect(test2).to.be.equal(true)
            })
            it('it return false when checked as an non empty object', () => {
                validatorValidateEmitter = true
                const test = lib.isEqual(new classToTest({id: 'ID', info: {version: '1.0', emitter: 'TEST'}}))
                expect(test).to.be.equal(false)
            })
            it('it return false when trying to set an invalid emitter format', () => {
                validatorValidateEmitter = false
                EMITTER.BAD.forEach(emitter => {
                    const test = lib.setInfo(emitter.info)
                    expect(test).to.be.equal(false)
                    expect(lib.__test__.validator.validateEmitter).to.have.been.called.with(emitter.info)
                })
            })
            it('it return true when trying to set an valid emitter format', () => {
                validatorValidateEmitter = true
                const test = lib.setInfo(EMITTER.GOOD[0].info)
                expect(test).to.be.equal(true)
                expect(lib.__test__.validator.validateEmitter).to.have.been.called.with(EMITTER.GOOD[0].info)
            })
    
            describe('After having set a valid emitter', () => {
                beforeEach(() => {
                    validatorValidateEmitter = true
                    lib.setInfo(EMITTER.GOOD[0].info)
                })
                it('it should provide the good emitter information', () => {
                    const test = lib.getInfo()
                    expect(test).to.eql(EMITTER.GOOD[0].info)
                })
        
            })
        })
    })

    EMITTER.GOOD.forEach((emitterInfo, index) => {
        describe(`After I have an instance with valid information (${JSON.stringify(emitterInfo)})`, () => {
            beforeEach(() => {
                validatorValidateEmitter = true
                validatorValidateEmitterType = true
                lib = new classToTest(emitterInfo)
                installSandbox()
            })

            afterEach(() => {
                restoreSandbox()
            })

            it('it should provide a similar object to the one provided to instantiate', () => {
                const test = lib.serialize()
                expect(test).to.eql(emitterInfo)
            })
            it('it should provide the correct information object when the info is requested', () => {
                const test = lib.getInfo()
                expect(test).to.eql(emitterInfo.info)
            })
            it('it return true when checked as an empty object', () => {
                const test = lib.isEqual(new classToTest({}))
                expect(test).to.be.equal(false)
            })
            it('it return false when checked as an non empty and different object', () => {
                EMITTER.BAD.forEach(emitter => {
                    const test = lib.isEqual(new classToTest(emitter))
                    expect(test).to.be.equal(false)
                })
            })
            it('it return false when checked as an non valid emitter', () => {
                validatorValidateEmitterType = false
                const test = lib.isEqual('NON VALID EMITTER TYPE')
                expect(test).to.be.equal(false)
            })
            EMITTER.GOOD.forEach((emitterInfo, idx) => {
                if (idx > index) {
                    it('it return false when checked against a similar information', () => {
                        const test = lib.isEqual(new classToTest(emitterInfo))
                        expect(test).to.be.equal(false)
                    })
                }
            })
        })
    })
})
