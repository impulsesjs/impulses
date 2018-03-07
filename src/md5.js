/**
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Copyright (C) Paul Johnston 1999 - 2000.
 * Updated by Joao Correia 2017 - 2018.
 * See http://pajhome.org.uk/site/legal.html for details.
 */
const md5 = class MD5 {

    /**
     * Creates and initializes a Values object
     */
    constructor () {

        /**** Private Attributes *************************************************************************************/

        let hexChr = '0123456789abcdef'

        /**** Private Methods ****************************************************************************************/

        /**
         * Turn a 32-bit number to a hexadecimal string with least significant byte first
         *
         * @param {int} num 32-bit Number
         * @returns {string} Hexadecimal representation of the provided number
         */
        function numberToHex(num)
        {
            let str = '';
            for(let idx = 0; idx <= 3; idx++) {
                str += hexChr.charAt((num >> (idx * 8 + 4)) & 0x0F) + hexChr.charAt((num >> (idx * 8)) & 0x0F)
            }
            return str;
        }

        /**
         * Convert a string to a sequence of 16-word blocks, stored as an array.
         * Append padding bits and the length, as described in the MD5 standard.
         *
         * @param {string} data
         * @returns {Array}
         */
        function stringToBlocks (data) {
            console.log(data)
            let numberOfBlocks = ((data.length + 8) >> 6) + 1
            console.log(numberOfBlocks)
            let blocks = new Array(numberOfBlocks * 16)

            for(let idx = 0; idx < numberOfBlocks * 16; idx++) {
                blocks[idx] = 0
            }

            for(let idx = 0; idx < data.length; idx++) {
                blocks[idx >> 2] |= data.charCodeAt(idx) << ((idx % 4) * 8)
            }

            blocks[idx >> 2] |= 0x80 << ((idx % 4) * 8)
            console.log(blocks)
            blocks[numberOfBlocks * 16 - 2] = data.length * 8
            console.log(blocks)

            return blocks
        }

        /**
         * Add integers, wrapping at 2^32. This uses 16-bit operations internally
         * to work around bugs in some JS interpreters.
         *
         * @param {int} x
         * @param {int} y
         * @returns {number}
         */
        function add(x, y)
        {
            let leastSignificantWord = (x & 0xFFFF) + (y & 0xFFFF)
            let mostSignificantWord = (x >> 16) + (y >> 16) + (leastSignificantWord >> 16)

            return (mostSignificantWord << 16) | (leastSignificantWord & 0xFFFF)
        }

        /**
         * Bitwise rotate a 32-bit number to the left
         *
         * @param number
         * @param times
         * @returns {number}
         */
        function rotateLeft(number, times)
        {
            return (number << times) | (number >>> (32 - times))
        }

        /**
         * These functions implement the basic operation for each round of the
         * algorithm.
         */
        function cmn(q, a, b, x, s, t)
        {
            return add(rotateLeft(add(add(a, q), add(x, t)), s), b)
        }
        function ff(a, b, c, d, x, s, t)
        {
            return cmn((b & c) | ((~b) & d), a, b, x, s, t)
        }
        function gg(a, b, c, d, x, s, t)
        {
            return cmn((b & d) | (c & (~d)), a, b, x, s, t)
        }
        function hh(a, b, c, d, x, s, t)
        {
            return cmn(b ^ c ^ d, a, b, x, s, t)
        }
        function ii(a, b, c, d, x, s, t)
        {
            return cmn(c ^ (b | (~d)), a, b, x, s, t)
        }

        /**
         * Take a string and return the hex representation of its MD5.
         *
         * @param {string} data Data to be used for the calculation
         * @returns {string}
         */
        function calculate(data)
        {
            let blocks = stringToBlocks(data)
            let valueA =  1732584193
            let valueB = -271733879
            let valueC = -1732584194
            let valueD =  271733878

            let numberOfBlocks = blocks.length

            for(let idx = 0; idx < numberOfBlocks; idx += 16)
            {
                let oldA = valueA
                let oldB = valueB
                let oldC = valueC
                let oldD = valueD

                valueA = ff(valueA, valueB, valueC, valueD, blocks[idx], 7 , -680876936)
                valueD = ff(valueD, valueA, valueB, valueC, blocks[idx +  1], 12, -389564586)
                valueC = ff(valueC, valueD, valueA, valueB, blocks[idx +  2], 17,  606105819)
                valueB = ff(valueB, valueC, valueD, valueA, blocks[idx +  3], 22, -1044525330)
                valueA = ff(valueA, valueB, valueC, valueD, blocks[idx +  4], 7 , -176418897)
                valueD = ff(valueD, valueA, valueB, valueC, blocks[idx +  5], 12,  1200080426)
                valueC = ff(valueC, valueD, valueA, valueB, blocks[idx +  6], 17, -1473231341)
                valueB = ff(valueB, valueC, valueD, valueA, blocks[idx +  7], 22, -45705983)
                valueA = ff(valueA, valueB, valueC, valueD, blocks[idx +  8], 7 ,  1770035416)
                valueD = ff(valueD, valueA, valueB, valueC, blocks[idx +  9], 12, -1958414417)
                valueC = ff(valueC, valueD, valueA, valueB, blocks[idx + 10], 17, -42063)
                valueB = ff(valueB, valueC, valueD, valueA, blocks[idx + 11], 22, -1990404162)
                valueA = ff(valueA, valueB, valueC, valueD, blocks[idx + 12], 7 ,  1804603682)
                valueD = ff(valueD, valueA, valueB, valueC, blocks[idx + 13], 12, -40341101)
                valueC = ff(valueC, valueD, valueA, valueB, blocks[idx + 14], 17, -1502002290)
                valueB = ff(valueB, valueC, valueD, valueA, blocks[idx + 15], 22,  1236535329)

                valueA = gg(valueA, valueB, valueC, valueD, blocks[idx +  1], 5 , -165796510)
                valueD = gg(valueD, valueA, valueB, valueC, blocks[idx +  6], 9 , -1069501632)
                valueC = gg(valueC, valueD, valueA, valueB, blocks[idx + 11], 14,  643717713)
                valueB = gg(valueB, valueC, valueD, valueA, blocks[idx], 20, -373897302)
                valueA = gg(valueA, valueB, valueC, valueD, blocks[idx +  5], 5 , -701558691)
                valueD = gg(valueD, valueA, valueB, valueC, blocks[idx + 10], 9 ,  38016083)
                valueC = gg(valueC, valueD, valueA, valueB, blocks[idx + 15], 14, -660478335)
                valueB = gg(valueB, valueC, valueD, valueA, blocks[idx +  4], 20, -405537848)
                valueA = gg(valueA, valueB, valueC, valueD, blocks[idx +  9], 5 ,  568446438)
                valueD = gg(valueD, valueA, valueB, valueC, blocks[idx + 14], 9 , -1019803690)
                valueC = gg(valueC, valueD, valueA, valueB, blocks[idx +  3], 14, -187363961)
                valueB = gg(valueB, valueC, valueD, valueA, blocks[idx +  8], 20,  1163531501)
                valueA = gg(valueA, valueB, valueC, valueD, blocks[idx + 13], 5 , -1444681467)
                valueD = gg(valueD, valueA, valueB, valueC, blocks[idx +  2], 9 , -51403784)
                valueC = gg(valueC, valueD, valueA, valueB, blocks[idx +  7], 14,  1735328473)
                valueB = gg(valueB, valueC, valueD, valueA, blocks[idx + 12], 20, -1926607734)

                valueA = hh(valueA, valueB, valueC, valueD, blocks[idx +  5], 4 , -378558)
                valueD = hh(valueD, valueA, valueB, valueC, blocks[idx +  8], 11, -2022574463)
                valueC = hh(valueC, valueD, valueA, valueB, blocks[idx + 11], 16,  1839030562)
                valueB = hh(valueB, valueC, valueD, valueA, blocks[idx + 14], 23, -35309556)
                valueA = hh(valueA, valueB, valueC, valueD, blocks[idx +  1], 4 , -1530992060)
                valueD = hh(valueD, valueA, valueB, valueC, blocks[idx +  4], 11,  1272893353)
                valueC = hh(valueC, valueD, valueA, valueB, blocks[idx +  7], 16, -155497632)
                valueB = hh(valueB, valueC, valueD, valueA, blocks[idx + 10], 23, -1094730640)
                valueA = hh(valueA, valueB, valueC, valueD, blocks[idx + 13], 4 ,  681279174)
                valueD = hh(valueD, valueA, valueB, valueC, blocks[idx], 11, -358537222)
                valueC = hh(valueC, valueD, valueA, valueB, blocks[idx +  3], 16, -722521979)
                valueB = hh(valueB, valueC, valueD, valueA, blocks[idx +  6], 23,  76029189)
                valueA = hh(valueA, valueB, valueC, valueD, blocks[idx +  9], 4 , -640364487)
                valueD = hh(valueD, valueA, valueB, valueC, blocks[idx + 12], 11, -421815835)
                valueC = hh(valueC, valueD, valueA, valueB, blocks[idx + 15], 16,  530742520)
                valueB = hh(valueB, valueC, valueD, valueA, blocks[idx +  2], 23, -995338651)

                valueA = ii(valueA, valueB, valueC, valueD, blocks[idx], 6 , -198630844)
                valueD = ii(valueD, valueA, valueB, valueC, blocks[idx +  7], 10,  1126891415)
                valueC = ii(valueC, valueD, valueA, valueB, blocks[idx + 14], 15, -1416354905)
                valueB = ii(valueB, valueC, valueD, valueA, blocks[idx +  5], 21, -57434055)
                valueA = ii(valueA, valueB, valueC, valueD, blocks[idx + 12], 6 ,  1700485571)
                valueD = ii(valueD, valueA, valueB, valueC, blocks[idx +  3], 10, -1894986606)
                valueC = ii(valueC, valueD, valueA, valueB, blocks[idx + 10], 15, -1051523)
                valueB = ii(valueB, valueC, valueD, valueA, blocks[idx +  1], 21, -2054922799)
                valueA = ii(valueA, valueB, valueC, valueD, blocks[idx +  8], 6 ,  1873313359)
                valueD = ii(valueD, valueA, valueB, valueC, blocks[idx + 15], 10, -30611744)
                valueC = ii(valueC, valueD, valueA, valueB, blocks[idx +  6], 15, -1560198380)
                valueB = ii(valueB, valueC, valueD, valueA, blocks[idx + 13], 21,  1309151649)
                valueA = ii(valueA, valueB, valueC, valueD, blocks[idx +  4], 6 , -145523070)
                valueD = ii(valueD, valueA, valueB, valueC, blocks[idx + 11], 10, -1120210379)
                valueC = ii(valueC, valueD, valueA, valueB, blocks[idx +  2], 15,  718787259)
                valueB = ii(valueB, valueC, valueD, valueA, blocks[idx +  9], 21, -343485551)

                valueA = add(valueA, oldA)
                valueB = add(valueB, oldB)
                valueC = add(valueC, oldC)
                valueD = add(valueD, oldD)
            }

            return numberToHex(valueA) + numberToHex(valueB) + numberToHex(valueC) + numberToHex(valueD)
        }

        /**** Privileged Methods *************************************************************************************/

        this.calculate = function (data) { return calculate(data) }
    }

    /**** Prototype Methods ******************************************************************************************/

}

export default md5
