'use strict'
import { Frequency as FrequencyClass } from '../frequency'

const frequencyCollectionClass = class FequencyCollectionClass {

    constructor (serializedInfo) {

        /**** Private Attributes *************************************************************************************/

        // config = config || {}

        // const configuration = Object.assign({}, config)

        const collection = []

        /**** Private Methods ****************************************************************************************/

        /**
         * Add a frequency for the impulse to be sent
         * 
         * @param {frequencyClass} itemToBeAdded 
         * 
         * @returns {boolean}
         */
        const add = (itemToBeAdded) => {
            if (!has(itemToBeAdded)) {
                collection.push(itemToBeAdded)
                return true
            }
            return false
        }

        /**
         * Check if the provided item is already in the list
         * 
         * @param {frequencyClass} itemToSearch
         * 
         * @returns {boolean}
         */
        const has = itemToSearch => !!find(itemToSearch)

        /**
         * Search for the provided item in the list
         * 
         * @param {frequencyClass} frequencyToFind
         * 
         * @returns {frequencyClass}
         */
        const find = frequencyToFind => {
            return collection.find(frequency => {
                return frequency.getEntity() === frequencyToFind.getEntity() && frequency.getChannel() === frequencyToFind.getChannel()
            })
        }

        const count = () => {
            return collection.length
        }

        const each = (workingfunction) => collection.forEach(workingfunction)

        const importSerialized = (serialized) => {
            if (serialized && serialized.constructor === Array) {
                serialized.forEach(serializedFreq => {
                    add(new FrequencyClass(serializedFreq))
                })
            }
        }

        const serialize = () => {
            return collection.map(freq => freq.serialize())
        }

        importSerialized(serializedInfo)
        
        /**** Privileged Methods *************************************************************************************/

        this.add = (newItem) => add(newItem)
        this.has = (itemToSearch) => has(itemToSearch)
        // this.find = (itemToSearch) => find(itemToSearch)
        this.count = () => count()
        this.each = (workingfunction) => each(workingfunction)
        this.serialize = () => serialize()
    }

    /**** Prototype Methods ******************************************************************************************/

}

export default frequencyCollectionClass
