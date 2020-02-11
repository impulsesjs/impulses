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
const Md5 = class MD5 {

    /**
     * Creates and initializes a Values object
     *
     * @param {boolean} alwaysUseSafe This will override and use always the special IE mode (exists for safety reason)
     */
    constructor(alwaysUseSafe = false) {
        /**** Private Attributes *************************************************************************************/

        const hexChr = '0123456789abcdef'.split('')

        // Some IEs are the only ones known of that need the idiotic function.
        let isSpecialIe = false
        if (alwaysUseSafe || '5d41402abc4b2a76b9719d911017c592' !== calculate('hello')) {
            isSpecialIe = true
        }

        /**** Private Methods ****************************************************************************************/

        /**
         * Turn a 32-bit number to a hexadecimal string with least significant byte first
         *
         * @param {int} num 32-bit Number
         * @returns {string} Hexadecimal representation of the provided number
         */
        function numberToHex(num)
        {
            let str = ''
            for (let idx = 0; idx < 4; idx++) {
                str += hexChr[(num >> (idx * 8 + 4)) & 0x0F] + hexChr[(num >> (idx * 8)) & 0x0F]
            }
            return str
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
        function add(x, y)
        {
            if (!alwaysUseSafe && !isSpecialIe) {
                return (x + y) & 0xFFFFFFFF
            } else {
                const leastSignificantWord = (x & 0xFFFF) + (y & 0xFFFF)
                const mostSignificantWord = (x >> 16) + (y >> 16) + (leastSignificantWord >> 16)
                return (mostSignificantWord << 16) | (leastSignificantWord & 0xFFFF)
            }
        }

        /**
         * These functions implement the basic operation for each round of the
         * algorithm.
         */
        function cmn(q, a, b, x, s, t) {
            a = add(add(a, q), add(x, t))
            return add((a << s) | (a >>> (32 - s)), b)
        }

        function ff(a, b, c, d, x, s, t) {
            return cmn((b & c) | ((~b) & d), a, b, x, s, t)
        }

        function gg(a, b, c, d, x, s, t) {
            return cmn((b & d) | (c & (~d)), a, b, x, s, t)
        }

        function hh(a, b, c, d, x, s, t) {
            return cmn(b ^ c ^ d, a, b, x, s, t)
        }

        function ii(a, b, c, d, x, s, t) {
            return cmn(c ^ (b | (~d)), a, b, x, s, t)
        }

        /**
         * Convert a string into block representation
         *
         * @param {string} data
         * @returns {array}
         */
        function stringToBlocks(data) {
            const blocks = []
            for (let idx = 0; idx < 64; idx += 4) {
                blocks[idx >> 2] = data.charCodeAt(idx)
                    + (data.charCodeAt(idx + 1) << 8)
                    + (data.charCodeAt(idx + 2) << 16)
                    + (data.charCodeAt(idx + 3) << 24)
            }
            return blocks
        }

        /**
         * Convert an array of integers to an hex string
         *
         * @param {int[]} blocks
         * @returns {string}
         */
        function blocksToHex(blocks) {
            const hex_result = []
            blocks.forEach((block) => {
                hex_result.push(numberToHex(block))
            })
            return hex_result.join('')
        }

        /**
         * Run the cycle calculation
         *
         * @param {int[]} blocks
         * @param {object} settings
         */
        function runCyclesCalc(blocks, settings) {
            settings.cycles
                .reduce((currentState, cycleInfo) => {
                    /** @property {function} cycleInfo.method */
                    /** @property {int[]} cycleInfo.blockMap */
                    /** @property {int[]} cycleInfo.extra */
                    cycleInfo.blockMap.forEach((pos, idx) => {
                        currentState[0] = cycleInfo.method(...[...currentState, blocks[pos], ...cycleInfo.extra[idx]])
                        currentState.unshift(currentState.pop())
                    })
                    return currentState
                }, settings.runState)
        }

        /**
         * Cycle through blocks
         *
         * @param {int[]} state
         * @param {int[]} blocks
         */
        function cycle(state, blocks) {
            const val_a = state[0]
            const val_b = state[1]
            const val_c = state[2]
            const val_d = state[3]

            const settings = {
                runState: [val_a, val_b, val_c, val_d],
                cycles: [{method: ff, blockMap: [0,1,2,3, 4,5,6,7, 8,9,10,11, 12,13,14,15], extra: [
                    [7, -680876936],  [12, -389564586],  [17,  606105819],  [22, -1044525330],
                    [7, -176418897],  [12, 1200080426],  [17, -1473231341], [22, -45705983],
                    [7, 1770035416],  [12, -1958414417], [17, -42063],      [22, -1990404162],
                    [7, 1804603682],  [12, -40341101],   [17, -1502002290], [22,  1236535329]]
                }, {method: gg, blockMap: [1,6,11,0, 5,10,15,4, 9,14,3,8, 13,2,7,12], extra: [
                    [5, -165796510],  [9, -1069501632],  [14, 643717713],   [20, -373897302],
                    [5, -701558691],  [9, 38016083],     [14, -660478335],  [20, -405537848],
                    [5, 568446438],   [9, -1019803690],  [14, -187363961],  [20, 1163531501],
                    [5, -1444681467], [9, -51403784],    [14, 1735328473],  [20, -1926607734]]
                }, {method: hh, blockMap: [5,8,11,14, 1,4,7,10, 13,0,3,6, 9,12,15,2], extra: [
                    [4, -378558],     [11, -2022574463], [16, 1839030562],  [23, -35309556],
                    [4, -1530992060], [11, 1272893353],  [16, -155497632],  [23, -1094730640],
                    [4, 681279174],   [11, -358537222],  [16, -722521979],  [23, 76029189],
                    [4, -640364487],  [11, -421815835],  [16, 530742520],   [23, -995338651]]
                }, {method: ii, blockMap: [0,7,14,5, 12,3,10,1, 8,15,6,13, 4,11,2,9], extra: [
                    [6, -198630844],  [10, 1126891415],  [15, -1416354905], [21, -57434055],
                    [6, 1700485571],  [10, -1894986606], [15, -1051523],    [21, -2054922799],
                    [6, 1873313359],  [10, -30611744],   [15, -1560198380], [21, 1309151649],
                    [6, -145523070],  [10, -1120210379], [15, 718787259],   [21, -343485551]]
                }]
            }
            runCyclesCalc(blocks, settings)

            state[0] = add(settings.runState[0], state[0])
            state[1] = add(settings.runState[1], state[1])
            state[2] = add(settings.runState[2], state[2])
            state[3] = add(settings.runState[3], state[3])
        }

        /**
         * Take a string and return the hex representation of its MD5.
         *
         * @param {string} data Data to be used for the calculation
         * @returns {string}
         */
        function calculate(data) {
            const data_length = data.length
            const state = [1732584193, -271733879, -1732584194, 271733878]
            let idx

            for (idx = 64; idx <= data.length; idx += 64) {
                cycle(state, stringToBlocks(data.substring(idx - 64, idx)))
            }

            data = data.substring(idx - 64)
            const tail = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
            for (idx = 0; idx < data.length; idx++) {
                tail[idx >> 2] |= data.charCodeAt(idx) << ((idx % 4) << 3)
            }
            tail[idx >> 2] |= 0x80 << ((idx % 4) << 3)
            if (idx > 55) {
                // TODO: Test, the next two lines aren't covered by the tests
                cycle(state, tail);
                tail.fill(0, 0, 15)
                // TODO: Remove this comments after tests are in place and working correctly
                // Updated for vulnerability prevention warning raise from original code
                // for (idx = 0; idx < 16; idx++) { tail[idx] = 0 }
            }
            tail[14] = data_length * 8
            cycle(state, tail)

            return blocksToHex(state)
        }

        /**** Privileged Methods *************************************************************************************/

        this.calculate = (data) => calculate(data)
    }
}

export { Md5 }
