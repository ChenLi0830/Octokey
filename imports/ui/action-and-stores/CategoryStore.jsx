/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-12-26
 *
 * This is used as the 'stores' of Re-flux for the category the user select
 *******************************************************************************/
import Reflux from "reflux";

var Actions =  require("./Actions.jsx");

const CategoryStore = Reflux.createStore({
  listenables: [Actions],

  selectNewCategory(categoryName){
    this.trigger('categoryChange', categoryName)
  }
});

module.exports = CategoryStore;