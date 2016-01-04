//Todo: importance level: normal - pretty login page up.
Login = React.createClass({
  mixins:[ReactMeteorData],

  getMeteorData(){
    return {
      userLoggedIn:!Meteor.userId()
    }
  },

  handleLoggedIn(){
    console.log(this.props);
    const { location } = this.props;

    if (location.state && location.state.nextPathname) {
      this.props.history.replaceState(null, location.state.nextPathname)
    } else {
      this.props.history.replaceState(null, '/')
    }
  },

  render(){
    if (this.data.userLoggedIn){
      this.handleLoggedIn();
    }

    return <div>
      <p>Opps, it seems like you are not logged in. </p>
    </div>
  }
});