/* global describe, it, before */

import chai from 'chai'
// import Bus from '../src/bus';
import { impulseValidator as classToTest }  from '../src/impulse-validator'

chai.expect();

const expect = chai.expect;

let lib,
    emitter,
    emit,
    frequency

// Mock of an EmitterClass for type check
class EmitterClass {}

const impulseTemplate =  {
    id: 'impulseID', // Internal impulse ID / signature
    info: {
        emitter: 'emitterId', // External ID from the emitter
        frequencies: [],
        reply: undefined,
        options: {
            trace: false,
            traceContent: 'traceContent_1',
            debug: false,
            debugContent: 'debugContent_1',
        },
        encryption: false,
    },
    content: {
        body: 'contentBody_1'
    },
    history: {
        emitStack: [],
        emitters: [],
    },
}

const replyTemplate = { // Set if the impulse is a reply impulse
    impulse: 'requestImpulseID', // Internal impulse ID / signature
    emitter: 'requestEmitterId', // External ID from the emitter
    stack: 1, // Wich emit is this impulse related to in the stack
}

const frequencyTemplate = {
    entity: 'channelName',
    channel: 'channelName',
}

const emitTemplate = {
    time: new Date(),
    info: {},
    content: {},
}

const emitterTemplate = {
    emitter: 'emitterID',
    version: 'version.major.minor',
}

describe('IMPULSE-VALIDATOR', () => {

    beforeEach(() => {
        lib = new classToTest()
    })

    describe('After I have an instance', () => {
        describe('and while validating an emit', () => {
            beforeEach(() => {
                emit = Object.assign({}, emitTemplate)
            })

            it('it should succeed when valid', () => {
                const test = lib.validateEmit(emit)
                expect(test).to.be.equal(true)
            })
            it('it should fail when time is not an object', () => {
                emit = 'not an object'
                const test = lib.validateEmit(emit)
                expect(test).to.be.equal(false)
            })
            it('it should fail when time is not defined', () => {
                delete(emit.time)
                const test = lib.validateEmit(emit)
                expect(test).to.be.equal(false)
            })
            it('it should fail when time is of invalid type', () => {
                emit.time = 'date'
                const test = lib.validateEmit(emit)
                expect(test).to.be.equal(false)
            })
            it('it should fail when info is not defined', () => {
                delete(emit.info)
                const test = lib.validateEmit(emit)
                expect(test).to.be.equal(false)
            })
            it('it should fail when info is of invalid type', () => {
                emit.info = 'date'
                const test = lib.validateEmit(emit)
                expect(test).to.be.equal(false)
            })
            it('it should fail when content is not defined', () => {
                delete(emit.content)
                const test = lib.validateEmit(emit)
                expect(test).to.be.equal(false)
            })
            it('it should fail when content is of invalid type', () => {
                emit.content = 'date'
                const test = lib.validateEmit(emit)
                expect(test).to.be.equal(false)
            })
        })

        describe('and while validating an emitter', () => {
            beforeEach(() => {
                emitter = Object.assign({}, emitterTemplate)
            })
            it('it should succeed when the type is valid', () => {
                const test = lib.validateEmitterType(new EmitterClass())
                expect(test).to.be.equal(true)
            })
            it('it should fail when the type is invalid', () => {
                const test = lib.validateEmitterType(emitter)
                expect(test).to.be.equal(false)
            })
            it('it should succeed when valid', () => {
                const test = lib.validateEmitter(emitter)
                expect(test).to.be.equal(true)
            })
            it('it should fail when emitter is not defined', () => {
                delete(emitter.emitter)
                const test = lib.validateEmitter(emitter)
                expect(test).to.be.equal(false)
            })
            it('it should fail when emitter is of invalid type', () => {
                emitter.emitter = []
                const test = lib.validateEmitter(emitter)
                expect(test).to.be.equal(false)
            })
            it('it should fail when version is not defined', () => {
                delete(emitter.version)
                const test = lib.validateEmitter(emitter)
                expect(test).to.be.equal(false)
            })
            it('it should fail when version is of invalid type', () => {
                emitter.version = []
                const test = lib.validateEmitter(emitter)
                expect(test).to.be.equal(false)
            })
            it('it should succeed when have extra information', () => {
                emitter.name = 'Emitter name';
                const test = lib.validateEmitter(emitter)
                expect(test).to.be.equal(true)
            })
        })

        describe('and while validating an frequency', () => {
            beforeEach(() => {
                frequency = Object.assign({}, frequencyTemplate)
            })

            it('it should succeed when valid', () => {
                const test = lib.validateFrequency(frequency)
                expect(test).to.be.equal(true)
            })
            it('it should fail when entity is not defined', () => {
                delete(frequency.entity)
                const test = lib.validateFrequency(frequency)
                expect(test).to.be.equal(false)
            })
            it('it should fail when entity is of invalid type', () => {
                frequency.entity = []
                const test = lib.validateFrequency(frequency)
                expect(test).to.be.equal(false)
            })
            it('it should fail when channel is not defined', () => {
                delete(frequency.channel)
                const test = lib.validateFrequency(frequency)
                expect(test).to.be.equal(false)
            })
            it('it should fail when channel is of invalid type', () => {
                frequency.channel = []
                const test = lib.validateEmitter(frequency)
                expect(test).to.be.equal(false)
            })
        })
    })
})
