'use strict'

import Values from './values'

const Queue = class QueueClass {

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
            // Make sure that we do not have the same key already stored
            while (queuedData.isSet(id)) {
                id = Date.now().toString()
            }
            queuedData.set(id, data)
            queue.push(id)
            return id
        }

        /**
         * Cancel a queued data, by removing it from the queue and from the data
         *
         * @param {number} id Queued Data identifier
         * @returns {boolean|null}
         */
        function cancel (id) {
            let pos = queue.indexOf(id)
            if (pos >= 0) {
                queue.splice(pos, 1)
                let result = queuedData.destroy(id)
                return (result !== null) ? result : true
            }
            return null
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

        /**
         * Gets the first in queue line and remove it from the list
         *
         * @returns {*|null} Value or null if not present
         */
        this.next = () => { return next() }

        /**
         * Adds a new data to the queue
         *
         * @param {*} data Any structure or simple type allowed
         * @returns {number}
         */
        this.add = (data) => { return add(data) }

        /**
         * Cancel a queued data, by removing it from the queue and from the data
         *
         * @param {number} id Queued Data identifier
         * @returns {boolean}
         */
        this.cancel = (id) => { return cancel(id) }

        /**
         * Gets the value of a specific id (if present)
         *
         * @param {number} id Queued Data identifier
         * @returns {*|null} Value or null if not present
         */
        this.get = (id) => { return get(id) }
    }

    /**** Prototype Methods ******************************************************************************************/
}

export default Queue
// module.exports = Queue
