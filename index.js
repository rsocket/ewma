'use strict';

var assert = require('assert-plus');

/**
 * Compute the exponential weighted moving average of a series of values.
 * The time at which you insert the value into `Ewma` is used to compute a
 * weight (recent points are weighted higher).
 * The parameter for defining the convergence speed (like most decay process) is
 * the half-life.
 *
 * e.g. with a half-life of 10 unit, if you insert 100 at t=0 and 200 at t=10
 *      the ewma will be equal to (200 - 100)/2 = 150 (half of the distance
 *      between the new and the old value)
 *
 * @param {Number} halfLifeMs parameter representing the speed of convergence
 * @param {Number} initialValue initial value
 * @param {Object} clock clock object used to read time
 *
 * @returns {Ewma} the object computing the ewma average
 */
function Ewma(halfLifeMs, initialValue, clock) {
    assert.number(halfLifeMs, 'halfLifeMs');
    assert.optionalNumber(initialValue, 'initialValue');
    assert.optionalObject(clock, 'clock');

    if (clock) {
        assert.func(clock.now, 'clock.now');
    }

    this._decay = halfLifeMs;
    this._ewma = initialValue || 0;
    this._clock = clock || Date;
    this._stamp = (typeof initialValue === 'number') ? clock.now() : 0;
}

module.exports = Ewma;

Ewma.prototype.insert = function insert(x) {
    var self = this;
    var now = self._clock.now();
    var elapsed = now - self._stamp;
    self._stamp = now;

    var w = Math.pow(2, -elapsed / self._decay);
    self._ewma = w * self._ewma + (1.0 - w) * x;
};

Ewma.prototype.reset = function reset(x) {
    var self = this;
    self._stamp = self._clock.now();
    self._ewma = x;
};

Ewma.prototype.value = function value() {
    var self = this;
    return self._ewma;
};
