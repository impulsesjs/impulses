'use strict'

import Queue from './queue'
// import MD5 from './md5'
import md5 from 'md5'

// TODO: need this to be WebWorker Working
const channel = class ChannelClass {

    /**
     * Creates and initializes a Channel Object
     */
    constructor (channelName, initOnHold = false) {

        /**** Private Attributes *************************************************************************************/

        const CLOSED_STATUS = 0
        const OPEN_STATUS = 1
        const ON_HOLD_STATUS = 2

        let processingQueue = false
        let name = channelName
        let statusOpen = true
        let statusHold = initOnHold || false
        let hookList = []
        let listenerQ = new Queue()
        let messageQ = new Queue()

        /**** Private Methods ****************************************************************************************/

        /**
         * Get the channel name
         *
         * @returns {string}
         */
        function getName () {
            return name
        }

        function isProcessingQueue() {
            return processingQueue
        }

        /**
         * Check if the channel is open
         *
         * @returns {boolean}
         */
        function isOpen () {
            return statusOpen
        }

        /**
         * Check if the channel is on hold
         *
         * @returns {boolean}
         */
        function isOnHold () {
            return statusOpen && statusHold
        }

        /**
         * Check if the channel is active
         *
         * @returns {boolean}
         */
        function isActive () {
            return statusOpen && !statusHold
        }

        function startQueueProcessing() {
            while (isProcessingQueue()) {}
            processingQueue = true
        }

        function endQueueProcessing() {
            processingQueue = false
        }

        /**
         * Change the channel status and start processing if it is not on hold
         */
        function start() {
            if (!isOnHold()) {
                startQueueProcess()
            }
        }

        /**
         * Open the channel activity (if not active)
         *
         * @returns {boolean}
         */
        function open () {
            if (!isActive()) {
                statusOpen = true
                statusHold = false
                startQueueProcess()
                return true
            }
            return false
        }

        /**
         * Closes the channel activity (if open)
         *
         * @returns {boolean}
         */
        function close () {
            if (isOpen()) {
                statusOpen = false
                return true
            }
            return false
        }

        /**
         * Freezes the channel activity (if active)
         *
         * @returns {boolean}
         */
        function hold () {
            if (isActive()) {
                statusHold = true
                return true
            }
            return false
        }

        /**
         * Resume the channel activity (if on hold)
         *
         * @returns {boolean}
         */
        function resume () {
            if (isOnHold()) {
                statusHold = false
                startQueueProcess()
                return true
            }
            return false
        }

        /**
         * Get the channel status
         *
         * @returns {number}
         */
        function getStatus () {
            if (!isOpen()) {
                return CLOSED_STATUS
            }

            if (isOnHold()) {
                return ON_HOLD_STATUS
            }

            return OPEN_STATUS
        }

        /**
         * Add a listener to the channel
         *
         * @param {object} listenerInfo
         */
        function addListener (listenerInfo) {
            return listenerQ.add(listenerInfo)
        }

        /**
         * Remove a listener from the channel
         *
         * @param {string} id listener ID
         */
        function removeListener (id) {
            listenerQ.cancel(id)
            cancelHook(id)
        }

        /**
         * Cancel a hook from the active hook list
         *
         * @param {string} id listener ID
         */
        function cancelHook (id) {
            try {
                for (let idx = 0; idx < hookList.length; idx++) {
                    if (hookList[idx].qid === id) {
                        hookList.splice(idx, 1)
                        break
                    }
                }
            }
            catch (e) {
                // something went wrong probably list length change due to cancellation / activity
            }
        }

        /**
         * Gets a listener information for the provided ID
         *
         * @param {string} id listener ID
         * @returns {*}
         */
        function getListenerInfo (id) {
            startQueueProcessing()
            let toReturn = listenerQ.get(id)
            endQueueProcessing()
            if (toReturn === null) {
                try {
                    for (let idx = 0; idx < hookList.length; idx++) {
                        if (hookList[idx].qid === id) {
                            toReturn = hookList[idx].data
                        }
                    }
                }
                catch (e) {
                    // something went wrong probably list length change due to cancellation / activity
                }
            } else {
                toReturn = toReturn.data
            }

            return toReturn
        }

        /**
         * Processes a message and send it to all registered hook
         *
         * @param {object} message
         */
        function processMessage (message) {
            try {
                let idx = 0;
                let length = hookList.length
                for (; idx < length; idx++) {
                    if (typeof hookList[idx].data.listener !== 'undefined') {

                        hookList[idx].data.listener(message)
                        if (hookList[idx].data.times > 0) {
                            hookList[idx].data.times--
                        }

                        if (hookList[idx].data.times < 1) {
                            hookList.splice(idx, 1)
                            idx--
                        }
                    }
                }
            }
            catch (e) {
                // something went wrong probably list length change due to cancellation / activity
            }
        }

        /**
         * Send a messagr to the channel
         *
         * @param {object} message
         */
        function send (message) {
            return messageQ.add(message)
        }

        /**
         * Sends a message to the channel and makes the listener hear
         *
         * @param {object} message
         * @param {object} listenerInfo
         */
        function sendAndListen (message, listenerInfo) {
            addListener(listenerInfo)
            send(message)
        }

        /**
         * Get a message information for the provided id
         *
         * @param {string} id Message ID
         */
        function getMessageInfo (id) {
            return messageQ.get(id)
        }

        /**
         * Starts the queue process so we can deal with the pending in the queues
         */
        function startQueueProcess() {
            if (isActive()) {
                processListenersQueue()
                processMessagesQueue()
                setTimeout(startQueueProcess, 0)
            }
        }

        /**
         * Processes the listener queue
         */
        function processListenersQueue() {
            if (!isProcessingQueue()) {
                startQueueProcessing()
                let hash = null
                let listenerInfo = listenerQ.next()
                while (listenerInfo !== null) {
                    hash = md5(listenerInfo.toString())
                    let item = {id: hash, qid: listenerInfo.id, data: listenerInfo.data}
                    hookList.push(item)
                    listenerInfo = listenerQ.next()
                }
                endQueueProcessing()
            }
        }

        /**
         * Proceoo the message queue
         */
        function processMessagesQueue() {
            let message = messageQ.next()
            while (message !== null) {
                processMessage(message.data)
                message = messageQ.next()
            }
        }

        // initializes the state
        start()

        /**** Privileged Methods *************************************************************************************/

        this.getName = function () { return getName() }

        this.getStatus = function () { return getStatus() }

        this.open = function () { return open() }

        this.close = function () { return close() }

        this.hold = function () { return hold() }

        this.resume = function () { return resume() }

        this.addListener = function (listenerInfo) { return addListener(listenerInfo) }

        this.removeListener = function (id) { return removeListener(id) }

        this.listenerInfo = function (id) { return getListenerInfo(id) }

        this.send = function (message) { return send(message) }

        this.sendAndListen = function (message, listenerInfo) { return sendAndListen(message, listenerInfo) }

        this.messageInfo = function (id) { return getMessageInfo(id) }

    }

    /**** Prototype Methods ******************************************************************************************/
}

export default channel
