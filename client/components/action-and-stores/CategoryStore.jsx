CategoryStore = Reflux.createStore({
  listenables: [Actions],

  selectNewCategory(categoryName){
    //console.log("Actions",Actions);
    this.trigger('categoryChange', categoryName)
  }
});

