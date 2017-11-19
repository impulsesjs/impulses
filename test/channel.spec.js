/* global describe, it, before */

import chai from 'chai';
import Channel from '../src/channel';

chai.expect();

const expect = chai.expect;

let lib
let listenerDynamic = { id: 0, listener: () => {} }
let listener1 = { id: 1, listener: () => {} }
let message1 = {id: 0, message: 'test1'}

describe('Given an instance of channel', () => {
    before(() => {
        lib = new Channel('CHANNEL.NAME')
    })

    describe('After I have instantiated queue', () => {
        it('it should have the name correctly set', () => {
            expect(lib.getName()).to.be.equal('CHANNEL.NAME')
        })
        it('it should be open', () => {
            expect(lib.getStatus()).to.be.equal(1)
        })
    })

    describe('After I have changed status', () => {
        it('it should have status 2 when set on hold', () => {
            lib.hold()
            expect(lib.getStatus()).to.be.equal(2)
        })

        it('it should have status 1 when resumed', () => {
            lib.resume()
            expect(lib.getStatus()).to.be.equal(1)
        })

        it('it should have status 0 when set to closed', () => {
            lib.close()
            expect(lib.getStatus()).to.be.equal(0)
        })

        it('it should have status 1 when set to opened', () => {
            lib.open()
            expect(lib.getStatus()).to.be.equal(1)
        })
    })

    describe('After I have set the channel on hold and added a listener', () => {
        let id
        it('it should have status 2 when set on hold', () => {
            lib.hold()
            expect(lib.getStatus()).to.be.equal(2)
        })

        it('it should return an id', () => {
            id = lib.addListener(listener1)
            expect(id).to.be.a('string')
        })

        it('it should possible to get the information back', () => {
            let info = lib.listenerInfo(id)
            expect(info).to.be.equal(listener1)
        })

        it('it should possible to remove the hook', () => {
            lib.removeListener(id)
            expect(lib.listenerInfo(id)).to.be.null
        })
    })

    describe('After I have added a listener while channel is active', () => {
        let id
        it('it should have status 1 when set to opened', () => {
            lib.open()
            expect(lib.getStatus()).to.be.equal(1)
        })

        it('it should return an id', () => {
            id = lib.addListener(listener1)
            expect(id).to.be.a('string')
        })

        it('it should possible to get the information back', () => {
            let info = lib.listenerInfo(id)
            expect(info).to.be.equal(listener1)
        })

        it('it should possible to remove the hook', () => {
            lib.removeListener(id)
            expect(lib.listenerInfo(id)).to.be.null
        })

        it('it should receive a message', (done) => {
            listenerDynamic.listener = function (message) {
                expect(message).to.be.equal(message1)
                done()
            }
            id = lib.addListener(listenerDynamic)
            lib.send(message1)
        })
    })
})

