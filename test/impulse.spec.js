/* global describe, it, before */

import chai from 'chai'
// import Bus from '../src/bus';
import Impulse from '../src/impulse'

chai.expect();

const expect = chai.expect;

let lib 
const contentBlock1 = {block1: 'first text block'}
const contentBlock2 = {block2: 'second text block'}
const contentBlock3 = {block2: 'third text block on second attribute'}

const emitter_1_wrong = {
    name: 'NAME1',
    entity: 'ENTITY1',
    channel: 'CHANNEL1',
    version: '1.0.0',
}

const emitter_1 = {
    emitter: 'NAME1',
    entity: 'ENTITY1',
    channel: 'CHANNEL1',
    version: '1.0.0',
}

const emitter_2 = {
    emitter: 'NAME2',
    entity: 'ENTITY2',
    channel: 'CHANNEL2',
    version: '1.0.0',
}

const traceContent = {traceInfo: 'TRACE_INFO'}
const debugContent = {debugInfo: 'DEBUG_INFO'}

let busExistsFail = false
const bus = {
    exists: (entiy, channel) => {
        return busExistsFail === false
    },
    get: (entiy, channel) => {
        if (busExistsFail === false) {
            return {
                send: (impulse) => {
                    return 'STRING_OK'
                }
            }
        }
        return null
    }
}

