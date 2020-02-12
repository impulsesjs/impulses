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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
var Md5 =

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
     * Run the cycle calculation
     *
     * @param {int[]} blocks
     * @param {object} settings
     */
    function runCyclesCalc(blocks, settings) {
        settings.cycles.reduce(function (currentState, cycleInfo) {
            /** @property {function} cycleInfo.method */
            /** @property {int[]} cycleInfo.blockMap */
            /** @property {int[]} cycleInfo.extra */
            cycleInfo.blockMap.forEach(function (pos, idx) {
                currentState[0] = cycleInfo.method.apply(cycleInfo, [].concat(_toConsumableArray(currentState), [blocks[pos]], _toConsumableArray(cycleInfo.extra[idx])));
                currentState.unshift(currentState.pop());
            });
            return currentState;
        }, settings.runState);
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

        var settings = {
            runState: [val_a, val_b, val_c, val_d],
            cycles: [{ method: ff, blockMap: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], extra: [[7, -680876936], [12, -389564586], [17, 606105819], [22, -1044525330], [7, -176418897], [12, 1200080426], [17, -1473231341], [22, -45705983], [7, 1770035416], [12, -1958414417], [17, -42063], [22, -1990404162], [7, 1804603682], [12, -40341101], [17, -1502002290], [22, 1236535329]]
            }, { method: gg, blockMap: [1, 6, 11, 0, 5, 10, 15, 4, 9, 14, 3, 8, 13, 2, 7, 12], extra: [[5, -165796510], [9, -1069501632], [14, 643717713], [20, -373897302], [5, -701558691], [9, 38016083], [14, -660478335], [20, -405537848], [5, 568446438], [9, -1019803690], [14, -187363961], [20, 1163531501], [5, -1444681467], [9, -51403784], [14, 1735328473], [20, -1926607734]]
            }, { method: hh, blockMap: [5, 8, 11, 14, 1, 4, 7, 10, 13, 0, 3, 6, 9, 12, 15, 2], extra: [[4, -378558], [11, -2022574463], [16, 1839030562], [23, -35309556], [4, -1530992060], [11, 1272893353], [16, -155497632], [23, -1094730640], [4, 681279174], [11, -358537222], [16, -722521979], [23, 76029189], [4, -640364487], [11, -421815835], [16, 530742520], [23, -995338651]]
            }, { method: ii, blockMap: [0, 7, 14, 5, 12, 3, 10, 1, 8, 15, 6, 13, 4, 11, 2, 9], extra: [[6, -198630844], [10, 1126891415], [15, -1416354905], [21, -57434055], [6, 1700485571], [10, -1894986606], [15, -1051523], [21, -2054922799], [6, 1873313359], [10, -30611744], [15, -1560198380], [21, 1309151649], [6, -145523070], [10, -1120210379], [15, 718787259], [21, -343485551]]
            }]
        };
        runCyclesCalc(blocks, settings);

        state[0] = add(settings.runState[0], state[0]);
        state[1] = add(settings.runState[1], state[1]);
        state[2] = add(settings.runState[2], state[2]);
        state[3] = add(settings.runState[3], state[3]);
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

exports.Md5 = Md5;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _api = __webpack_require__(2);

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _api.Api;
  }
});
module.exports = exports['default'];

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Api = undefined;

var _md = __webpack_require__(0);

var _bus = __webpack_require__(3);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Api =

/**
 * Creates and initializes a bus Object
 *
 * @throws TypeError
 *
 * @param {Object} [configuration={}] Api configuration object
 * @param {Bus} [providedBus=null]   Bus object that will be considered public
 */
