/* global describe, it, before */

import chai from 'chai';
import Md5 from '../src/md5';

chai.expect();

const expect = chai.expect;

let lib;

describe('Given an instance of md5', () => {
    before(() => {
        lib = new Md5()
    })

    describe('After I have provided data', () => {
        it('it should return with the md5 for it', () => {
            let id = lib.calculate('test1')
            console.log('id', id)
            expect(id).to.be.equal('psv1')
        })
    })
})

