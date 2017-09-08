'use strict';

var EWMA = require('../index.js');
var test = require('tape');

test('Should half life', function (t) {
    var NOW = 10000000;
    var clock = {
        now: function () {
            return NOW;
        }
    };
    var e = new EWMA(1, 10, clock);
    var shouldBe = 10;
    t.equal(e.value(), shouldBe);
    NOW++;
    var i;

    for (i = 1; i < 100; i++, NOW++) {
        shouldBe = shouldBe * 0.5 + i * 0.5;
        e.insert(i);
        t.equal(e.value(), shouldBe);
    }

    t.comment('reset');
    e.reset(0);
    shouldBe = 0;
    t.equal(e.value(), shouldBe);
    NOW += 1;

    for (i = 1; i < 100; i++, NOW += 1) {
        shouldBe = shouldBe * 0.5 + i * 0.5;
        e.insert(i);
        t.equal(e.value(), shouldBe);
    }

    t.comment('new');
    e = new EWMA(2, undefined, clock);
    shouldBe = 1;
    e.insert(1);
    t.equal(e.value(), shouldBe);
    NOW += 2;

    for (i = 2; i < 100; i++, NOW += 2) {
        shouldBe = shouldBe * 0.5 + i * 0.5;
        e.insert(i);
        t.equal(e.value(), shouldBe);
    }
    t.end();
});

test('Guard against NaN', function (t) {
    t.throws(EWMA.bind({}, NaN, 0, Date), 'opts.halfLifeMs');
    t.throws(EWMA.bind({}, 100, NaN, Date), 'opts.initialValue');
    t.doesNotThrow(EWMA.bind({}, 100, 0, Date));

    var e = new EWMA(100, 0);
    t.throws(e.insert.bind(e, NaN), 'insert(NaN)');
    t.doesNotThrow(e.insert.bind(e, 0), 'insert(0)');
    t.throws(e.reset.bind(e, NaN), 'reset(NaN)');
    t.doesNotThrow(e.reset.bind(e, 0), 'reset(0)');
    t.end();
});
