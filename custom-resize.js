(function (root) {
    'use strict';
    
    // primary variables
    var timer,
        funcs = {},
        changed = true,
        doc = root.document,
        docElem = doc.documentElement,
        winWidth = root.innerWidth || docElem.clientWidth || doc.body.clientWidth,
        winHeight = root.innerHeight || docElem.clientHeight || doc.body.clientHeight,
        orientationSupport = Object.prototype.hasOwnProperty.call(root, 'orientationchange'), // prevent IE7 error using prototype
        oldOrientation = winWidth > winHeight ? 'landscape' : 'portrait',
        newOrientation,
        
        callFuncs = function (event) {
            var func;
            for (func in funcs) {
                if (funcs.hasOwnProperty(func)) {
                    // call function in the context of the window
                    funcs[func].call(root, event);
                }
            }
        },
        
        call = function (event) {
            var func;
            
            // clear current timer to enable resize end
            if (timer) {
                root.clearTimeout(timer);
            }
            
            // reset timer
            timer = root.setTimeout(function () {
                // reset width and height vars
                root.customResize.width = root.innerWidth || docElem.clientWidth || doc.body.clientWidth;
                root.customResize.height = root.innerHeight || docElem.clientHeight || doc.body.clientHeight;

                // check if orientation has changed for supported devices and reset vars accordingly
                if (orientationSupport) {
                    newOrientation = root.customResize.width > root.customResize.height ? 'landscape' : 'portait';
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
        
        // functions to expose
        returnFuncs = {
            
            /**
             * Call passed in function on orientation change / window resize end
             * @param {function}: function to be called on orientation change on compatible devices, or resize end
             * @return {number}: timestamp to identify bound function
             */
            bind: function (f) {
                var t = new Date().getTime();
                if (typeof f === 'function') {
                    funcs[t] = f;
                    return t;
                }
            },
            
            /**
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
    if (root.addEventListener) {
        root.addEventListener('resize', call);
    } else {
        root.attachEvent('onresize', call);
    }
    
    root.customResize = returnFuncs;

}(this));