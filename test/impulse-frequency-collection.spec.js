/* global describe, it, before */
// TODO: needs spies to mock frequnecy and do the proper unit testing
import chai from 'chai'
import spies from 'chai-spies'

import classToTest from '../src/impulse_/frequency-collection'
import * as Frequency from '../src/impulse_/frequency'

chai.use(spies);
chai.expect();

const expect = chai.expect;
const sandbox = chai.spy.sandbox();

let lib

const ENTITY = {
    CORRECT: 'CORRECT_ENTITY',
    WRONG: 'WRONG_ENTITY',
}

const CHANNEL = {
    CORRECT: 'CORRECT_CHANNEL',
    WRONG: 'WRONG_CHANNEL',
}

let objFrequencyEntityCorrect = true
let objFrequencyChannelCorrect = true
let objFrequencyIndex = '0';
const serializedFrequencyCorrect = [
    {
        entity: `${ENTITY.CORRECT}_0`,
        channel: `${CHANNEL.CORRECT}_0`,
    },
    {
        entity: `${ENTITY.CORRECT}_1`,
        channel: `${CHANNEL.CORRECT}_1`,
    },
    {
        entity: `${ENTITY.CORRECT}_2`,
        channel: `${CHANNEL.CORRECT}_2`,
    },
    {
        entity: `${ENTITY.CORRECT}_3`,
        channel: `${CHANNEL.CORRECT}_3`,
    },
];
const objFrequencyCorrect = [
    {
        getEntity: () => `${ENTITY.CORRECT}_0`,
        getChannel: () => `${CHANNEL.CORRECT}_0`,
    },
    {
        getEntity: () => `${ENTITY.CORRECT}_1`,
        getChannel: () => `${CHANNEL.CORRECT}_1`,
    },
    {
        getEntity: () => `${ENTITY.CORRECT}_2`,
        getChannel: () => `${CHANNEL.CORRECT}_2`,
    },
    {
        getEntity: () => `${ENTITY.CORRECT}_3`,
        getChannel: () => `${CHANNEL.CORRECT}_3`,
    },
];
const objFrequencyQuery = {
    getEntity: () => objFrequencyEntityCorrect ? `${ENTITY.CORRECT}_${objFrequencyIndex}` : `${ENTITY.WRONG}_${objFrequencyIndex}`,
    getChannel: () => objFrequencyChannelCorrect ? `${CHANNEL.CORRECT}_${objFrequencyIndex}` : `${CHANNEL.WRONG}_${objFrequencyIndex}`,
};
    
describe('IMPULSE-FREQUENCY-COLLECTION', () => {

    describe('After I have an empty instance', () => {
        beforeEach(() => {
            lib = new classToTest()
        })

        describe('and while it is empty', () => {
            it('it should return false when verifying if it has a frequency', () => {
                const test = lib.has(objFrequencyCorrect[0])
                expect(test).to.be.equal(false)
            })
            it('it should return 0 when questioned about the number of frequencies', () => {
                const test = lib.count()
                expect(test).to.be.equal(0)
            })
            it('it should not iterate any content', () => {
                let iteraction = 0
                const test = lib.each(item => {
                    iteraction++;
                })
                expect(iteraction).to.be.equal(0)
            })
        })

        describe('and while it has one frequency', () => {
            beforeEach(() => {
                objFrequencyEntityCorrect = true
                objFrequencyChannelCorrect = true
                objFrequencyIndex = '0'
                lib.add(objFrequencyCorrect[0])
            })

            it('it should return true when verifying if it has the inserted frequency', () => {
                const test = lib.has(objFrequencyCorrect[0])
                expect(test).to.be.equal(true)
            })
            it('it should return false when verifying if it has a frequency with a wrong entity', () => {
                objFrequencyEntityCorrect = false
                const test = lib.has(objFrequencyQuery)
                expect(test).to.be.equal(false)
            })
            it('it should return false when verifying if it has a frequency with a wrong channel', () => {
                objFrequencyChannelCorrect = false
                const test = lib.has(objFrequencyQuery)
                expect(test).to.be.equal(false)
            })
            it('it should return false when verifying if it has a frequency with a wrong entity and channel', () => {
                objFrequencyEntityCorrect = false
                objFrequencyChannelCorrect = false
                const test = lib.has(objFrequencyQuery)
                expect(test).to.be.equal(false)
            })
            it('it should return 1 when questioned about the number of frequencies', () => {
                const test = lib.count()
                expect(test).to.be.equal(1)
            })
            it('it should iterate by 1 frequency', () => {
                let iteraction = 0
                const test = lib.each(item => {
                    iteraction++;
                })
                expect(iteraction).to.be.equal(1)
            })
        })

        describe('and while it has several frequencies', () => {
            beforeEach(() => {
                objFrequencyEntityCorrect = true
                objFrequencyChannelCorrect = true
                objFrequencyIndex = '0'
                objFrequencyCorrect.forEach(freq => {
                    lib.add(freq)
                })
                
            })

            it('it should return true when verifying if it has any of the inserted frequencies', () => {
                objFrequencyCorrect.forEach(freq => {
                    const test = lib.has(freq)
                    expect(test).to.be.equal(true)
                })
            })
            it('it should return false when verifying if it has a frequency with a wrong entity', () => {
                objFrequencyEntityCorrect = false
                const test = lib.has(objFrequencyQuery)
                expect(test).to.be.equal(false)
            })
            it('it should return false when verifying if it has a frequency with a wrong channel', () => {
                objFrequencyChannelCorrect = false
                const test = lib.has(objFrequencyQuery)
                expect(test).to.be.equal(false)
            })
            it('it should return false when verifying if it has a frequency with a wrong entity and channel', () => {
                objFrequencyEntityCorrect = false
                objFrequencyChannelCorrect = false
                const test = lib.has(objFrequencyQuery)
                expect(test).to.be.equal(false)
            })
            it('it should return 4 when questioned about the number of frequencies', () => {
                const test = lib.count()
                expect(test).to.be.equal(4)
            })
            it('it should iterate by 1 frequency', () => {
                let iteraction = 0
                const test = lib.each(item => {
                    iteraction++;
                })
                expect(iteraction).to.be.equal(4)
            })
        })
    })

    describe('When instanciating with a serialized object', () => {
        beforeEach(() => {
            sandbox.on(Frequency, 'Frequency')
        })

        afterEach(() => {
            sandbox.restore()
        })

        it('it should create internal freqeuncy objects', () => {
            expect(Frequency.Frequency).to.not.have.been.called()
            lib = new classToTest(serializedFrequencyCorrect)
            expect(Frequency.Frequency).to.have.been.called()
        })
    })

    describe('After I have an instance from an serialized information', () => {
        beforeEach(() => {
            lib = new classToTest(serializedFrequencyCorrect)
        })

        it('it should return the correct serialized object', () => {
            const test = lib.serialize()
            expect(test).to.be.eql(serializedFrequencyCorrect)
        })

        it('it should return false when verifying if it has a frequency', () => {
            const test = lib.has(objFrequencyCorrect[0])
            expect(test).to.be.equal(true)
        })
    })
})
