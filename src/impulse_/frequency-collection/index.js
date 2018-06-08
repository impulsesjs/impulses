'use strict'

import FrequencyClass from './frequency'

const frequencyCollectionClass = class FequencyColelctionClass {

    constructor (config) {

        /**** Private Attributes *************************************************************************************/

        const configuration = {
            find: undefined,
        }

        const collection = new Set()

        /**** Private Methods ****************************************************************************************/

        /**
         * Add a frequency for the impulse to be sent
         * 
         * @param {string} entityName 
         * @param {string} channelName 
         */
        const add = (itemToBeAdded) => {
            if (!has(itemToBeAdded)) {
                collection.push(itemToBeAdded)
            }
        }

        /**
         * Check if the provided item is already in the list
         * 
         * @param {*} itemToSearch
         * 
         * @returns {boolean}
         */
        const has = itemToSearch => !!find(itemToSearch)

        /**
         * Search for the provided item in the list
         * 
         * @param {*} itemToBeFound
         * 
         * @returns {*}
         */
        const find = itemToBeFound => {
            if (!configuration.find) {
                configuration.find = (item) => {
                    return JSON.stringify(item) === JSON.stringify(itemToBeFound)
                }
            }

            return collection.find(configuration.find)
        }
        
        /**** Privileged Methods *************************************************************************************/


    }

    /**** Prototype Methods ******************************************************************************************/

}

export default frequencyCollectionClass
