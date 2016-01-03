const {
  Navbar,
  Nav
  } = ReactBootstrap;

const {AppBar,
  Tabs,
  Tab
  } = MUI;

const {ToggleStar} = SvgIcons;

const {Link} = ReactRouter;

Header = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData(){
    return {
      currentUser: Meteor.user()
    }
  },

  handleActive(tab) {
    //alert(`A tab with this route property ${tab.props.route} was activated.`);
  },

  render(){
    const addNewImage = (
      <Link to="/catalog">
        <img className="headerSVG " src="/img/addNew.svg"/>
      </Link>
    );

    const logo = (
      <Link to="/">
        <img className="headerSVG " src="/img/logo.svg"/>
      </Link>

    );

    return <AppBar className="ZenAppBar" showMenuIconButton={false}>
      <div className="container">
        <Tabs style={{maxWidth:"800px",marginLeft:"auto", marginRight:"auto"}}
              inkBarStyle={{height:"4px", width:"20%", marginLeft:"6.7%"}}>
          <Tab className="headerTab" label={<AccountsUIWrapper/>}/>

          <Tab className="headerTab" label={logo}/>

          <Tab className="headerTab" label={addNewImage} route="/home" onActive={this.handleActive}>
          </Tab>
        </Tabs>
      </div>
    </AppBar>;

  }
})
;