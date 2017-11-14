'use strict'

import Values from './values'
import Queue from './queue'

class CommBus {
    constructor () {
        this.val = new Values()
        this.queue = new Queue()
    }
}

module.exports = new CommBus()