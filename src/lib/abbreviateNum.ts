/** Convert a number greater than 4 digits long into an abbreviated string.
 * @param {number} num The number to be converted.
 * @returns {string} The formatted string.
 *
 * Examples:
 *
 * abbreviateNum(1234) => 1.2K
 *
 * abbreviateNum(9801304) => 9.8M
 *
 * abbreviateNum(455) => 455
 * */
function abbreviateNum(num: number): string {
  const iterations = recur(num);
  if (iterations === 0) {
    return num.toString();
  }
  const letterArr = ['K', 'M', 'B'];
  return `${(num / 1000 ** iterations).toFixed(1)}${letterArr[iterations > 3 ? 2 : iterations - 1]}`;
}

function recur(num: number): number {
  if (num < 999) {
    return 0;
  }
  return 1 + recur(num / 1000);
}

export default abbreviateNum;
