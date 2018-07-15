import math from 'mathjs'

math.config({
  number: 'BigNumber', // Default type of number:
                      // 'number' (default), 'BigNumber', or 'Fraction'
  precision: 64        // Number of significant digits for BigNumbers
})

export default {
  add(a, b, fix) {
    return this.compute(a, b, '+', fix)
  },
  subtract(a, b, fix) {
    return this.compute(a, b, '-', fix)
  },
  multiply(a, b, fix) {
    return this.compute(a, b, '*', fix)
  },
  divide(a, b, fix) {
    return this.compute(a, b, '/', fix)
  },
  compute(a, b, rule, fix) {
    return this.eval(a + rule + b, fix)
  },
  eval(str, fix) {
    if (fix || fix === 0) {
      return math.eval(str).toFixed(fix)
    } else {
      return math.eval(str).toFixed(0)
    }
  }
}

