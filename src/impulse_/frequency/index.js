'use strict'

const frequencyClass = class FequencyClass {
    /**
     * @constructor
     * 
     * @param {string} entity 
     * @param {string} channel 
     */
    constructor (entityOrSerializedFrequency, channel) {

        /**** Private Attributes *************************************************************************************/

        let entityName = undefined
        let channelName = undefined

        /**** Private Methods ****************************************************************************************/

        /**
         * Get the Entity name
         * 
         * @returns {string}
         */
        const getEntity = () => entityName

        /**
         * Check if the current Entity name is the same as the provided
         * 
         * @param {string} name
         * @returns {boolean}
         */
        const isEntity = name => getEntity() === name

        /**
         * Get the Channel name
         * 
         * @returns {string}
         */
        const getChannel = () => channelName

        /**
         * Check if the current Channel name is the same as the provided
         * 
         * @param {string} name
         * @returns {boolean}
         */
        const isChannel = name => getChannel() === name

        /**
         * Check if the Frequency Entity and Channel are the same as the provided ones
         * 
         * @param {string} entity
         * @param {string} channel
         * @returns {boolean}
         */
        const isFrequency = (entity, channel) => (isEntity(entity) && isChannel(channel))

        /**
         * Check if the current Frequency is the same as the provided one
         * 
         * @param {FequencyClass} otherFreq
         * @returns {boolean}
         */
        const isEqual = otherFreq => isFrequency(otherFreq.getEntity(), otherFreq.getChannel())

        const serialize = () => ({
            entity: getEntity(),
            channel: getChannel(),
        })

        const importFromSerialized = (serialized) => {
            if (serialized && serialized.constructor === Object && serialized.entity && serialized.channel) {
                entityName = serialized.entity
                channelName = serialized.channel
            }
        }

        if (entityOrSerializedFrequency && !channel) {
            importFromSerialized(entityOrSerializedFrequency)
        } else if (entityOrSerializedFrequency && channel) {
            entityName = entityOrSerializedFrequency
            channelName = channel
        }

        /**
         * Reset the frequency information to the intital state
         */
        // const resetFrequency = () => {
        //     entityName = undefined
        //     channelName = undefined
        // }

        /**
         * Validates it the provided value is a string
         * 
         * @param {*} value Value to be validated
         * @returns {boolean}
         */
        // const validateStringType = value => value.constructor === String

        /**
         * Validates if the provided value is a valid entity name
         * 
         * @param {*} value 
         * @returns {boolean}
         */
        // const validateEntity = value => validateStringType(value)

        /**
         * Validates if the provided value is a valid channel name
         * 
         * @param {*} value 
         * @returns {boolean}
         */
        // const validateChannel = value => validateStringType(value)

        /**
         * Set the entity frequency name
         * 
         * @param {string} name Frequency Entity Name with format ENTITY.CHANNEL
         * @returns {boolean}
         */
        // const setEntity = (name) => {
        //     if (validateEntity(name)) {
        //         entityName = name
        //         return true
        //     }
        //     return false
        // }

        /**
         * Set the channel frequency name
         * 
         * @param {string} name Frequency Channel Name
         * @returns {boolean}
         */
        // const setChannel = (name) => {
        //     if (validateChannel(name)) {
        //         channelName = name
        //         return true
        //     }
        //     return false
        // }

        /**
         * Set the frequency information
         * 
         * @param {string} entity Entity Name
         * @param {string} channel Channel Name
         * @returns {boolean}
         */
        // const setFrequency = (entity, channel) => {
        //     if (validateEntity(entity) && validateChannel(channel)) {
        //         setEntity(entity)
        //         setChannel(channel)
        //         return true;
        //     }
        //     return false;
        // }

        /**
         * Set the frequency information based on a composed string
         * 
         * @param {string} name Frequency composed name
         * @returns {boolean}
         */
        // const setFrequencyFromString = name => {
        //     const {entity, channel} = frequencyClass.parseFrequency(name)
        //     if (entity !== false) {
        //         setFrequency(entity, channel)
        //         return true
        //     }
        //     return false
        // }

        /**
         * Parses the frequency information from a composed string
         * 
         * @param {string} name Composed frequency name
         * @returns {FrequencyEntity|false}
         */
        // const parseFrequency = name => {
        //     if (name.indexOf('.') > 0) {
        //         const {entity, channel} = name.split('.', 2)
        //         return {entity, channel}
        //     }
        //     return false
        // }
        
        /**** Privileged Methods *************************************************************************************/

        /**
         * Get the Entity name
         * 
         * @returns {string}
         */
        this.getEntity = () => getEntity()

        /**
         * Get the Channel name
         * 
         * @returns {string}
         */
        this.getChannel = () => getChannel()

        /**
         * Check if the Frequency Entity and Channel are the same as the provided ones
         * 
         * @param {string} entity
         * @param {string} channel
         * @returns {boolean}
         */
        this.is = (entity, channel) => isFrequency(entity, channel)

        /**
         * Check if the current Frequency is the same as the provided one
         * 
         * @param {FequencyClass} freq
         * @returns {boolean}
         */
        this.isEqual = freq => isEqual(freq)

        this.serialize = () => serialize()
    }

    /**** Prototype Methods ******************************************************************************************/

}

// export default frequencyClass
export const Frequency = frequencyClass
