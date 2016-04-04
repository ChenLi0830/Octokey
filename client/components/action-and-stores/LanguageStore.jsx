/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-2-3
 *
 * This is used as the 'stores' of Re-flux for the language the user select
 *******************************************************************************/
LanguageStore = Reflux.createStore({
  listenables: [Actions],

  selectNewLanguage(language){
    if (this.language != language) {
      this.language = language;
      this.trigger('languageChange', language)
    } else {
      console.log("language not changed");
    }
  },

  /*getLanguage(){
   this.trigger('languageChange', this.language);
   },*/
});

