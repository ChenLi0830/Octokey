//Todo: add configuration FAB

const {
  Grid,
  Row
  } = ReactBootstrap;

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

      let findUserApps = UserApps.find({userId: Meteor.userId()});
      return {
        currentUser: Meteor.user(),
        chosenPublicApps: findUserApps ? findUserApps.fetch()[0].publicApps : []
      }
    } else {
      return {
        currentUser: null,
        chosenPublicApps: []
      }
    }
  },

  getInitialState(){
    return {
      //Todo configure the width dynamically
      appsBoxWidth: 1140
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
                       width={(this.state.appsBoxWidth)/6}/>
      }.bind(this));
    } else {
      var appBoxes = <h4> Add new apps</h4>;
    }

    return <div ref="AppsBox">
      <Grid>
        <Row>
          {appBoxes}
        </Row>
      </Grid>
    </div>
  }
});