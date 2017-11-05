'use strict'

const values = class ValuesClass {

    /**
     * Creates and initializes a Values object
     *
     * @param {object} values Object with variables
     * @param {int} ttlToSet Number of seconds before deprecating
     */
    constructor (values = null, ttlToSet = null) {

        /**** Private Attributes *************************************************************************************/

        let ttl = ttlToSet || null
        let dirty = values !== null
        let value = values || {}
        let eol = null

        if (ttl !== null) {
            eol = (Date.now() / 1000) + ttl
        }

        /**** Private Methods ****************************************************************************************/

        /**
         * Sets the dirty flag to inform that the data was changed
         */
        function setDirty () {
            dirty = true
        }

        /**
         * Checks if the data is valid (if its not deprecated by ttl)
         *
         * @returns {boolean}
         */
        function isValid () {
            return (Date.now() / 1000) < eol
        }

        /**
         * Resolve and returns the reference for the provided variable path
         *
         * @param {string} fullPath Object notation 'some.variable.name'
         * @returns {Object|{}}
         */
        function getPointerTo (fullPath) {
            let varPath = fullPath.split('.')
            let level = value
            for (let idx = 0; idx < varPath.length; idx++) {
                let name = varPath[idx]
                if (level.hasOwnProperty(name)) {
                    level = level[name]
                } else {
                    level = null
                    break
                }
            }
            return level
        }

        /**
         * Delets a specified variable
         *
         * @param {string} fullPath Object notation 'some.variable.name'
         * @returns {boolean}
         */
        function destroy (fullPath) {
            let previousPathToDestroy = fullPath.split('.')

            if (previousPathToDestroy.length > 1) {
                let pathToDestroy = previousPathToDestroy[previousPathToDestroy.length-1]
                delete previousPathToDestroy[previousPathToDestroy.length-1]

                let holder = getPointerTo(previousPathToDestroy)
                if (holder.hasOwnProperty(pathToDestroy)) {
                    delete holder[pathToDestroy]
                } else {
                    return false
                }
            } else if (previousPathToDestroy.length > 0) {
                if (value.hasOwnProperty(previousPathToDestroy)) {
                    delete value[previousPathToDestroy]
                } else {
                    return false
                }
            } else {
                return false
            }
            return true
        }

        /**
         * Get a specific variable in the provided path
         *
         * @param {string} fullPath Object notation 'some.variable.name'
         * @returns {*}
         */
        function get (fullPath) {
            let varPath = fullPath.split('.')
            let level = value
            let returnValue = null
            for (let idx = 0; idx < varPath.length; idx++) {
                let name = varPath[idx]
                if (level.hasOwnProperty(name)) {
                    if (idx < varPath.length - 1) {
                        level = level[name]
                    } else {
                        returnValue = level[name]
                    }
                } else {
                    break
                }
            }
            return returnValue
        }

        /**
         * Sets a specified variable by path
         *
         * @param {string} fullPath Object notation 'some.variable.name'
         * @param {*} valueToSet Values to be stored
         */
        function set (fullPath, valueToSet) {
            let varPath = fullPath.split('.')
            let level = value
            varPath.forEach(function (name, idx) {
                if (idx < varPath.length - 1) {
                    level[name] = {}
                    level = level[name]
                } else {
                    level[name] = valueToSet
                    setDirty()
                }
            })
        }

        /**** Privileged Methods *************************************************************************************/

        /**
         * Check if the data was set
         *
         * @returns {boolean}
         */
        this.isSet = () => { return value !== null }

        /**
         * Checks if the data was changed
         *
         * @returns {boolean}
         */
        this.isDirty = () => { return dirty }

        /**
         * Checks if the data is valid (if its not deprecated by ttl)
         *
         * @returns {boolean}
         */
        this.isValid = () => { return isValid() }

        /**
         * Export all the data as it is
         *
         * @returns {object}
         */
        this.export = () => { return value }

        /**
         * Adds a value to the data
         *
         * @param {string} fullPath Object notation 'some.variable.name.to.be.set'
         * @param {*} valueToSet
         */
        this.set = (fullPath, valueToSet) => { set(fullPath, valueToSet) }

        /**
         * Get a specific value
         *
         * @param {string} fullPath Object notation 'some.variable.name.to.fetch'
         * @returns {*}
         */
        this.get = (fullPath) => { return get(fullPath) }

        /**
         * Destroy a specific variable
         *
         * @param {string} fullPath Object notation 'some.variable.name.to.fetch'
         * @returns {boolean}
         */
        this.destroy = (fullPath) => { return destroy(fullPath) }
    }

    /**** Prototype Methods ******************************************************************************************/
}

module.exports = values
