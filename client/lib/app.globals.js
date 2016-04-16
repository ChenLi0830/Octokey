/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-31
 *
 * Global variables used by client, remove it in the future and reference
 * everything in each component instead.
 *******************************************************************************/
React = require("react");
ReactDOM = require("react-dom");
ReactRouter = require("react-router");
ReactBootstrap = require("react-bootstrap");
_ = require("lodash");
MUI = require("material-ui");
injectTapEventPlugin = require("react-tap-event-plugin");
SvgIcons = require("material-ui/svg-icons/");
Reflux = require('reflux');

Colors = require('material-ui/styles/colors');
ColorManipulator = require('material-ui/utils/colorManipulator');
//Spacing = require('material-ui/styles/spacing');
//zIndex = require('material-ui/styles/zIndex');

ReactIntl = require("react-intl");

antd = require("antd");

/**
 * Set up intl-polyfill for different apps, see details (Search for issue#150 in React-Intl to see
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