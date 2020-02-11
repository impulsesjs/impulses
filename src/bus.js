'use strict'

import { Channel } from './channel'

/**
 * @typedef {object} ChannelInfo
 * @property {string} name Channel name
 * @property {string} entity Responsible entity
 * @property {object} require Required fields
 * @property {ChannelClass} channel Channel reference
 *
 * @typedef {ChannelInfo[]} ChannelsInfo
 */

const Bus = class CommBusClass {

    /**
     * Creates and initializes a Channel Object
     */
    constructor () {

        /**** Private Attributes *************************************************************************************/

        const channelsInfo = {}

        /**** Private Methods ****************************************************************************************/

        /**
         * Validates if an object is as channel info definition
         *
         * @param {ChannelInfo} channelInfo
         * @returns {boolean}
         */
        function isValidChannelInformation(channelInfo) {

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
        function register(channels) {
            const registeredChannels = []
            if (channels.constructor !== Array) {
                channels = [channels]
            }

            channels.forEach((channel) => {
                if (isValidChannelInformation(channel)) {
                    const channelInfo = Object.assign({}, channel)
                    const entity = channelInfo.entity
                    const name = channelInfo.name
                    delete channelInfo.entity
                    delete channelInfo.name
                    channelInfo.channel = new Channel(entity, name)
                    if (typeof channelInfo.listener !== 'undefined') {
                        channelInfo.channel.addListener(channelInfo.listener)
                    }

                    if (!channelsInfo.hasOwnProperty(entity)) {
                        Reflect.set(channelsInfo, entity, {})
                    }
                    const entityObj = Reflect.getOwnPropertyDescriptor(channelsInfo, entity).value
                    if (!entityObj.hasOwnProperty(name)) {
                        Reflect.set(entityObj, name, channelInfo)
                        registeredChannels.push(`${entity}.${name}`)
                    }
                }
            })

            return registeredChannels
        }

        /**
         * Check if a entity channel list and / or a specific channel exists
         *
         * @param {string} entity Entity name to search for
         * @param {string|null} channelName Channel name to search for
         * @returns {boolean}
         */
        function exists(entity, channelName) {
            if (channelsInfo.hasOwnProperty(entity)) {
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
        function get(entity, channelName) {
            if (channelsInfo.hasOwnProperty(entity)) {
                const entityInfo = Reflect.getOwnPropertyDescriptor(channelsInfo, entity).value
                if (entityInfo.hasOwnProperty(channelName)) {
                    return Reflect.getOwnPropertyDescriptor(entityInfo, channelName).value.channel
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
        this.register = (channelsInfo = []) => register(channelsInfo)

        /**
         * Check if a entity channel list and / or a specific channel exists
         *
         * @param {string} entity Entity name to search for
         * @param {string|null} channelName Channel name to search for
         * 
         * @returns {boolean}
         */
        this.exists = (entity, channelName = null) => exists(entity, channelName)

        /**
         * Get a channel to work with
         *
         * @param {string} entity Entity name to search for
         * @param {string=} channelName Channel name to search for
         * @returns {ChannelClass|null}
         */
        this.get = (entity, channelName) => get(entity, channelName)

        /**** Test Area **********************************************************************************************/

        if (process.env.NODE_ENV === 'test') {
            // Allow unit test mocking
            this.__test__ = {
                channelsInfo: channelsInfo,
            }
        }

    }

    /**** Prototype Methods ******************************************************************************************/
}

export { Bus }
