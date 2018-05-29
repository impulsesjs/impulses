'use strict'

import Api from './api'
import Bus from './bus'

// TODO: Need to make it just an export of API
class impulses {
    constructor () {

        function newApi () {
            return new Api(...arguments)
        }

        function newBus () {
            return new Bus(...arguments)
        }

        this.getNewApi = () => newApi(...arguments)
    
        this.getNewBus = () => newBus(...arguments)
    }
}

module.exports = new impulses()