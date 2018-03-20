(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("impulses", [], factory);
	else if(typeof exports === 'object')
		exports["impulses"] = factory();
	else
		root["impulses"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// TODO: This will require change once API is built

var _bus = __webpack_require__(1);

var _bus2 = _interopRequireDefault(_bus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = new _bus2.default();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _channel = __webpack_require__(2);

var _channel2 = _interopRequireDefault(_channel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @typedef {object} ChannelInfo
 * @property {string} name Channel name
 * @property {string} entity Responsible entity
 * @property {object} require Required fields
 * @property {ChannelClass} channel Channel reference
 *
 * @typedef {ChannelInfo[]} ChannelsInfo
 */

var CommBus =

/**
 * Creates and initializes a Channel Object
 */
function CommBusClass() {
    _classCallCheck(this, CommBusClass);

    /**** Private Attributes *************************************************************************************/

    var channelsInfo = {};

    /**** Private Methods ****************************************************************************************/

    /**
     * Validates if an object is as channel info definition
     *
     * @param {ChannelInfo} channelInfo
     * @returns {boolean}
     */
    function isValidChannelInformation(channelInfo) {
        // let forbiddenChars = /[\{\(]*/


        /* attribute entity registers tha responsible entity*/
        if (typeof channelInfo.entity === 'undefined') {
            return false;
        }
        // console.log(channelInfo.entity, forbiddenChars)
        // if (forbiddenChars.test(channelInfo.entity)) {
        //     return false
        // }

        /* attribute name must exist and represent the channel name */
        if (typeof channelInfo.name === 'undefined') {
            return false;
        }
        // if (forbiddenChars.test(channelInfo.name)) {
        //     return false
        // }

        /* require field must be an string array with the required attributes expressed as a string */
        return typeof channelInfo.require === 'undefined' || channelInfo.require.constructor === Array;
    }

    /**
     * Register channel(s) into the bus allowing the discovery by entity and by channel name
     *
     * @param {ChannelInfo[]} channels
     * @returns {String[]} List of the registered channels (entity.name)
     */
    function register(channels) {
        var registeredChannels = [];
        if (channels.constructor !== Array) {
            channels = [channels];
        }

        channels.forEach(function (channel) {
            if (isValidChannelInformation(channel)) {
                var channelInfo = Object.assign({}, channel);
                var entity = channelInfo.entity;
                var name = channelInfo.name;
                delete channelInfo.entity;
                delete channelInfo.name;
                channelInfo.channel = new _channel2.default(name);

                if (!channelsInfo.hasOwnProperty(entity)) {
                    Reflect.set(channelsInfo, entity, {});
                }
                var entityObj = Reflect.getOwnPropertyDescriptor(channelsInfo, entity).value;
                if (!entityObj.hasOwnProperty(name)) {
                    Reflect.set(entityObj, name, channelInfo);
                    registeredChannels.push(entity + '.' + name);
                }
            }
        });

        return registeredChannels;
    }

    /**
     * Check if a entity channel list and / or a specific channel exists
     *
     * @param {string} entity Entity name to search for
     * @param {string|null} channelName Channel name to search for
     * @returns {boolean}
     */
    function exists(entity, channelName) {
        if (channelsInfo.hasOwnProperty(entity)) {
            if (channelName !== null) {
                return get(entity, channelName) !== null;
            } else {
                return true;
            }
        }
        return false;
    }

    /**
     * Get a channel to work with
     *
     * @param {string} entity Entity name to search for
     * @param {string=} channelName Channel name to search for
     * @returns {ChannelClass|null}
     */
    function get(entity, channelName) {
        if (channelsInfo.hasOwnProperty(entity)) {
            var entityInfo = Reflect.getOwnPropertyDescriptor(channelsInfo, entity).value;
            if (entityInfo.hasOwnProperty(channelName)) {
                return Reflect.getOwnPropertyDescriptor(entityInfo, channelName).value.channel;
            }
        }
        return null;
    }

    /**** Privileged Methods *************************************************************************************/

    /**
     * Register channel(s) into the bus allowing the discovery by entity and by channel name
     *
     * @param {ChannelsInfo} channelsInfo
     */
    this.register = function () {
        var channelsInfo = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        return register(channelsInfo);
    };

    /**
     * Check if a entity channel list and / or a specific channel exists
     *
     * @param {string} entity Entity name to search for
     * @param {string|null} channelName Channel name to search for
     * @returns {boolean}
     */
    this.exists = function (entity) {
        var channelName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        return exists(entity, channelName);
    };

    /**
     * Get a channel to work with
     *
     * @param {string} entity Entity name to search for
     * @param {string=} channelName Channel name to search for
     * @returns {ChannelClass|null}
     */
    this.get = function (entity, channelName) {
        return get(entity, channelName);
    };
}

/**** Prototype Methods ******************************************************************************************/
;

exports.default = CommBus;
module.exports = exports['default'];

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _queue = __webpack_require__(3);

var _queue2 = _interopRequireDefault(_queue);

var _md = __webpack_require__(5);

var _md2 = _interopRequireDefault(_md);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// import md5 from 'md5'

// TODO: need this to be WebWorker Working
var channel =

/**
 * Creates and initializes a Channel Object
 */
function ChannelClass(channelName) {
    var initOnHold = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    _classCallCheck(this, ChannelClass);

    /**** Private Attributes *************************************************************************************/

    var CLOSED_STATUS = 0;
    var OPEN_STATUS = 1;
    var ON_HOLD_STATUS = 2;

    var processingQueue = false;
    var name = channelName;
    var statusOpen = true;
    var statusHold = initOnHold || false;
    var hookList = [];
    var listenerQ = new _queue2.default();
    var messageQ = new _queue2.default();

    /**** Private Methods ****************************************************************************************/

    /**
     * Get the channel name
     *
     * @returns {string}
     */
    function getName() {
        return name;
    }

    function isProcessingQueue() {
        return processingQueue;
    }

    /**
     * Check if the channel is open
     *
     * @returns {boolean}
     */
    function isOpen() {
        return statusOpen;
    }

    /**
     * Check if the channel is on hold
     *
     * @returns {boolean}
     */
    function isOnHold() {
        return statusOpen && statusHold;
    }

    /**
     * Check if the channel is active
     *
     * @returns {boolean}
     */
    function isActive() {
        return statusOpen && !statusHold;
    }

    function startQueueProcessing() {
        while (isProcessingQueue()) {}
        processingQueue = true;
    }

    function endQueueProcessing() {
        processingQueue = false;
    }

    /**
     * Change the channel status and start processing if it is not on hold
     */
    function start() {
        if (!isOnHold()) {
            startQueueProcess();
        }
    }

    /**
     * Open the channel activity (if not active)
     *
     * @returns {boolean}
     */
    function open() {
        if (!isActive()) {
            statusOpen = true;
            statusHold = false;
            startQueueProcess();
            return true;
        }
        return false;
    }

    /**
     * Closes the channel activity (if open)
     *
     * @returns {boolean}
     */
    function close() {
        if (isOpen()) {
            statusOpen = false;
            return true;
        }
        return false;
    }

    /**
     * Freezes the channel activity (if active)
     *
     * @returns {boolean}
     */
    function hold() {
        if (isActive()) {
            statusHold = true;
            return true;
        }
        return false;
    }

    /**
     * Resume the channel activity (if on hold)
     *
     * @returns {boolean}
     */
    function resume() {
        if (isOnHold()) {
            statusHold = false;
            startQueueProcess();
            return true;
        }
        return false;
    }

    /**
     * Get the channel status
     *
     * @returns {number}
     */
    function getStatus() {
        if (!isOpen()) {
            return CLOSED_STATUS;
        }

        if (isOnHold()) {
            return ON_HOLD_STATUS;
        }

        return OPEN_STATUS;
    }

    /**
     * Add a listener to the channel
     *
     * @param {object} listenerInfo
     */
    function addListener(listenerInfo) {
        return listenerQ.add(listenerInfo);
    }

    /**
     * Remove a listener from the channel
     *
     * @param {string} id listener ID
     */
    function removeListener(id) {
        listenerQ.cancel(id);
        cancelHook(id);
    }

    /**
     * Cancel a hook from the active hook list
     *
     * @param {string} id listener ID
     */
    function cancelHook(id) {
        try {
            var idx = hookList.findIndex(function (item) {
                return item.qid === id;
            });
            if (idx >= 0) {
                hookList.splice(idx, 1);
            }
            // for (let idx = 0; idx < hookList.length; idx++) {
            //     if (hookList[idx].qid === id) {
            //         hookList.splice(idx, 1)
            //         break
            //     }
            // }
        } catch (e) {
            // something went wrong probably list length change due to concurrent cancellation / activity
        }
    }

    /**
     * Gets a listener information for the provided ID
     *
     * @param {string} id listener ID
     * @returns {*}
     */
    function getListenerInfo(id) {
        startQueueProcessing();
        var toReturn = listenerQ.get(id);
        endQueueProcessing();
        if (toReturn === null) {
            try {
                var obj = hookList.find(function (item) {
                    return item.qid === id;
                });
                if (typeof obj !== 'undefined') {
                    toReturn = obj.data;
                }
            } catch (e) {
                // something went wrong probably list length change due to cancellation / activity
            }
        } else {
            toReturn = toReturn.data;
        }

        return toReturn;
    }

    /**
     * Processes a message and send it to all registered hook
     *
     * @param {object} message
     */
    function processMessage(message) {
        try {
            hookList.forEach(function (item) {
                if (typeof item.data.listener !== 'undefined') {
                    item.data.listener(message);
                    if (item.data.times > 0) {
                        item.data.times--;
                    }
                }
            });
            hookList = hookList.filter(function (item) {
                return typeof item.data === 'undefined' || typeof item.data.times === 'undefined' || item.data.times !== 0;
            });
        } catch (e) {
            // something went wrong probably list length change due to cancellation / activity
        }
    }

    /**
     * Send a messagr to the channel
     *
     * @param {object} message
     */
    function send(message) {
        return messageQ.add(message);
    }

    /**
     * Sends a message to the channel and makes the listener hear
     *
     * @param {object} message
     * @param {object} listenerInfo
     */
    function sendAndListen(message, listenerInfo) {
        addListener(listenerInfo);
        send(message);
    }

    /**
     * Get a message information for the provided id
     *
     * @param {string} id Message ID
     */
    function getMessageInfo(id) {
        return messageQ.get(id);
    }

    /**
     * Starts the queue process so we can deal with the pending in the queues
     */
    function startQueueProcess() {
        if (isActive()) {
            processListenersQueue();
            processMessagesQueue();
            setTimeout(startQueueProcess, 0);
        }
    }

    /**
     * Processes the listener queue
     */
    function processListenersQueue() {
        if (!isProcessingQueue()) {
            startQueueProcessing();
            var md5 = new _md2.default();
            var hash = null;
            var listenerInfo = listenerQ.next();
            while (listenerInfo !== null) {
                hash = md5.calculate(listenerInfo.toString());
                var item = { id: hash, qid: listenerInfo.id, data: listenerInfo.data };
                hookList.push(item);
                listenerInfo = listenerQ.next();
            }
            endQueueProcessing();
        }
    }

    /**
     * Proceoo the message queue
     */
    function processMessagesQueue() {
        var message = messageQ.next();
        while (message !== null) {
            processMessage(message.data);
            message = messageQ.next();
        }
    }

    // initializes the state
    start();

    /**** Privileged Methods *************************************************************************************/

    this.getName = function () {
        return getName();
    };

    this.getStatus = function () {
        return getStatus();
    };

    this.open = function () {
        return open();
    };

    this.close = function () {
        return close();
    };

    this.hold = function () {
        return hold();
    };

    this.resume = function () {
        return resume();
    };

    this.addListener = function (listenerInfo) {
        return addListener(listenerInfo);
    };

    this.removeListener = function (id) {
        return removeListener(id);
    };

    this.listenerInfo = function (id) {
        return getListenerInfo(id);
    };

    this.send = function (message) {
        return send(message);
    };

    this.sendAndListen = function (message, listenerInfo) {
        return sendAndListen(message, listenerInfo);
    };

    this.messageInfo = function (id) {
        return getMessageInfo(id);
    };
}

/**** Prototype Methods ******************************************************************************************/
;

exports.default = channel;
module.exports = exports['default'];

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _values = __webpack_require__(4);

var _values2 = _interopRequireDefault(_values);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Queue =

/**
 * Creates and initializes a Values object
 * @constructor
 */
function QueueClass() {
    _classCallCheck(this, QueueClass);

    /**** Private Attributes *************************************************************************************/

    var queue = [];
    var queuedData = new _values2.default();
    var lock = false;

    /**** Private Methods ****************************************************************************************/

    /**
     * Check if there is a lock for the queue
     *
     * @returns {boolean}
     */
    function isLocked() {
        return lock;
    }

    /**
     * Lock the queue for doing operations
     */
    function getLock() {
        while (isLocked()) {}
        lock = true;
    }

    /**
     * Release the lock
     */
    function releaseLock() {
        lock = false;
    }

    /**
     * Gets the first in queue line and remove it from the list
     *
     * @returns {*|null} Value or null if not present
     */
    function next() {
        if (queue.length > 0) {
            getLock();
            var id = queue.shift();
            var data = get(id);
            queuedData.destroy(id);
            releaseLock();
            return data;
        } else {
            return null;
        }
    }

    /**
     * Adds a new data to the queue
     *
     * @param {*} data Any structure or simple type allowed
     * @returns {string}
     */
    function add(data) {
        getLock();
        var id = Date.now().toString();
        // Make sure that we do not have the same key already stored
        while (queuedData.isSet(id)) {
            id = Date.now().toString();
        }
        queuedData.set(id, { id: id, data: data });
        queue.push(id);
        releaseLock();
        return id;
    }

    /**
     * Cancel a queued data, by removing it from the queue and from the data
     *
     * @param {string} id Queued Data identifier
     * @returns {boolean|null}
     */
    function cancel(id) {
        var pos = queue.indexOf(id);
        if (pos >= 0) {
            getLock();
            queue.splice(pos, 1);
            var result = queuedData.destroy(id);
            releaseLock();
            return result !== null ? result : true;
        }
        return null;
    }

    /**
     * Gets the value of a specific id (if present)
     *
     * @param {string} id Queued Data identifier
     * @returns {*|null} Value or null if not present
     */
    function get(id) {
        return queuedData.get(id);
    }

    /**** Privileged Methods *************************************************************************************/

    /**
     * Gets the first in queue line and remove it from the list
     *
     * @returns {*|null} Value or null if not present
     */
    this.next = function () {
        return next();
    };

    /**
     * Adds a new data to the queue
     *
     * @param {*} data Any structure or simple type allowed
     * @returns {string}
     */
    this.add = function (data) {
        return add(data);
    };

    /**
     * Cancel a queued data, by removing it from the queue and from the data
     *
     * @param {string} id Queued Data identifier
     * @returns {boolean}
     */
    this.cancel = function (id) {
        return cancel(id);
    };

    /**
     * Gets the value of a specific id (if present)
     *
     * @param {string} id Queued Data identifier
     * @returns {*|null} Value or null if not present
     */
    this.get = function (id) {
        return get(id);
    };
}

/**** Prototype Methods ******************************************************************************************/
;

exports.default = Queue;
// module.exports = Queue

module.exports = exports['default'];

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Values =

/**
 * Creates and initializes a Values object
 *
 * @param {object} values Object with variables
 * // param {int} ttlToSet Number of seconds before deprecating
 */
function ValuesClass() /*, ttlToSet = null*/{
    var values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    _classCallCheck(this, ValuesClass);

    /**** Private Attributes *************************************************************************************/

    // let ttl = ttlToSet || null
    var dirty = values !== null;
    var value = values || {};
    var eol = null;

    // if (ttl !== null && !isNaN(ttl)) {
    //     eol = (Date.now() / 1000) + ttl
    // }

    /**** Private Methods ****************************************************************************************/

    /**
     * Sets the dirty flag to inform that the data was changed
     */
    function setDirty() {
        dirty = true;
    }

    /**
     * Checks if the data is valid (if its not deprecated by ttl)
     *
     * @returns {boolean}
     */
    function isValid() {
        return Date.now() / 1000 < eol;
    }

    /**
     * Resolve and returns the reference for the provided variable path
     *
     * @param {string} fullPath Object notation 'some.variable.name'
     * @returns {Object|{}}
     */
    function getPointerTo(fullPath) {
        var varPath = fullPath.split('.');
        var level = value;
        varPath.forEach(function (name) {
            if (level.hasOwnProperty(name)) {
                level = Reflect.getOwnPropertyDescriptor(level, name).value;
            } else {
                level = null;
            }
        });
        return level;
    }

    /**
     * Deletes a specified variable
     *
     * @param {string} fullPath Object notation 'some.variable.name'
     * @returns {boolean}
     */
    function destroy(fullPath) {
        var previousPathToDestroy = fullPath.split('.');

        if (previousPathToDestroy.length > 1) {
            var pathToDestroy = previousPathToDestroy[previousPathToDestroy.length - 1];
            previousPathToDestroy.splice(previousPathToDestroy.length - 1, 1);

            var holder = getPointerTo(previousPathToDestroy.join('.'));
            if (holder.hasOwnProperty(pathToDestroy)) {
                Reflect.deleteProperty(holder, pathToDestroy);
            } else {
                return false;
            }
        } else if (previousPathToDestroy.length > 0) {
            if (value.hasOwnProperty(previousPathToDestroy[0])) {
                Reflect.deleteProperty(value, previousPathToDestroy[0]);
            } else {
                return false;
            }
        } else {
            return false;
        }
        return true;
    }

    /**
     * Get a specific variable in the provided path
     *
     * @param {string} fullPath Object notation 'some.variable.name'
     * @returns {*}
     */
    function get(fullPath) {
        var varPath = fullPath.split('.');
        var level = value;
        var returnValue = null;
        var ended = false;

        varPath.forEach(function (name, idx) {
            if (!ended && level.hasOwnProperty(name)) {
                if (idx < varPath.length - 1) {
                    level = Reflect.getOwnPropertyDescriptor(level, name).value;
                } else {
                    returnValue = Reflect.getOwnPropertyDescriptor(level, name).value;
                    ended = true;
                }
            } else {
                ended = true;
            }
        });

        return returnValue;
    }

    /**
     * Sets a specified variable by path
     *
     * @param {string} fullPath Object notation 'some.variable.name'
     * @param {*} valueToSet Values to be stored
     */
    function set(fullPath, valueToSet) {
        var varPath = fullPath.split('.');
        var level = value;
        varPath.forEach(function (name, idx) {
            if (idx < varPath.length - 1) {
                Reflect.set(level, name, {});
                level = Reflect.getOwnPropertyDescriptor(level, name).value;
            } else {
                Reflect.set(level, name, valueToSet);
                setDirty();
            }
        });
    }

    /**
     * Check if the provided path is set
     *
     * @param {string} fullPath Object notation 'some.variable.name'
     * @returns {boolean}
     */
    function isSet(fullPath) {
        return getPointerTo(fullPath) !== null;
    }

    /**** Privileged Methods *************************************************************************************/

    /**
     * Check if the data was set
     *
     * @returns {boolean}
     */
    this.isSet = function () {
        return value !== null;
    };

    /**
     * Checks if the data was changed
     *
     * @returns {boolean}
     */
    this.isDirty = function () {
        return dirty;
    };

    /**
     * Checks if the data is valid (if its not deprecated by ttl)
     *
     * @returns {boolean}
     */
    this.isValid = function () {
        return isValid();
    };

    /**
     * Export all the data as it is
     *
     * @returns {object}
     */
    this.export = function () {
        return value;
    };

    /**
     * Adds a value to the data
     *
     * @param {string} fullPath Object notation 'some.variable.name.to.be.set'
     * @param {*} valueToSet
     */
    this.set = function (fullPath, valueToSet) {
        set(fullPath, valueToSet);
    };

    /**
     * Checks if a path is set
     *
     * @param {string} fullPath Object notation 'some.variable.name.to.check'
     * @returns {boolean}
     */
    this.isSet = function (fullPath) {
        return isSet(fullPath);
    };

    /**
     * Get a specific value
     *
     * @param {string} fullPath Object notation 'some.variable.name.to.fetch'
     * @returns {*}
     */
    this.get = function (fullPath) {
        return get(fullPath);
    };

    /**
     * Destroy a specific variable
     *
     * @param {string} fullPath Object notation 'some.variable.name.to.fetch'
     * @returns {boolean}
     */
    this.destroy = function (fullPath) {
        return destroy(fullPath);
    };
}

/**** Prototype Methods ******************************************************************************************/
;

exports.default = Values;
module.exports = exports['default'];

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Fastest md5 implementation around (JKM md5).
 *
 * Credits: Joseph Myers
 * Updated by Joao Correia 2017 - 2018.
 *
 * @see http://www.myersdaily.org/joseph/javascript/md5-text.html
 * @see http://jsperf.com/md5-shootout/7
 */
var md5 =

/**
 * Creates and initializes a Values object
 *
 * @param {boolean} alwaysUseSafe This will override and use always the special IE mode (exists for safety reason)
 */
function MD5() {
    var alwaysUseSafe = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    _classCallCheck(this, MD5);

    /**** Private Attributes *************************************************************************************/

    var hexChr = '0123456789abcdef'.split('');

    // Some IEs are the only ones known of that need the idiotic function.
    var isSpecialIe = false;
    if (alwaysUseSafe || '5d41402abc4b2a76b9719d911017c592' !== calculate('hello')) {
        isSpecialIe = true;
    }

    /**** Private Methods ****************************************************************************************/

    /**
     * Turn a 32-bit number to a hexadecimal string with least significant byte first
     *
     * @param {int} num 32-bit Number
     * @returns {string} Hexadecimal representation of the provided number
     */
    function numberToHex(num) {
        var str = '';
        for (var idx = 0; idx < 4; idx++) {
            str += hexChr[num >> idx * 8 + 4 & 0x0F] + hexChr[num >> idx * 8 & 0x0F];
        }
        return str;
    }

    /**
     * Add integers, wrapping at 2^32.
     * This uses 16-bit operations internally to work around bugs in some JS interpreters if necessary.
     *
     * @aka add32
     *
     * @param {int} x
     * @param {int} y
     * @returns {number}
     */
    function add(x, y) {
        if (!alwaysUseSafe && !isSpecialIe) {
            return x + y & 0xFFFFFFFF;
        } else {
            var leastSignificantWord = (x & 0xFFFF) + (y & 0xFFFF);
            var mostSignificantWord = (x >> 16) + (y >> 16) + (leastSignificantWord >> 16);
            return mostSignificantWord << 16 | leastSignificantWord & 0xFFFF;
        }
    }

    /**
     * These functions implement the basic operation for each round of the
     * algorithm.
     */
    function cmn(q, a, b, x, s, t) {
        a = add(add(a, q), add(x, t));
        return add(a << s | a >>> 32 - s, b);
    }

    function ff(a, b, c, d, x, s, t) {
        return cmn(b & c | ~b & d, a, b, x, s, t);
    }

    function gg(a, b, c, d, x, s, t) {
        return cmn(b & d | c & ~d, a, b, x, s, t);
    }

    function hh(a, b, c, d, x, s, t) {
        return cmn(b ^ c ^ d, a, b, x, s, t);
    }

    function ii(a, b, c, d, x, s, t) {
        return cmn(c ^ (b | ~d), a, b, x, s, t);
    }

    /**
     * Convert a string into block representation
     *
     * @param {string} data
     * @returns {array}
     */
    function stringToBlocks(data) {
        var blocks = [];
        for (var idx = 0; idx < 64; idx += 4) {
            blocks[idx >> 2] = data.charCodeAt(idx) + (data.charCodeAt(idx + 1) << 8) + (data.charCodeAt(idx + 2) << 16) + (data.charCodeAt(idx + 3) << 24);
        }
        return blocks;
    }

    /**
     * Convert an array of integers to an hex string
     *
     * @param {int[]} blocks
     * @returns {string}
     */
    function blocksToHex(blocks) {
        var hex_result = [];
        blocks.forEach(function (block) {
            hex_result.push(numberToHex(block));
        });
        return hex_result.join('');
    }

    /**
     * Cycle through blocks
     *
     * @param {int[]} state
     * @param {int[]} blocks
     */
    function cycle(state, blocks) {
        var val_a = state[0];
        var val_b = state[1];
        var val_c = state[2];
        var val_d = state[3];

        val_a = ff(val_a, val_b, val_c, val_d, blocks[0], 7, -680876936);
        val_d = ff(val_d, val_a, val_b, val_c, blocks[1], 12, -389564586);
        val_c = ff(val_c, val_d, val_a, val_b, blocks[2], 17, 606105819);
        val_b = ff(val_b, val_c, val_d, val_a, blocks[3], 22, -1044525330);
        val_a = ff(val_a, val_b, val_c, val_d, blocks[4], 7, -176418897);
        val_d = ff(val_d, val_a, val_b, val_c, blocks[5], 12, 1200080426);
        val_c = ff(val_c, val_d, val_a, val_b, blocks[6], 17, -1473231341);
        val_b = ff(val_b, val_c, val_d, val_a, blocks[7], 22, -45705983);
        val_a = ff(val_a, val_b, val_c, val_d, blocks[8], 7, 1770035416);
        val_d = ff(val_d, val_a, val_b, val_c, blocks[9], 12, -1958414417);
        val_c = ff(val_c, val_d, val_a, val_b, blocks[10], 17, -42063);
        val_b = ff(val_b, val_c, val_d, val_a, blocks[11], 22, -1990404162);
        val_a = ff(val_a, val_b, val_c, val_d, blocks[12], 7, 1804603682);
        val_d = ff(val_d, val_a, val_b, val_c, blocks[13], 12, -40341101);
        val_c = ff(val_c, val_d, val_a, val_b, blocks[14], 17, -1502002290);
        val_b = ff(val_b, val_c, val_d, val_a, blocks[15], 22, 1236535329);

        val_a = gg(val_a, val_b, val_c, val_d, blocks[1], 5, -165796510);
        val_d = gg(val_d, val_a, val_b, val_c, blocks[6], 9, -1069501632);
        val_c = gg(val_c, val_d, val_a, val_b, blocks[11], 14, 643717713);
        val_b = gg(val_b, val_c, val_d, val_a, blocks[0], 20, -373897302);
        val_a = gg(val_a, val_b, val_c, val_d, blocks[5], 5, -701558691);
        val_d = gg(val_d, val_a, val_b, val_c, blocks[10], 9, 38016083);
        val_c = gg(val_c, val_d, val_a, val_b, blocks[15], 14, -660478335);
        val_b = gg(val_b, val_c, val_d, val_a, blocks[4], 20, -405537848);
        val_a = gg(val_a, val_b, val_c, val_d, blocks[9], 5, 568446438);
        val_d = gg(val_d, val_a, val_b, val_c, blocks[14], 9, -1019803690);
        val_c = gg(val_c, val_d, val_a, val_b, blocks[3], 14, -187363961);
        val_b = gg(val_b, val_c, val_d, val_a, blocks[8], 20, 1163531501);
        val_a = gg(val_a, val_b, val_c, val_d, blocks[13], 5, -1444681467);
        val_d = gg(val_d, val_a, val_b, val_c, blocks[2], 9, -51403784);
        val_c = gg(val_c, val_d, val_a, val_b, blocks[7], 14, 1735328473);
        val_b = gg(val_b, val_c, val_d, val_a, blocks[12], 20, -1926607734);

        val_a = hh(val_a, val_b, val_c, val_d, blocks[5], 4, -378558);
        val_d = hh(val_d, val_a, val_b, val_c, blocks[8], 11, -2022574463);
        val_c = hh(val_c, val_d, val_a, val_b, blocks[11], 16, 1839030562);
        val_b = hh(val_b, val_c, val_d, val_a, blocks[14], 23, -35309556);
        val_a = hh(val_a, val_b, val_c, val_d, blocks[1], 4, -1530992060);
        val_d = hh(val_d, val_a, val_b, val_c, blocks[4], 11, 1272893353);
        val_c = hh(val_c, val_d, val_a, val_b, blocks[7], 16, -155497632);
        val_b = hh(val_b, val_c, val_d, val_a, blocks[10], 23, -1094730640);
        val_a = hh(val_a, val_b, val_c, val_d, blocks[13], 4, 681279174);
        val_d = hh(val_d, val_a, val_b, val_c, blocks[0], 11, -358537222);
        val_c = hh(val_c, val_d, val_a, val_b, blocks[3], 16, -722521979);
        val_b = hh(val_b, val_c, val_d, val_a, blocks[6], 23, 76029189);
        val_a = hh(val_a, val_b, val_c, val_d, blocks[9], 4, -640364487);
        val_d = hh(val_d, val_a, val_b, val_c, blocks[12], 11, -421815835);
        val_c = hh(val_c, val_d, val_a, val_b, blocks[15], 16, 530742520);
        val_b = hh(val_b, val_c, val_d, val_a, blocks[2], 23, -995338651);

        val_a = ii(val_a, val_b, val_c, val_d, blocks[0], 6, -198630844);
        val_d = ii(val_d, val_a, val_b, val_c, blocks[7], 10, 1126891415);
        val_c = ii(val_c, val_d, val_a, val_b, blocks[14], 15, -1416354905);
        val_b = ii(val_b, val_c, val_d, val_a, blocks[5], 21, -57434055);
        val_a = ii(val_a, val_b, val_c, val_d, blocks[12], 6, 1700485571);
        val_d = ii(val_d, val_a, val_b, val_c, blocks[3], 10, -1894986606);
        val_c = ii(val_c, val_d, val_a, val_b, blocks[10], 15, -1051523);
        val_b = ii(val_b, val_c, val_d, val_a, blocks[1], 21, -2054922799);
        val_a = ii(val_a, val_b, val_c, val_d, blocks[8], 6, 1873313359);
        val_d = ii(val_d, val_a, val_b, val_c, blocks[15], 10, -30611744);
        val_c = ii(val_c, val_d, val_a, val_b, blocks[6], 15, -1560198380);
        val_b = ii(val_b, val_c, val_d, val_a, blocks[13], 21, 1309151649);
        val_a = ii(val_a, val_b, val_c, val_d, blocks[4], 6, -145523070);
        val_d = ii(val_d, val_a, val_b, val_c, blocks[11], 10, -1120210379);
        val_c = ii(val_c, val_d, val_a, val_b, blocks[2], 15, 718787259);
        val_b = ii(val_b, val_c, val_d, val_a, blocks[9], 21, -343485551);

        state[0] = add(val_a, state[0]);
        state[1] = add(val_b, state[1]);
        state[2] = add(val_c, state[2]);
        state[3] = add(val_d, state[3]);
    }

    /**
     * Take a string and return the hex representation of its MD5.
     *
     * @param {string} data Data to be used for the calculation
     * @returns {string}
     */
    function calculate(data) {
        var data_length = data.length;
        var state = [1732584193, -271733879, -1732584194, 271733878];
        var idx = void 0;

        for (idx = 64; idx <= data.length; idx += 64) {
            cycle(state, stringToBlocks(data.substring(idx - 64, idx)));
        }

        data = data.substring(idx - 64);
        var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (idx = 0; idx < data.length; idx++) {
            tail[idx >> 2] |= data.charCodeAt(idx) << (idx % 4 << 3);
        }
        tail[idx >> 2] |= 0x80 << (idx % 4 << 3);
        if (idx > 55) {
            // TODO: Test, the next two lines aren't covered by the tests
            cycle(state, tail);
            tail.fill(0, 0, 15);
            // TODO: Remove this comments after tests are in place and working correctly
            // Updated for vulnerability prevention warning raise from original code
            // for (idx = 0; idx < 16; idx++) { tail[idx] = 0 }
        }
        tail[14] = data_length * 8;
        cycle(state, tail);

        return blocksToHex(state);
    }

    /**** Privileged Methods *************************************************************************************/

    this.calculate = function (data) {
        return calculate(data);
    };
};

exports.default = md5;
module.exports = exports['default'];

/***/ })
/******/ ]);
});
//# sourceMappingURL=impulses.js.map