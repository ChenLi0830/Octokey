const {
  Navbar,
  Nav
  } = ReactBootstrap;

Header = React.createClass({
  mixins:[ReactMeteorData],

  getMeteorData(){
    return {
      currentUser: Meteor.user()
    }
  },

  renderLoggedIn(){
    return <Nav bsStyle="pills" pullRight>
      <ProfilePhoto/>
      <SettingButton/>
      <NewAppButton/>
    </Nav>
  },

  render(){
    return <div>
      <Navbar id="superid-navbar">
        <Brand />
        <HeaderSearch/>
        <Navbar.Collapse>
          {this.data.currentUser ? this.renderLoggedIn() : null}
          <AccountsUIWrapper/>
        </Navbar.Collapse>

      </Navbar>
    </div>
  }
})
;