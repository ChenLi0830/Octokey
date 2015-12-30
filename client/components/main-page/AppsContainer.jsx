const {
  Grid,
  Row
  } = ReactBootstrap;

AppsContainer = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData(){
    if (Meteor.user()){
      console.log("user():",Meteor.user());
      console.log("publicApps",Meteor.user().publicApps);
      let query_chosenApps = {_id: {$in:Meteor.user().publicApps}};

      return {
        currentUser: Meteor.user(),
        chosenApps: ZenApps.find(query_chosenApps).fetch()
      }
    } else {
      return {}
    }
  },

  render(){
    console.log("chosenApps",this.data.chosenApps);
    return <div>
      <Grid>
        <Row>
          <AppBox showConfig={true}/>
        </Row>
      </Grid>
    </div>
  }
});