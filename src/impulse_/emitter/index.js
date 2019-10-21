'use strict'
import Md5 from '../../md5'
import { impulseValidator } from '../../impulse-validator'

/**
* @typedef {Object} EmitterEntity
* @prop {String} emitter Emitter signature / name
* @prop {String} version Emitter verison
*/

const emitterClass = class EmitterClass {

    constructor (serializedInfo) {

        /**** Private Attributes *************************************************************************************/

        const validator = new impulseValidator()
        let internalId = undefined
        let info = {}

        /**** Private Methods ****************************************************************************************/

        /**
         * Generate the Unique ID
         *
         * @returns {string} Generated Unique ID
         */
        const generateGenericId = () => {
            const randomValue1 = Math.random() * 5000
            const timeValue = Date.now()
            const randomValue2 = Math.random() * 5000
            return (new Md5()).calculate(`${randomValue1}.${timeValue}.${randomValue2}`)
        }

        /**
         * Generates a Unique ID / Signature
         * 
         * @returns {string} Generated Unique ID / Signature
         */
        const generateId = () => `i.${generateGenericId()}`

        const getId = () => internalId

        /**
         * Initializes the internal ID
         */
        const initInternalId = () => {
            if (!internalId) {
                internalId = generateId()
            }
        }

        const importFromSerialized = (serialized) => {
            if (serialized && serialized.id && serialized.info && setInfo(serialized.info)) {
                internalId = serialized.id
            }
        }

        /**
         * Set the emitter information
         * 
         * @param {EmitterEntity} newEmitterInfo
         * @returns {Boolean}
         */
        const setInfo = newEmitterInfo => {
            if (!validator.validateEmitter(newEmitterInfo)) {
                return false
            }
            info = Object.assign({}, newEmitterInfo)
            return true
        } 

        /**
         * Get the Emitter information
         * 
         * @returns {Object}
         */
        const getInfo = () => {
            return Object.assign({}, info)
        }

        const checkObjectKeysEquality = (objA, objB) => {
            const objAKeys = Object.keys(objA)
            const objBKeys = Object.keys(objB)
            if (objAKeys.length !== objBKeys.length) {
                return false
            }
            const keyResult = objAKeys.filter(key => (objBKeys.indexOf(key) >= 0))
            return (keyResult.length !== objAKeys.length) ? false : true
        }

        const checkObjectEquality = (objA, objB) => {
            let equal = true
            Object.keys(objA).forEach(attribute => {
                if (!objB[attribute] || objA[attribute] !== objB[attribute]) {
                    equal = false;
                }
            })
            return equal
        }

        const isEqual = emitterInfo => {
            if (!checkObjectKeysEquality(info, emitterInfo)) {
                return false
            }
            return checkObjectEquality(info, emitterInfo)
        }

        const serialize = () => Object.assign({}, {
            id: internalId,
            info: getInfo(),
        })
        
        importFromSerialized(serializedInfo)
        initInternalId()

        /**** Privileged Methods *************************************************************************************/

        /**
         * Set the Emitter info
         * 
         * @returns {Boolean}
         */
        this.setInfo = (emitterInfo) => setInfo(emitterInfo)

        /**
         * Get the emitter internal ID
         */
        this.getId = () => getId()

        /**
         * Get the Emitter info
         * 
         * @returns {*}
         */
        this.getInfo = () => getInfo()

        /**
         * Check if the current Frequency is the same as the provided one
         * 
         * @param {EmitterClass} emitter
         * @returns {boolean}
         */
        this.isEqual = emitter => validator.validateEmitterType(emitter) ? isEqual(emitter.getInfo()) : false

        this.serialize = () => serialize()

        /**** Test Area **********************************************************************************************/

        if (process.env.NODE_ENV === 'test') {
            // Allow unit test mocking
            this.__test__ = {
                validator: validator,
            }
        }

    }

    /**** Prototype Methods ******************************************************************************************/

}

export default emitterClass
