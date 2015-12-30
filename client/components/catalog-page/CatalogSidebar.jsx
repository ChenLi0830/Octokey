CatalogSideBar = React.createClass({
  mixins:[ReactMeteorData],

  getMeteorData(){
    return {
      currentUser: Meteor.user()
    }
  },

  render(){
    return <div className="catalog-sidebar">
      <SearchBox/>
      <br/>
      <CreateAppDraft private = {!this.isAdmin()}/>
      <br/>
      <CategoryList/>
    </div>
  },

  isAdmin(){//TODO use more scalable solution to configure this, possible solution: role system
    return this.data.currentUser && this.data.currentUser.emails[0].address == "lulugeo.li@gmail.com"
  }
});