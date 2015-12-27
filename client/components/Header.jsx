const {
  Jumbotron,
  } = ReactBootstrap;

Header = React.createClass({
  render()
  {
    /*if (this.state.idToken) {
     return (<LoggedIn lock={this.lock} idToken={this.state.idToken} />);
     } else {
     return (<AuthHome lock={this.lock} />);
     }*/

    return <div>
      <Jumbotron id="superid-navbar">
        this is a test for ReactBootstrap
      </Jumbotron>
    </div>
  }
//render (){
//  return <div>
//    Login Button:
//    <AccountsUIWrapper/>
//  </div>
//}
})
;