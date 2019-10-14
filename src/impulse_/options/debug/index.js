'use strict'

const optionsDebugClass = class OptionsDebugClass {
    /**
     * @constructor
     */
    constructor () {

        /**** Private Attributes *************************************************************************************/

        let debug = false
        let debugContent = undefined

        /**** Private Methods ****************************************************************************************/

        const initContent = () => {
            debugContent = undefined
        }

        /**
         * Check if the current impulse will be debuged
         * 
         * @return {boolean}
         */
        const isSubscribed = () => {
            return !!debug
        }

        /**
         * Sets the debug Information
         * 
         * @param {Object} content 
         * @return {boolean}
         */
        const subscribe = (content) => {
            if (!isSubscribed() && content && content.constructor === Object) {
                debug = true
                debugContent = Object.assign({}, content)
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
            debug = false
            initContent()
            return true
        }

        /**
         * Gets the debug contents
         */
        const get = () => debugContent

        /**** Privileged Methods *************************************************************************************/

        this.isSubscribed = () => isSubscribed()
        this.subscribe = (content) => subscribe(content)
        this.cancel = () => cancel()
        this.get = () => get()
    }

    /**** Prototype Methods ******************************************************************************************/

}

export default optionsDebugClass