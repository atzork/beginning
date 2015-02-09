/**
 * Created by Zork on 09.02.2015.
 */
module.exports = {
    /**
     * Преобразует в int
     * @param {string} num
     * @returns {number}    ==>     если не удается преобразовать в int --> возвращается 0
     */
    int: function (num) {
        var int = parseInt(num, 10);
        return !this.isNumber(int) ? 0 : int;
    },
    isNumber: function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
};
