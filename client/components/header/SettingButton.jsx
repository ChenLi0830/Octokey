const {
  NavItem,
  Glyphicon
  } = ReactBootstrap;

SettingButton = React.createClass({
  render(){
    return <NavItem eventKey={2} href="#"><Glyphicon glyph="cog"/></NavItem>
  }
});
