CatalogSideBar = React.createClass({
  mixins:[ReactMeteorData],

  getMeteorData(){
    return {
      currentUser: Meteor.user()
    }
  },

  render(){
    let createPublicAppButton = this.isAdmin()? <CreateAppDraft createPublicApp = {true}/> :null;

    return <div className="catalog-sidebar">
      {createPublicAppButton}
      <SearchBox/>
      <br/>
      <CreateAppDraft createPublicApp = {false}/>
      <br/>
      <CategoryList/>
    </div>
  },

  isAdmin(){//TODO use more scalable solution to configure this, possible solution: role system
    return this.data.currentUser && this.data.currentUser.emails[0].address == "lulugeo.li@gmail.com"
  }
});