var {ThemeManager} = MUI.Styles;
var {AppCanvas,Paper} = MUI;
var {Grid,Row,Col} = ReactBootstrap;

App = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    const subHandles = Meteor.userId() ?
      [
        //Meteor.subscribe("userData"),
        Meteor.subscribe("zenApps"),
        Meteor.subscribe("userPublicApps")
      ] : [];

    const subsReady = _.all(subHandles, function (handle) {
      return handle.ready();
    });

    // Get the current routes from React Router
    const routes = this.props.routes;

    // If we are at the root route, and the subscrioptions are ready
    if (routes.length > 1 && !routes[1].path && subsReady) {
      // Redirect to the route for the first todo list
      this.props.history.replaceState(null, `/list`);
    }

    return {
      subsReady: subsReady
    }
      ;
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(ZenRawTheme)
    };
  },

  render(){
    return (
      <div id="wrapper">
        <Header />
        <Grid style={{padding:"0"}}>
          <Row >
            <Col xs={12}>
              <div id="layout-margin">
                <Paper zDepth={1}
                       style={{backgroundColor:"#ffffff", boxShadow:"0 1px 6px rgba(0, 0, 0, 0.12)", padding:0, borderRadius:"5px"}}>
                  {this.data.subsReady ?
                    this.props.children :
                    <AppLoading />}
                </Paper>
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
});
