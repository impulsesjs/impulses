/* global describe, it, before */

import chai from 'chai'
import classToTest from '../src/impulse_/options/debug'

chai.expect();

const expect = chai.expect;

let lib

// let validatorResult = false
describe('IMPULSE-OPTIONS-DEBUG', () => {
    beforeEach(() => {
        lib = new classToTest()
    })

    describe('After I have an instance not subscribed', () => {
        it('it should not be in subscribed mode', () => {
            const test = lib.isSubscribed()
            expect(test).to.be.equal(false)
        })

        it('it should return undefined when fetched', () => {
            const test = lib.get()
            expect(test).to.be.equal(undefined)
        })

        it('it should return false when trying to cancel it', () => {
            const test = lib.cancel()
            expect(test).to.be.equal(false)
        })

        describe('When trying to subscribe', () => {
            it('it should fail if a non object ', () => {
                const test1 = lib.subscribe('FAILURE')
                expect(test1).to.be.equal(false)

                const test2 = lib.subscribe([])
                expect(test2).to.be.equal(false)

                const test3 = lib.subscribe(1234)
                expect(test3).to.be.equal(false)

                const test4 = lib.subscribe(() => {})
                expect(test4).to.be.equal(false)

                const test5 = lib.subscribe(null)
                expect(test5).to.be.equal(false)

                const test6 = lib.subscribe(undefined)
                expect(test6).to.be.equal(false)
            })
    
            it('it should succeed if a object ', () => {
                const test = lib.subscribe({})
                expect(test).to.be.equal(true)
            })

        })
    })

    describe('After I have a subscribed instance', () => {
        beforeEach(() => {
            lib = new classToTest()
            lib.subscribe({})
        })

        it('it should be in subscribed mode', () => {
            const test = lib.isSubscribed()
            expect(test).to.be.equal(true)
        })

        it('it should return an object when fetched', () => {
            const test = lib.get()
            expect(test).to.be.eql({})
        })

        it('it should return true when trying to cancel it', () => {
            const test = lib.cancel()
            expect(test).to.be.equal(true)
        })

        it('it should return false when trying subscribe', () => {
            const test = lib.subscribe({})
            expect(test).to.be.equal(false)
        })
    })

})
