'use strict'

const optionsSubscribeClass = class OptionsSubscribeClass {
    /**
     * @constructor
     */
    constructor () {

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

        const hasContent = () => {
            return subscribedContent || 
                   (subscribedContent.constructor === Object && Object.keys(subscribedContent).length > 0)
        }

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
         */
        const get = () => subscribedContent

        /**** Privileged Methods *************************************************************************************/

        this.isSubscribed = () => isSubscribed()
        this.hasContent = () => hasContent()
        this.subscribe = (content) => subscribe(content)
        this.cancel = () => cancel()
        this.get = () => get()
    }

    /**** Prototype Methods ******************************************************************************************/

}

export default optionsSubscribeClass