var {ThemeManager} = MUI.Styles;

App = React.createClass({
  mixins:[ReactMeteorData],

  getMeteorData() {
    const subHandles = [
      Meteor.subscribe("userData"),
      Meteor.subscribe("zenApps")
    ];

    const subsReady = _.all(subHandles, function(handle){
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
    };
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
      <div>
        <Header/>
        <div id="content-container">
          { this.data.subsReady ?
            this.props.children :
            <AppLoading /> }
        </div>
      </div>
    )
  }
});
