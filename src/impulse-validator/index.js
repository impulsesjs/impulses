const impulseValidationHelper = class ImpulseValidationHelperClass {

    constructor () {

        /**** Private Attributes *************************************************************************************/

        /**** Private Methods ****************************************************************************************/

        // const validate = impulse => {
        //     if (!impulse.id || typeof impulse.id !== 'string') return false
        //     if (!impulse.info || typeof impulse.info !== 'object') return false
        //     if (!impulse.content || typeof impulse.content !== 'object') return false
        //     if (!impulse.history || typeof impulse.history !== 'object') return false
    
        //     return validateInfo(impulse.info) && validateInfoHistory(impulse.history)
        // }
    
        // const validateInfo = info => {
        //     if (!info.emitter || typeof info.emitter !== 'string') return false
        //     if (!info.frequencies || !Array.isArray(info.frequencies)) return false
        //     if (!info.reply || typeof info.reply !== 'object') return false
        //     if (!info.options || typeof info.options !== 'object') return false
        //     if (!info.encryption || typeof info.encryption !== 'boolean') return false

        //     return validateInfoFrequencies(info.frequencies) && validateInfoReply(info.reply) && validateInfoOptions(info.options)
        // }

        // const validateInfoFrequencies = frequencies => {
        //     let valid = true

        //     frequencies.forEach(frequency => {
        //         if (valid && !validateFrequency(frequency)) {
        //             valid = false
        //         }
        //     })

        //     return valid
        // }

        const validateFrequency = ferquency => {
            if (!ferquency.entity || typeof ferquency.entity !== 'string') return false
            if (!ferquency.channel || typeof ferquency.channel !== 'string') return false

            return true
        }

        // const validateInfoReply = reply => {
        //     if (!reply.impulse || typeof reply.impulse !== 'string') return false
        //     if (!reply.emitter || typeof reply.emitter !== 'string') return false
        //     if (!reply.stack || typeof reply.stack !== 'number') return false

        //     return true;
        // }
        
        // const validateInfoOptions = options => {
        //     if (!options.trace || typeof options.trace !== 'boolean') return false
        //     if (!options.traceContent || typeof options.traceContent !== 'string') return false
        //     if (!options.debug || typeof options.debug !== 'boolean') return false
        //     if (!options.debugContent || typeof options.debugContent !== 'string') return false

        //     return true;
        // }

        // const validateInfoHistory = history => {
        //     if (!history.emitStack || !Array.isArray(history.emitStack)) return false
        //     if (!history.emitters || !Array.isArray(history.emitters)) return false

        //     return validateInfoHistoryEmits(history.emitStack) && validateInfoHistoryEmitters(history.emitters)
        // }

        // const validateInfoHistoryEmits = emits => {
        //     let valid = true

        //     emits.forEach(emit => {
        //         if (valid && !validateEmit(emit)) {
        //             valid = false
        //         }
        //     })

        //     return valid
        // }

        const validateEmit = emit => {
            if (typeof emit !== 'object') return false
            if (!emit.time || emit.time.constructor !== Date ) return false
            if (!emit.info || typeof emit.info !== 'object') return false
            if (!emit.content || typeof emit.content !== 'object') return false

            return true;
        }

        // const validateInfoHistoryEmitters = emitters => {
        //     let valid = true

        //     emitters.forEach(emitter => {
        //         if (valid && !validateEmitter(emitter)) {
        //             valid = false
        //         }
        //     })

        //     return valid
        // }

        /**
         * Validates if the provided emitter is the correct type
         * @param {EmitterClass} emitter 
         * @returns {Boolean}
         */
        const validateEmitterType = emitter => {
            if (typeof emitter !== 'object' || emitter.constructor.name !== 'EmitterClass') return false
            return true;
        }

        /**
         * 
         * @param {Object} emitter 
         */
        const validateEmitter = emitter => {
            if (typeof emitter !== 'object') return false
            if (!emitter.emitter || typeof emitter.emitter !== 'string') return false
            if (!emitter.version || typeof emitter.version !== 'string') return false

            return true;
        }

        /**** Privileged Methods *************************************************************************************/

        // this.validateImpulse = impulse => validate(impulse)
        this.validateFrequency = freqeuency => validateFrequency(freqeuency)
        this.validateEmit = emit => validateEmit(emit)
        this.validateEmitterType = emitter => validateEmitterType(emitter)
        this.validateEmitter = emitter => validateEmitter(emitter)
    }

    /**** Prototype Methods ******************************************************************************************/

}

export default impulseValidationHelper