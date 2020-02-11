/* global describe, it, before */

import chai from 'chai';
import { Bus } from '../src/bus';
import { channelStatusCodes } from '../src/channel';
import { Api } from '../src/api';

chai.expect();

const expect = chai.expect;

let lib, pbBus

let message1 = ['ENTITY_NAME', 'CHANNEL_1', {field1: 'field1 value'}]
let replyMessage = {message: 'This is the reply'}
let errMessage1 = ['ENTITY_NAME', 'CHANNEL_11', {field1: 'field1 value'}]

let channelConfig = {
    entity: 'ENTITY_NAME',
    channels: [
        {name: 'CHANNEL_1', require: [ 'field1' ]},
        {name: 'CHANNEL_2', require: [ 'field1', 'field2' ]},
        {name: 'CHANNEL_3'},
    ]
}

let channelConfigWithInvalidChannelsProperty = {
    entity: 'ENTITY_NAME',
    channels: ''
}

let channelConfigWithInvalidEntityProperty = {
    channels: [
        {name: 'CHANNEL_1', require: [ 'field1' ]},
        {name: 'CHANNEL_2', require: [ 'field1', 'field2' ]},
        {name: 'CHANNEL_3'},
    ]
}

const listenerTest = (done, mustInclude = undefined, reply=false) => (message) => {
    if (reply && message.reply === true) {
        if (mustInclude) {
            expect(message).to.include(mustInclude)
        }
        if (done) {
            done()
        }
    }
}

