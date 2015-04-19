/* 
 * custom orientation change and resize end script
 * Leon Slater
 * http://mynamesleon.com
 */

window.customResize = window.customResize || new function () {
    'use strict';

    // primary variables
    var timer,
        num = 0,
        funcs = {},
        changed = true,
        doc = window.document,
        docElem = doc.documentElement,
        winWidth = window.innerWidth || docElem.clientWidth || doc.body.clientWidth,
        winHeight = window.innerHeight || docElem.clientHeight || doc.body.clientHeight,
        orientationSupport = Object.prototype.hasOwnProperty.call(window, 'orientationchange'), // prevent IE7 error by using prototype
        oldOrientation = winWidth > winHeight ? 'landscape' : 'portrait',
        newOrientation,

        /* 
         * call all functions in funcs object
         */
        callFuncs = function (event) {
            var func;
            for (func in funcs) {
                if (funcs.hasOwnProperty(func)) {
                    funcs[func].call(window, event); // call function in the context of the window
                }
            }
        },

        /* 
         * primary call
         */
        call = function (event) {
            // clear current timer to enable resize end
            if (timer) {
                window.clearTimeout(timer);
            }

            // reset timer
            timer = window.setTimeout(function () {
                // reset width and height vars
                window.customResize.width = window.innerWidth || docElem.clientWidth || doc.body.clientWidth;
                window.customResize.height = window.innerHeight || docElem.clientHeight || doc.body.clientHeight;

                // check if orientation has changed for supported devices and reset vars accordingly
                if (orientationSupport) {
                    newOrientation = window.customResize.width > window.customResize.height ? 'landscape' : 'portait';
                    changed = newOrientation !== oldOrientation;
                    oldOrientation = newOrientation;
                }

                // only continue if orientation has changed (for supported devices), or standard resize end
                if (!changed) {
                    return;
                }

                // fire stored functions
                callFuncs(event);
            }, 100);
        },

        returnFuncs = {

            /*
             * Call passed in function on orientation change / window resize end
             * @param {function}: function to be called on orientation change on compatible devices, or resize end
             * @return {number}: function identifier
             */
            bind: function (f) {
                if (typeof f === 'function') {
                    var t = new Date().getTime() + num + Math.random(); // timestamp + index + random number
                    num += 1;
                    funcs[t] = f;
                    return t;
                }
            },

            /*
             * Unbind previous bound window resize event
             * @param {number|string}: timestamp of bound resize event
             * @return {boolean}: whether or not an event matching passed in timestamp was unbound
             */
            unbind: function (t) {
                if (funcs.hasOwnProperty(t)) {
                    delete funcs[t];
                    return true;
                }
                return false;
            },

            height: winHeight,
            width: winWidth
        };

    // bind resize event listener
    if (window.addEventListener) {
        window.addEventListener('resize', call);
    } else {
        window.attachEvent('onresize', call);
    }

    return returnFuncs;
    
}();