/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-26
 *
 * Header component, called by "App" component
 *******************************************************************************/
var LanguageIcon = require('../header/LanguageIcon.jsx');
var AccountTab = require('../accounts/AccountTab.jsx');

const {
    Navbar,
    Nav,
    Col,
    } = ReactBootstrap;

const {AppBar,
    Tabs,
    Tab,
    IconMenu,
    IconButton,
    DropDownMenu,
    MenuItem,
    SvgIcon,
    FontIcon,
    Paper
    } = MUI;

const {
    MapsPersonPin,
    ToggleStar,
    ActionLanguage,
    HardwareToys,
    ActionAccountCircle,
    ActionViewModule,
    PlacesAllInclusive,
    } = SvgIcons;

import { Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;


const {Link} = ReactRouter;

const guestAllowedLink = ["/login", "/reset", "/join"];

const styles = {
  tab: {
    paddingLeft: 30,
    paddingRight: 30,
    backgroundColor: ZenColor.white,
  },
  headerSVG: {
    height: 64,
  },

  languageItem: {
    position: "absolute",
    display: "block",
    width: "32px",
    height: "24px",
    left: "14px",
    margin: "10px",
  },
  inkBar: {
    //height: "4px",
    //top: "8px",
    width: "10%",
    marginLeft: "6.7%",
    backgroundColor: ZenColor.blue,
    transform: "translateX(50%)",
    //':hover': {
    //    backgroundColor: 'red'
    //},
  },
  appBar: {
    marginTop: "-68px",
    boxShadow: "0 1px 16px rgba(0, 0, 0, 0.18)",
    backgroundColor: ZenRawTheme.palette.primary4Color,
    zIndex: "auto",
  }
};

var Header = React.createClass({
  propTypes: {
    location: React.PropTypes.object.isRequired,
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired,
    intl: React.PropTypes.object.isRequired,
  },

  mixins: [ReactMeteorData],

  getInitialState(){
    return {
      routeValue: "/login",
    }
  },

  getMeteorData(){
    return {
      currentUser: Meteor.user(),
    }
  },

  componentWillReceiveProps: function (nextProps) {
    this.setState({
      routeValue: nextProps.location.pathname
    });
  },

  handleTabChange(value) {
    //console.log("handleTabChange");
    if (this.data.currentUser) {//用户已经登录
      if (value === "/login") {
        Meteor.logout(function (err) {
          //console.log("userId = " + Meteor.userId());
          this.setState({routeValue: value}, function (error) {
            this.context.router.push(value);
          }.bind(this))
        }.bind(this))
      } else {
        this.setState({routeValue: value}, function () {
          this.context.router.push(value);
        }.bind(this));
      }
    }
    else if (_.indexOf(guestAllowedLink, value) > -1) {//是任何人都可以访问的link
      this.setState({routeValue: value}, function () {
        this.context.router.push(value);
      }.bind(this));
    } else {//无权限访问, 把tab换回之前的位置
      this.setState({routeValue: this.state.routeValue})
    }
  },

  render(){
    messages = this.context.intl.messages.header;
    const logo = (
        <div style={{margin:"10px 10px 10px 30px"}}>
          <img src="/img/logo.png"
               style={{height: 40, verticalAlign:"top", color:Colors.grey800}}/>
          <div src="vertical-center"
               style={{display:"inline-block",marginLeft:12, color:Colors.grey700}}>
            <h3>Octokey</h3>
            <p>O钥匙</p>
          </div>
        </div>
    );

    let account;
    console.log("this.data.currentUser", this.data.currentUser);

    if (this.data.currentUser && this.data.currentUser.emails &&
        this.data.currentUser.emails.length > 0) {
      account = this.data.currentUser.emails[0].address;
    } else if (this.data.currentUser && this.data.currentUser.phone) {
      account = this.data.currentUser.phone.number;
    }

    console.log("account", account);
    return (<Paper style={{display: "flex", position: "relative",
    boxShadow: "0 0px 12px rgba(0, 0, 0, 0.18)", backgroundColor:"white"}}>
          <Col xs={2}>
            {logo}
          </Col>

          <Col xs={8} xsOffset={1}>
            <Menu onClick={this.handleClick}
                  selectedKeys={[this.state.routeValue]}
                  style={{fontSize: "14px", fontWeight: 200, lineHeight:"60px"}}
                  mode="horizontal">

              {this.data.currentUser ?
                  <SubMenu title={<span><Icon type="setting" />{messages["account-账户"]}</span>}>
                    <MenuItemGroup title={account}>
                      <Menu.Item key="/login">{messages["logout-登出"]}</Menu.Item>
                    </MenuItemGroup>
                  </SubMenu>

                  : <Menu.Item key="/login">
                    <Icon type="solution"/>{messages["login-登录"]}
                  </Menu.Item>
              }

              <Menu.Item key="/list" style={{marginLeft:"25%", marginRight:"12.5%"}}>
                <Icon type="home"/>{messages["mySites-我的网站"]}
              </Menu.Item>

              <Menu.Item key="/catalog" style={{marginLeft:"12.5%"}}>
                <Icon type="appstore-o"/>{messages["allSites-所有网站"]}
              </Menu.Item>

            </Menu>
          </Col>
        </Paper>

    )
    {
      /*      <AppBar
       style={styles.appBar}
       iconElementLeft={logo}
       showMenuIconButton={true}>

       <Col xs={10}>
       <div>

       {<Tabs
       onChange={this.handleTabChange}
       tabItemContainerStyle={{backgroundColor:ZenRawTheme.palette.primary4Color}}
       inkBarStyle={styles.inkBar}
       value={this.state.routeValue}
       >
       <Tab
       icon={<ActionAccountCircle className="horizontal-center"
       style={{fill:ZenRawTheme.palette.primary1Color}}/>}
       label={<AccountTab currentUser={this.data.currentUser}/>}
       value="/login"
       />
       <Tab
       icon={<HardwareToys className="horizontal-center"
       style={{fill:ZenRawTheme.palette.primary1Color, height:"68px"}}/>}
       label={messages["mySites-我的网站"]/!*message*!/}
       value="/list"
       />
       <Tab
       icon={<PlacesAllInclusive className="horizontal-center"
       style={{fill:ZenRawTheme.palette.primary1Color, height:"68px"}}/>}
       label={messages["allSites-所有网站"]/!*message*!/}
       value="/catalog"
       />
       </Tabs>}

       <Tabs>
       <Tab
       icon={<FontIcon className="material-icons">phone</FontIcon>}
       label="RECENTS"
       />
       <Tab
       icon={<FontIcon className="material-icons">favorite</FontIcon>}
       label="FAVORITES"
       />
       <Tab
       icon={<MapsPersonPin />}
       label="NEARBY"
       />
       </Tabs>

       </div>
       </Col>
       </AppBar>*/
    }
  },

  handleClick(e) {
    console.log('click ', e);
    this.setState({current: e.key}, ()=> {
      console.log("this.state.current", this.state.current);
    });

    this.handleTabChange(e.key);
    /*switch (e.key) {
     case "mail/.$mail":
     this.handleTabChange('/list');
     break;
     case "app/.$app":
     this.handleTabChange('/catalog');
     break;

     }*/
  },
});

module.exports = Header;