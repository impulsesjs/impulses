/* global describe, it, before */

import chai from 'chai';
import Bus from '../src/bus';
import MockHelper from './mocked/mockClassHelper.mock'

chai.expect();

const expect = chai.expect;

let lib
/** @type {ChannelInfo} channelType1 */
let channelType1 = {
    name: 'TEST1',
    entity: 'TYPE1',
}
let channelType2 = {
    name: 'TEST2',
    entity: 'TYPE2',
    require: [ 'field1' ],
}

let channelTypeFail1 = {
    name: 'TEST1',
}
let channelTypeFail2 = {
    entity: 'TYPE1',
}

let channelsInfo = {}

// Helpers for mocked
let mockChannel = {}

describe('Given an instance of bus', () => {
    describe('After I have an instance', () => {
        before(() => {
            lib = new Bus()

            channelsInfo = lib.__test__.channelsInfo
            mockChannel = new MockHelper(lib.__test__.channelsInfo)
            mockChannel.__updateMethods__({
                next: {
                    func: () => (mockChannel.return.next.length ? mockChannel.return.next.shift() : null),
                    debug: false
                }
            })
            mockChannel.return.next = [];
        })

        it('it should not have any entity registered', () => {
            expect(lib.exists(channelType1.entity)).to.be.equal(false)
        })

        it('it should not have any channel registered', () => {
            expect(lib.exists(channelType1.entity, channelType1.name)).to.be.equal(false)
        })

        describe('After registering a channel', () => {
            before(() => {
                lib.register(channelType1)
            })

            it('it should be possible to register a single channel', () => {
                expect(lib.exists(channelType1.entity, channelType1.name)).to.be.equal(true)
            })
    
            it('it should have the registered entity', () => {
                expect(lib.exists(channelType1.entity)).to.be.equal(true)
            })
            it('it should have the registered channel', () => {
                expect(lib.exists(channelType1.entity, channelType1.name)).to.be.equal(true)
            })
    
            it('it should not have an unregistered channel', () => {
                expect(lib.exists(channelType1.entity, channelType1.name + 'A')).to.be.equal(false)
            })
        })
    })

    describe('After I have a clean instance', () => {
        before(() => {
            lib = new Bus()
        })

        it('it should fail when trying to register and empty list of channels', () => {
            let ret = lib.register()
            expect(ret.length).to.be.equal(0)
        })

        it('it should fail when trying to register a channel information object missing the entity information', () => {
            let ret = lib.register(channelTypeFail1)
            expect(ret.length).to.be.equal(0)
        })

        it('it should fail when trying to register a channel information object missing the name information', () => {
            let ret = lib.register(channelTypeFail2)
            expect(ret.length).to.be.equal(0)
        })

        it('trying to register the same channel shouldn´t be possible', () => {
            let ret1 = lib.register(channelType1)
            let ret2 = lib.register(channelType1)
            expect(ret1.length).to.be.equal(1)
            expect(ret2.length).to.be.equal(0)
        })
    })

    describe('After I have a clean instance', () => {
        before(() => {
            lib = new Bus()
        })

        it('it should not have any entity registered', () => {
            expect(lib.exists(channelType1.entity)).to.be.equal(false)
        })

        it('it should not have any channel registered', () => {
            expect(lib.exists(channelType1.entity, channelType1.name)).to.be.equal(false)
        })

        it('it should be possible to register a list of channels', () => {
            lib.register([ channelType1, channelType2 ])
            expect(lib.exists(channelType1.entity, channelType1.name)).to.be.equal(true)
            expect(lib.exists(channelType2.entity, channelType2.name)).to.be.equal(true)
        })

        it('it should have both entities registered', () => {
            expect(lib.exists(channelType1.entity)).to.be.equal(true)
            expect(lib.exists(channelType2.entity)).to.be.equal(true)
        })

        it('it should have both channels registered', () => {
            expect(lib.exists(channelType1.entity, channelType1.name)).to.be.equal(true)
            expect(lib.exists(channelType2.entity, channelType2.name)).to.be.equal(true)
        })
    })

    describe('With the last instance', () => {
        it('it should not be possible to get the channel class when requesting an unexisting entity', () => {
            expect(lib.get('FAIL1')).to.be.null
        })

        it('it should not be possible to get the channel class only with the first entity information', () => {
            expect(lib.get(channelType1.entity)).to.be.null
        })

        it('it should be possible to get the channel class for the first type and name', () => {
            expect(lib.get(channelType1.entity, channelType1.name)).not.null
        })

        it('it should not be possible to get the channel class only with the first second information', () => {
            expect(lib.get(channelType2.entity)).to.be.null
        })

        it('it should be possible to get the channel class for the second type and name', () => {
            expect(lib.get(channelType2.entity, channelType2.name)).not.null
        })
    })
})

