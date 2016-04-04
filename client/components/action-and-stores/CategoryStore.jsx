/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-26
 *
 * This is used as the 'stores' of Re-flux for the category the user select
 *******************************************************************************/
CategoryStore = Reflux.createStore({
  listenables: [Actions],

  selectNewCategory(categoryName){
    this.trigger('categoryChange', categoryName)
  }
});

