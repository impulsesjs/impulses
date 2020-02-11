'use strict'

import { Values } from './values'

const Queue = class QueueClass {

    /**
     * Creates and initializes a Values object
     * @constructor
     */
    constructor () {

        /**** Private Attributes *************************************************************************************/

        let queue = []
        let queuedData = new Values()
        let lock = false

        /**** Private Methods ****************************************************************************************/

        /**
         * Check if there is a lock for the queue
         *
         * @returns {boolean}
         */
        function isLocked() {
            return lock
        }

        /**
         * Lock the queue for doing operations
         */
        function getLock() {
            while (isLocked()) {}
            lock = true
        }

        /**
         * Release the lock
         */
        function releaseLock() {
            lock = false
        }

        /**
         * Gets the first in queue line and remove it from the list
         *
         * @returns {*|null} Value or null if not present
         */
        function next () {
            if (queue.length > 0) {
                getLock()
                const id = queue.shift()
                const data = get(id)
                queuedData.destroy(id)
                releaseLock()
                return data
            } else {
                return null
            }
        }

        /**
         * Adds a new data to the queue
         *
         * @param {*} data Any structure or simple type allowed
         * @returns {string}
         */
        function add (data) {
            getLock()
            let id = Date.now().toString()
            // Make sure that we do not have the same key already stored
            while (queuedData.isSet(id)) {
                id = Date.now().toString()
            }
            queuedData.set(id, { id: id, data: data })
            queue.push(id)
            releaseLock()
            return id
        }

        /**
         * Cancel a queued data, by removing it from the queue and from the data
         *
         * @param {string} id Queued Data identifier
         * @returns {boolean|null}
         */
        function cancel (id) {
            const pos = queue.indexOf(id)
            if (pos >= 0) {
                getLock()
                queue.splice(pos, 1)
                const result = queuedData.destroy(id)
                releaseLock()
                return (result !== null) ? result : true
            }
            return null
        }

        /**
         * Gets the value of a specific id (if present)
         *
         * @param {string} id Queued Data identifier
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
        this.next = () => next()

        /**
         * Adds a new data to the queue
         *
         * @param {*} data Any structure or simple type allowed
         * @returns {string}
         */
        this.add = (data) => add(data)

        /**
         * Cancel a queued data, by removing it from the queue and from the data
         *
         * @param {string} id Queued Data identifier
         * @returns {boolean}
         */
        this.cancel = (id) => cancel(id)

        /**
         * Gets the value of a specific id (if present)
         *
         * @param {string} id Queued Data identifier
         * @returns {*|null} Value or null if not present
         */
        this.get = (id) => get(id)

        /**** Test Area **********************************************************************************************/

        if (process.env.NODE_ENV === 'test') {
            // Allow unit test mocking
            this.__test__ = {
                queuedData: queuedData,
                queue: queue,
            }
        }

    }

    /**** Prototype Methods ******************************************************************************************/
}

export { Queue }
