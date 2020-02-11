'use strict'

import { Md5 } from './md5'
import { Bus } from './bus'

const Api = class ApiClass {

    /**
     * Creates and initializes a bus Object
     *
     * @throws TypeError
     *
     * @param {Object} [configuration={}] Api configuration object
     * @param {Bus} [providedBus=null]   Bus object that will be considered public
     */
    constructor (configuration = {}, providedBus = null) {

        // Configuration Validation
        if (configuration.constructor !== Object) {
            throw TypeError('Configuration must be of type Object')
        }

        if (providedBus !== null && providedBus.constructor !== Bus) {
            throw TypeError('Public BUS Object is Invalid')
        }

        /**** Private Attributes *************************************************************************************/
        const listenersId = new Map();
        let bus = providedBus
        let id = undefined

        id = initId()
        /**** Private Methods ****************************************************************************************/

        function initId () {
            if (!id) {
                // TODO: Make the hash more unique 
                return (new Md5()).calculate(JSON.stringify(this) + ('' + Math.random() * 5000))
            }
            return id
        }

        /**
         * Gets the API id
         * 
         * @return {string}
         */
        function getId() {
            return id
        }

        /**
         * Check if a given bus is set
         *
         * @return {Boolean}     True if the bus is valid
         */
        function isBusSet() {
            return bus !== null
        }

        /**
         * Validates if a given object is a valid bus object
         *
         * @param  {Bus} busToCheck Object to be validated
         * @return {boolean} True if the bus is valid
         */
        function isBus(busToCheck) {
            return busToCheck.constructor === Bus
        }

        function setBus(busToSet) {
            if (isBus(busToSet)) {
                bus = busToSet
                // TODO: Need to reset any map related to the previous bus
            } else {
                throw TypeError('Expecting Bus type')
            }
        }

        /**
         * Verifies the minimum required structure for the Channel Configuration
         *
         * @param  {Object}  channelConfig Channel configuration object
         * @return {Boolean} True if valid
         */
        function isValidChannelConfig(channelConfig) {
            if (channelConfig.constructor === Object) {
                if (channelConfig.hasOwnProperty('entity')) {
                    if (channelConfig.hasOwnProperty('channels')
                        && channelConfig.channels.constructor === Array) {
                        return true
                    }
                }
            }
            return false
        }

        /*************************************************************/
        /** Channel Related ******************************************/
        /*************************************************************/

        /**
         * Gets channel object if exists
         * 
         * @param {String} entityName Entity Name
         * @param {String} channelName Channel Name
         * 
         * @returns {Channel|undefined}
         */
        function getChannel(entityName, channelName) {
            if (isBusSet()) {
                const channelObj = bus.get(entityName, channelName)
                if (channelObj !== null) {
                    return channelObj
                }
            }
            return undefined;
        }

        /**
         * Gets channel object by listener ID if exists
         * 
         * @param {String} entityName Entity Name
         * @param {String} channelName Channel Name
         * 
         * @returns {Channel|undefined}
         */
        function getChannelByListenerId(listenerId) {
            if (listenersId.has(listenerId)) {
                const { entity, channel } = listenersId.get(listenerId)
                return getChannel(entity, channel)
            }
            return undefined;
        }
        
        function getChannelStatus (entityName, channelName) {
            const channelObj = getChannel(entityName, channelName)
            return !!channelObj ? channelObj.getStatus() : undefined
        }

        function openChannel (entityName, channelName) {
            const channelObj = getChannel(entityName, channelName)
            return !!channelObj && channelObj.open()
        }

        function closeChannel (entityName, channelName) {
            const channelObj = getChannel(entityName, channelName)
            return !!channelObj && channelObj.close()
        }

        function holdChannel (entityName, channelName) {
            const channelObj = getChannel(entityName, channelName)
            return !!channelObj && channelObj.hold()
        }
        
        function resumeChannel (entityName, channelName) {
            const channelObj = getChannel(entityName, channelName)
            return !!channelObj && channelObj.resume()
        }
        
        function initChannels (channelConfig = {}) {
            if (isBusSet()) {
                if (isValidChannelConfig(channelConfig)) {
                    const channels = channelConfig.channels.map((channelInfo) => {
                        const res = {
                            entity: channelConfig.entity,
                            name: channelInfo.name,
                        }
                        if (typeof channelInfo.require !== 'undefined') {
                            res.require = channelInfo.require
                        }
                        if (typeof channelInfo.listenerInfo !== 'undefined') {
                            res.listener = channelInfo.listenerInfo
                            res.listener.id = getId()
                        }
                        return res
                    })
                    return bus.register(channels)
                } else {
                    throw TypeError('Invalid channel configuration')
                }
            } else {
                throw Error('Target BUS is not set')
            }
        }

        function sanitizeChannelListenerMap () {
            listenersId.forEach((value, id, map) => {
                if (!getChannelListenerInfo(id)) {
                    removeChannelListener(listenerId)
                }
            })
        }

        function addChannelListener (entity, channel, listenerInfo) {
            sanitizeChannelListenerMap()
            const channelObj = getChannel(entity, channel)
            let listenerId = false
            if (channelObj) {
                listenerId = channelObj.addListener(listenerInfo)
                if (listenerId) {
                    listenersId.set(listenerId, {entity, channel})
                }
            }
            return listenerId
        }

        function removeChannelListener (listenerId) {
            const channelObj = getChannelByListenerId(listenerId)
            if (channelObj) {
                channelObj.removeListener(listenerId)
            }
            listenersId.delete(listenerId)
        }

        function getChannelListenerInfo (listenerId) {
            const channelObj = getChannelByListenerId(listenerId)
            return !!channelObj ? channelObj.listenerInfo(listenerId) : null
        }

        function sendMessage (entity, channel, message) {
            sanitizeChannelListenerMap()
            const channelObj = getChannel(entity, channel)
            return !!channelObj && channelObj.send(message)
        }

        function sendAndListen (entityName, channelName, message, listenerInfo) {
            const channelObj = getChannel(entityName, channelName)
            return !!channelObj ? channelObj.sendAndListen(message, listenerInfo) : false
        }

        function getMessageInfo (entityName, channelName, messageId) {
            const channelObj = getChannel(entityName, channelName)
            return !!channelObj ? channelObj.messageInfo(messageId) : null
        }

        /**
         * Discover if a channel exists
         * 
         * @param {String} entityName Entity name
         * @param {String} cahnnelName Channel name
         * 
         * @return {ChannelClass|false} False if no Channel found
         */
        function discoverChannel (entityName, cahnnelName) {
            // TODO: Refactor - same as getChannel
            if (isBusSet()) {
                return bus.get(entityName, cahnnelName)
            }
            return false
        }        
        
        /**
         * Get the information for the reply
         *
         * @param  {Object} message Message
         * @return {Object|false} Entity and Channel information or false if none
         */
        function getReplyInformation (message) {
            if (typeof message.reply_stack !== 'undefined') {
                return message.reply_stack.pop()
            }
            return false
        }

        function reply (message, requestMessage) {
            const reply_to = getReplyInformation(requestMessage)
            if (reply_to !== false) {
                const channelFound = discoverChannel(reply_to.entity, reply_to.name)
                if (channelFound) {
                    message.reply = true
                    channelFound.send(message)
                    return true
                }
            }
            return false
        }

        /**** Privileged Methods *************************************************************************************/

        /**
         * Get the API id
         * 
         * @return {string} 
         */
        this.getId = () => getId()

        /*************************************************************/
        /** Bus Related **********************************************/
        /*************************************************************/

        /**
         * Checks if the BUS is defined
         *
         * @return {boolean} True if the public bus is set
         */
        this.hasBus = () => isBusSet()

        /**
         * Sets/Overrides the BUS
         *
         * @throws TypeError
         *
         * @param {Bus} busToSet BUS to be used as public
         */
        this.setBus = (bus) => setBus(bus)
        
        /*************************************************************/
        /** Channel Related ******************************************/
        /*************************************************************/
        
        /**
         * Get a specific channel status
         * 
         * @param {String} entityName Entity Name
         * @param {String} channelName Channel Name
         * 
         * @returns {Number} 
         */
        this.getChannelStatus = (entityName, channelName) => getChannelStatus(entityName, channelName)
        /**
         * Open the channel activity (if not active)
         * 
         * @param {String} entityName Entity Name
         * @param {String} channelName Channel Name
         * 
         * @returns {Boolean}
         */
        this.openChannel = (entityName, channelName) => openChannel(entityName, channelName)

        /**
         * Close the channel activity (if open)
         * 
         * @param {String} entityName Entity Name
         * @param {String} channelName Channel Name
         * 
         * @returns {Boolean}
         */
        this.closeChannel = (entityName, channelName) => closeChannel(entityName, channelName)

        /**
         * Freezes the channel activity (if active)
         * 
         * @param {String} entityName Entity Name
         * @param {String} channelName Channel Name
         * 
         * @returns {Boolean}
         */
        this.holdChannel = (entityName, channelName) => holdChannel(entityName, channelName)

        /**
         * Resume the channel activity (if on hold)
         * 
         * @param {String} entityName Entity Name
         * @param {String} channelName Channel Name
         * 
         * @returns {Boolean}
         */
        this.resumeChannel = (entityName, channelName) => resumeChannel(entityName, channelName)
        
        /**
         * Bulk channel initialization
         *
         * @throws Error, TypeError
         *
         * @param  {Object} [channelConfig={}] Channel Configuration Object
         * @returns {String[]} Array with registered channels (check bus.register)
         */
        this.initChannels = (channelConfig) => initChannels(channelConfig)
        
        /**
         * Adds a listener to a specific channel
         * 
         * @param {String} entity 
         * @param {String} channel 
         * @param {{id: Number, listener: Function}} listener 
         * 
         * @returns {String|false}
         */
        this.addListener = (entityName, channelName, listener) => addChannelListener(entityName, channelName, listener)
        
        /**
         * Remove a listener
         *
         * @param {String} listenerId listener ID
         */
        this.removeListener = (listenerId) => removeChannelListener(listenerId)

        /**
         * Gets a listener information for the provided ID
         *
         * @param {String} listenerId listener ID
         * @returns {Object|null}
         */
        this.getListenerInfo = (listenerId) => getChannelListenerInfo(listenerId)

        /**
         * Discover if a channel exists
         * 
         * @param {String} entityName Entity name
         * @param {String} cahnnelName Channel name
         * 
         * @return {ChannelClass|false} False if no Channel found
         */
        this.exists = (entityName, channelName) => !!discoverChannel(entityName, channelName)
        
        /**
         * Send a message to the BUS
         *
         * @param {String} entityName  Entity name
         * @param {String} channelName Channel name
         * @param {Object} message Message to be sent
         *
         * @return {int|false} Registered Message ID or False
         */ 
        this.send = (entityName, channelName, message) => sendMessage(entityName, channelName, message)

        /**
         * Sends a message to the channel and makes the listener hear
         *
         * @param {String} entityName  Entity name
         * @param {String} channelName Channel name
         * @param {Object} message
         * @param {Object} listenerInfo
         *
         * @return {String|false} listenerId
         */
        this.sendAndListen = (entityName, channelName, message, listenerInfo) => sendAndListen(entityName, channelName, message, listenerInfo)

        /**
         * Gets a message information for a specific ID
         * 
         * @param {String} entityName  Entity name
         * @param {String} channelName Channel name
         * @param {String} messageId
         * 
         * @returns {Object|null} Message Information Object or null if not found
         */
        this.getMessageInfo = (entityName, channelName, messageId) => getMessageInfo(entityName, channelName, messageId)

        /**
         * Reply to a given message
         * 
         * TODO: need to make the reply for a specific message ID.
         *
         * @param {Object} message Message to be sent in the reply
         * @param {Object} requestMessage Message to reply
         * @return {boolean} True if replied successfully
         */
        this.reply = (message, requestMessage) => reply(message, requestMessage)
    }

    /**** Prototype Methods ******************************************************************************************/
}

export { Api }
