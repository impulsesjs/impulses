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
const md5 = class MD5 {

    /**
     * Creates and initializes a Values object
     *
     * @param {boolean} alwaysUseSafe This will override and use always the special IE mode (exists for safety reason)
     */
    constructor(alwaysUseSafe = false) {
        /**** Private Attributes *************************************************************************************/

        let hexChr = '0123456789abcdef'.split('')

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
                let leastSignificantWord = (x & 0xFFFF) + (y & 0xFFFF)
                let mostSignificantWord = (x >> 16) + (y >> 16) + (leastSignificantWord >> 16)
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
            let blocks = []
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
            let hex_result = []
            blocks.forEach((block) => {
                hex_result.push(numberToHex(block))
            })
            return hex_result.join('')
        }

        /**
         * Cycle through blocks
         *
         * @param {int[]} state
         * @param {int[]} blocks
         */
        function cycle(state, blocks) {
            let val_a = state[0]
            let val_b = state[1]
            let val_c = state[2]
            let val_d = state[3]

            val_a = ff(val_a, val_b, val_c, val_d, blocks[0], 7, -680876936)
            val_d = ff(val_d, val_a, val_b, val_c, blocks[1], 12, -389564586)
            val_c = ff(val_c, val_d, val_a, val_b, blocks[2], 17,  606105819)
            val_b = ff(val_b, val_c, val_d, val_a, blocks[3], 22, -1044525330)
            val_a = ff(val_a, val_b, val_c, val_d, blocks[4], 7, -176418897)
            val_d = ff(val_d, val_a, val_b, val_c, blocks[5], 12,  1200080426)
            val_c = ff(val_c, val_d, val_a, val_b, blocks[6], 17, -1473231341)
            val_b = ff(val_b, val_c, val_d, val_a, blocks[7], 22, -45705983)
            val_a = ff(val_a, val_b, val_c, val_d, blocks[8], 7,  1770035416)
            val_d = ff(val_d, val_a, val_b, val_c, blocks[9], 12, -1958414417)
            val_c = ff(val_c, val_d, val_a, val_b, blocks[10], 17, -42063)
            val_b = ff(val_b, val_c, val_d, val_a, blocks[11], 22, -1990404162)
            val_a = ff(val_a, val_b, val_c, val_d, blocks[12], 7,  1804603682)
            val_d = ff(val_d, val_a, val_b, val_c, blocks[13], 12, -40341101)
            val_c = ff(val_c, val_d, val_a, val_b, blocks[14], 17, -1502002290)
            val_b = ff(val_b, val_c, val_d, val_a, blocks[15], 22,  1236535329)

            val_a = gg(val_a, val_b, val_c, val_d, blocks[1], 5, -165796510)
            val_d = gg(val_d, val_a, val_b, val_c, blocks[6], 9, -1069501632)
            val_c = gg(val_c, val_d, val_a, val_b, blocks[11], 14,  643717713)
            val_b = gg(val_b, val_c, val_d, val_a, blocks[0], 20, -373897302)
            val_a = gg(val_a, val_b, val_c, val_d, blocks[5], 5, -701558691)
            val_d = gg(val_d, val_a, val_b, val_c, blocks[10], 9,  38016083)
            val_c = gg(val_c, val_d, val_a, val_b, blocks[15], 14, -660478335)
            val_b = gg(val_b, val_c, val_d, val_a, blocks[4], 20, -405537848)
            val_a = gg(val_a, val_b, val_c, val_d, blocks[9], 5,  568446438)
            val_d = gg(val_d, val_a, val_b, val_c, blocks[14], 9, -1019803690)
            val_c = gg(val_c, val_d, val_a, val_b, blocks[3], 14, -187363961)
            val_b = gg(val_b, val_c, val_d, val_a, blocks[8], 20,  1163531501)
            val_a = gg(val_a, val_b, val_c, val_d, blocks[13], 5, -1444681467)
            val_d = gg(val_d, val_a, val_b, val_c, blocks[2], 9, -51403784)
            val_c = gg(val_c, val_d, val_a, val_b, blocks[7], 14,  1735328473)
            val_b = gg(val_b, val_c, val_d, val_a, blocks[12], 20, -1926607734)

            val_a = hh(val_a, val_b, val_c, val_d, blocks[5], 4, -378558)
            val_d = hh(val_d, val_a, val_b, val_c, blocks[8], 11, -2022574463)
            val_c = hh(val_c, val_d, val_a, val_b, blocks[11], 16,  1839030562)
            val_b = hh(val_b, val_c, val_d, val_a, blocks[14], 23, -35309556)
            val_a = hh(val_a, val_b, val_c, val_d, blocks[1], 4, -1530992060)
            val_d = hh(val_d, val_a, val_b, val_c, blocks[4], 11,  1272893353)
            val_c = hh(val_c, val_d, val_a, val_b, blocks[7], 16, -155497632)
            val_b = hh(val_b, val_c, val_d, val_a, blocks[10], 23, -1094730640)
            val_a = hh(val_a, val_b, val_c, val_d, blocks[13], 4,  681279174)
            val_d = hh(val_d, val_a, val_b, val_c, blocks[0], 11, -358537222)
            val_c = hh(val_c, val_d, val_a, val_b, blocks[3], 16, -722521979)
            val_b = hh(val_b, val_c, val_d, val_a, blocks[6], 23,  76029189)
            val_a = hh(val_a, val_b, val_c, val_d, blocks[9], 4, -640364487)
            val_d = hh(val_d, val_a, val_b, val_c, blocks[12], 11, -421815835)
            val_c = hh(val_c, val_d, val_a, val_b, blocks[15], 16,  530742520)
            val_b = hh(val_b, val_c, val_d, val_a, blocks[2], 23, -995338651)

            val_a = ii(val_a, val_b, val_c, val_d, blocks[0], 6, -198630844)
            val_d = ii(val_d, val_a, val_b, val_c, blocks[7], 10,  1126891415)
            val_c = ii(val_c, val_d, val_a, val_b, blocks[14], 15, -1416354905)
            val_b = ii(val_b, val_c, val_d, val_a, blocks[5], 21, -57434055)
            val_a = ii(val_a, val_b, val_c, val_d, blocks[12], 6,  1700485571)
            val_d = ii(val_d, val_a, val_b, val_c, blocks[3], 10, -1894986606)
            val_c = ii(val_c, val_d, val_a, val_b, blocks[10], 15, -1051523)
            val_b = ii(val_b, val_c, val_d, val_a, blocks[1], 21, -2054922799)
            val_a = ii(val_a, val_b, val_c, val_d, blocks[8], 6,  1873313359)
            val_d = ii(val_d, val_a, val_b, val_c, blocks[15], 10, -30611744)
            val_c = ii(val_c, val_d, val_a, val_b, blocks[6], 15, -1560198380)
            val_b = ii(val_b, val_c, val_d, val_a, blocks[13], 21,  1309151649)
            val_a = ii(val_a, val_b, val_c, val_d, blocks[4], 6, -145523070)
            val_d = ii(val_d, val_a, val_b, val_c, blocks[11], 10, -1120210379)
            val_c = ii(val_c, val_d, val_a, val_b, blocks[2], 15,  718787259)
            val_b = ii(val_b, val_c, val_d, val_a, blocks[9], 21, -343485551)

            state[0] = add(val_a, state[0])
            state[1] = add(val_b, state[1])
            state[2] = add(val_c, state[2])
            state[3] = add(val_d, state[3])
        }

        /**
         * Take a string and return the hex representation of its MD5.
         *
         * @param {string} data Data to be used for the calculation
         * @returns {string}
         */
        function calculate(data) {
            let data_length = data.length
            let state = [1732584193, -271733879, -1732584194, 271733878]
            let idx

            for (idx = 64; idx <= data.length; idx += 64) {
                cycle(state, stringToBlocks(data.substring(idx - 64, idx)))
            }

            data = data.substring(idx - 64)
            let tail = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
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

        this.calculate = function (data) { return calculate(data) }
    }
}

export default md5
