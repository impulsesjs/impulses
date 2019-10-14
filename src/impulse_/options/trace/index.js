'use strict'

const optionsTraceClass = class OptionsTraceClass {
    /**
     * @constructor
     */
    constructor () {

        /**** Private Attributes *************************************************************************************/

        let trace = false
        let traceContent = undefined

        /**** Private Methods ****************************************************************************************/

        const initContent = () => {
            traceContent = undefined
        }

        /**
         * Check if the current impulse will be traced
         * 
         * @return {boolean}
         */
        const isSubscribed = () => {
            return !!trace
        }

        /**
         * Sets the trace Information
         * 
         * @param {Object} content 
         * @return {boolean}
         */
        const subscribe = (content) => {
            if (!isSubscribed() && content && content.constructor === Object) {
                trace = true
                traceContent = Object.assign({}, content)
                return true
            }
            return false
        }

        /**
         * Removes the trace flag and content
         */
        const cancel = () => {
            if (!isSubscribed()) {
                return false
            }
            trace = false
            initContent()
            return true
        }

        /**
         * Gets the trace contents
         */
        const get = () => traceContent

        /**** Privileged Methods *************************************************************************************/

        this.isSubscribed = () => isSubscribed()
        this.subscribe = (content) => subscribe(content)
        this.cancel = () => cancel()
        this.get = () => get()
    }

    /**** Prototype Methods ******************************************************************************************/

}

export default optionsTraceClass