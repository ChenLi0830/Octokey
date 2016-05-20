/**
 * Created by Chen on 2016-05-20.
 */
/**
 * Set up intl-polyfill for different browsers (safari), see details (Search for issue#150 in
 * React-Intl to see
 * details)
 */
if (global.Intl) {
  // Determine if the built-in `Intl` has the locale data we need.
  var IntlPolyfill = require('intl');
  Intl.NumberFormat = IntlPolyfill.NumberFormat;
  Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
} else {
  // No `Intl`, so use and load the polyfill.
  global.Intl = require('intl');
}