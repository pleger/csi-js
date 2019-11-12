let logger = require('../libs/logger');

class Signal {

    constructor(initialValue, sym) {
        //todo: Always signal should start with '_'?
        this._sym = sym !== undefined ? sym : "_";
        this._val = initialValue;
        this._callbacks = [];
    }

    get value() {
        return this._val;
    }

    get id() {
        return this._sym;
    }

    on(callback) {
        this._callbacks.push(callback);
    }

    evaluate(val) {
        this._val = val;
        let sym = this._sym;
        this._callbacks.forEach(function (callback) {
            callback(sym);
        });

        return this._val; //todo: remove?
    }

    set id(sym) {
        this._sym = sym;
    }

    set value(val) {
        this.evaluate(val);
    }
}

module.exports = Signal;