const {
  List,
  ListItem,
  RaisedButton,
  Divider,
  Paper} = MUI;
const {
  ActionSearch,
  ContentInbox,
  PlacesAllInclusive,
  CommunicationForum,
  ImageAudiotrack,
  HardwareVideogameAsset} = SvgIcons;

CatalogSideBar = React.createClass({
  mixins: [ReactMeteorData],


  getMeteorData(){
    return {
      currentUser: Meteor.user()
    }
  },

  render(){
    let createPublicAppButton = this.isAdmin() ? <CreateAppDraft createPublicApp={true}/> : null;

    return <div>
      <SearchBox/>
      <Divider />
      {createPublicAppButton}
      <CreateAppDraft createPublicApp={false} />
      <Divider />
      <CategoryList/>
    </div>
  },

  isAdmin(){//TODO use more scalable solution to configure this, i.e.: role system
    return this.data.currentUser && this.data.currentUser.emails[0].address == "lulugeo.li@gmail.com"
  }
});