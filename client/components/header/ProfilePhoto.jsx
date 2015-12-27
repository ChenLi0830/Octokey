const {
  NavDropdown,
  MenuItem
  } = ReactBootstrap;

ProfilePhoto = React.createClass({
  render(){
    return <NavDropdown eventKey={1} title="User" id="basic-nav-dropdown">
      <MenuItem eventKey={1.1}>Profile</MenuItem>
      <MenuItem eventKey={1.2}>Configuration</MenuItem>
      <MenuItem divider/>

      <MenuItem to="/" onClick={this.handleLogout}>
        Log Out
      </MenuItem>

    </NavDropdown>
  },

  handleLogout(){
    alert(" profile-photo: log out triggered");
    localStorage.removeItem('userToken');
  }
});