function ApiClass() {
    var configuration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var providedBus = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    _classCallCheck(this, ApiClass);

    // Configuration Validation
    if (configuration.constructor !== Object) {
        throw TypeError('Configuration must be of type Object');
    }

    if (providedBus !== null && providedBus.constructor !== _bus.Bus) {
        throw TypeError('Public BUS Object is Invalid');
    }

    /**** Private Attributes *************************************************************************************/
    var listenersId = new Map();
    var bus = providedBus;
    var id = undefined;

    id = initId();
    /**** Private Methods ****************************************************************************************/

    function initId() {
        if (!id) {
            // TODO: Make the hash more unique 
            return new _md.Md5().calculate(JSON.stringify(this) + ('' + Math.random() * 5000));
        }
        return id;
    }

    /**
     * Gets the API id
     * 
     * @return {string}
     */
    function getId() {
        return id;
    }

    /**
     * Check if a given bus is set
     *
     * @return {Boolean}     True if the bus is valid
     */
    function isBusSet() {
        return bus !== null;
    }

    /**
     * Validates if a given object is a valid bus object
     *
     * @param  {Bus} busToCheck Object to be validated
     * @return {boolean} True if the bus is valid
     */
    function isBus(busToCheck) {
        return busToCheck.constructor === _bus.Bus;
    }

    function setBus(busToSet) {
        if (isBus(busToSet)) {
            bus = busToSet;
            // TODO: Need to reset any map related to the previous bus
        } else {
            throw TypeError('Expecting Bus type');
        }
    }

    /**
     * Verifies the minimum required structure for the Channel Configuration
     *
     * @param  {Object}  channelConfig Channel configuration object
     * @return {Boolean} True if valid
     */
    function isValidChannelConfig(channelConfig) {
        if (channelConfig.constructor === Object) {
            if (channelConfig.hasOwnProperty('entity')) {
                if (channelConfig.hasOwnProperty('channels') && channelConfig.channels.constructor === Array) {
                    return true;
                }
            }
        }
        return false;
    }

    /*************************************************************/
    /** Channel Related ******************************************/
    /*************************************************************/

    /**
     * Gets channel object if exists
     * 
     * @param {String} entityName Entity Name
     * @param {String} channelName Channel Name
     * 
     * @returns {Channel|undefined}
     */
    function getChannel(entityName, channelName) {
        if (isBusSet()) {
            var channelObj = bus.get(entityName, channelName);
            if (channelObj !== null) {
                return channelObj;
            }
        }
        return undefined;
    }

    /**
     * Gets channel object by listener ID if exists
     * 
     * @param {String} entityName Entity Name
     * @param {String} channelName Channel Name
     * 
     * @returns {Channel|undefined}
     */
    function getChannelByListenerId(listenerId) {
        if (listenersId.has(listenerId)) {
            var _listenersId$get = listenersId.get(listenerId),
                entity = _listenersId$get.entity,
                channel = _listenersId$get.channel;

            return getChannel(entity, channel);
        }
        return undefined;
    }

    function getChannelStatus(entityName, channelName) {
        var channelObj = getChannel(entityName, channelName);
        return !!channelObj ? channelObj.getStatus() : undefined;
    }

    function openChannel(entityName, channelName) {
        var channelObj = getChannel(entityName, channelName);
        return !!channelObj && channelObj.open();
    }

    function closeChannel(entityName, channelName) {
        var channelObj = getChannel(entityName, channelName);
        return !!channelObj && channelObj.close();
    }

    function holdChannel(entityName, channelName) {
        var channelObj = getChannel(entityName, channelName);
        return !!channelObj && channelObj.hold();
    }

    function resumeChannel(entityName, channelName) {
        var channelObj = getChannel(entityName, channelName);
        return !!channelObj && channelObj.resume();
    }

    function initChannels() {
        var channelConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        if (isBusSet()) {
            if (isValidChannelConfig(channelConfig)) {
                var channels = channelConfig.channels.map(function (channelInfo) {
                    var res = {
                        entity: channelConfig.entity,
                        name: channelInfo.name
                    };
                    if (typeof channelInfo.require !== 'undefined') {
                        res.require = channelInfo.require;
                    }
                    if (typeof channelInfo.listenerInfo !== 'undefined') {
                        res.listener = channelInfo.listenerInfo;
                        res.listener.id = getId();
                    }
                    return res;
                });
                return bus.register(channels);
            } else {
                throw TypeError('Invalid channel configuration');
            }
        } else {
            throw Error('Target BUS is not set');
        }
    }

    function sanitizeChannelListenerMap() {
        listenersId.forEach(function (value, id, map) {
            if (!getChannelListenerInfo(id)) {
                removeChannelListener(listenerId);
            }
        });
    }

    function addChannelListener(entity, channel, listenerInfo) {
        sanitizeChannelListenerMap();
        var channelObj = getChannel(entity, channel);
        var listenerId = false;
        if (channelObj) {
            listenerId = channelObj.addListener(listenerInfo);
            if (listenerId) {
                listenersId.set(listenerId, { entity: entity, channel: channel });
            }
        }
        return listenerId;
    }

    function removeChannelListener(listenerId) {
        var channelObj = getChannelByListenerId(listenerId);
        if (channelObj) {
            channelObj.removeListener(listenerId);
        }
        listenersId.delete(listenerId);
    }

    function getChannelListenerInfo(listenerId) {
        var channelObj = getChannelByListenerId(listenerId);
        return !!channelObj ? channelObj.listenerInfo(listenerId) : null;
    }

    function sendMessage(entity, channel, message) {
        sanitizeChannelListenerMap();
        var channelObj = getChannel(entity, channel);
        return !!channelObj && channelObj.send(message);
    }

    function sendAndListen(entityName, channelName, message, listenerInfo) {
        var channelObj = getChannel(entityName, channelName);
        return !!channelObj ? channelObj.sendAndListen(message, listenerInfo) : false;
    }

    function getMessageInfo(entityName, channelName, messageId) {
        var channelObj = getChannel(entityName, channelName);
        return !!channelObj ? channelObj.messageInfo(messageId) : null;
    }

    /**
     * Discover if a channel exists
     * 
     * @param {String} entityName Entity name
     * @param {String} cahnnelName Channel name
     * 
     * @return {ChannelClass|false} False if no Channel found
     */
    function discoverChannel(entityName, cahnnelName) {
        // TODO: Refactor - same as getChannel
        if (isBusSet()) {
            return bus.get(entityName, cahnnelName);
        }
        return false;
    }

    /**
     * Get the information for the reply
     *
     * @param  {Object} message Message
     * @return {Object|false} Entity and Channel information or false if none
     */
    function getReplyInformation(message) {
        if (typeof message.reply_stack !== 'undefined') {
            return message.reply_stack.pop();
        }
        return false;
    }

    function reply(message, requestMessage) {
        var reply_to = getReplyInformation(requestMessage);
        if (reply_to !== false) {
            var channelFound = discoverChannel(reply_to.entity, reply_to.name);
            if (channelFound) {
                message.reply = true;
                channelFound.send(message);
                return true;
            }
        }
        return false;
    }

    /**** Privileged Methods *************************************************************************************/

    /**
     * Get the API id
     * 
     * @return {string} 
     */
    this.getId = function () {
        return getId();
    };

    /*************************************************************/
    /** Bus Related **********************************************/
    /*************************************************************/

    /**
     * Checks if the BUS is defined
     *
     * @return {boolean} True if the public bus is set
     */
    this.hasBus = function () {
        return isBusSet();
    };

    /**
     * Sets/Overrides the BUS
     *
     * @throws TypeError
     *
     * @param {Bus} busToSet BUS to be used as public
     */
    this.setBus = function (bus) {
        return setBus(bus);
    };

    /*************************************************************/
    /** Channel Related ******************************************/
    /*************************************************************/

    /**
     * Get a specific channel status
     * 
     * @param {String} entityName Entity Name
     * @param {String} channelName Channel Name
     * 
     * @returns {Number} 
     */
    this.getChannelStatus = function (entityName, channelName) {
        return getChannelStatus(entityName, channelName);
    };
    /**
     * Open the channel activity (if not active)
     * 
     * @param {String} entityName Entity Name
     * @param {String} channelName Channel Name
     * 
     * @returns {Boolean}
     */
    this.openChannel = function (entityName, channelName) {
        return openChannel(entityName, channelName);
    };

    /**
     * Close the channel activity (if open)
     * 
     * @param {String} entityName Entity Name
     * @param {String} channelName Channel Name
     * 
     * @returns {Boolean}
     */
    this.closeChannel = function (entityName, channelName) {
        return closeChannel(entityName, channelName);
    };

    /**
     * Freezes the channel activity (if active)
     * 
     * @param {String} entityName Entity Name
     * @param {String} channelName Channel Name
     * 
     * @returns {Boolean}
     */
    this.holdChannel = function (entityName, channelName) {
        return holdChannel(entityName, channelName);
    };

    /**
     * Resume the channel activity (if on hold)
     * 
     * @param {String} entityName Entity Name
     * @param {String} channelName Channel Name
     * 
     * @returns {Boolean}
     */
    this.resumeChannel = function (entityName, channelName) {
        return resumeChannel(entityName, channelName);
    };

    /**
     * Bulk channel initialization
     *
     * @throws Error, TypeError
     *
     * @param  {Object} [channelConfig={}] Channel Configuration Object
     * @returns {String[]} Array with registered channels (check bus.register)
     */
    this.initChannels = function (channelConfig) {
        return initChannels(channelConfig);
    };

    /**
     * Adds a listener to a specific channel
     * 
     * @param {String} entity 
     * @param {String} channel 
     * @param {{id: Number, listener: Function}} listener 
     * 
     * @returns {String|false}
     */
    this.addListener = function (entityName, channelName, listener) {
        return addChannelListener(entityName, channelName, listener);
    };

    /**
     * Remove a listener
     *
     * @param {String} listenerId listener ID
     */
    this.removeListener = function (listenerId) {
        return removeChannelListener(listenerId);
    };

    /**
     * Gets a listener information for the provided ID
     *
     * @param {String} listenerId listener ID
     * @returns {Object|null}
     */
    this.getListenerInfo = function (listenerId) {
        return getChannelListenerInfo(listenerId);
    };

    /**
     * Discover if a channel exists
     * 
     * @param {String} entityName Entity name
     * @param {String} cahnnelName Channel name
     * 
     * @return {ChannelClass|false} False if no Channel found
     */
    this.exists = function (entityName, channelName) {
        return !!discoverChannel(entityName, channelName);
    };

    /**
     * Send a message to the BUS
     *
     * @param {String} entityName  Entity name
     * @param {String} channelName Channel name
     * @param {Object} message Message to be sent
     *
     * @return {int|false} Registered Message ID or False
     */
    this.send = function (entityName, channelName, message) {
        return sendMessage(entityName, channelName, message);
    };

    /**
     * Sends a message to the channel and makes the listener hear
     *
     * @param {String} entityName  Entity name
     * @param {String} channelName Channel name
     * @param {Object} message
     * @param {Object} listenerInfo
     *
     * @return {String|false} listenerId
     */
    this.sendAndListen = function (entityName, channelName, message, listenerInfo) {
        return sendAndListen(entityName, channelName, message, listenerInfo);
    };

    /**
     * Gets a message information for a specific ID
     * 
     * @param {String} entityName  Entity name
     * @param {String} channelName Channel name
     * @param {String} messageId
     * 
     * @returns {Object|null} Message Information Object or null if not found
     */
    this.getMessageInfo = function (entityName, channelName, messageId) {
        return getMessageInfo(entityName, channelName, messageId);
    };

    /**
     * Reply to a given message
     * 
     * TODO: need to make the reply for a specific message ID.
     *
     * @param {Object} message Message to be sent in the reply
     * @param {Object} requestMessage Message to reply
     * @return {boolean} True if replied successfully
     */
    this.reply = function (message, requestMessage) {
        return reply(message, requestMessage);
    };
}

