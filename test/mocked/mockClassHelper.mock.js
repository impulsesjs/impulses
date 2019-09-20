'use strict'

import sinon from 'sinon'

class MockHelper {

    constructor (objectToMock, mockedMethods = null, mockedValues = null) {

        /** @constant {Object} targetObject Object to be mocked */
        const targetObject = objectToMock

        /** @property {Object} method Holder helper object that holds the real mock information */
        let method = {}

        /** @property {boolean} debug */
        this.debug = false

        /** @property {Object} this.spy Holder object that holds spy information */
        this.spy = {}

        /** @property {Object} this.method Holder object that holds spy information */
        this.method = {}

        /** @property {Object} this.return Holder object that holds return information */
        this.return = {} 

        /**
         * Setter method to update the mocked methods
         */
        const setMethod = () => {
            return (newValue) => {
                method = newValue
                refresh()
            }
        }

        /**
         * Define the getter and setter for the method attribute
         */
        Object.defineProperty(this, 'method', {
            get: () => method,
            set: setMethod()
        });

        /**
         * Mock function to apply to all methods
         * It allows debuging and call the mocked function provided by the tests
         */
        const wrapingMockFunction = (name) => (() => {
            let toCall = method[name]
            let showDebug = this.debug

            if (typeof toCall !== 'function' && typeof toCall !== 'object' || 
                (typeof toCall === 'object' && typeof toCall.func !== 'function')) {
                return undefined
            }

            if (typeof toCall === 'object' && toCall.func) {
                showDebug = toCall.debug || this.debug
                toCall = toCall.func
            }

            const returnValue = toCall(arguments)

            if (showDebug) {
                console.group('Method:', name)
                console.info('Arguments:', arguments)
                console.info('Returning:', returnValue)
                console.groupEnd()
            }

            return returnValue
        })
        
        /**
         * Check if there is a othod with the provided name
         * 
         * @param {string} methodName 
         * @return {boolean}
         */
        const isMethod = (methodName) => typeof targetObject[methodName] === 'function'

        /**
         * Check if there is a spy for the method
         * 
         * @param {string} methodName 
         * @return {boolean}
         */
        const spyExists = (methodName) => !!this.spy[methodName]

        /**
         * Toggle the default debug status
         */
        const toggleDebug = () => {
            this.debug = !this.debug
        }

        /**
         * Refresh and update the methods with the current setup
         * Note: this will be called every time the method object is updated
         */
        const refresh = () => {
            const spies = Object.getOwnPropertyNames(this.spy).sort()
            const methods = Object.getOwnPropertyNames(method).sort()

            if (spies !== methods) {
                methods.forEach(name => {
                    if (typeof this.return[name] === 'undefined') {
                        this.return[name] = undefined
                    }

                    refreshMethod(name)
                })
            }
        }

        const refreshMethod = name => {
            this.return[name] = undefined
    
            if (isMethod(name)) {
                if (spyExists(name)) {
                    this.spy[name].restore()
                }
                this.spy[name] = sinon.stub(targetObject, name)
                this.spy[name].callsFake(getMethodToCall(name))
            }
        }

        const getMethodToCall = (methodName) => {
            if (typeof method[methodName] === 'function') {
                return method[methodName]
            }

            if (typeof method[methodName] === 'object' && typeof method[methodName].func === 'function') {
                return method[methodName].func
            }

            return wrapingMockFunction
        }

        /**
         * Reset the history for all spies
         */
        const resetHistory = () => resetSpyHistory(Object.getOwnPropertyNames(this.spy))

        /**
         * Reset the history for the provided spy names
         * 
         * @param {string[]} names List of names to apply the reset
         */
        const resetSpyHistory = (names) => {
            if (names.constructor !== Array) {
                names = [names]
            }
            names.forEach(name => {
                if (this.spy[name]) {
                    this.spy[name].resetHistory()
                }
            })
        }

        // Initialise the method mock information based on the provided object/class
        const init = () => {
            let methodObject = {}
            Object.getOwnPropertyNames(targetObject).forEach(name => {
                if (mockedValues && mockedValues[name]) {
                    this.return[name] = mockedValues[name]
                } else {
                    this.return[name] = undefined
                }

                if (mockedMethods && mockedMethods[name]) {
                    if (typeof mockedMethods[name] === 'function') {
                        methodObject[name] = {
                            func: () => mockedMethods[name],
                            debug: this.debug,
                        }
                    } else if (typeof mockedMethods[name] === 'object') {
                        methodObject[name] = mockedMethods[name]
                    }
                } else {
                    methodObject[name] = {
                        func: () => this.return[name],
                        debug: this.debug,
                    }
                }
            })
            this.method = methodObject
        }

        init()

        /**
         * Reset the history for the provided spy names
         * 
         * @param {string[]} names List of names to apply the reset
         */
        this.__resetSpyHistory__ = (name) => resetSpyHistory(name)

        /**
         * Reset the history for all spies
         */
        this.__resetHistory__ = () => resetHistory()

        /**
         * Toggle the default debug status
         */
        this.__toggleDebug__ = () => toggleDebug()

        this.__updateMethods__ = (methods) => {
            this.method = Object.assign(this.method, methods)
        }
    }

}

export default MockHelper