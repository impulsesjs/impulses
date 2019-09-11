'use strict'
import Md5 from '../../md5'

/**
* @typedef {Object} EmitterEntity
* @prop {String} emitter Emitter signature / name
* @prop {String} version Emitter verison
*/

const emitterClass = class EmitterClass {

    constructor (emitterInfo) {

        /**** Private Attributes *************************************************************************************/

        let internalId = undefined
        let info = {}

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
        const getEmitter = () => {
            return Object.assign({}, info)
        }

        const isEqual = infoCheck => {
            let equal = true
            if (info.size !== infoCheck.size) {
                return false
            }

            Object.keys(info).forEach(attribute => {
                if (!infoCheck[attribute] || info[attribute] !== infoCheck[attribute]) {
                    equal = false;
                }
            })

            Object.keys(infoCheck).forEach(attribute => {
                if (!info[attribute] || info[attribute] !== infoCheck[attribute]) {
                    equal = false;
                }
            })

            return equal;
        }
        
        initInternalId()
        setEmitter(emitterInfo)

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
