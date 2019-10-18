/* global describe, it, before */

// TODO: Replace with spies
import chai from 'chai'
import Queue from '../src/queue'
import MockHelper from './mocked/mockClassHelper.mock'

chai.expect();

const expect = chai.expect;

let lib
let objecto = {valor: 'teste'}
let objecto1 = {valor: 'teste1'}
let objecto2 = {valor: 'teste2'}
let objecto3 = {valor: 'teste3'}
let objecto4 = {valor: 'teste4'}
let id

// Helpers for mocked
let valuesMock = {}
let queueMock = {}

describe('Given an instance of queue', () => {
    before(() => {
        lib = new Queue()

        valuesMock = new MockHelper(lib.__test__.queuedData)
        valuesMock.method = {
            isSet: id => valuesMock.return.isSet,
            destroy: id => valuesMock.return.destroy,
            set: (id, value) => valuesMock.return.set,
            get: id => ({id: id, data: valuesMock.return.get}),
        }

        queueMock = new MockHelper(lib.__test__.queue)
        queueMock.method = {
            indexOf: val => queueMock.return.indexOf,
            shift: () => queueMock.return.shift,
            length: (() => queueMock.return.length),
        }
    })

    beforeEach(() => {
        valuesMock.__resetHistory__()
        valuesMock.return = {}

        queueMock.__resetHistory__()
        queueMock.return = {}
    })

    describe('After instantiating queue', () => {
        it('it should be empty', () => {
            expect(lib.next()).to.be.null
        })
    })

    describe('After adding a new values', () => {
        it('it should return an id', () => {
            valuesMock.return.isSet = false;
            id = lib.add(objecto)
            expect(valuesMock.spy.isSet.called).to.be.true
            expect(valuesMock.spy.set.called).to.be.true
            expect(id).to.be.not.null
        })

        it('it should be possible to get the value', () => {
            valuesMock.return.get = objecto;
            let obj = lib.get(id)
            expect(valuesMock.spy.get.called).to.be.true
            expect(obj.data).to.be.equal(objecto)
        })

        it('it should be possible to cancel the value', () => {
            queueMock.return.indexOf = 1
            valuesMock.return.destroy = true;
            let res = lib.cancel(id)
            expect(queueMock.spy.indexOf.called).to.be.true
            expect(valuesMock.spy.destroy.called).to.be.true
            expect(res).to.be.true
        })

        it('it should return true if queue destroy null value', () => {
            queueMock.return.indexOf = 1
            valuesMock.return.destroy = null;
            let res = lib.cancel(id)
            expect(queueMock.spy.indexOf.called).to.be.true
            expect(res).to.be.true
        })
    })

    describe('After I have canceled an invalid id', () => {
        it('it should return null', () => {
            queueMock.return.indexOf = -1
            let res = lib.cancel(21312)
            expect(queueMock.spy.indexOf.called).to.be.true
            expect(valuesMock.spy.destroy.called).to.be.false
            expect(res).to.be.null
        })
    })

    describe('After I have queued 1 value', () => {
        it('it should be returned when next is requested', () => {
            valuesMock.return.isSet = false;
            id = lib.add(objecto1)
            expect(valuesMock.spy.isSet.called).to.be.true
            expect(valuesMock.spy.set.called).to.be.true

            queueMock.return.length = 1
            valuesMock.return.shift = id
            valuesMock.return.get = objecto1;
            valuesMock.return.destroy = true;
            let obj = lib.next()

            expect(queueMock.spy.shift.called).to.be.true
            expect(valuesMock.spy.get.called).to.be.true
            expect(valuesMock.spy.destroy.called).to.be.true
            expect(obj.data).to.be.equal(objecto1)
        })
    })

    describe('After I have queued several values', () => {
        it('it should return the same order when next is required (FIFO)', () => {
            valuesMock.return.isSet = false;
            id = lib.add(objecto2)
            id = lib.add(objecto1)
            id = lib.add(objecto3)
            id = lib.add(objecto4)
            expect(valuesMock.spy.isSet.called).to.be.true
            expect(valuesMock.spy.isSet.callCount).to.be.equal(4)
            expect(valuesMock.spy.set.called).to.be.true
            expect(valuesMock.spy.set.callCount).to.be.equal(4)


            queueMock.return.length = 1
            queueMock.return.shift = id
            valuesMock.return.get = objecto2;
            expect(lib.next().data).to.be.equal(objecto2)
            valuesMock.return.get = objecto1;
            expect(lib.next().data).to.be.equal(objecto1)
            valuesMock.return.get = objecto3;
            expect(lib.next().data).to.be.equal(objecto3)
            valuesMock.return.get = objecto4;
            expect(lib.next().data).to.be.equal(objecto4)

            expect(queueMock.spy.shift.called).to.be.true
            expect(queueMock.spy.shift.callCount).to.be.equal(4)
            expect(valuesMock.spy.get.called).to.be.true
            expect(valuesMock.spy.get.callCount).to.be.equal(4)
            expect(valuesMock.spy.destroy.called).to.be.true
            expect(valuesMock.spy.destroy.callCount).to.be.equal(4)
        })
    })
})

