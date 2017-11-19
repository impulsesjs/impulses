'use strict'

import Channel from './channel'

/**
 * @typedef {object} ChannelInfo
 * @property {string} name Channel name
 * @property {string} entity Responsible entity
 * @property {object} require Required fields
 * @property {ChannelClass} channel Channel reference
 *
 * @typedef {ChannelInfo[]} ChannelsInfo
 */

const CommBus = class CommBusClass {

    /**
     * Creates and initializes a Channel Object
     */
    constructor () {

        /**** Private Attributes *************************************************************************************/

        let channelsInfo = {}

        /**** Private Methods ****************************************************************************************/

        function isValidChannelInformation (channelInfo) {
            /* attribute entity registers tha responsible entity*/
            if (typeof channelInfo.entity === 'undefined' ) {
                return false
            }

            /* attribute name must exist and represent the channel name */
            if (typeof channelInfo.name === 'undefined' ) {
                return false
            }

            /* require field must be an string array with the required attributes expressed as a string */
            if (typeof channelInfo.require === 'undefined' || channelInfo.require.constructor !== Array) {
                return false
            }

            return true
        }

        /**
         * Register channel(s) into the bus allowing the discovery by entity and by channel name
         *
         * @param {ChannelsInfo} channels
         */
        function register (channels = []) {
            if (channels.constructor === Array) {
                let idx = 0,
                    amount = channels.length
                for (; idx < amount; idx++) {
                    if (isValidChannelInformation(channels[idx])) {
                        /** @type {ChannelInfo} channelInfo */
                        let channelInfo = Object.assign({}, channels[idx])
                        let entity = channelInfo.entity
                        let name = channelInfo.name
                        delete channelInfo.entity
                        delete channelInfo.name
                        channelInfo.channel = new Channel(name)

                        if (typeof channelsInfo[entity] === 'undefined') {
                            channelsInfo[entity] = {}
                        }

                        if (typeof channelsInfo[entity][name] === 'undefined') {
                            channelsInfo[entity][name] = channelInfo
                        }
                    }
                }
            }
        }

        /**
         * Check if a entity channel list and / or a specific channel exists
         *
         * @param {string} entity Entity name to search for
         * @param {string|null} channelName Channel name to search for
         * @returns {boolean}
         */
        function exists (entity, channelName = null) {
            if (typeof channelsInfo[entity] !== 'undefined') {
                if (channelName !== null) {
                    return get(entity, channelName) !== null
                } else {
                    return true
                }
            }
            return false
        }

        /**
         * Get a channel to work with
         *
         * @param {string} entity Entity name to search for
         * @param {string=} channelName Channel name to search for
         * @returns {ChannelClass|null}
         */
        function get (entity, channelName) {
            if (typeof channelsInfo[entity] !== 'undefined') {
                let idx = 0
                for (; idx < channelsInfo[entity].length; idx++) {
                    if (channelsInfo[entity][idx].name === channelName) {
                        return channelsInfo[entity][idx].channel
                    }
                }
            }
            return null
        }

        /**** Privileged Methods *************************************************************************************/

        /**
         * Register channel(s) into the bus allowing the discovery by entity and by channel name
         *
         * @param {ChannelsInfo} channelsInfo
         */
        this.register = function (channelsInfo = []) { return register(channelsInfo) }

        /**
         * Check if a entity channel list and / or a specific channel exists
         *
         * @param {string} entity Entity name to search for
         * @param {string|null} channelName Channel name to search for
         * @returns {boolean}
         */
        this.exists = function (entity, channelName = null) { return exists(entity, channelName) }

        /**
         * Get a channel to work with
         *
         * @param {string} entity Entity name to search for
         * @param {string=} channelName Channel name to search for
         * @returns {ChannelClass|null}
         */
        this.get = function (entity, channelName) { return get (entity, channelName) }
    }

    /**** Prototype Methods ******************************************************************************************/
}

export default CommBus
