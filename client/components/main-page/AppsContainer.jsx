const {
  Grid,
  Row
  } = ReactBootstrap;

AppsContainer = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData(){
    if (Meteor.user() && Meteor.user().publicApps) {
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
    if (this.data.chosenApps.length>0){
      var appBoxes = this.data.chosenApps.map(function (app) {
        const logoURL = "cfs/files/zenApps/" + app._id;
        return <AppBox key={app._id} showConfig={true} appName={app.appName} logoURL={logoURL}/>
      }.bind(this));
    } else {
      var appBoxes = <h4> Add new apps</h4>;
    }

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