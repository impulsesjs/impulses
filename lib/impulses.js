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
    // function isValid () {
    //     return (Date.now() / 1000) < eol
    // }

    /**
     * Resolve and returns the reference for the provided variable path
     *
     * @param {string} fullPath Object notation 'some.variable.name'
     * @returns {Object|{}}
     */
    function getPointerTo(fullPath) {
        var varPath = fullPath.split('.');
        var level = value;
        for (var idx = 0; idx < varPath.length; idx++) {
            var name = varPath[idx];
            if (level.hasOwnProperty(name)) {
                level = level[name];
            } else {
                level = null;
                break;
            }
        }
        return level;
    }

    /**
     * Delets a specified variable
     *
     * @param {string} fullPath Object notation 'some.variable.name'
     * @returns {boolean}
     */
    function destroy(fullPath) {
        var previousPathToDestroy = fullPath.split('.');

        if (previousPathToDestroy.length > 1) {
            var pathToDestroy = previousPathToDestroy[previousPathToDestroy.length - 1];
            previousPathToDestroy.splice(previousPathToDestroy.length - 1, 1);
            // delete previousPathToDestroy[previousPathToDestroy.length-1]

            var holder = getPointerTo(previousPathToDestroy.join('.'));
            if (holder.hasOwnProperty(pathToDestroy)) {
                delete holder[pathToDestroy];
            } else {
                return false;
            }
        } else if (previousPathToDestroy.length > 0) {
            if (value.hasOwnProperty(previousPathToDestroy)) {
                delete value[previousPathToDestroy];
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
        for (var idx = 0; idx < varPath.length; idx++) {
            var name = varPath[idx];
            if (level.hasOwnProperty(name)) {
                if (idx < varPath.length - 1) {
                    level = level[name];
                } else {
                    returnValue = level[name];
                    break;
                }
            } else {
                break;
            }
        }
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
                level[name] = {};
                level = level[name];
            } else {
                level[name] = valueToSet;
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
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _values = __webpack_require__(0);

var _values2 = _interopRequireDefault(_values);

var _queue = __webpack_require__(2);

var _queue2 = _interopRequireDefault(_queue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CommBus = function CommBus() {
    _classCallCheck(this, CommBus);

    this.val = new _values2.default();
    this.queue = new _queue2.default();
};

module.exports = new CommBus();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _values = __webpack_require__(0);

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

/***/ })
/******/ ]);
});
//# sourceMappingURL=impulses.js.map