/* global describe, it, before */

import chai from 'chai';
import Queue from '../src/queue';

chai.expect();

const expect = chai.expect;

let lib
let objecto = {valor: 'teste'}
let objecto1 = {valor: 'teste1'}
let objecto2 = {valor: 'teste2'}
let objecto3 = {valor: 'teste3'}
let objecto4 = {valor: 'teste4'}
let id

describe('Given an instance of queue', () => {
    before(() => {
        lib = new Queue()
    })

    describe('After I have instantiated queue', () => {
        it('it should be empty', () => {
            expect(lib.next()).to.be.null
        })
    })

    describe('After I have added a new values', () => {
        it('it should return an id', () => {
            id = lib.add(objecto)
            expect(id).to.be.not.null
        })

        it('it should be possible to get the value', () => {
            let obj = lib.get(id)
            expect(obj).to.be.equal(objecto)
        })

        it('it should be possible to cancel the value', () => {
            let res = lib.cancel(id)
            expect(res).to.be.true
        })
    })

    describe('After I have canceled an invalid id', () => {
        it('it should return null', () => {
            let res = lib.cancel(21312)
            expect(res).to.be.null
        })
    })

    describe('After I have queued 1 value', () => {
        it('it should be returned when next is requested', () => {
            id = lib.add(objecto1)
            let obj = lib.next()
            expect(obj).to.be.equal(objecto1)
        })
    })

    describe('After I have queued several values', () => {
        it('it should return the same order when next is required (FIFO)', () => {
            id = lib.add(objecto2)
            id = lib.add(objecto1)
            id = lib.add(objecto3)
            id = lib.add(objecto4)
            expect(lib.next()).to.be.equal(objecto2)
            expect(lib.next()).to.be.equal(objecto1)
            expect(lib.next()).to.be.equal(objecto3)
            expect(lib.next()).to.be.equal(objecto4)
        })
    })
})

