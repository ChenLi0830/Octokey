/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-12-31
 *
 * React-Intl wrapper component. Used to wrap the App around react-intl to support
 * multiple languages. Called by "routes".
 *******************************************************************************/
import React from "react"
import languages from '../locales';
import Reflux from "reflux";
import {IntlProvider} from "react-intl";
import {LanguageStore} from "./action-and-stores/LanguageStore.jsx";

var Actions =  require("./action-and-stores/Actions.jsx");
var IntlWrapper = React.createClass({
  mixins: [Reflux.listenTo(LanguageStore, 'languageChange')],

  propTypes: {
    router: React.PropTypes.object.isRequired,
  },

  childContextTypes: {
    locale: React.PropTypes.string
  },
  getChildContext: function () {
    return {locale: this.state.locale};
  },

  getInitialState(){
    const defaultLocale = "zh";
    //const defaultLocale = "en-US";
    Actions.selectNewLanguage(defaultLocale);
    return {
      locale: defaultLocale,
      //locale:"en-US",
    };
  },

  render(){
    //console.log("render this.state.locale",this.state.locale);
    let intlData = this.getIntlData(this.state.locale);
    return <IntlProvider {...intlData}>
      {this.props.router}
    </IntlProvider>
  },

  getIntlData(locale){
    //var locale = navigator.language.split('-');
    //locale = locale[1] ? `${locale[0]}-${locale[1].toUpperCase()}` : navigator.language;
    //locale = "zh";
    /* Set error message language */
    locale==="zh" && T9n.setLanguage("zh-CN");
    locale==="en-US" && T9n.setLanguage("en-US");

    var strings = languages[locale] ? languages[locale] : languages["en-US"];
    //strings = Object.assign(languages["en-US"], strings);

    //console.log("locale", locale);
    //console.log("strings", strings);
    return {
      locale: locale,
      messages: strings
    };
  },

  languageChange(event, locale){
    //if (this.state.locale != locale) {
    this.setState({locale: locale});
    //};
  },
});

module.exports = IntlWrapper;