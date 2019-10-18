/* global describe, it, before */

import chai from 'chai';
import Content from '../src/impulse_/content';

chai.expect();

const expect = chai.expect;

let lib;

const toSet = {test: 'TEST CONTENT'}
const toAdd = {test: 'TEST CONTENT 2', test2: 'TEST AGAIN'}


describe('IMPULSE-CONTENT', () => {
    describe('Given an instance of content', () => {
        beforeEach(() => {
            lib = new Content()
        })
    
        it('should not have any content', () => {
            expect(lib.get()).to.be.eql({})
        })
    
        it('should not be possible to set non object as a content', () => {
            expect(lib.set('JUST A TEST')).to.be.equal(false)
        })

        it('should be possible to set content', () => {
            expect(lib.set(toSet)).to.be.equal(true)
            expect(lib.get()).to.be.eql(toSet)
        })
    
        it('should not be possible to add a non object content', () => {
            expect(lib.set(toSet)).to.be.equal(true)
            expect(lib.add('JUST A TEST')).to.be.equal(false)
            expect(lib.get()).to.be.eql(toSet)
        })
    
        it('should be possible to add content', () => {
            expect(lib.set(toSet)).to.be.equal(true)
            expect(lib.add(toAdd)).to.be.equal(true)
            expect(lib.get()).to.be.eql(toAdd)
        })
    })
    
    describe('Given an instance of content with initial content', () => {
        beforeEach(() => {
            lib = new Content(toSet)
        })

        it('should have content', () => {
            expect(lib.get()).to.be.eql(toSet)
        })
    
        it('should be possible to add content', () => {
            expect(lib.add(toAdd)).to.be.equal(true)
            expect(lib.get()).to.be.eql(toAdd)
        })
    })

})    
