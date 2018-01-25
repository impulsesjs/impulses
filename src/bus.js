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

        /**
         * Validates if an object is as channel info definition
         *
         * @param {ChannelInfo} channelInfo
         * @returns {boolean}
         */
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
            return (typeof channelInfo.require === 'undefined' || channelInfo.require.constructor === Array);


        }

        /**
         * Register channel(s) into the bus allowing the discovery by entity and by channel name
         *
         * @param {ChannelInfo[]} channels
         * @returns {String[]} List of the registered channels (entity.name)
         */
        function register (channels) {
            let registeredChannels = []
            if (channels.constructor !== Array) {
                channels = [channels]
            }

            let idx = 0,
                amount = channels.length

            for (; idx < amount; idx++) {
                if (isValidChannelInformation(channels[idx])) {
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
                        registeredChannels.push(`${entity}.${name}`)
                    }
                }
            }

            return registeredChannels
        }

        /**
         * Check if a entity channel list and / or a specific channel exists
         *
         * @param {string} entity Entity name to search for
         * @param {string|null} channelName Channel name to search for
         * @returns {boolean}
         */
        function exists (entity, channelName) {
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
                if (typeof channelsInfo[entity][channelName] !== 'undefined') {
                    return channelsInfo[entity][channelName].channel
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
