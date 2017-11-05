'use strict'

import Values from './values.js'

const queue = class QueueClass {

    /**
     * Creates and initializes a Values object
     */
    constructor () {

        /**** Private Attributes *************************************************************************************/

        let queue = []
        let queuedData = new Values()

        /**** Private Methods ****************************************************************************************/

        /**
         * Gets the first in queue line and remove it from the list
         *
         * @returns {*|null} Value or null if not present
         */
        function next () {
            if (queue.length > 0) {
                let id = queue.shift()
                let data = get(id)
                queuedData.destroy(id)
                return data
            } else {
                return null
            }
        }

        /**
         * Adds a new data to the queue
         *
         * @param {*} data Any structure or simple type allowed
         * @returns {number}
         */
        function add (data) {
            let id = Date.now().toString()
            queuedData.set(id, data)
            queue.push(id)
            console.log(queue, queuedData.export())
            return id
        }

        /**
         * Cancel a queued data, by removing it from the queue and from the data
         *
         * @param {number} id Queued Data identifier
         * @returns {boolean}
         */
        function cancel (id) {
            if (queue.indexOf(id) >= 0) {
                let result = queuedData.destroy(id)
                return (result !== null) ? result : true
            }
            return true
        }

        /**
         * Gets the value of a specific id (if present)
         *
         * @param {number} id Queued Data identifier
         * @returns {*|null} Value or null if not present
         */
        function get (id) {
            return queuedData.get(id)
        }

        /**** Privileged Methods *************************************************************************************/

        this.next = () => { return next() }

        this.add = (data) => { return add(data) }

        this.cancel = (id) => { return cancel(id) }

        this.get = (id) => { return get(id) }
    }

    /**** Prototype Methods ******************************************************************************************/
}

module.exports = queue
