/* global describe, it, before */

import chai from 'chai';
import { Values } from '../src/values';

chai.expect();

const expect = chai.expect;

let lib;

describe('Given an instance of values', () => {
    before(() => {
        lib = new Values({preset1: 'psv1', preset2: {name1: 'valuePS1'}})
    })

    describe('After I have instantiated values with a object of values', () => {
        it('It should be dirty', () => {
            expect(lib.isDirty()).to.be.equal(true)
        })
        it('it should be possible to get a single simple value', () => {
            expect(lib.get('preset1')).to.be.equal('psv1')
        })
        it('it should be possible to get a single complex value', () => {
            expect(lib.get('preset2.name1')).to.be.equal('valuePS1')
        })

        it('it should be possible to export and have all values present', () => {
            let exp = lib.export()
            expect(exp.preset1).to.be.equal('psv1')
            expect(exp.preset2.name1).to.be.equal('valuePS1')
        })

        it('it should be possible to check if there is any value', () => {
            let set = lib.isSet()
            expect(set).to.be.equal(true)
        })
        it('it should be possible to check if a specific value exists with success', () => {
            let set = lib.isSet('preset2.name1')
            expect(set).to.be.equal(true)
        })
        it('it should be possible to check if a specific value exists with no success', () => {
            let set = lib.isSet('preset2.name2')
            expect(set).to.be.equal(false)
        })
    })

    describe('When I need to set a simple value', () => {
        it('it should be possible to set a single value', () => {
            lib.set('name1', 'value1')
            expect(lib.get('name1')).to.be.equal('value1')
        })

        it('it should be possible to set a several level value value', () => {
            lib.set('name2.with.several.levels', 'value2')
            expect(lib.get('name2.with.several.levels')).to.be.equal('value2')
        })

        it('it should be possible to export and have all values present', () => {
            let exp = lib.export()
            expect(exp.name1).to.be.equal('value1')
            expect(exp.name2.with.several.levels).to.be.equal('value2')
        })

        it('It should not be dirty anymore', () => {
            expect(lib.isDirty()).to.be.equal(false)
        })
    })

    describe('When I need to update a simple value', () => {
        it('it should be possible to update a single value', () => {
            lib.set('name1', 'value1_1')
            expect(lib.get('name1')).to.be.equal('value1_1')
        })

        it('it should be possible to update a several level value value', () => {
            lib.set('name2.with.several.levels', 'value2_1')
            expect(lib.get('name2.with.several.levels')).to.be.equal('value2_1')
        })

        it('it should be possible to export and have all values present', () => {
            let exp = lib.export()
            expect(exp.name1).to.be.equal('value1_1')
            expect(exp.name2.with.several.levels).to.be.equal('value2_1')
        })
    })

    describe('When I need to delete a simple value', () => {
        it('it should return false when trying to remove an unexisting value', () => {
            expect(lib.destroy('poop')).to.be.equal(false)
        })

        it('it should be possible to set a single value', () => {
            lib.destroy('name1')
            expect(lib.get('name1')).to.be.equal(null)
        })

        it('it should be possible to delete a several level value value', () => {
            lib.destroy('name2.with.several.levels')
            expect(lib.get('name2.with.several.levels')).to.be.equal(null)
        })

        it('it should be possible to export and have none values present', () => {
            let exp = lib.export()
            expect(exp.name1).to.be.undefined
            expect(exp.name2.with.several.levels).to.be.undefined
        })
    })

    // describe('After initialised with a short TTL', () => {
    //     before(() => {
    //         lib = new Values({preset1: 'psv1', preset2: {name1: 'valuePS1'}}, 1)
    //     })
    //
    //     it('it should be deprecated', () => {
    //         lib.isValid()
    //         expect(lib.get('preset1')).to.be.equal('psv1')
    //     })
    //     it('it should be possible to get a single complex value', () => {
    //         expect(lib.get('preset2.name1')).to.be.equal('valuePS1')
    //     })
    //
    //     it('it should be possible to export and have all values present', () => {
    //         let exp = lib.export()
    //         expect(exp.preset1).to.be.equal('psv1')
    //         expect(exp.preset2.name1).to.be.equal('valuePS1')
    //     })
    // })
    //
})

