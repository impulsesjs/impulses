'use strict'
import { Frequency as FrequencyClass } from '../frequency'

const emitStackClass = class EmitStackClass {

    constructor (serializedInfo) {

        /**** Private Attributes *************************************************************************************/

        // config = config || {}

        // const configuration = Object.assign({}, config)

        const stack = []

        /**** Private Methods ****************************************************************************************/

        /**
         * Adds info to the stack
         * 
         * @param {*} info 
         * @param {object} trace
         * @param {object} debug
         */
        const push = (info, trace = undefined, debug = undefined) => {
            const emitStackItem = {
                time: (new Date()).getTime(),
                info: Object.assign(Object.create(Object.getPrototypeOf(info)), info),
                content: {}
            }

            if (trace.isSubscribed() && trace.hasContent()) {
                emitStackItem.content.trace = Object.assign(Object.create(Object.getPrototypeOf(trace.get())), trace.get())
            }

            if (debug.isSubscribed() && debug.hasContent()) {
                emitStackItem.content.debug = Object.assign(Object.create(Object.getPrototypeOf(debug.get())), debug.get())
            }
            stack.push(emitStackItem)
        }

        /**
         * Removes info from the stack
         */
        const pop = () => stack.pop()

        /**
         * Return the number of emittions
         * 
         * @return {number}
         */
        const itemsCount = () => stack.length

        /**
         * Check if there is any message sent by the provided emitter
         * 
         * @param {EmitterClass} emitter 
         * @return {boolean}
         */
        const hasEmitter = (emitter) => {
            return !!stack.find(emit => {
                return emit.info.emitter.isEqual(emitter)
            })
        }

        /**
         * Gets emit info from from the stack
         * 
         * @param {number} position Stack position to fetch (start at 0)
         * @param {boolean} [clone=true] To get a clone from the master
         * @return {object|undefined}
         */
        const getEmitInfo = (position, clone = true) => {
            const count = itemsCount()
            if (count > 0 && position >= 0 && position <= count-1) {
                if (clone) {
                    return Object.assign(Object.create(Object.getPrototypeOf(stack[position])), stack[position])
                } else {
                    return stack[position]
                }
            }
            return undefined
        }

        const getLastEmitInfo = (clone = true) => getEmitInfo(itemsCount()-1, clone)

        /**
         * Check if there is any message sent by the provided emitter
         * 
         * @param {EmitterClass} emitter 
         * @return {boolean}
         */
        const find = (emitter) => {
            return !!stack.find(emit => {
                return emit.info.emitter.isEqual(emitter)
            })
        }


        const importSerialized = (serialized) => {
            if (serialized && serialized.constructor === Array) {
                serialized.forEach(serializedFreq => {
                    add(new FrequencyClass(serializedFreq))
                })
            }
        }

        const serialize = () => {
            console.log('\n-----\n')
            const serializeContent = (content) => {
                console.log('\n-----\n serializeContent', item)
                if (content.hasOwnProperty('serialize')) {
                    console.log('\ncalling serialize')
                    return content.serialize()
                }
                
                if (content.constructor === Array) {
                    console.log('\nArray found')
                    return content.map(item => serializeContent(item))
                }

                if (content.constructor === Object) {
                    console.log('\nObject found')
                    Object.getOwnPropertyNames().forEach(itemName => {
                        console.log('\nDealing with', itemName)
                        content[itemName] = serializeContent(content[itemName])
                    })
                }
                
            }

            return stack.map(item => serializeContent(item))
        }

        importSerialized(serializedInfo)
        
        /**** Privileged Methods *************************************************************************************/

        this.push = (newItem, trace = undefined, debug = undefined) => push(newItem, trace, debug)
        this.pop = () => pop()
        this.count = () => itemsCount()
        this.hasEmitter = () => hasEmitter()
        this.getEmitInfo = (position, clone = true) => getEmitInfo(position, clone)
        this.getLastEmitInfo = (clone = true) => getLastEmitInfo(clone)
        this.find = (emitter) => find(emitter)
        this.serialize = () => serialize()
    }

    /**** Prototype Methods ******************************************************************************************/

}

export default emitStackClass
