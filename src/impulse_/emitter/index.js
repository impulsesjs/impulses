'use strict'
import Md5 from './md5'

/**
* @typedef {Object} EmitterEntity
* @prop {String} emitter Emitter signature / name
* @prop {String} version Emitter verison
*/

const emitterClass = class EmitterClass {

    constructor (emitterInfo) {

        /**** Private Attributes *************************************************************************************/

        const internalId = undefined
        const info = undefined

        initInternalId()
        setEmitter(emitterInfo)

        /**** Private Methods ****************************************************************************************/

        /**
         * Checks if the information is valid / as expected
         * 
         * @param {EmitterEntity} info 
         * @returns {Boolean}
         */
        const isValid = (info) => {
            if (typeof info !== 'object') return false
            if (!info.emitter || typeof info.emitter !== 'string') return false
            if (!info.version || typeof info.version !== 'string') return false

            return true;
        }

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
            internalId = generateId()
        }

        /**
         * Set the emitter information
         * 
         * @param {EmitterEntity} newEmitterInfo
         * @returns {Boolean}
         */
        const setEmitter = newEmitterInfo => {
            if (!isValid(newEmitterInfo)) {
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
        const getEmitter = () => Object.assign({}, info)

        isEqual = infoCheck => {
            let testValue;
            if (info.size !== infoCheck.size) {
                return false;
            }

            for (let [name, value] of info) {
                testValue = infoCheck.get(name);
                // in cases of an undefined value, make sure the key
                // actually exists on the object so there are no false positives
                if (testValue !== value || (testValue === undefined && !infoCheck.has(name))) {
                    return false;
                }
            }
            return true;
        }
        
        /**** Privileged Methods *************************************************************************************/

        /**
         * Set the Emitter info
         * 
         * @returns {Boolean}
         */
        this.setEmitter = (emitterInfo) => setEmitter(emitterInfo)

        /**
         * Get the emitter internal ID
         */
        this.getId = () => getId()

        /**
         * Get the Emitter info
         * 
         * @returns {*}
         */
        this.getEmitter = () => getEmitter()

        /**
         * Check if the current Frequency is the same as the provided one
         * 
         * @param {EmitterClass}emitter
         * @returns {boolean}
         */
        this.isEqual = emitter => isEqual(emitter)
    }

    /**** Prototype Methods ******************************************************************************************/

}

export default emitterClass