describe('Integration Tests', () => {
    describe('After I have an API instance', () => {
        beforeEach(() => {
            lib = new Api()
            pbBus = new Bus()
        })

        // TODO: we must add configuration mode

        it('it should have a different id from another', () => {
            const b = new Api()
            expect(lib.getId() === b.getId()).to.be.false
        })

        it('it should be possible to set a BUS', () => {
            lib.setBus(pbBus)
            expect(lib.hasBus()).to.be.true
        })

        it('it should show false when we try to set a non BUS', () => {
            lib = new Api()
            const setBus = () => {lib.setBus({})}
            expect(setBus).to.throw(TypeError)
            expect(lib.hasBus()).to.be.false
        })

        it('it should be possible to define channels through a configuration', () => {
            let args
            lib.setBus(pbBus)

            const expectedValues = channelConfig.channels.map((item) => {
                return channelConfig.entity + '.' + item.name
            })
            const checkExists = channelConfig.channels.map((item) => {
                return [channelConfig.entity, item.name]
            })

            const result = lib.initChannels(channelConfig)
            expect(result).to.be.an('array')
            expect(result).to.include.members(expectedValues)

            expect(pbBus.exists(channelConfig.entity)).to.be.true
            for (args in checkExists) {
                expect(pbBus.exists(...checkExists[args])).to.be.true
            }
        })

        it('it should not be possible to define channels through a configuration with an invalid channels property', () => {
            lib.setBus(pbBus)

            const register = () => { return lib.initChannels(channelConfigWithInvalidChannelsProperty) }
            expect(register).to.throw(TypeError, 'Invalid channel configuration')
        })

        it('it should not be possible to define channels through a configuration with an invalid entity property', () => {
            lib.setBus(pbBus)

            const register = () => { return lib.initChannels(channelConfigWithInvalidEntityProperty) }
            expect(register).to.throw(TypeError, 'Invalid channel configuration')
        })

        it('it should not be possible to define channels through an invalid configuration', () => {
            lib.setBus(pbBus)

            const register = () => { return lib.initChannels([]) }
            expect(register).to.throw(TypeError, 'Invalid channel configuration')
        })

        it('it should not be possible to define channels without a configuration', () => {
            lib.setBus(pbBus)

            const register = () => { return lib.initChannels() }
            expect(register).to.throw(TypeError, 'Invalid channel configuration')
        })

        it('it should not be possible to define channels through a configuration without a BUS', () => {
            const register = () => { return lib.initChannels(channelConfig) }
            expect(register).to.throw(Error, 'Target BUS is not set')
        })

        it('it should not be possible to find any channel', () => {
            expect(lib.exists('ENTITY_NAME', 'CHANNEL_1')).to.be.false
        })

    })

    describe('When intantiating a new Entity API', () => {
        it('it should be possible to instatiate it with configuration object only', () => {
            const localLib = new Api({})
            expect(localLib).to.be.an.instanceof(Api)
        })

        it('it should not be possible to instatiate it with configuration different from an object literal', () => {
            const localLib = () => { return new Api('dafadfadf') }
            expect(localLib).to.throw(TypeError)
        })

        it('it should be possible to instatiate it with a BUS and become associated', () => {
            const bus = new Bus()
            const localLib = new Api({}, bus)
            expect(localLib).to.be.an.instanceof(Api)
            expect(localLib.hasBus()).to.be.true
        })

        it('it should not be possible to instatiate it with a non BUS', () => {
            const bus = {}
            const localLib = () => { return new Api({}, bus) }
            expect(localLib).to.throw(TypeError)
        })
    })

    describe('After I have an API instance with a BUS and Channels set', () => {
        beforeEach(() => {
            pbBus = new Bus()
            lib = new Api({}, pbBus)
            lib.initChannels(channelConfig)
        })

        it('it should not be possible to send a message without a BUS', () => {
            lib = new Api({}, null)
            expect(lib.send(...message1)).to.be.false
        })

        it('it should not be possible to send a message to an unexisting channel', () => {
            expect(lib.send(...errMessage1)).to.be.false
        })

        it('it should be possible to send a message', () => {
            expect(lib.send(...message1)).to.not.be.false
        })

        it('it should not be possible to reply to an unknown channel', () => {
            const receivedMessageMocked = { 
                message: 'Checking Hold State', 
                reply_stack: [ 
                    { entity: 'ENTITY_NAME', name: 'CHANNEL_33' } 
                ]
            }
            const replied = lib.reply(replyMessage, receivedMessageMocked)
            expect(replied).to.be.false
        })

        it('it should not be possible to reply to an message without reply stack present', () => {
            const receivedMessageMocked = {message: 'Checking Hold State'}
            const replied = lib.reply(replyMessage, receivedMessageMocked)
            expect(replied).to.be.false
        })
    })

    describe('After I have an API instance with a BUS set and Channels set', () => {
        beforeEach(() => {
            pbBus = new Bus()
            lib = new Api({}, pbBus)
            const localChannelConfig = Object.assign({}, channelConfig)
            const apiListener = (msg) => {
                // console.log(msg)
                if (typeof msg.reply === 'undefined' || msg.reply !== true) {
                    lib.reply(replyMessage, msg)
                }
            }

            localChannelConfig.channels[2].listenerInfo = {id: 100, listener: apiListener}
            lib.initChannels(localChannelConfig)
        })

        it('it sould be possible to check if a channel exists by providing the entity and channel name', () => {
            const exists = lib.exists('ENTITY_NAME', 'CHANNEL_1')
            expect(exists).to.be.true
        })

        it('it sould be possible to check if an unexisting channel exists by providing the entity and channel name', () => {
            const exists = lib.exists('ENTITY_NAME', 'CHANNEL')
            expect(exists).to.be.false
        })

        it('it should be possible to add a listener to an existing channel', () => {
            const listener = listenerTest()
            const listenerId = lib.addListener('ENTITY_NAME', 'CHANNEL_1', {id: 200, listener})
            expect(listenerId).not.to.be.false
        })

        it('it should not be possible to add a listener to an unexisting channel', () => {
            const listener = listenerTest()
            const listenerId = lib.addListener('ENTITY_NAME', 'CHANNEL', {id: 200, listener})
            expect(listenerId).to.be.false
        })

        it('it should be possible to get a listener information if exists', () => {
            const listener = listenerTest()
            const listenerInfoInit = {id: 200, listener}
            const listenerId = lib.addListener('ENTITY_NAME', 'CHANNEL_1', listenerInfoInit)
            const listenerInfo = lib.getListenerInfo(listenerId)
            expect(listenerId).not.to.be.false
            expect(listenerInfo).to.include(listenerInfoInit)
        })

        it('it should not be possible to get a listener information if it is unknown', () => {
            const listener = listenerTest()
            const listenerInfoInit = {id: 200, listener}
            const listenerId = lib.addListener('ENTITY_NAME', 'CHANNEL_1', listenerInfoInit)
            const listenerInfo = lib.getListenerInfo('XXXX')
            expect(listenerId).not.to.be.false
            expect(listenerInfo).to.be.null
        })

        it('it should be possible to remove a listener information if it is known', () => {
            const listener = listenerTest()
            const listenerInfoInit = {id: 200, listener}
            const listenerId = lib.addListener('ENTITY_NAME', 'CHANNEL_1', listenerInfoInit)
            expect(listenerId).not.to.be.false
            lib.removeListener(listenerId)
            expect(lib.getListenerInfo(listenerId)).to.be.null
        })

        it('it should be possible to request to remove a listener from a channel that does not exsit', () => {
            const listenerId = '89769865'
            lib.removeListener(listenerId)
            expect(lib.getListenerInfo(listenerId)).to.be.null
        })

        it('it should sync and sanitize the listener so it should not exist', () => {
            const listener = listenerTest()
            const listenerInfo = {id: 200, listener}
            const listenerId = lib.sendAndListen('ENTITY_NAME', 'CHANNEL_3', {message: 'Request message (sanitize)'}, listenerInfo)
            expect(listenerId).not.to.be.false
            expect(lib.getListenerInfo(listenerId)).to.be.null
        })

        it('it should be able reply back through the same channel in a BUS', (done) => {
            const clientListener = listenerTest(done, replyMessage, true)
            const listenerId = lib.sendAndListen('ENTITY_NAME', 'CHANNEL_3', {message: 'Request message'}, {id:200, listener: clientListener})
            expect(listenerId).not.to.be.false
        })

        it('it should return null when send & listen to an unknown channel', () => {
            const listenerId = lib.sendAndListen('ENTITY_UNKNOWN_1', 'CHANNEL_UNKNOWN', {message: 'Request message'}, {id:200, listener: () => {}})
            expect(listenerId).to.be.false
        })

        it('it should return null when fetching a message information form an unknown channel', () => {
            expect(lib.getMessageInfo('ENTITY_UNKNOWN', 'CHANNEL_1', '98765848')).to.be.null
        })

        it('should return undefined when trying to get information about an unknown channel', () => {
            expect(lib.getChannelStatus('ENTITY_UNKNOWN_2', 'CHANNEL_UNKNOWN')).to.be.undefined
        })

        it('should be able to hold a channel communication queuing messages and when reopened the message should proceed', (done) => {
            const listener = message => {
                if (message.reply) {
                    expect(message).to.include(replyMessage)
                    done()
                }
            }
            const listenerInfo = {id: 200, listener}
            const messageToSend = {message: 'Checking Hold State'}

            expect(lib.getChannelStatus('ENTITY_NAME', 'CHANNEL_3')).to.be.equal(1)
            lib.holdChannel('ENTITY_NAME', 'CHANNEL_3')
            expect(lib.getChannelStatus('ENTITY_NAME', 'CHANNEL_3')).to.be.equal(2)

            const listenerId = lib.addListener('ENTITY_NAME', 'CHANNEL_3', listenerInfo)
            const messageId = lib.send('ENTITY_NAME', 'CHANNEL_3', messageToSend)
            lib.getMessageInfo('ENTITY_NAME', 'CHANNEL_3', messageId)

            expect(listenerId).not.to.be.false
            expect(messageId).not.to.be.false
            expect(lib.getListenerInfo(listenerId)).not.to.be.null

            lib.resumeChannel('ENTITY_NAME', 'CHANNEL_3')
            expect(lib.getChannelStatus('ENTITY_NAME', 'CHANNEL_3')).to.be.equal(1)
        })

        it('should be able to close a channel communication queuing messages and when reopened the message should proceed', (done) => {
            const listener = message => {
                if (message.reply) {
                    expect(message).to.include(replyMessage)
                    done()
                }
            }
            const listenerInfo = {id: 200, listener}
            const messageToSend = {message: 'Checking Close State'}

            expect(lib.getChannelStatus('ENTITY_NAME', 'CHANNEL_3')).to.be.equal(1)
            lib.closeChannel('ENTITY_NAME', 'CHANNEL_3')
            expect(lib.getChannelStatus('ENTITY_NAME', 'CHANNEL_3')).to.be.equal(0)

            const listenerId = lib.addListener('ENTITY_NAME', 'CHANNEL_3', listenerInfo)
            const messageId = lib.send('ENTITY_NAME', 'CHANNEL_3', messageToSend)

            expect(listenerId).not.to.be.false
            expect(messageId).not.to.be.false
            expect(lib.getListenerInfo(listenerId)).not.to.be.null

            lib.openChannel('ENTITY_NAME', 'CHANNEL_3')
            expect(lib.getChannelStatus('ENTITY_NAME', 'CHANNEL_3')).to.be.equal(1)
        })
    })
})