'use strict'
import OptionsTraceClass from './trace'

const optionsClass = class OptionsClass {
    /**
     * @constructor
     * 
     * @param {string} entity 
     * @param {string} channel 
     */
    constructor () {

        /**** Private Attributes *************************************************************************************/

        const trace = new OptionsTraceClass()

        /**** Private Methods ****************************************************************************************/

        /**** Privileged Methods *************************************************************************************/

        const subscribeTrace = (content) => trace.subscribe(content)
        const cancelTrace = () => trace.cancel()
        const isTraceable = () => trace.isSubscribed()
        const getTrace = () => trace.get()

        /**** Test Area **************************************************************************************************/

        if (process.env.NODE_ENV === 'test') {
            // Allow unit test mocking
            this.__test__ = {
                trace: trace,
            }
        }
    }

    /**** Prototype Methods ******************************************************************************************/
}

export default optionsClass