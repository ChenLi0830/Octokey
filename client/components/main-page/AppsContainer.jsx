//Todo: add configuration FAB

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

  getInitialState(){
    return {
      appsBoxWidth:1140
    }
  },

  componentDidMount(){
    this.setState({width:this.refs.AppsBox.offsetWidth});
  },

  render(){
    if (this.data.chosenApps.length>0){
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