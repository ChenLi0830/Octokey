const {
  Navbar,
  } = ReactBootstrap;

const{
  Link
  } = ReactRouter;

Brand = React.createClass({
  render(){
    return <Navbar.Header>
      <Navbar.Brand>
        <Link to="/">App Home</Link>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
  }
});