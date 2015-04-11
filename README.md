# Custom Resize

A custom resize script.

In mobile Chrome and Firefox, resize events fire when the nav bar disappears. If you don't want to do any unnecessary calculations in this case, then you can use the `orientationchange` event. The problem with the `orientationchange` event however, is that in many cases (particularly on Android), it fires **before** the orientation has changed. So any width calculations your functions are dependent on will be calculated incorrectly.

Custom Resize exists in order to get around this. On desktop devices, Custom Resize will fire on resize end to prevent calculations firing on every pixel movement. On mobile devices (particularly devices that support `orientationchange`), it will use a custom orientationchange detection, that will fire **after** the orientation has actually changed. This is done via some window width and height comparisons.

## How To Use

The script adds a `customResize` object to the window with two properties: `bind` and `unbind`. Bind returns a number - a unique identifier for the function bound. `unbind` needs to be passed a number - the unique identifier returned by the `bind` method - in order to unbind this function from firing on resize end / orientationchange.