const {
  Grid,
  Row
  } = ReactBootstrap;

AppsContainer = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData(){
    if (Meteor.user()) {
      let query_chosenApps = {_id: {$in: Meteor.user().publicApps}};

      return {
        currentUser: Meteor.user(),
        chosenApps: ZenApps.find(query_chosenApps).fetch()
      }
    } else {
      return {}
    }
  },

  render(){
    console.log("chosenApps of this user:", this.data.chosenApps);
    let appBoxes = this.data.chosenApps.map(function (app) {
      const logoURL = "cfs/files/zenApps/" + app._id;
      return <AppBox key={app._id} showConfig={true} appName={app.appName} logoURL={logoURL}/>
    }.bind(this));

    console.log("chosenApps", this.data.chosenApps);
    return <div>
      <Grid>
        <Row>
          {appBoxes}
        </Row>
      </Grid>
    </div>
  }
});