describe('IMPULSE', () => {

    beforeEach(() => {
        lib = new Impulse()
    })

    describe('After I have an instance', () => {
        it('it shouldn´t have traceable flag active', () => {
            const test = lib.isTraceable()
            expect(test).to.be.equal(false)
        })
    
        it('it shouldn´t have debug flag active', () => {
            const test = lib.isDebugable()
            expect(test).to.be.equal(false)
        })

        it('it shouldn´t have any frequency set', () => {
            const test = lib.isFrequencySet()
            expect(test).to.be.equal(false)
        })

        it('it shouldn´t have any emitter set', () => {
            const test = lib.hasEmitter()
            expect(test).to.be.equal(false)
        })

        it('it shouldn´t have any emitter set in the index', () => {
            const test = lib.getKnownEmitters()
            expect(test).to.be.empty
        })

        it('it shouldn´t have any emit history', () => {
            const test = lib.getLastEmitInfo()
            expect(test).to.be.undefined
        })

        describe('when subscribing traceability', () => {
            describe('when providing the wrong structure', () => {
                it('it should fail', () => {
                    const test = lib.subscribeTrace()
                    expect(test).to.be.equal(false)
                })
            })
            describe('when providing the correct structure', () => {
                beforeEach(() => {
                    lib.subscribeTrace(traceContent)
                })
                it('it should succeed', () => {
                    const set = lib.subscribeTrace(traceContent)
                    expect(set).to.be.equal(true)
                })
                it('it should have the traceability flag in active state', () => {
                    const test = lib.isTraceable()
                    expect(test).to.be.equal(true)
                })
                it('it have the traceability flag inactive if we cancel it', () => {
                    lib.cancelTrace()
                    const test = lib.isTraceable()
                    expect(test).to.be.equal(false)
                })
            })
        })

        describe('when subscribing debugability', () => {
            describe('when providing the wrong structure', () => {
                it('it should fail', () => {
                    const test = lib.subscribeDebug()
                    expect(test).to.be.equal(false)
                })
            })
            describe('when providing the correct structure', () => {
                beforeEach(() => {
                    lib.subscribeDebug(debugContent)
                })
                it('it should succeed', () => {
                    const test = lib.subscribeDebug(debugContent)
                    expect(test).to.be.equal(true)
                })
                it('it should have the debugability flag in active state', () => {
                    const test = lib.isDebugable()
                    expect(test).to.be.equal(true)
                })
                it('it have the debugability flag inactive if we cancel it', () => {
                    lib.cancelDebug()
                    const test = lib.isDebugable()
                    expect(test).to.be.equal(false)
                })
            })
        })

        describe('When providing the wrong emitter information', () => {
            it('it should false', () => {
                const test = lib.setEmitter(emitter_1_wrong)
                expect(test).to.be.equal(false)
            })
        })

        describe('when providing the emitter information', () => {
            beforeEach(() => {
                lib.setEmitter(emitter_1)
            })

            it('it should have stored the emitter information', () => {
                const result = lib.setEmitter(emitter_1)
                expect(result).to.be.equal(true)
            })
        
            it('it should have stored the emitter information', () => {
                const emitter = lib.getEmitter()
                expect(emitter.getInfo()).to.be.eql(emitter_1)
            })
        })

        describe('when adding a new frequency without a BUS configured', () => {
            it('it should fail', () => {
                const result = lib.addFrequency('ENTITY', 'CHANNEL')
                expect(result).to.be.equal(false)
            })
        })

        describe('when providing BUS', () => {
            it('it whould succeed', () => {
                lib.setBus(bus)
            })
        })

        describe('when adding a new frequency with a BUS configured', () => {
            beforeEach(() => {
                busExistsFail = false
                lib.setBus(bus)
            })
    
            it('it should fail is the frequency does not exist', () => {
                busExistsFail = true
                const result = lib.addFrequency('ENTITY', 'CHANNEL')
                expect(result).to.be.equal(false)
            })
    
            it('it should succeed is the frequency exist', () => {
                const result = lib.addFrequency('ENTITY', 'CHANNEL')
                expect(result).to.be.equal(true)
                expect(lib.hasFrequency('ENTITY', 'CHANNEL')).to.be.equal(true)
            })
    
            it('it should not add if the frequency is already in the list', () => {
                lib.addFrequency('ENTITY', 'CHANNEL')
                const result = lib.addFrequency('ENTITY', 'CHANNEL')
                expect(result).to.be.equal(false)
            })
        })

        describe('when setting content', () => {
            describe('and it is not correctly formatted', () => {
                it('it should fail', () => {
                    const result = lib.setContent('jhgjg')
                    expect(result).to.be.equal(false)
                })
            })
            describe('and it is correctly formatted', () => {
                beforeEach(() => {
                    lib.setContent(contentBlock1)
                })

                it('it should succeed', () => {
                    const result = lib.setContent(contentBlock1)
                    expect(result).to.be.equal(true)
                })
                it('it should have stored it correctly', () => {
                    const result = lib.getContent()
                    expect(result).to.include(contentBlock1)
                })
                it('it should clear all content and have only the one we set', () => {
                    const result = lib.setContent(contentBlock2)
                    const content = lib.getContent()
                    expect(result).to.be.equal(true)
                    expect(content).to.not.include(contentBlock1)
                    expect(content).to.include(contentBlock2)
                })
            })
        })

        describe('when adding content', () => {
            beforeEach(() => {
                lib.setContent(contentBlock1)
            })
            describe('and it is not correctly formatted', () => {
                it('it should fail', () => {
                    const result = lib.addContent('jhgjg')
                    expect(result).to.be.equal(false)
                })
            })
    
            describe('and it is correctly formatted', () => {
                beforeEach(() => {
                    lib.addContent(contentBlock2)
                })
                it('it should succeed', () => {
                    const result = lib.addContent(contentBlock2)
                    expect(result).to.be.equal(true)
                })
                it('it should have stored it correctly by keeping the previous values', () => {
                    const content = lib.getContent()
                    expect(content).to.include(contentBlock1)
                    expect(content).to.include(contentBlock2)
                })
                it('it should have overritten conflicting content with the last version', () => {
                    const result = lib.addContent(contentBlock3)
                    const content = lib.getContent()
                    expect(content).to.include(contentBlock1)
                    expect(content).to.not.include(contentBlock2)
                    expect(content).to.include(contentBlock3)
                })
            })
        })

        describe('when clearing content', () => {
            beforeEach(() => {
                lib.setContent(contentBlock1)
            })
            it('it should clear all content', () => {
                lib.clearContent()
                const content = lib.getContent()
                expect(JSON.stringify(content)).to.equal(JSON.stringify({}))
            })
        })

        describe('when the impulse is emitted', () => {
            beforeEach(() => {
                lib.setContent(contentBlock1)
            })

            describe('with no emitter set', () => {
                it('it should return false', () => {
                    const result = lib.emit()
                    expect(result).to.be.equal(false)
                })
            })
            
            describe('with an emitter set', () => {
                beforeEach(() => {
                    lib.setEmitter(emitter_1)
                })

                describe('with no BUS set', () => {
                    it('it should return false', () => {
                        const result = lib.emit()
                        expect(result).to.be.equal(false)
                    })
                })
    
                describe('with a BUS set', () => {
                    beforeEach(() => {
                        lib.setBus(bus)
                    })
    
                    describe('with no Frequency set', () => {
                        it('it should return false', () => {
                            const result = lib.emit()
                            expect(result).to.be.equal(false)
                        })
                    })
                    describe('with a Frequency set', () => {
                        beforeEach(() => {
                            busExistsFail = false
                            lib.addFrequency('ENTITY', 'CHANNEL')
                        })

                        describe('and the frequency was removed after', () => {
                            it ('it should not emit any impulse', () => {
                                busExistsFail = true
                                const result = lib.emit()
                                const emitCount = lib.getEmitCount()
                                const emitters = lib.getKnownEmitters()
                                expect(result).to.be.equal(false)
                                expect(emitCount).to.be.equal(0)
                                expect(emitters.length).to.be.equal(0)
                            })

                            describe('and a new emitter is set', () => {
                                it ('it should not emit any impulse', () => {
                                    lib.setEmitter(emitter_2)
                                    busExistsFail = true
                                    const result = lib.emit()
                                    const emitCount = lib.getEmitCount()
                                    const emitters = lib.getKnownEmitters()
                                    expect(result).to.be.equal(false)
                                    expect(emitCount).to.be.equal(0)
                                    expect(emitters.length).to.be.equal(0)
                                })
                            })    

                            describe('and a the emitter was used before (not the last)', () => {
                                it ('it should not emit any impulse', () => {
                                    lib.emit()
                                    const emitCount1 = lib.getEmitCount()
                                    const emitters1 = lib.getKnownEmitters()
                                    expect(emitCount1).to.be.equal(1)
                                    expect(emitters1.length).to.be.equal(1)

                                    lib.setEmitter(emitter_2)
                                    lib.emit()
                                    const emitCount2 = lib.getEmitCount()
                                    const emitters2 = lib.getKnownEmitters()
                                    expect(emitCount2).to.be.equal(2)
                                    expect(emitters2.length).to.be.equal(2)

                                    lib.setEmitter(emitter_1)
                                    busExistsFail = true
                                    const result = lib.emit()
                                    const emitCount3 = lib.getEmitCount()
                                    const emitters3 = lib.getKnownEmitters()

                                    expect(result).to.be.equal(false)
                                    expect(emitCount3).to.be.equal(2)
                                    expect(emitters3.length).to.be.equal(2)
                                })
                            })    
                        })

                        describe('and we try to send it twice', () => {
                            it ('it should not add the same emitter twice in the index', () => {
                                lib.emit()
                                const emitCount1 = lib.getEmitCount()
                                const result = lib.emit()
                                const emitCount2 = lib.getEmitCount()
                                const emitters = lib.getKnownEmitters()
                                expect(result).to.be.equal(true)
                                expect(emitters.length).to.be.equal(1)
                                expect(emitCount2).to.be.equal(emitCount1 + 1)
                            })
                        })

                        describe('and we try to send it twice and the frequency is removed after the first', () => {
                            it ('it should not add the same emitter twice in the index', () => {
                                lib.emit()
                                const emitCount1 = lib.getEmitCount()
                                busExistsFail = true
                                const result = lib.emit()
                                const emitCount2 = lib.getEmitCount()
                                const emitters = lib.getKnownEmitters()
                                expect(result).to.be.equal(false)
                                expect(emitters.length).to.be.equal(1)
                                expect(emitCount2).to.be.equal(emitCount1)
                            })
                        })
                        
                        describe('trace and debug flag are off', () => {
                            it('it should not add any trace or debug to the content', () => {
                                const result = lib.emit()
                                const content = lib.getContent()
                                const emitInfo = lib.getLastEmitInfo()
                                expect(result).to.be.equal(true)
                                expect(JSON.stringify(content)).to.be.equal(JSON.stringify(contentBlock1))
                                expect(emitInfo.content).not.to.deep.include(content)
                                expect(emitInfo.content).not.to.have.keys('trace', 'debug')
                            })
                        })
    
                        describe('trace flag is on', () => {
                            describe('with trace content', () => {
                                beforeEach(() => {
                                    lib.subscribeTrace(traceContent)
                                })
                                it('it should add the trace to the content', () => {
                                    const result = lib.emit()
                                    const content = lib.getContent()
                                    const emitInfo = lib.getLastEmitInfo()
                                    expect(result).to.be.equal(true)
                                    expect(JSON.stringify(content)).to.be.equal(JSON.stringify(contentBlock1))
                                    expect(emitInfo.content).not.to.deep.include(content)
                                    expect(emitInfo.content).to.have.keys('trace')
                                    expect(emitInfo.content).not.to.have.keys('debug')
                                    expect(emitInfo.content.trace).to.include(traceContent)
                                })                            
                            })
                            describe('with no trace content', () => {
                                it('it should not add any trace content', () => {
                                    const result = lib.emit()
                                    const content = lib.getContent()
                                    const emitInfo = lib.getLastEmitInfo()
                                    expect(result).to.be.equal(true)
                                    expect(JSON.stringify(content)).to.be.equal(JSON.stringify(contentBlock1))
                                    expect(emitInfo.content).not.to.deep.include(content)
                                    expect(emitInfo.content).not.to.have.keys('trace', 'debug')
                                })
                            })
                        })
    
                        describe('debug flag is on', () => {
                            describe('with debug content', () => {
                                beforeEach(() => {
                                    lib.subscribeDebug(debugContent)
                                })
                                it('it should add the debug to the content', () => {
                                    const result = lib.emit()
                                    const content = lib.getContent()
                                    const emitInfo = lib.getLastEmitInfo()
                                    expect(result).to.be.equal(true)
                                    expect(JSON.stringify(content)).to.be.equal(JSON.stringify(contentBlock1))
                                    expect(emitInfo.content).not.to.deep.include(content)
                                    expect(emitInfo.content).to.have.keys('debug')
                                    expect(emitInfo.content).not.to.have.keys('trace')
                                    expect(emitInfo.content.debug).to.include(debugContent)
                                })                            
                            })
                            describe('with no debug content', () => {
                                it('it should not add any debug content', () => {
                                    const result = lib.emit()
                                    const content = lib.getContent()
                                    const emitInfo = lib.getLastEmitInfo()
                                    expect(result).to.be.equal(true)
                                    expect(JSON.stringify(content)).to.be.equal(JSON.stringify(contentBlock1))
                                    expect(emitInfo.content).not.to.deep.include(content)
                                    expect(emitInfo.content).not.to.have.keys('debug', 'trace')
                                })
                            })
                        })
    
                        describe('trace and debug flag are bothe on', () => {
                            beforeEach(() => {
                                lib.subscribeTrace(traceContent)
                                lib.subscribeDebug(debugContent)
                            })
                            it('it should add both trace and debug to the content', () => {
                                const result = lib.emit()
                                const content = lib.getContent()
                                const emitInfo = lib.getLastEmitInfo()
                                expect(result).to.be.equal(true)
                                expect(JSON.stringify(content)).to.be.equal(JSON.stringify(contentBlock1))
                                expect(emitInfo.content).not.to.deep.include(content)
                                expect(emitInfo.content).to.have.keys('trace', 'debug')
                                expect(emitInfo.content.trace).to.include(traceContent)
                                expect(emitInfo.content.debug).to.include(debugContent)                            
                            })
                        })
                    })
                })
            })

            describe('when frequency does not exist (or a new bus has been set)', () => {
                beforeEach(() => {
                    lib.setBus(bus)
                    lib.setEmitter(emitter_1)
                    lib.addFrequency('ENTITY', 'CHANNEL')
                    lib.setContent(contentBlock1)
                    busExistsFail = true
                })
    
                it('it should not add the same emitter to the index', () => {
                    const test = lib.emit()
                    const startKnownEmitters = lib.getKnownEmitters()
                    const result = lib.emit()
                    const endKnownEmitters = lib.getKnownEmitters()
                    expect(JSON.stringify(startKnownEmitters)).to.be.equal(JSON.stringify(endKnownEmitters))
                })
            })
        })

        describe('when the impulse is emitted again', () => {
            beforeEach(() => {
                lib.setBus(bus)
                lib.setEmitter(emitter_1)
                lib.addFrequency('ENTITY', 'CHANNEL')
                lib.setContent(contentBlock1)
                lib.emit()
            })

            it('it should not add the same emitter to the index', () => {
                const startKnownEmitters = lib.getKnownEmitters()
                const result = lib.emit()
                const endKnownEmitters = lib.getKnownEmitters()
                expect(JSON.stringify(startKnownEmitters)).to.be.equal(JSON.stringify(endKnownEmitters))
            })
        })
    })
})
