'use strict'
import Md5 from './md5'

const emitterClass = class EmitterClass {

    constructor (emitterInfo) {

        /**** Private Attributes *************************************************************************************/

        const internalId = undefined
        const info = undefined

        initInternalId()
        setEmitter(emitterInfo)

        /**** Private Methods ****************************************************************************************/

        /**
         * Generate the Unique ID
         *
         * @returns {string} Generated Unique ID
         */
        const generateGenericId = () => {
            const serializedImpulse = JSON.stringify(impulse)
            const randomValue = Math.random() * 5000
            const timeValue = Date.now()

            return (new Md5()).calculate(`${serializedImpulse}${randomValue}${timeValue}`)
        }

        /**
         * Generates a Unique ID / Signature
         * 
         * @returns {string} Generated Unique ID / Signature
         */
        const generateId = () => `i.${generateGenericId()}`

        /**
         * Initializes the internal ID
         */
        const initInternalId = () => {
            internalId = generateId()
        }

        /**
         * Set the ID
         * 
         * @param {string} newId
         */
        const setId = newId => internalId = newId

        const initEmit = newEmitterInfo => {
            info = Object.assign({}, newEmitterInfo)
        }
        /**
         * Set the emitter information
         * 
         * @param {Object} newEmitterInfo
         */
        const setEmitter = newEmitterInfo => {
            info = Object.assign({}, newEmitterInfo)
        } 

        /**
         * Get the Emitter information
         * 
         * @returns {Object}
         */
        const getEmitter = () => info

        const getEmitterCopy = () => Object.assign({}, info)

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
         * Get the Emitter info
         * 
         * @returns {*}
         */
        this.getEmitter = () => this.getEmitter()

        /**
         * Check if the current Frequency is the same as the provided one
         * 
         * @param {EmitterClass} freq
         * @returns {boolean}
         */
        this.isEqual = emitter => isEqual(emitter)
    }

    /**** Prototype Methods ******************************************************************************************/

}

export default emitterClass
