'use strict'

const Values = class ValuesClass {

    /**
     * Creates and initializes a Values object
     *
     * @param {object} values Object with variables
     * // param {int} ttlToSet Number of seconds before deprecating
     */
    constructor (values = null/*, ttlToSet = null*/) {

        /**** Private Attributes *************************************************************************************/

        // let ttl = ttlToSet || null
        let dirty = values !== null
        let value = values || {}
        // let eol = null

        // if (ttl !== null && !isNaN(ttl)) {
        //     eol = (Date.now() / 1000) + ttl
        // }

        /**** Private Methods ****************************************************************************************/

        /**
         * Sets the dirty flag to inform that the data was changed
         */
        function setDirty () {
            dirty = true
        }

        /**
         * Sets the dirty flag to inform that the data was changed
         */
        function unsetDirty () {
            dirty = false
        }

        /**
         * Checks if the data is valid (if its not deprecated by ttl)
         *
         * @returns {boolean}
         */
        // function isValid () {
        //     return (Date.now() / 1000) < eol
        // }

        /**
         * Resolve and returns the reference for the provided variable path
         *
         * @param {string} fullPath Object notation 'some.variable.name'
         * @returns {Object|{}}
         */
        function getPointerTo (fullPath = '') {
            return fullPath === ''
                ? value
                : fullPath
                    .split('.')
                    .reduce((valuesIn, currentPath) => valuesIn[currentPath] || null, value)
        }

        /**
         * Deletes a specified variable
         *
         * @param {string} fullPath Object notation 'some.variable.name'
         * @returns {boolean}
         */
        function destroy (fullPath) {
            const holder_path = fullPath.split('.')
            const to_delete = holder_path.splice(-1, 1)[0]
            const holder = getPointerTo(holder_path.join('.'))
            return holder.hasOwnProperty(to_delete) ? Reflect.deleteProperty(holder, to_delete) : false
        }

        /**
         * Get a specific variable in the provided path
         *
         * @param {string} fullPath Object notation 'some.variable.name'
         * @returns {*}
         */
        function get (fullPath) {
            return getPointerTo(fullPath)
        }

        /**
         * Sets a specified variable by path
         *
         * @param {string} fullPath Object notation 'some.variable.name'
         * @param {*} valueToSet Values to be stored
         */
        function set (fullPath, valueToSet) {
            const full_path = fullPath.split('.')
            const ptr = full_path.reduce(
                (valuePtr, block, idx) => {
                    if (!valuePtr.hasOwnProperty(block)) {
                        Reflect.set(valuePtr, block, {})
                    }
                    return (idx === full_path.length - 1) ? valuePtr : valuePtr[block]
                }, 
                value)
            if (Reflect.set(ptr, full_path.pop(), valueToSet) === true) {
                setDirty()
            }
        }

        /**
         * Check if the provided path is set
         *
         * @param {string} fullPath Object notation 'some.variable.name'
         * @returns {boolean}
         */
        function isSet (fullPath) {
            return getPointerTo(fullPath) !== null
        }

        /**** Privileged Methods *************************************************************************************/

        /**
         * Checks if the data was changed
         *
         * @returns {boolean}
         */
        this.isDirty = () => dirty

        /**
         * Checks if the data is valid (if its not deprecated by ttl)
         *
         * @returns {boolean}
         */
        // this.isValid = () => isValid()

        /**
         * Export all the data as it is
         *
         * @returns {object}
         */
        this.export = () => {
            unsetDirty()
            return Object.assign({}, value)
        }

        /**
         * Adds a value to the data
         *
         * @param {string} fullPath Object notation 'some.variable.name.to.be.set'
         * @param {*} valueToSet
         */
        this.set = (fullPath, valueToSet) => { set(fullPath, valueToSet) }

        /**
         * Checks if a path is set
         *
         * @param {string} fullPath Object notation 'some.variable.name.to.check'
         * @returns {boolean}
         */
        this.isSet = (fullPath) => isSet(fullPath)

        /**
         * Get a specific value
         *
         * @param {string} fullPath Object notation 'some.variable.name.to.fetch'
         * @returns {*}
         */
        this.get = (fullPath) => get(fullPath)

        /**
         * Destroy a specific variable
         *
         * @param {string} fullPath Object notation 'some.variable.name.to.fetch'
         * @returns {boolean}
         */
        this.destroy = (fullPath) => destroy(fullPath)
    }

    /**** Prototype Methods ******************************************************************************************/
}

export { Values }
