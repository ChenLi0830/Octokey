//Todo: add configuration FAB

const {
  Grid,
  Row
  } = ReactBootstrap;

AppsContainer = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData(){
    if (Meteor.user()) {
      let chosenPublicApps = UserApps.find({userId: Meteor.userId()}).fetch()[0].publicApps;
      let chosenPublicAppIds = _.pluck(chosenPublicApps, "appId");

      const query_chosenPublicApps = {
        _id: {
          $in: chosenPublicAppIds
        }
      };

      return {
        currentUser: Meteor.user(),
        chosenPublicApps: chosenPublicApps,
        chosenApps: ZenApps.find(query_chosenPublicApps).fetch()
      }
    } else {
      return {
        currentUser: null,
        chosenPublicApps: [],
        chosenApps: []
      }
    }
  },

  getInitialState(){
    return {
      appsBoxWidth: 1140
    }
  },

  componentDidMount(){
    this.setState({width: this.refs.AppsBox.offsetWidth});
  },

  render(){
    if (this.data.chosenApps.length > 0) {
      var appBoxes = this.data.chosenApps.map(function (app) {
        const logoURL = getLogoUrl(app._id);
        return <AppBox key={app._id} appName={app.appName} logoURL={logoURL} width={(this.state.appsBoxWidth)/6}/>
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