/**** Prototype Methods ******************************************************************************************/
;

exports.Api = Api;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Bus = undefined;

var _channel = __webpack_require__(4);

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

var Bus =

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

        /* attribute entity registers tha responsible entity*/
        if (typeof channelInfo.entity === 'undefined') {
            return false;
        }

        /* attribute name must exist and represent the channel name */
        if (typeof channelInfo.name === 'undefined') {
            return false;
        }

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
                channelInfo.channel = new _channel.Channel(entity, name);
                if (typeof channelInfo.listener !== 'undefined') {
                    channelInfo.channel.addListener(channelInfo.listener);
                }

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
     * 
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

    /**** Test Area **********************************************************************************************/

    if (false) {
        // Allow unit test mocking
        this.__test__ = {
            channelsInfo: channelsInfo
        };
    }
}

/**** Prototype Methods ******************************************************************************************/
;

exports.Bus = Bus;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.channelStatusCodes = exports.Channel = undefined;

var _queue = __webpack_require__(5);

var _md = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var channelStatusCodes = {
    CLOSED_STATUS: 0,
    OPEN_STATUS: 1,
    ON_HOLD_STATUS: 2

    // TODO: need this to be WebWorker Working
};var Channel =
/**
 * @constructor ChannelClass
 * 
 * @param {string} entityName 
 * @param {string} channelName 
 * @param {boolean} initOnHold 
 */
