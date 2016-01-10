//Todo: add configuration FAB

const {
  Grid,
  Row
  } = ReactBootstrap;

const {
  Paper
  } = MUI;

AppsContainer = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData(){
    if (Meteor.user()) {
      //let publicAppsUserData = UserApps.find({userId: Meteor.userId()}).fetch()[0].publicApps;
      //let chosenPublicAppIds = _.pluck(publicAppsUserData, "appId");
      //
      //const query_chosenPublicApps = {
      //  _id: {
      //    $in: chosenPublicAppIds
      //  }
      //};

      let findUserApps = UserApps.find({userId: Meteor.userId()}).fetch()[0];
      return {
        currentUser: Meteor.user(),
        chosenPublicApps: findUserApps ? findUserApps.publicApps : []
      }
    } else {
      return {
        currentUser: null,
        chosenPublicApps: []
      }
    }
  },

  componentDidMount(){
    this.setState({width: this.refs.AppsBox.offsetWidth});
  },

  render(){
    if (this.data.chosenPublicApps.length > 0) {
      var appBoxes = this.data.chosenPublicApps.map(function (userApp) {
        return <AppBox key={userApp.appId}
                       appId={userApp.appId}
                       appName={userApp.appName}
                       logoURL={userApp.logoURL}
                       loginLink={userApp.loginLink}
                       configured={userApp.configured}
                       width="100%"/>
      }.bind(this));
    } else {
      var appBoxes = <h4> Add new apps</h4>;
    }

    return <Paper zDepth={1}
                  style={{
             backgroundColor:"#ffffff",
             boxShadow:"0 1px 6px rgba(0, 0, 0, 0.12)",
             padding:0,
             borderRadius:"5px"}}>
      <Row style={{marginLeft:0, marginRight:0}}>
        {appBoxes}
      </Row>
    </Paper>
  }
});