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
  propTypes:{
    zenCategories:React.PropTypes.array.isRequired
  },

  mixins: [ReactMeteorData],

  getMeteorData(){
    return {
      currentUser: Meteor.user()
    }
  },

  render(){
    let createPublicAppButton = this.isAdmin() ? <CreateAppDraft createPublicApp={true}/> : null;
    let createCategoryButton = this.isAdmin()? <CreateCategoryButton zenCategories={this.props.zenCategories}/>:null;

    return <div>
      <Paper zDepth={1}
             style={{
             backgroundColor:"#ffffff",

             padding:0,
             borderRadius:"5px"}}>
        <SearchBox/>
        <Divider />
        {createPublicAppButton}
        <CreateAppDraft createPublicApp={false}/>
        <Divider />
        <CategoryList zenCategories={this.props.zenCategories}/>
        {createCategoryButton}
      </Paper>
    </div>
  },

  isAdmin(){//TODO use more scalable solution to configure this, i.e.: role system
    return this.data.currentUser && this.data.currentUser.emails[0].address == "lulugeo.li@gmail.com"
  }
});