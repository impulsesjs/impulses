/* global describe, it, before */

import chai from 'chai';
import Channel from '../src/channel';

chai.expect();

const expect = chai.expect;

let lib
let listenerDynamic = { id: 0, listener: () => {} }
let listener1 = { id: 1, listener: () => {} }
let listenerDynamic1 = { id: 2, listener: () => {}, times: 2}
let invalidListener_noListener = { id: 1 }
let message1 = {id: 0, message: 'test1'}

describe('Given an instance of channel', () => {
    before(() => {
        lib = new Channel('ENTITY.NAME', 'CHANNEL.NAME')
    })

    describe('After I have instantiated queue', () => {
        it('it should have the name correctly set', () => {
            expect(lib.getName()).to.be.equal('CHANNEL.NAME')
        })
        it('it should be open', () => {
            expect(lib.getStatus()).to.be.equal(1)
        })
    })

    describe('After I have instantiated a channel on hold', () => {
        it('should not start automatically', () => {
            let special = new Channel('ENTITY.NAME', 'CHANNEL.NAME', true)
            expect(special.getStatus()).to.be.equal(2)
        })
    })

    describe('After I have changed status', () => {
        it('it should have status 2 when set on hold', () => {
            lib.hold()
            expect(lib.getStatus()).to.be.equal(2)
        })

        it('it should return false if channel is not active', () => {
            expect(lib.hold()).to.be.equal(false)
        })

        it('it should have status 1 when resumed', () => {
            lib.resume()
            expect(lib.getStatus()).to.be.equal(1)
        })

        it('it should return false if the channel not on hold', () => {
            expect(lib.resume()).to.be.equal(false)
        })

        it('it should have status 0 when set to closed', () => {
            lib.close()
            expect(lib.getStatus()).to.be.equal(0)
        })

        it('it return false if we try to close a none opened channel', () => {
            expect(lib.close()).to.be.equal(false)
        })

        it('it should have status 1 when set to opened', () => {
            lib.open()
            expect(lib.getStatus()).to.be.equal(1)
        })

        it('it should return false when we try to open an active channel', () => {
            expect(lib.open()).to.be.equal(false)
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
            expect(lib.listenerInfo(id)).to.be.equal(null)
        })

        it('it should return an id if a message is sent', () => {
            id = lib.send(message1)
            expect(id).to.be.a('string')
        })

        it('it should be possible to get the message information', () => {
            expect(lib.messageInfo(id)).to.include(message1)
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
            expect(lib.listenerInfo(id)).to.be.equal(null)
        })

        it('it should receive a message', (done) => {
            listenerDynamic.listener = function (message) {
                expect(message).to.include(message1)
                done()
            }
            id = lib.addListener(listenerDynamic)
            lib.send(message1)
        })

        it('it should possible to remove the hook', () => {
            lib.removeListener(id)
            expect(lib.listenerInfo(id)).to.be.equal(null)
        })
    })

    describe('After I have added an invalid listener while channel is active', () => {
        let id

        it('it should not return an queue id', () => {
            id = lib.addListener(invalidListener_noListener)
            console.log(id, typeof id);
            expect(id).to.be.equal(false)
        })

        it('it should not place it in the listeners hook list', () => {
            expect(lib.listenerInfo(id)).to.be.equal(null)
            lib.removeListener(id)
        })
    })

    describe('After I have added a listener with limited life time (2)', () => {
        let id

        it('should work 2 times but not 3 (1#2)',  (done) => {
            listenerDynamic1.listener = function (message) {
                expect(message).to.include(message1)
                done()
            }
            id = lib.addListener(listenerDynamic1)
            lib.send(message1)
        })

        it('should work 2 times but not 3 (2#2)', (done) => {
            lib.removeListener(id) // removing the previous hook
            listenerDynamic1.listener = function (message) {
                expect(message).to.include(message1)
                done()
            }
            id = lib.addListener(listenerDynamic1)
            lib.send(message1)
        })

        it('should not exist after the second message', () => {
            expect(lib.listenerInfo(id)).to.be.equal(null)
        })
    })


    describe('After I have added a listener with limited life time (1)', () => {
        let id

        it('should work 1 time only',  (done) => {
            listenerDynamic1.times = 1
            listenerDynamic1.listener = function (message) {
                expect(message).to.include(message1)
                done()
            }
            id = lib.sendAndListen(message1, listenerDynamic1)
        })

        it('should not exist after the message', () => {
            expect(lib.listenerInfo(id)).to.be.equal(null)
        })
    })

    // describe('After I have instantiated a channel in hold mode', () => {
    //     let id, msgId
    //
    //     it('should be possible to get the message info',  () => {
    //         let test = new Channel('SOME.NAME', true)
    //         msgId = test.send(message1)
    //         expect(lib.messageInfo(msgId)).to.be.equal(null)
    //     })
    // })
})
