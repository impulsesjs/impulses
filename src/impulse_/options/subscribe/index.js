'use strict'

const optionsSubscribeClass = class OptionsSubscribeClass {
    /**
     * @constructor
     */
    constructor (serializedObject) {

        /**** Private Attributes *************************************************************************************/

        let subscribed = false
        let subscribedContent = undefined

        /**** Private Methods ****************************************************************************************/

        const initContent = () => {
            subscribedContent = undefined
        }

        /**
         * Check if the current impulse will be debuged
         * 
         * @return {boolean}
         */
        const isSubscribed = () => {
            return !!subscribed
        }

        const isContentValid = content => {
            return !!content && content.constructor === Object && Object.keys(content).length > 0
        }

        const hasContent = () => isContentValid(subscribedContent)

        /**
         * Sets the debug Information
         * 
         * @param {Object} content 
         * @return {boolean}
         */
        const subscribe = (content) => {
            if (!isSubscribed() && content && content.constructor === Object) {
                subscribed = true
                subscribedContent = Object.assign({}, content)
                return true
            }
            return false
        }

        /**
         * Removes the debug flag and content
         */
        const cancel = () => {
            if (!isSubscribed()) {
                return false
            }
            subscribed = false
            initContent()
            return true
        }

        /**
         * Gets the debug contents
         * 
         * @return {object|undefined}
         */
        const get = () => {
            if (subscribedContent && subscribedContent.constructor === Object) {
                return Object.assign({}, subscribedContent)
            }
            return undefined
        }

        const serialize = () => Object.assign({}, {
            subscribed, subscribed, 
            content: get(),
        })

        const importFromSerialized = serialized => {
            if (serialized && serialized.constructor === Object && serialized.subscribed && serialized.content && isContentValid(serialized.content)) {
                subscribed = serialized.subscribed
                subscribedContent = serialized.content
            }
        }

        importFromSerialized(serializedObject)

        /**** Privileged Methods *************************************************************************************/

        this.isSubscribed = () => isSubscribed()
        this.hasContent = () => hasContent()
        this.subscribe = (content) => subscribe(content)
        this.cancel = () => cancel()
        this.get = () => get()
        this.serialize = () => serialize()
    }

    /**** Prototype Methods ******************************************************************************************/

}

export default optionsSubscribeClass