function ChannelClass(entityName, channelName) {
    var initOnHold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    _classCallCheck(this, ChannelClass);

    /**** Private Attributes *************************************************************************************/
    var md5 = new _md.Md5();

    var processingQueue = false;
    var entity = entityName;
    var name = channelName;
    var statusOpen = true;
    var statusHold = initOnHold || false;
    var hookList = [];
    var listenerQ = new _queue.Queue();
    var messageQ = new _queue.Queue();

    /**** Private Methods ****************************************************************************************/

    /**
     * Get the channel name
     *
     * @returns {string}
     */
    function getName() {
        return name;
    }

    /**
     * Check if the queue is being proccessed
     *
     * @return {Boolean}
     */
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

    /**
     * Starts or restart the queue process
     */
    function startQueueProcessing() {
        while (isProcessingQueue()) {} // stays here until stops processing
        processingQueue = true;
    }

    /**
     * End the queue processing
     */
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
            return channelStatusCodes.CLOSED_STATUS;
        }

        if (isOnHold()) {
            return channelStatusCodes.ON_HOLD_STATUS;
        }

        return channelStatusCodes.OPEN_STATUS;
    }

    /**
     * Add a listener to the channel
     *
     * @param {Object} listenerInfo
     * @return {string|false} Listener ID
     */
    function addListener(listenerInfo) {
        if (isValidListener(listenerInfo)) {
            return listenerQ.add(listenerInfo);
        }
        return false;
    }

    function isValidListener(listenerInfo) {
        // { id: 1, listener: () => {} }
        // Checking required attributes and respective types
        if (!listenerInfo) {
            return false;
        }

        if (typeof listenerInfo.id === 'undefined') {
            return false;
        }

        if (typeof listenerInfo.listener === 'undefined' || typeof listenerInfo.listener !== 'function') {
            return false;
        }

        return true;
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
        } catch (e) {
            // something went wrong probably list length change due to concurrent cancellation / activity
        }
    }

    /**
     * Gets a listener information for the provided ID
     *
     * @param {string} id listener ID
     * @returns {Object|null}
     */
    function getListenerInfo(id) {
        return findListenerInQueue(id, function () {
            var listenerFound = hookList.find(function (item) {
                return item.qid === id;
            });
            return listenerFound ? listenerFound.data : null;
        });
    }

    /**
     * Finds a listener in the listener queue
     * @param {string} id 
     * @param {function} callback 
     * @returns {Object|null}
     */
    function findListenerInQueue(id, callback) {
        if (!id) return null;
        startQueueProcessing();
        var listener = listenerQ.get(id);
        endQueueProcessing();
        if (listener === null) {
            return callback();
        } else {
            return listener.data;
        }
    }

    /**
     * Add a reply Information to the message
     *
     * @param {Object} message Message object
     */
    function addReplyInfo(message) {
        var reply_stack = { entity: entity, name: name };
        if (typeof message.reply_stack === 'undefined') {
            message.reply_stack = [];
        }
        message.reply_stack.push(reply_stack);
    }

    /**
     * Processes a message and send it to all registered hook
     *
     * @param {Object} message
     */
    function processMessage(message) {
        try {
            addReplyInfo(message);
            hookList.forEach(function (item) {
                item.data.listener(message); // No need to check here since we are ensuring its existence when coming from the queue
                if (item.data.times > 0) {
                    item.data.times--;
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
     * @param {Object} message
     * 
     * @return {string}
     */
    function send(message) {
        return messageQ.add(Object.assign({}, message));
    }

    /**
     * Sends a message to the channel and makes the listener hear
     *
     * @param {Object} message
     * @param {Object} listenerInfo
     *
     * @return {String|false} listenerId
     */
    function sendAndListen(message, listenerInfo) {
        var id = addListener(listenerInfo);
        send(message);
        return id;
    }

    /**
     * Get a message information for the provided id
     *
     * @param {string} id Message ID
     * @returns {*|null}
     */
    function getMessageInfo(id) {
        return messageQ.get(id).data;
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
            var hash = null;
            var listenerInfo = listenerQ.next();
            while (listenerInfo !== null) {
                if (typeof listenerInfo.data.listener === 'function') {
                    hash = md5.calculate(listenerInfo.toString());
                    var item = { id: hash, qid: listenerInfo.id, data: listenerInfo.data };
                    hookList.push(item);
                }
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

    /**
     * Get the channel name
     *
     * @returns {string}
     */
    this.getName = function () {
        return getName();
    };

    /**
     * Get the channel status
     *
     * @returns {number}
     */
    this.getStatus = function () {
        return getStatus();
    };

    /**
     * Open the channel activity (if not active)
     *
     * @returns {boolean}
     */
    this.open = function () {
        return open();
    };

    /**
     * Closes the channel activity (if open)
     *
     * @returns {boolean}
     */
    this.close = function () {
        return close();
    };

    /**
     * Freezes the channel activity (if active)
     *
     * @returns {boolean}
     */
    this.hold = function () {
        return hold();
    };

    /**
     * Resume the channel activity (if on hold)
     *
     * @returns {boolean}
     */
    this.resume = function () {
        return resume();
    };

    /**
     * Add a listener to the channel
     *
     * @param {Object} listenerInfo
     * @return {string} Listener ID
     */
    this.addListener = function (listenerInfo) {
        return addListener(listenerInfo);
    };

    /**
     * Remove a listener from the channel
     *
     * @param {string} id listener ID
     */
    this.removeListener = function (id) {
        return removeListener(id);
    };

    /**
     * Gets a listener information for the provided ID
     *
     * @param {string} id listener ID
     * @returns {*}
     */
    this.listenerInfo = function (id) {
        return getListenerInfo(id);
    };

    /**
     * Send a messagr to the channel
     *
     * @param {Object} message
     * 
     * @returns {string}
     */
    this.send = function (message) {
        return send(message);
    };

    /**
     * Sends a message to the channel and makes the listener hear
     *
     * @param {Object} message
     * @param {Object} listenerInfo
     *
     * @return {Object} listenerInfo
     */
    this.sendAndListen = function (message, listenerInfo) {
        return sendAndListen(message, listenerInfo);
    };

    /**
     * Get a message information for the provided id
     *
     * @param {string} id Message ID
     * @returns {*}
     */
    this.messageInfo = function (id) {
        return getMessageInfo(id);
    };

    /**** Test Area **********************************************************************************************/

    if (false) {
        // Allow unit test mocking
        this.__test__ = {
            md5: md5,
            listenerQ: listenerQ,
            messageQ: messageQ
        };
    }
}

/**** Prototype Methods ******************************************************************************************/
;

exports.Channel = Channel;
exports.channelStatusCodes = channelStatusCodes;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Queue = undefined;

var _values = __webpack_require__(6);

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
    var queuedData = new _values.Values();
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

    /**** Test Area **********************************************************************************************/

    if (false) {
        // Allow unit test mocking
        this.__test__ = {
            queuedData: queuedData,
            queue: queue
        };
    }
}

/**** Prototype Methods ******************************************************************************************/
;

exports.Queue = Queue;

/***/ }),
/* 6 */
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
  // let eol = null

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
   * Sets the dirty flag to inform that the data was changed
   */
  function unsetDirty() {
    dirty = false;
  }

  /**
   * Checks if the data is valid (if its not deprecated by ttl)
   *
   * @returns {boolean}
   */
  // function isValid () {
  //     return (Date.now() / 1000) < eol
  // }

  /**
   * Resolve and returns the reference for the provided variable path
   *
   * @param {string} fullPath Object notation 'some.variable.name'
   * @returns {Object|{}}
   */
  function getPointerTo() {
    var fullPath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return fullPath === '' ? value : fullPath.split('.').reduce(function (valuesIn, currentPath) {
      return valuesIn[currentPath] || null;
    }, value);
  }

  /**
   * Deletes a specified variable
   *
   * @param {string} fullPath Object notation 'some.variable.name'
   * @returns {boolean}
   */
  function destroy(fullPath) {
    var holder_path = fullPath.split('.');
    var to_delete = holder_path.splice(-1, 1)[0];
    var holder = getPointerTo(holder_path.join('.'));
    return holder.hasOwnProperty(to_delete) ? Reflect.deleteProperty(holder, to_delete) : false;
  }

  /**
   * Get a specific variable in the provided path
   *
   * @param {string} fullPath Object notation 'some.variable.name'
   * @returns {*}
   */
  function get(fullPath) {
    return getPointerTo(fullPath);
  }

  /**
   * Sets a specified variable by path
   *
   * @param {string} fullPath Object notation 'some.variable.name'
   * @param {*} valueToSet Values to be stored
   */
  function set(fullPath, valueToSet) {
    var full_path = fullPath.split('.');
    var ptr = full_path.reduce(function (valuePtr, block, idx) {
      if (!valuePtr.hasOwnProperty(block)) {
        Reflect.set(valuePtr, block, {});
      }
      return idx === full_path.length - 1 ? valuePtr : valuePtr[block];
    }, value);
    if (Reflect.set(ptr, full_path.pop(), valueToSet) === true) {
      setDirty();
    }
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
  // this.isValid = () => isValid()

  /**
   * Export all the data as it is
   *
   * @returns {object}
   */
  this.export = function () {
    unsetDirty();
    return Object.assign({}, value);
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

exports.Values = Values;

/***/ })
/******/ ]);
});
//# sourceMappingURL=impulses.js.map