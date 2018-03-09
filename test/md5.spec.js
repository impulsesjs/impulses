/* global describe, it, before */

import chai from 'chai';
import Md5 from '../src/md5';

chai.expect();

const expect = chai.expect;

let lib;
let testString = 'this is a string to test the algorithm with a ' +
    'very very very very very very very very very very very very very very very very very very very very very very ' +
    'long long long long long long long long long long long long long long long long long long long long long long ' +
    'length'
let testStringHash = '54c36f44c9da4b2245134dffd113de7b'

describe('Given an instance of md5', () => {
    before(() => {
        lib = new Md5()
    })

    describe('After I have provided data', () => {
        it('it should return with the md5 for it', () => {
            let id = lib.calculate(testString)
            expect(id).to.be.equal(testStringHash)
        })
    })
})

describe('Given an instance of md5 (in safe mode)', () => {
    before(() => {
        lib = new Md5(true)
    })

    describe('After I have provided data', () => {
        it('it should return with the md5 for it', () => {
            let id = lib.calculate(testString)
            expect(id).to.be.equal(testStringHash)
        })
    })
})
