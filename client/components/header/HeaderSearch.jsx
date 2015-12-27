const {
  Navbar,
  Button,
  Glyphicon,
  Fade,
  Input
  } = ReactBootstrap;

HeaderSearch = React.createClass({

  getInitialState(){
    return {
      searchForm: false
    }
  },

  render(){
    return <Navbar.Form pullLeft>
      <Button id="superid-searchicon" onClick={this.handleToggle}>
        <Glyphicon glyph="search"/>
      </Button>
      <Fade in={this.state.searchForm}>
        <span>
          {<Input type="text" placeholder="Search"/>}
          {/*<Button type="submit">Submit</Button>*/}
        </span>
      </Fade>
    </Navbar.Form>
  },

  handleToggle(){
    //this.setState({searchForm: !this.state.searchForm})
    alert("HeaderSearch component: button toggled");
  }
});