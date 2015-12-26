if (Meteor.isClient) {
  Meteor.startup(function () {
    // Use Meteor.startup to render the component after the page is ready
    ReactDOM.render(<App />, document.getElementById("container"));
  });
}

if (Meteor.isServer) {
/*  Meteor.startup(function () {
    // code to run on server at startup
  });*/


}
