'use strict'

import Md5 from './md5'
import Bus from './bus'

const api = class ApiClass {

    /**
     * Creates and initializes a bus Object
     *
     * @throws TypeError
     *
     * @param {Object} [configuration={}] Api configuration object
     * @param {Bus} [publicBus=null]   Bus object that will be considered public
     * @param {Bus} [pirvateBus=null]  Bus object that will be considered private
     */
    constructor (configuration = {}, publicBus = null, privateBus = null) {

        // Configuration Validation
        if (configuration.constructor !== Object) {
            throw TypeError('Configuration must be of type Object')
        }

        if (publicBus !== null && publicBus.constructor !== Bus) {
            throw TypeError('Public BUS Object is Invalid')
        }

        if (privateBus !== null && privateBus.constructor !== Bus) {
            throw TypeError('Private BUS Object is Invalid')
        }

        /**** Private Attributes *************************************************************************************/

        let apiInfo = configuration
        let pubBus = publicBus
        let privBus = privateBus
        let id = initId()

        /**** Private Methods ****************************************************************************************/

        function initId() {
            if (!id) {
                return (new Md5()).calculate(JSON.stringify(this) + ('' + Math.random() * 5000))
            }
            return id
        }

        function getId() {
            return id
        }

        /**
         * Check if a given bus is set
         *
         * @param  {Bus} bus Bus object to be verified
         * @return {Boolean}     True if the bus is valid
         */
        function isBusSet(bus) {
            return bus !== null
        }

        /**
         * Checks if the public BUS is defined
         *
         * @return {boolean} True if the public bus is set
         */
         function existPublic() {
             return isBusSet(pubBus)
         }

         /**
          * Checks if the private BUS is defined
          *
          * @return {boolean} True if the private bus is set
          */
         function existPrivate() {
             return isBusSet(privBus)
         }

         /**
          * Validates if a given object is a valid bus object
          *
          * @param  {Bus} bus Object to be validated
          * @return {boolean} True if the bus is valid
          */
         function isBus(bus) {
            return bus.constructor === Bus
         }

        /**
         * Sets the public BUS
         *
         * @throws TypeError
         *
         * @param {Bus} publicBus BUS to be used as public
         */
        function setPublicBus(publicBus) {
            if (isBus(publicBus)) {
                pubBus = publicBus
            } else {
                throw TypeError('Expecting Bus type')
            }
        }

        /**
         * Sets the private BUS
         *
         * @throws TypeError
         *
         * @param {Bus} privateBus BUS to be used as private
         */
        function setPrivateBus(privateBus) {
            if (isBus(privateBus)) {
                privBus = privateBus
            } else {
                throw TypeError('Expecting Bus type')
            }
        }

        /**
         * Verifies the minimum required structure for the Channel Configuration
         *
         * @param  {Object}  channelConfig Channel configuration object
         * @return {Boolean}               True if valid
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

        /**
         * [registerChannels description]
         *
         * @throws Error, TypeError
         *
         * @param  {Bus} targetBus         Target Bus Object
         * @param  {Object} [channelConfig={}] Channel Configuration Object
         * @return {String[]}                  Array with registered channels (check bus.register)
         */
        function registerChannels(targetBus, channelConfig = {}) {
            if (isBusSet(targetBus)) {
                if (isValidChannelConfig(channelConfig)) {
                    let channels = channelConfig.channels.map((channelInfo) => {
                        // TODO: Need to validate the Channel Config
                        let res = {
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
                    return targetBus.register(channels)
                } else {
                    throw TypeError('Invalid channel configuration')
                }
            } else {
                throw Error('Target BUS is not set')
            }
        }

        /**
         * Send a message to a given BUS
         *
         * @param  {String} entity  Entity name
         * @param  {String} channel Channel name
         * @param  {Object} message Message to be sent
         * @param  {Bus} bus     Bus to be used
         *
         * @return {int|false}      Registered Id or False
         */
        function sendMessage(entity, channel, message, bus) {
            /** @type {Bus} */
            let targetBus = bus || pubBus

            if (isBusSet(targetBus)) {
                let channelObj = targetBus.get(entity, channel)
                if (channelObj !== null) {
                    return channelObj.send(message)
                }
            }

            return false
        }

        /**
         * Get the information for the reply
         *
         * @param  {Object} message   Message
         * @return {Object|false}     Entity and Channel information or false if none
         */
        function getReplyInformation(message) {
            if (typeof message.reply_stack !== 'undefined') {
                return message.reply_stack.pop()
            }
            return false
        }

        /**
         * Discovers the Channel in the correct BUS
         *
         * @param  {String} entity  Entity name
         * @param  {String} name Channel name
         *
         * @return {ChannelClass|false}  False if no Channel found
         */
        function discoverChannel(entity, name) {
            let channel_obj = false

            if (channel_obj === false && existPublic()) {
                channel_obj = pubBus.get(entity, name)
            }

            if (channel_obj === false && existPrivate()) {
                channel_obj = privBus.get(entity, name)
            }

            return channel_obj
        }

        /**
         * Reply to a given message
         *
         * @param  {Object} message        Message to be sent in the reply
         * @param  {Object} requestMessage Message to reply
         * @return {[type]}                [description]
         */
        function reply(message, requestMessage) {
            let reply_to = getReplyInformation(requestMessage)
            if (reply_to !== false) {
                let channel_found = discoverChannel(reply_to.entity, reply_to.name)
                if (channel_found !== false) {
                    message.reply = true
                    channel_found.send(message)
                    return true
                }
            }
            return false
        }

        /**** Privileged Methods *************************************************************************************/

        this.getId = () => getId()

        /**
         * Checks if the public BUS is defined
         *
         * @return {boolean} True if the public bus is set
         */
        this.existPublic = () => existPublic()

        /**
         * Checks if the private BUS is defined
         *
         * @return {boolean} True if the public bus is set
         */
        this.existPrivate = () => existPrivate()

        /**
         * Sets the public BUS
         *
         * @throws TypeError
         *
         * @param {Bus} publicBus BUS to be used as public
         */
        this.setPublicBus = (publicBus) => setPublicBus(publicBus)

        /**
         * Sets the private BUS
         *
         * @throws TypeError
         *
         * @param {Bus} privateBus BUS to be used as public
         */
        this.setPrivateBus = (privateBus) => setPrivateBus(privateBus)

        /**
         * Register channels in the public BUS
         *
         * @throws Error, TypeError
         *
         * @param  {Object} channelConfig Channel Configuration
         * @return {String[]}             Array with registered channels (check bus.register)
         */
        this.registerPublic = (channelConfig) => registerChannels(pubBus, channelConfig)

        /**
         * Register channels in the private BUS
         *
         * @throws Error, TypeError
         *
         * @param  {Object} channelConfig Channel Configuration
         * @return {String[]}             Array with registered channels (check bus.register)
         */
        this.registerPrivate = (channelConfig) => registerChannels(privBus, channelConfig)

        /**
         * Send a message to the public BUS
         *
         * @param  {String} entity  Entity name
         * @param  {String} channel Channel name
         * @param  {Object} message Message to be sent
         *
         * @return {int|false}      Registered Id or False
         */
        this.sendPublic = (entity, channel, message) => sendMessage(entity, channel, message, pubBus)

        /**
         * Send a message to the private BUS
         *
         * @param  {String} entity  Entity name
         * @param  {String} channel Channel name
         * @param  {Object} message Message to be sent
         *
         * @return {int|false}      Registered Id or False
         */
        this.sendPrivate = (entity, channel, message) => sendMessage(entity, channel, message, privBus)

        this.reply = (message, requestMessage) => reply(message, requestMessage)
    }

    /**** Prototype Methods ******************************************************************************************/
}

export default api
