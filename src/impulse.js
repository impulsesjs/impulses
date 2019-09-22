'use strict'

import Md5 from './md5'
import EmitterClass from './impulse_/emitter'
import FrequencyCollectionClass from './impulse_/frequency-collection'
import FrequencyClass from './impulse_/frequency'

/**
 * 
 * @typedef {Object} ImpulseFrequency
 * @prop {function} getEntity 
 * @prop {function} getChannel
 * @prop {function} is
 * @prop {function} isEqual
 * 
 * @typedef {Object} ImpulseInfoReplyEntity
 * @prop {string|null} [impulse=?] Internal impulse ID / signature
 * @prop {string|null} [emitter=?] External ID from the emitter
 * @prop {number|null} [stack=?] Reply to the position in the emitStack
 * 
 * @typedef {Object} ImpulseInfoOptionsEntity
 * @prop {boolean} trace
 * @prop {boolean} debug
 * 
 * @typedef {Object} ImpulseInfoEntity
 * @prop {string} emitter
 * @prop {Object[]} frequencies
 * @prop {ImpulseInfoReplyEntity} [reply=?]
 * @prop {ImpulseInfoOptionsEntity} options
 * @prop {boolean} encryption
 * 
 * @typedef {Object} CommunicationFlowEmitStackEntity
 * @prop {Time} time
 * @prop {ImpulseInfoEntity} info
 * @prop {Object} content
 * 
 * @typedef {Object} ImpulseEntity
 * @prop {string} id
 * @prop {ImpulseInfoEntity} info
 * @prop {Object} content
 * @prop {CommunicationFlowEmitStackEntity[]} [emitStack=?]
 * @prop {EmitterClass[]} [emitters=?]
 * 
 * @typedef {Object} ImpulseCommunicationFlowEntity
 * @prop {CommunicationFlowEmitStackEntity[]} emitStack
 * @prop {EmitterEntity[]} emitters
 * 
 * @typedef {Object} EmitterEntity
 * @prop {string} id
 * @prop {Object} info
 */

