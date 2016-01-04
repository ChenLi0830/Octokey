const {
  Navbar,
  Nav
  } = ReactBootstrap;

const {AppBar,
  Tabs,
  Tab
  } = MUI;

const {ToggleStar} = SvgIcons;

const {Link, History} = ReactRouter;

Header = React.createClass({
  mixins: [ReactMeteorData, History],

  getMeteorData(){
    return {
      currentUser: Meteor.user()
    }
  },

  handleClickAddNew(tab) {
    //this.history.pushState(null, '/catalog');
    this.context.history.pushState(null, "/catalog");
  },

  handleClickHome(tab) {
    //this.history.pushState(null, '/catalog');
    this.context.history.pushState(null, "/");
  },

  render(){
    const addNewImage = (
      <img className="headerSVG " src="/img/addNew.svg"/>
    );

    const logo = (
      <img className="headerSVG " src="/img/logo.svg"/>
    );

    //header + inkbar: 64+4=68px;
    return <AppBar style={{marginTop:"-68px", boxShadow:"0 1px 16px rgba(0, 0, 0, 0.18)", backgroundColor:ZenColor.white}} showMenuIconButton={false}>
      <div className="container">
        <Tabs style={{maxWidth:"800px",marginLeft:"auto", marginRight:"auto"}}
              inkBarStyle={{height:"4px", width:"20%", marginLeft:"6.7%",backgroundColor:ZenColor.cyan}}>
          <Tab className="headerTab" label={<AccountsUIWrapper/>}/>

          <Tab className="headerTab" label={logo} onActive={this.handleClickHome}/>

          <Tab className="headerTab" label={addNewImage} route="/catalog" onActive={this.handleClickAddNew}/>
        </Tabs>
      </div>
    </AppBar>
  }
})
;