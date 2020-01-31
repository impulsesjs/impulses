'use strict'

import Md5 from './md5'
import EmitterClass from './impulse_/emitter'
import FrequencyCollectionClass from './impulse_/frequency-collection'
import { Frequency as FrequencyClass } from './impulse_/frequency'
import OptionsSubscribeClass from './impulse_/options/subscribe'
import ContentClass from './impulse_/content'
import EmitStack from './impulse_/emit-stack'

/**
 * @typedef {Object} ImpulseInfoReplyEntity
 * @prop {string|null} [impulse=?] Internal impulse ID / signature
 * @prop {string|null} [emitter=?] External ID from the emitter
 * @prop {number|null} [stack=?] Reply to the position in the emitStack
 * 
 * @typedef {Object} ImpulseInfoOptionsEntity
 * @prop {OptionsSubscribeClass} trace
 * @prop {OptionsSubscribeClass} debug
 * 
 * @typedef {Object} ImpulseInfoEntity
 * @prop {EmitterClass} emitter
 * @prop {FrequencyCollectionClass[]} frequencies
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
                emitter: null, // External emitter information
                frequencies: new FrequencyCollectionClass(),
                reply: { // Set if the impulse is a reply impulse
                    impulse: null, // Internal impulse ID / signature
                    emitter: null, // External ID from the emitter
                    stack: null, // Wich emit is this impulse related to in the stack
                },
                options: {
                    trace: new OptionsSubscribeClass(),
                    debug: new OptionsSubscribeClass(),
                },
                encryption: false,
            },
            content: new ContentClass(),
            history: new ContentClass(),
        }

        /** @type {ImpulseCommunicationFlowEntity} */
        const communicationFlow = {
            emitStack: new EmitStack(), //[],
            emitters: [], // EmitterClass[]
        }

        /** @type {Number} temporary control for the number of emitters */
        let emittersCountForRolbackControl = 0

        /** @type {EmitterClass} */
        let currentEmitter = undefined

        /** @type {CommunicationBus} */
        let connectedBus = undefined

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
                    if (validation[name].indexOf(typeof toImport[name]) >= 0 
                        || validation[name].indexOf('exists') >= 0) {
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
         * @return {string} Generated Unique ID
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
         * @return {string} Generated Impulse Unique ID / Signature
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
                const flow = {}
                flow.emitStack = communicationFlow.emitStack.serialize()
                flow.emitters = communicationFlow.emitters.map(emitter => emitter.serialize())
                impulse.history.set(flow)
            }
        }

        /**
         * Rollback the history set
         */
        const setImpulseHistoryRollBack = () => {
            impulse.history.set({})
        }

        /**
         * Sets the Emitter
         * 
         * @param {EmitterClass} emitter EmitterClass Instance
         */
        const setEmitter = (emitter) => {
            impulse.info.emitter = emitter
        }

        /**
         * Sets the current Emitter Information
         * 
         * @throws {TypeError}
         * 
         * @param {EmitterEntity} emitterInformation 
         * @return {true}
         */
        const setCurrentEmitter = (emitterInformation) => {
            const emitter = new EmitterClass()
            if (!emitter.setInfo(emitterInformation)) {
                return false
            }
            currentEmitter = emitter
            return true
        }

        /**
         * Get the currently set emitter
         * 
         * @return {EmitterClass|false} False if no emitter
         */
        const getEmitter = () => {
            return currentEmitter ? currentEmitter : false;
        }

        /**
         * Get the known emitter list
         * 
         * @return {EmitterClass[]}
         */
        const getKnownEmitters = () => {
            return communicationFlow.emitters.slice()
        }

        /**
         * Check if a CommunicationBus has been set
         * 
         * @return {boolean}
         */
        const hasBus = () => {
            return !!connectedBus
        }

        /**
         * Set a Communication Bus to emit impulses
         * 
         * @param {CommunicationBus} bus
         */
        const setBus = (bus) => {
            connectedBus = bus
        }

        /**
         * Add a frequency for the impulse to be sent
         * 
         * @param {FrequencyClass} frequency
         * @return {boolean}
         */
        const addFrequency = (frequency) => {
            if (hasBus()) {
                if (!!connectedBus.exists(frequency.getEntity(), frequency.getChannel())) {
                    return impulse.info.frequencies.add(frequency)
                }
            }
            return false
        }

        /**
         * Add a frequency for the impulse to be sent
         * 
         * @param {string} entityName 
         * @param {string} channelName 
         * @return {boolean}
         */
        const addFrequencyFromBasic = (entityName, channelName) => {
            const newFrequency = new FrequencyClass(entityName, channelName)
            return addFrequency(newFrequency)
        }

        /**
         * Adds the current impulse information to the Emit Information Stack
         */
        const addToEmitStack = () => {

            /** IMPORTANT !!!! **********
             * Never provide the real content for debug. 
             * Sensitive data migh be present
             ***************************/

            // First we need to set the emitter to the last known/set one
            impulse.info.emitter = getEmitter()
            communicationFlow.emitStack.push(impulse.info, impulse.info.options.trace, impulse.info.options.debug)

            // const emitStackItem = {
            //     time: (new Date()).getTime(),
            //     info: Object.assign({}, impulse.info),
            //     content: {}
            // }

            // if (impulse.info.options.trace.isSubscribed() && impulse.info.options.trace.hasContent()) {
            //     emitStackItem.content.trace = Object.assign({}, impulse.info.options.trace.get())
            // }

            // if (impulse.info.options.debug.isSubscribed() && impulse.info.options.debug.hasContent()) {
            //     emitStackItem.content.debug = Object.assign({}, impulse.info.options.debug.get())
            // }
            // communicationFlow.emitStack.push(emitStackItem)
        }

        /**
         * Rollback the emitted signal from history/stack
         */
        const addToEmitStackRollBack = () => communicationFlow.emitStack.pop()

        /**
         * Adds the emitter to the list if not present
         * 
         * @param {EmmiterClass} emitter 
         */
        const addToEmitersIndex = (emitter) => {
            emittersCountForRolbackControl = communicationFlow.emitters.length
            if (!isEmitterPresentInTheEmittersIndex(emitter)) {
                communicationFlow.emitters.push(emitter)
            }
        }

        /**
         * Rollback the last addition to the emitter index
         * 
         * @param {EmmiterClass} emitter
         */
        const addToEmitersIndexRollBack = (emitter) => {
            if (isTheLastEmitterInTheIndexList(emitter) 
                && !hasEmitterSentHistoryInStack(emitter) 
                && emittersCountForRolbackControl < communicationFlow.emitters.length) {
                communicationFlow.emitters.pop()
            }
        }

        /**
         * Check if the current emitter is set
         * 
         * @return {boolean} False if no emitter
         */
        const hasEmitter = () => {
            return !!getEmitter()
        }

        /**
         * Check if there is any message sent by the provided emitter
         * 
         * @param {EmitterClass} emitter 
         * @return {boolean}
         */
        const hasEmitterSentHistoryInStack = (emitter) => {
            return communicationFlow.emitStack.find(emitter)
            // return !!communicationFlow.emitStack.find(emit => {
            //     return emit.info.emitter.isEqual(emitter)
            // })
        }

        /**
         * Check if the provided frequency is already in the list
         * 
         * @param {FrequencyClass} frequency 
         * @return {boolean}
         */
        const hasFrequency = (frequency) => {
            return !!impulse.info.frequencies.has(frequency)
        }

        /**
         * Check if the provided frequency is already in the list
         * 
         * @param {string} entityName 
         * @param {string} channelName 
         * @return {boolean}
         */
        const hasFrequencyFromBasic = (entityName, channelName) => {
            const newFrequency = new FrequencyClass(entityName, channelName)
            return hasFrequency(newFrequency)
        }

        /**
         * Check if there are any frequencies set
         */
        const isFrequencySet = () => {
            return impulse.info.frequencies.count() > 0
        }

        /**
         * Check if the emitter is already in the index
         * 
         * @param {EmitterClass} emitter 
         * @return {boolean}
         */
        const isEmitterPresentInTheEmittersIndex = (emitter) => {
            return !!communicationFlow.emitters.find(flowEmitter => {
                return flowEmitter.isEqual(emitter)
            })
        }

        /**
         * Check if it is the last emitter in the list
         * 
         * @param {EmitterClass} emitter 
         * @return {boolean}
         */
        const isTheLastEmitterInTheIndexList = (emitter) => {
            const lastAddedPos = communicationFlow.emitters.length - 1
            return communicationFlow.emitters[lastAddedPos].isEqual(emitter)
        }

        /**
         * Check if the current impulse will be traced
         * 
         * @return {boolean}
         */
        const isTraceable = () => impulse.info.options.trace.isSubscribed()

        /**
         * Check if the impulse will be debbuged
         * 
         * @return {boolean}
         */
        const isDebugable = () => impulse.info.options.debug.isSubscribed()

        /**
         * Gets the last emit in the stack
         * 
         * @param {boolean} [clone=true] To get a clone from the master
         * @return {Object|undefined}
         */
        const getLastEmitInfo = (clone = true) => {
            return communicationFlow.emitStack.getLastEmitInfo(clone)
            // const count = communicationFlow.emitStack.length
            // if (count > 0) {
            //     if (clone) {
            //         return Object.assign({}, communicationFlow.emitStack[count-1])
            //     } else {
            //         return communicationFlow.emitStack[count-1]
            //     }
            // }
            // return undefined
        }

        /**
         * Return the number of emittions
         * 
         * @return {number}
         */
        const getEmitCount = () => communicationFlow.emitStack.count()

        // const serilizeImpulse = () => {
        //     impulse.history = Object.assign({}, communicationFlow);
        //     return JSON.stringify(impulse)
        // }


        const serialize = () => {
            const history = impulse.history.serialize()
            history.emitters = history.emitters.map(emitter => emitter.serialize())
            console.log('HISTORY:', history)
            const serialized = Object.assign({}, {
                id: impulse.id,
                info: {
                    emitter: impulse.info.emitter.serialize(),
                    frequencies: impulse.info.frequencies.serialize(),
                    // TODO: REPLY
                    options: {
                        trace: impulse.info.options.trace.serialize(),
                        debug: impulse.info.options.debug.serialize(),
                    },
                    encryption: impulse.info.encryption,
                },
                content: impulse.content.serialize(),
                history: history,
            })
            console.log('SERIALIZED:', JSON.stringify(serialized))
            return serialized
        }

        /**
         * Dispatch the impulse to all defined frequencies and collect the impulseId for each one
         * 
         * @param {function} rollback Rollback function so we undo the actions
         * @return {boolean}
         */
        const dispatch = (rollback) => {
            let emitted = 0;
            impulse.history.set(communicationFlow);
            console.log('IMPULSE:', impulse)

            /** @property {CommunicationBus} connectedBus */
            const emit = getLastEmitInfo(false)
            if (emit && emit.info && emit.info.frequencies) {
                emit.info.frequencies.each((freq) => {
                    const entity = freq.getEntity()
                    const channel = freq.getChannel()
                    if (!!connectedBus.exists(entity, channel)) {
                        const channelObj = connectedBus.get(entity, channel)
                        const impulseToSend = serialize()
                        freq.impulseId = channelObj.send(impulseToSend)
                        emitted++
                    }
                })
            }

            if (!emitted) {
                rollback()
                return false
            }
            return true
        }

        const executeTransaction = (action, rollback) => {
            if (hasBus() && isFrequencySet() && hasEmitter()) {
                setEmitter(currentEmitter)
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

        /**
         * Sets the current Emitter Information
         * 
         * @throws {TypeError}

         * @param {EmitterEntity} emitterInformation 
         * @return {true}
         */
        this.setEmitter = (emitter) => setCurrentEmitter(emitter)

        /**
         * Check if the current emitter is set
         * 
         * @return {boolean} False if no emitter
         */
        this.hasEmitter = () => hasEmitter()

        /**
         * Get the currently set emitter
         * 
         * @return {EmitterClass|false} False if no emitter
         */
        this.getEmitter = () => getEmitter()

        /** Bus */

        /**
         * Set a Communication Bus to emit impulses
         * 
         * @param {CommunicationBus} bus
         */
        this.setBus = (bus) => setBus(bus)

        /** Frequenc(y/ies) management */

        /**
         * Add a frequency for the impulse to be sent
         * 
         * @param {string} entityName 
         * @param {string} channelName 
         * @return {boolean}
         */
        this.addFrequency = (entity, channel) => addFrequencyFromBasic(entity, channel)

        /**
         * Check if the provided frequency is already in the list
         * 
         * @param {string} entityName 
         * @param {string} channelName 
         * @return {boolean}
         */
        this.hasFrequency = (entity, channel) => hasFrequencyFromBasic(entity, channel)

        /**
         * Check if there are any frequencies set
         */
        this.isFrequencySet = () => isFrequencySet()

        /** Emitter history (trace/log) */
        this.getKnownEmitters = () => getKnownEmitters()

        /**
         * Subscribe the trace and sets the trace content
         * 
         * @param {object} traceContent
         * @return {boolean}
         */
        this.subscribeTrace = (traceContent) => impulse.info.options.trace.subscribe(traceContent)

        /**
         * Cancel the trace subscription
         * 
         * @return {boolean}
         */
        this.cancelTrace = () => impulse.info.options.trace.cancel()

        /**
         * Check if the current trace is subscribed
         * 
         * @return {boolean}
         */
        this.isTraceable = () => isTraceable()

        /**
         * Subscribe the debug and sets the debug content
         * 
         * @param {object} debugContent
         * @return {boolean}
         */
        this.subscribeDebug = (debugContent) => impulse.info.options.debug.subscribe(debugContent)

        /**
         * Cancel the debug subscription
         * 
         * @return {boolean}
         */
        this.cancelDebug = () => impulse.info.options.debug.cancel()

        /**
         * Check if the current debug is subscribed
         * 
         * @return {boolean}
         */
        this.isDebugable = () => isDebugable()

        this.setContent = (contentInformation) => impulse.content.set(contentInformation)
        this.addContent = (contentInformation) => impulse.content.add(contentInformation)
        this.getContent = () => impulse.content.get()
        this.clearContent = () => impulse.content.set({})
        
        this.emit = () => emit()
        this.getEmitCount = () => getEmitCount()
        this.getLastEmitInfo = () => getLastEmitInfo()

        /**** Test Area **********************************************************************************************/

        if (process.env.NODE_ENV === 'test') {
            // Allow unit test mocking
            this.__test__ = {
                impulse: impulse,
                communicationFlow: communicationFlow,
                currentEmitter: currentEmitter,
            }
        }

    }

    /**** Prototype Methods ******************************************************************************************/
}

export default impulse