const impulse = class ImpulseApiClass {
    /**
     * @constructor ImpulseClass
     * 
     * @param {ImpulseEntity} incommingImpulse
     */
    constructor (incommingImpulse = undefined) {

        /**** Private Attributes *************************************************************************************/

        /** @type {ImpulseEntity} impulse */
        const impulse =  {
            id: null, // Internal impulse ID / signature
            info: {
                emitter: null, // External ID from the emitter
                frequencies: new FrequencyCollectionClass(),
                reply: { // Set if the impulse is a reply impulse
                    impulse: null, // Internal impulse ID / signature
                    emitter: null, // External ID from the emitter
                    stack: null, // Wich emit is this impulse related to in the stack
                },
                options: {
                    trace: false,
                    traceContent: null,
                    debug: false,
                    debugContent: null,
                },
                encryption: false,
            },
            content: {},
            history: {},
        }

        /** @type {ImpulseCommunicationFlowEntity} */
        const communicationFlow = {
            emitStack: [],
            emitters: [],
        }

        /** @type {EmitterClass} */
        let currentEmitter = undefined

        /** @type {CommunicationBus} */
        let connectedBus = undefined;

        /**** Private Methods ****************************************************************************************/

        const importImpulse = (rawImpulse) => {
            const validate = {
                id: ['string'],
                content: ['exists'],
                history: ['exists'],
            }

            if (importImpulsePart(toImport, impulse, validate) && rawImpulse.info) {
                return importImpulseInfo(rawImpulse.info)
            }
            return false;
        }

        const importImpulseInfo = (toImport) => {
            const validate = {
                emitter: ['string'],
                frequencies: ['exists'],
                encryption: ['boolean'],
            }

            if (importImpulsePart(toImport, impulse.info, validate) && toImport.reply && toImport.options) {
                if (importImpulseInfoReply(toImport.reply)) {
                    return importImpulseInfoOptions(toImport.options)
                }
            }
            return false;
        }

        const importImpulseInfoReply = (toImport) => {
            const validate = {
                impulse: ['string'],
                emitter: ['string'],
                stack: ['number', 'exists'], 
            }

            return importImpulsePart(toImport, impulse.info.reply, validate)
        }

        const importImpulseInfoOptions = (toImport) => {
            const validate = {
                trace: ['boolean'],
                traceContent: ['string'],
                debug: ['boolean'],
                debugContent: ['string'],
            }

            return importImpulsePart(toImport, impulse.info.options, validate)
        }

        const importImpulsePart = (toImport, destination, validation) => {
            let failed = false;

            destination.keys().forEach(name => {
                if (validation[name] && toImport[name]) {
                    if (validation[name].indexOf(typeof toImport[name]) >= 0 || validation[name].indexOf('exists') >= 0) {
                        destination[name] = toImport[name]
                    } else {
                        failed = true;
                    }
                }
            })

            return failed
        }

        /**
         * Generate the Unique ID for the provided target
         *
         * @param {*} serializeTarget Target to be serialized
         * 
         * @returns {string} Generated Unique ID
         */
        const generateId = (serializeTarget) => {
            const serializedImpulse = JSON.stringify(serializeTarget)
            const randomValue = Math.random() * 5000
            const timeValue = Date.now()

            return (new Md5()).calculate(`${serializedImpulse}${randomValue}${timeValue}`)
        }

        /**
         * Generates the Impulse  Unique ID / Signature
         * 
         * @returns {string} Generated Impulse Unique ID / Signature
         */
        const generateImpulseId = () => {
            return `i.${generateId(impulse)}`
        }

        /**
         * Sets the impulse signature
         */
        const setImpulseSignature = () => {
            impulse.id = impulse.id || generateImpulseId()
        }

        /**
         * Set the history set if trace or debug is set
         */
        const setImpulseHistory = () => {
            if (isTraceable() && isDebugable()) {
                impulse.history = communicationFlow
            }
        }

        /**
         * Rollback the history set
         */
        const setImpulseHistoryRollBack = () => {
            impulse.history = {}
        }

        /**
         * Sets the Emitter ID
         * 
         * @param {string} emitterId Emitter ID
         */
        const setEmitterId = (emitterId) => {
            impulse.info.emitter = emitterId
        }

        /**
         * Sets the current Emitter Information
         * 
         * @param {EmitterEntity} emitterInformation 
         * 
         * @throws {TypeError}
         * 
         * @returns {true}
         */
        const setEmitter = (emitterInformation) => {
            const emitter = new EmitterClass()
            if (!emitter.setInfo(emitterInformation)) {
                return false
            }
            currentEmitter = emitter
            return true
        }

        /**
         * Set a Communication Bus to emit impulses
         * @param {CommunicationBus} bus
         */
        const setBus = (bus) => {
            connectedBus = bus
        }

        /**
         * Get the currently set emitter
         * 
         * @return {EmitterEntity|undefined}
         */
        const getEmitter = () => {
            return currentEmitter ? currentEmitter.getInfo() : false;
        }

        /**
         * Get the known emitter list
         */
        const getKnownEmitters = () => {
            return communicationFlow.emitters.slice()
        }

        /**
         * Add a frequency for the impulse to be sent
         * 
         * @param {string} entityName 
         * @param {string} channelName 
         * 
         * @returns {boolean}
         */
        const addFrequency = (entityName, channelName) => {
            if (hasBus()) {
                if (!!connectedBus.exists(entityName, channelName)) {
                    const newFrequency = new FrequencyClass(entityName, channelName)
                    return impulse.info.frequencies.add(newFrequency)
                }
            }
            return false
        }

        /**
         * Adds the current impulse information to the Emit Information Stack
         */
        const addToEmitStack = () => {

            /** IMPORTANT !!!! **********
             * Never provide the real content for debug. 
             * Sensitive data migh be present
             ***************************/

            // First we need to set the emitter to the lask known/set one
            impulse.info.emitter = getEmitter()

            const emitStackItem = {
                time: (new Date()).getTime(),
                info: Object.assign({}, impulse.info),
                content: {}
            }

            if (impulse.info.options.trace && impulse.info.options.traceContent) {
                emitStackItem.content.trace = Object.assign({}, impulse.info.options.traceContent)
            }

            if (impulse.info.options.debug && impulse.info.options.debugContent) {
                emitStackItem.content.debug = Object.assign({}, impulse.info.options.debugContent)
            }
            communicationFlow.emitStack.push(emitStackItem)
        }

        /**
         * Rollback the emitted signal from history/stack
         */
        const addToEmitStackRollBack = () => {
            communicationFlow.emitStack.pop()
        }

        /**
         * Adds the emitter to the list if not present
         * 
         * @param {EmmiterClass} emitterObject 
         */
        const addToEmitersIndex = (emitterObject) => {
            if (!isEmitterPresentInTheEmittersIndex(emitterObject)) {
                communicationFlow.emitters.push(emitterObject)
            }
        }

        /**
         * Rollback the last addition to the emitter index
         */
        const addToEmitersIndexRollBack = (emitterObject) => {
            if (isTheLastEmitterInTheIndexList(emitterObject) && !hasEmitterSentHistoryInStack(emitterObject)) {
                communicationFlow.emitters.pop()
            }
        }

        /**
         * Check if the current emitter is set
         */
        const hasEmitter = () => {
            return !!getEmitter()
        }

        /**
         * Check if there is any message sent by the provided emitter
         * 
         * @param {EmitterClass} emitterObject 
         * @return {boolean}
         */
        const hasEmitterSentHistoryInStack = (emitterObject) => {
            return !!communicationFlow.emitStack.find(emit => areTheSameEmitters(emit.info.emitter, emitterObject))
        }

        /**
         * Check if the provided frequency is already in the list
         * 
         * @param {ImpulseFrequency} frequencyObject 
         * @returns {boolean}
         */
        const hasFrequency = (frequencyObject) => {
            return !!impulse.info.frequencies.has(frequencyObject)
        }

        /**
         * Check if the provided frequency is already in the list
         * 
         * @param {string} entityName 
         * @param {string} channelName 
         * 
         * @returns {boolean}
         */
        const hasFrequencyFromBasic = (entityName, channelName) => {
            const newFrequency = new FrequencyClass(entityName, channelName)
            return hasFrequency(newFrequency)
        }

        /**
         * Check if a CommunicationBus has been set
         * 
         * @returns {boolean}
         */
        const hasBus = () => {
            return !!connectedBus
        }

        /**
         * Cheks if the emitter information is valid
         * 
         * @param {Object} emitterInformation 
         * 
         * @returns {string|boolean} missing property name or true
         */
        // const isValidEmitterInfo = (emitterInformation) => {
        //     if (emitterInformation.constructor !== Object || !emitterInformation.emitter) {
        //         return 'emitter'
        //     }
        //     return true
        // }

        /**
         * Check if there are any frequencies set
         */
        const isFrequencySet = () => {
            return impulse.info.frequencies.count() > 0
        }

        /**
         * Check if the emitter is already in the index
         * 
         * @param {EmitterObject} emitterObject 
         * @return {boolean}
         */
        const isEmitterPresentInTheEmittersIndex = (emitterObject) => {
            return !!communicationFlow.emitters.find(emitter => emitter.isEqual(emitterObject))
        }

        /**
         * Check if it is the last emitter in the list
         * 
         * @param {EmitterClass} emitterObject 
         * @return {boolean}
         */
        const isTheLastEmitterInTheIndexList = (emitterObject) => {
            const lastAddedPos = communicationFlow.emitters.length - 1
            if (areTheSameEmitters(communicationFlow.emitters[lastAddedPos], emitterObject)) {
                return true
            }
            return false
        }

        /**
         * Compare two emitters to check if they are the same
         * 
         * @param {EmitterClass} emitterA 
         * @param {EmitterClass} emitterB 
         */
        const areTheSameEmitters = (emitterA, emitterB) => areTheSameObject(emitterA, emitterB)

        /**
         * Compare two objects to check if they are the same
         * 
         * @param {Object} objectA 
         * @param {Object} objectB 
         */
        const areTheSameObject = (objectA, objectB) => JSON.stringify(objectA) === JSON.stringify(objectB)
        
        /**
         * Check if the current impulse will be traced
         * 
         * @returns {boolean}
         */
        const isTraceable = () => {
            return !!impulse.info.options.trace
        }

        /**
         * Check if the impulse will be debbuged
         * 
         * @returns {boolean}
         */
        const isDebugable = () => {
            return !!impulse.info.options.debug
        }

        /**
         * Sets the trace Information
         * 
         * @param {Object} traceContent 
         * 
         * @returns {boolean}
         */
        const subscribeTrace = (traceContent) => {
            if (typeof traceContent === 'object') {
                impulse.info.options.trace = true
                impulse.info.options.traceContent = Object.assign({}, traceContent)
                return true
            }
            return false
        }

        /**
         * Sets the debug Information
         * 
         * @param {Object} debugContent 
         * 
         * @returns {boolean}
         */
        const subscribeDebug = (debugContent) => {
            if (typeof debugContent === 'object') {
                impulse.info.options.debug = true
                impulse.info.options.debugContent = Object.assign({}, debugContent)
                return true
            }
            return false
        }

        /**
         * Removes the trace flag and content
         */
        const cancelTrace = () => {
            impulse.info.options.trace = false
            impulse.info.options.traceContent = undefined
        }

        /**
         * Removes the debug flag and content
         */
        const cancelDebug = () => {
            impulse.info.options.debug = false
            impulse.info.options.debugContent = undefined
        }

        /**
         * Clears all content
         */
        const clearContent = () => {
            impulse.content = {}
        }

        /**
         * Check if the content is in a valid format
         * 
         * @param {*} contentObj 
         * @returns {boolean}
         */
        const isValidContent = (contentObj) => (typeof contentObj === 'object')

        /**
         * Add extra content or replace with new content
         * 
         * @param {Object} contentObj 
         * @returns {boolean}
         */
        const addContent = (contentObj) => {
            if (isValidContent(contentObj)) {
                impulse.content = Object.assign(impulse.content, contentObj)
                return true
            }
            return false
        }

        /**
         * Sets the new content (destroys previous content)
         * 
         * @param {Object} contentObj 
         * @returns {boolean}
         */
        const setContent = (contentObj) => {
            if (isValidContent(contentObj)) {
                clearContent()
                impulse.content = Object.assign({}, contentObj)
                return true
            }
            return false
        }

        /**
         * Get the current content
         */
        const getContent = () => {
            return impulse.content
        }

        /**
         * Gets the last emit in the stack
         * 
         * @param {boolean} [clone=true] To get a clone from the master
         * 
         * @returns {Object|undefined}
         */
        const getLastEmitInfo = (clone = true) => {
            const count = communicationFlow.emitStack.length
            if (count > 0) {
                if (clone) {
                    return Object.assign({}, communicationFlow.emitStack[count-1])
                } else {
                    return communicationFlow.emitStack[count-1]
                }
            }
            return undefined
        }

        /**
         * Return the number of emittions
         * 
         * @return {number}
         */
        const getEmitCount = () => {
            return communicationFlow.emitStack.length
        }

        // const serilizeImpulse = () => {
        //     impulse.history = Object.assign({}, communicationFlow);
        //     return JSON.stringify(impulse)
        // }

        /**
         * Dispatch the impulse to all defined frequencies and collect the impulseId for each one
         * 
         * @param {function} rollback Rollback function so we undo the actions
         * @returns {boolean}
         */
        const dispatch = (rollback) => {
            let emitted = 0;
            impulse.history = Object.assign({}, communicationFlow);
            /** @property {CommunicationBus} connectedBus */
            getLastEmitInfo(false).info.frequencies.forEach((freq) => {
                const entity = freq.entity
                const channel = freq.channel
                if (!!connectedBus.exists(entity, channel)) {
                    const channelObj = connectedBus.get(entity, channel)
                    freq.impulseId = channelObj.send(impulse)
                    emitted++
                }
            })

            if (!emitted) {
                rollback()
                return false
            }
            return true
        }

        const executeTransaction = (action, rollback) => {
            if (hasBus() && isFrequencySet() && hasEmitter()) {
                setEmitterId(currentEmitter.emitter)
                addToEmitersIndex(currentEmitter)
                setImpulseSignature()
                setImpulseHistory()
                addToEmitStack()
                return action(rollback)
            }
            return false
        }

        const transactionRollBack = () => {
            addToEmitStackRollBack()
            setImpulseHistoryRollBack()
            addToEmitersIndexRollBack(currentEmitter)
        }

        const emit = () => {
            return executeTransaction(dispatch, transactionRollBack)
        }

        // const emitReply = () => {
        // }

        // const emitAndListen = () => {
        //     // TODO: Prepare and Set a function to get the reply
        //     // TODO: Create a new impulse with the returned message
        //     // TODO: call back the method so we can provide the impulse
        // }

        if (incommingImpulse) {
            importImpulse(incommingImpulse)
        }

        /**** Privileged Methods *************************************************************************************/

        /** Current Emitter */
        this.setEmitter = (emitterInfo) => setEmitter(emitterInfo)
        this.hasEmitter = () => hasEmitter()
        this.getEmitter = () => getEmitter()

        /** Bus */
        this.setBus = (bus) => setBus(bus)

        /** Frequenc(y/ies) management */
        this.addFrequency = (entity, channel) => addFrequency(entity, channel)
        this.hasFrequency = (entity, channel) => hasFrequencyFromBasic(entity, channel)
        this.isFrequencySet = () => isFrequencySet()

        /** Emitter history (trace/log) */
        this.getKnownEmitters = () => getKnownEmitters()

        this.subscribeTrace = (traceContent) => subscribeTrace(traceContent)
        this.cancelTrace = () => cancelTrace()
        this.isTraceable = () => isTraceable()

        this.subscribeDebug = (debugContent) => subscribeDebug(debugContent)
        this.cancelDebug = () => cancelDebug()
        this.isDebugable = () => isDebugable()

        this.setContent = (contentInformation) => setContent(contentInformation)
        this.addContent = (contentInformation) => addContent(contentInformation)
        this.getContent = () => getContent()
        this.clearContent = () => clearContent()
        
        this.emit = () => emit()
        this.getEmitCount = () => getEmitCount()
        this.getLastEmitInfo = () => getLastEmitInfo()

        /**** Test Area **********************************************************************************************/

        if (process.env.NODE_ENV === 'test') {
            // Allow unit test mocking
            this.__test__ = {
                impulse: impulse,
                currentEmitter: currentEmitter,
            }
        }

    }

    /**** Prototype Methods ******************************************************************************************/
}

export default impulse
