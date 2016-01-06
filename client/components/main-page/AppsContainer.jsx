//Todo: add configuration FAB

const {
  Grid,
  Row
  } = ReactBootstrap;

AppsContainer = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData(){
    if (Meteor.user()) {
      let publicAppsUserData = UserApps.find({userId: Meteor.userId()}).fetch()[0].publicApps;
      let chosenPublicAppIds = _.pluck(publicAppsUserData, "appId");

      const query_chosenPublicApps = {
        _id: {
          $in: chosenPublicAppIds
        }
      };

      return {
        currentUser: Meteor.user(),
        publicAppsUserData: publicAppsUserData,
        chosenPublicApps: ZenApps.find(query_chosenPublicApps).fetch()
      }
    } else {
      return {
        currentUser: null,
        publicAppsUserData: [],
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
      var appBoxes = this.data.chosenPublicApps.map(function (app) {
        const logoURL = getLogoUrl(app._id);
        const configured = _(this.data.publicAppsUserData).filter(function (userData) {
            return userData.appId == app._id;
          })
          .pluck("configured")
          .value();

        return <AppBox key={app._id}
                       appName={app.appName}
                       configured={configured}
                       logoURL={logoURL}
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