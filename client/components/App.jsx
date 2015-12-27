App = React.createClass({
  mixins:[ReactMeteorData],

  getMeteorData() {
    const subHandles = [
      Meteor.subscribe("formalApps")
    ];

    const subsReady = subHandles.map(function (handle) {//这里需要改成对每个Meteor.subscribe都可用
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
      subsReady: subsReady,
      //lists: Lists.find({}, { sort: {createdAt: -1} }).fetch(),
      currentUser: Meteor.user()
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
