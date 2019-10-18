'use strict'

const contentClass = class ContentClass {

    constructor (initialContent) {

        /**** Private Attributes *************************************************************************************/

        let content = {}

        /**** Private Methods ****************************************************************************************/

        /**
         * Check if the content is in a valid format
         * 
         * @param {*} contentObj 
         * @return {boolean}
         */
        const isValid = (contentObj) => (contentObj && contentObj.constructor === Object)

        /**
         * Clears all content
         */
        // const clear = () => {
        //     content = {}
        // }

        /**
         * Add extra content or replace with new content
         * 
         * @param {Object} contentObj 
         * @return {boolean}
         */
        const add = (contentObj) => {
            if (isValid(contentObj)) {
                content = Object.assign(content, contentObj)
                return true
            }
            return false
        }

        /**
         * Sets the new content (destroys previous content)
         * 
         * @param {Object} contentObj 
         * @return {boolean}
         */
        const set = (contentObj) => {
            if (isValid(contentObj)) {
                // clear()
                content = Object.assign({}, contentObj)
                return true
            }
            return false
        }

        /**
         * Get the copy of the current content
         * 
         * @return {object}
         */
        const get = () => {
            return Object.assign({}, content)
        }

        set(initialContent)

        /**** Privileged Methods *************************************************************************************/

        // this.clear = () => clear()
        this.set = (contentInfo) => set(contentInfo)
        this.add = (contentInfo) => add(contentInfo)
        this.get = () => get()

        /**** Test Area **********************************************************************************************/

        if (process.env.NODE_ENV === 'test') {
            // Allow unit test mocking
            this.__test__ = {
                // validator: validator,
            }
        }

    }

    /**** Prototype Methods ******************************************************************************************/

}

export default contentClass
