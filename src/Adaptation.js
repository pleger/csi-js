let logger = require('../libs/logger');
let SignalComp = require('./SignalComp');

//todo: avoid write many times an empty function
let emptyFunction = function () {
};

class Adaptation {

    constructor(adap) {
        this._cond = adap.condition === undefined ?
            new SignalComp("false") : typeof (adap.condition) === "string" ?
                new SignalComp(adap.condition) : adap.condition; //it should be already a signal composition

        this._enter = adap.enter || emptyFunction;
        this._exit = adap.exit || emptyFunction;
        this._active = false;
        this._name = adap.name || "_";
        this.__original__ = adap;  //for debugging

        this._variations = [];
        this.enableCondition();
    }

    set name(name) {
        this._name = name;
    }

    get name() {
        return this._name;
    }

    //todo: this method is only used for debugging
    get condition() {
        return this._cond;
    }

    addVariation(obj, methodName, variation) {
        console.log(["ADDING", methodName, obj, variation]);
        this._variations.push([obj, methodName, variation, obj[methodName]]);
    }

    _installVariations() {
        let thiz = this;
        console.log("INSTALLING:"+this._variations.length);
        this._variations.forEach(function (variation) {
            console.log(["XXXX", variation]);
            let obj = variation[0];
            let methodName = variation[1];
            let method = variation[3];
            let variationMethod = variation[2];
            obj[methodName] = function () {
                console.log("VARIATIONS");
                thiz.proceed = method;
                return variationMethod.apply(obj, arguments);
            };
        });
    }

    _uninstallVariations() {
        this._variations.forEach(function (variation) {
            let obj = variation[0];
            let methodName = variation[1];
            obj[methodName] = variation[3]; //original method
        });
    }

    enableCondition() {
        let thiz = this;
        this._cond.on(function (active) {

            if (active !== thiz._active) {
                thiz._active = active;
                if (thiz._active) {
                    thiz._enter();
                    thiz._installVariations();
                } else {
                    thiz._exit();
                    thiz._uninstallVariations();
                }
            }
            return thiz._active; //todo: Is it really necessary?
        });
    }

    isActive() { //todo: this may be used only for debugging
        return this._active;
    }

    addSignal(signal) {
        this._cond.addSignal(signal);
    }
}

module.exports = Adaptation;


