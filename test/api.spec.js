/* global describe, it, before */

import chai from 'chai';
import Bus from '../src/bus';
import Api from '../src/api';

chai.expect();

const expect = chai.expect;

let lib, pbBus, prBus

let message1 = ['ENTITY_NAME', 'CHANNEL_1', {field1: 'field1 value'}]
let replyMessage = {message: 'This is the reply'}
let errMessage1 = ['ENTITY_NAME', 'CHANNEL_11', {field1: 'field1 value'}]

let privateMessage1 = ['ENTITY_NAME_PRIVATE', 'CHANNEL_1_PRIVATE', {field1: 'field1 value'}]
let privateErrMessage1 = ['ENTITY_NAME_PRIVATE', 'CHANNEL_11_PRIVATE', {field1: 'field1 value'}]

let channelConfig = {
    entity: 'ENTITY_NAME',
    channels: [
        {name: 'CHANNEL_1', require: [ 'field1' ]},
        {name: 'CHANNEL_2', require: [ 'field1', 'field2' ]},
        {name: 'CHANNEL_3'},
    ]
}

let privateChannelConfig = {
    entity: 'ENTITY_NAME_PRIVATE',
    channels: [
        {name: 'CHANNEL_1_PRIVATE', require: [ 'field1' ]},
        {name: 'CHANNEL_2_PRIVATE', require: [ 'field1', 'field2' ]},
        {name: 'CHANNEL_3_PRIVATE'},
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

describe('After I have an API instance', () => {
    beforeEach(() => {
        lib = new Api()
    })

    // TODO: we must add configuration mode

    it('it should have a different id from another', () => {
        let b = new Api()
        expect(lib.getId() === b.getId()).to.be.false
    })

    it('it should be possible to set a public BUS', () => {
        let b = new Bus()
        lib.setPublicBus(b)
        expect(lib.hasPublic()).to.be.true
    })

    it('it should be possible to set a private BUS', () => {
        let b = new Bus()
        lib.setPrivateBus(b)
        expect(lib.hasPrivate()).to.be.true
    })

    it('it should show false when we try to set a non BUS to its public side', () => {
        lib = new Api()
        let set_public = () => {lib.setPublicBus({})}
        expect(set_public).to.throw(TypeError)
        expect(lib.hasPublic()).to.be.false
    })

    it('it should show false when we try to set a non BUS to its private side', () => {
        let set_private = () => {lib.setPrivateBus({})}
        expect(set_private).to.throw(TypeError)
        expect(lib.hasPrivate()).to.be.false
    })

    it('it should be possible to define public channels through a configuration', () => {
        let args
        let pubBus = new Bus()
        lib.setPublicBus(pubBus)

        let expected_values = channelConfig.channels.map((item) => {
            return channelConfig.entity + '.' + item.name
        })
        let check_exists = channelConfig.channels.map((item) => {
            return [channelConfig.entity, item.name]
        })

        let result = lib.registerPublic(channelConfig)
        expect(result).to.be.an('array')
        expect(result).to.include.members(expected_values)

        expect(pubBus.exists(channelConfig.entity)).to.be.true
        for (args in check_exists) {
            expect(pubBus.exists(...check_exists[args])).to.be.true
        }
    })

    it('it should not be possible to define public channels through a configuration with an invalid channels property', () => {
        let pubBus = new Bus()
        lib.setPublicBus(pubBus)

        let register = () => { return lib.registerPublic(channelConfigWithInvalidChannelsProperty) }
        expect(register).to.throw(TypeError, 'Invalid channel configuration')
    })

    it('it should not be possible to define public channels through a configuration with an invalid entity property', () => {
        let pubBus = new Bus()
        lib.setPublicBus(pubBus)

        let register = () => { return lib.registerPublic(channelConfigWithInvalidEntityProperty) }
        expect(register).to.throw(TypeError, 'Invalid channel configuration')
    })

    it('it should not be possible to define public channels through an invalid configuration', () => {
        let pubBus = new Bus()
        lib.setPublicBus(pubBus)

        let register = () => { return lib.registerPublic([]) }
        expect(register).to.throw(TypeError, 'Invalid channel configuration')
    })

    it('it should not be possible to define public channels without a configuration', () => {
        let pubBus = new Bus()
        lib.setPublicBus(pubBus)

        let register = () => { return lib.registerPublic() }
        expect(register).to.throw(TypeError, 'Invalid channel configuration')
    })

    it('it should not be possible to define public channels through a configuration without a BUS', () => {
        let register = () => { return lib.registerPublic(channelConfig) }
        expect(register).to.throw(Error, 'Target BUS is not set')
    })

    it('it should be possible to define private channels through a configuration', () => {
        let args
        let privBus = new Bus()
        lib.setPrivateBus(privBus)

        let expected_values = channelConfig.channels.map((item) => {
            return channelConfig.entity + '.' + item.name
        })
        let check_exists = channelConfig.channels.map((item) => {
            return [channelConfig.entity, item.name]
        })

        let result = lib.registerPrivate(channelConfig)
        expect(result).to.be.an('array')
        expect(result).to.include.members(expected_values)

        expect(privBus.exists(channelConfig.entity)).to.be.true
        for (args in check_exists) {
            expect(privBus.exists(...check_exists[args])).to.be.true
        }
    })

    it('it should not be possible to define public channels through a configuration with an invalid channels property', () => {
        let privBus = new Bus()
        lib.setPrivateBus(privBus)

        let register = () => { return lib.registerPrivate(channelConfigWithInvalidChannelsProperty) }
        expect(register).to.throw(TypeError, 'Invalid channel configuration')
    })

    it('it should not be possible to define public channels through a configuration with an invalid entity property', () => {
        let privBus = new Bus()
        lib.setPrivateBus(privBus)

        let register = () => { return lib.registerPrivate(channelConfigWithInvalidEntityProperty) }
        expect(register).to.throw(TypeError, 'Invalid channel configuration')
    })

    it('it should not be possible to define public channels through an invalid configuration', () => {
        let privBus = new Bus()
        lib.setPrivateBus(privBus)

        let register = () => { return lib.registerPrivate([]) }
        expect(register).to.throw(TypeError, 'Invalid channel configuration')
    })

    it('it should not be possible to define public channels without a configuration', () => {
        let privBus = new Bus()
        lib.setPrivateBus(privBus)

        let register = () => { return lib.registerPrivate() }
        expect(register).to.throw(TypeError, 'Invalid channel configuration')
    })

    it('it should not be possible to define public channels through a configuration without a BUS', () => {
        let register = () => { return lib.registerPrivate(channelConfig) }
        expect(register).to.throw(Error, 'Target BUS is not set')
    })
})

describe('When intantiating a new Entity API', () => {
    it('it should be possible to instatiate it with configuration object only', () => {
        let localLib = new Api({})
        expect(localLib).to.be.an.instanceof(Api)
    })

    it('it should not be possible to instatiate it with configuration different from an object literal', () => {
        let localLib = () => { return new Api('dafadfadf') }
        expect(localLib).to.throw(TypeError)
    })

    it('it should be possible to instatiate it with a public BUS and become associated', () => {
        let pubBus = new Bus()
        let localLib = new Api({}, pubBus)
        expect(localLib).to.be.an.instanceof(Api)
        expect(localLib.hasPublic()).to.be.true
    })

    it('it should not be possible to instatiate it with a non public BUS', () => {
        let pubBus = {}
        let localLib = () => { return new Api({}, pubBus) }
        expect(localLib).to.throw(TypeError)
    })

    it('it should be possible to instatiate it with a private BUS and become associated', () => {
        let privBus = new Bus()
        let localLib = new Api({}, null, privBus)
        expect(localLib).to.be.an.instanceof(Api)
        expect(localLib.hasPrivate()).to.be.true
    })

    it('it should not be possible to instatiate it with a non private BUS', () => {
        let privBus = {}
        let localLib = () => { return new Api({}, null, privBus) }
        expect(localLib).to.throw(TypeError)
    })

})

describe('After I have an API instance with Public and Private BUS set and Channels set', () => {
    beforeEach(() => {
        pbBus = new Bus()
        prBus = new Bus()
        lib = new Api({}, pbBus, prBus)
        lib.registerPublic(channelConfig)
        lib.registerPrivate(privateChannelConfig)
    })

    it('it should not be possible to send a public message without a public BUS', () => {
        lib = new Api({}, null, prBus)
        expect(lib.sendPublic(...message1)).to.be.false
    })

    it('it should not be possible to send a public message to an unexisting channel', () => {
        expect(lib.sendPublic(...errMessage1)).to.be.false
    })

    it('it should be possible to send a public message', () => {
        expect(lib.sendPublic(...message1)).to.not.be.false
    })

    it('it should not be possible to send a private message without a private BUS', () => {
        lib = new Api({}, pbBus, null)
        expect(lib.sendPrivate(...privateMessage1)).to.be.false
    })

    it('it should not be possible to send a private message to an unexisting channel', () => {
        expect(lib.sendPrivate(...privateErrMessage1)).to.be.false
    })

    it('it should be possible to send a private message', () => {
        expect(lib.sendPrivate(...privateMessage1)).to.not.be.false
    })
})

describe('After I have an API instance with Public and Private BUS set and Channels set', () => {
    beforeEach(() => {
        pbBus = new Bus()
        prBus = new Bus()
        lib = new Api({}, pbBus, prBus)
        let localChannelConfig = Object.assign({}, channelConfig)
        let apiListener = (msg) => {
            if (typeof msg.reply === 'undefined' || msg.reply !== true) {
                lib.reply(replyMessage, msg)
            }
        }

        localChannelConfig.channels[2].listenerInfo = {id: 100, listener: apiListener}
        lib.registerPublic(localChannelConfig)
        lib.registerPrivate(privateChannelConfig)
    })

    it('it should be able reply back through the same channel in a public BUS', (done) => {
        let chn = pbBus.get('ENTITY_NAME', 'CHANNEL_3')
        const clientListener = (message) => {
            if (message.reply === true) {
                expect(message).to.include(replyMessage)
                done()
            }
        }
        if (chn !== false) {
            let sendMessage = {message: 'Request message'}
            chn.sendAndListen({message: 'Request message'}, {id:200, listener: clientListener})
            // chn.send(sendMessage)
        }
//        expect(lib.sendPublic(...message1)).to.be.false
    })

})
