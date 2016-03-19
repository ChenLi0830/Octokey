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
    } = MUI;

const {
    ToggleStar,
    ActionLanguage,
    ActionAccountCircle,
    ActionViewModule,
    PlacesAllInclusive,
    } = SvgIcons;


const {Link} = ReactRouter;

const guestAllowedLink = ["/loginMobile", "/reset", "/join"];

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
            routeValue: "/loginMobile",
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
            if (value === "/loginMobile") {
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
            <div style={{margin:10}}>
                <img className="vertial-middle " src="/img/logo-text.png"
                     style={{height: 40}}/>
            </div>);
        return <AppBar
            style={{marginTop:"-68px", boxShadow:"0 1px 16px rgba(0, 0, 0, 0.18)", backgroundColor:ZenRawTheme.palette.primary4Color}}
            iconElementLeft={logo
                             /*<IconMenu
                                 value={this.state.language}
                                 onChange={this.handleLanguageChange}
                                 anchorOrigin={{vertical:'bottom', horizontal: 'left'}}
                                 menuStyle={{backgroundColor:ZenColor.white}}
                                 iconButtonElement={
                                     <IconButton>
                                     <LanguageIcon iconName={this.state.language==="zh"&&"cn" ||
                                     this.state.language==="en-US"&&"us"}
                                     />
                                     </IconButton>
                                 }
                             >
                             <MenuItem leftIcon = {<LanguageIcon style={styles.languageItem} iconName="cn"/>}
                             primaryText="中文" value="zh" style={{fontSize:13}}
                             />
                             <MenuItem leftIcon = {<LanguageIcon style={styles.languageItem} iconName="us"/>}
                             primaryText="English" value="en-US" style={{fontSize:13}}
                             />
                             </IconMenu>*/
                         }
            showMenuIconButton={true}>

            <Col xs={12}>
                <div>

                    {<Tabs
                        onChange={this.handleTabChange}
                        tabItemContainerStyle={{backgroundColor:ZenRawTheme.palette.primary4Color}}
                        contentContainerStyle={{color:"black"}}
                        inkBarStyle={styles.inkBar}
                        value={this.state.routeValue}
                    >
                        <Tab
                            icon={<ActionAccountCircle className="horizontal-center" style={{fill:ZenRawTheme.palette.primary1Color}}/>}
                            label={<AccountTab currentUser={this.data.currentUser}/>}
                            value="/loginMobile"
                        />
                        <Tab
                            icon={<ActionViewModule className="horizontal-center"style={{fill:ZenRawTheme.palette.primary1Color}}/>}
                            label={messages["mySites-我的网站"]/*message*/}
                            value="/list"
                        />
                        <Tab
                            icon={<PlacesAllInclusive className="horizontal-center" style={{fill:ZenRawTheme.palette.primary1Color}}/>}
                            label={messages["allSites-所有网站"]/*message*/}
                            value="/catalog"
                        />
                    </Tabs>}
                </div>
            </Col>
        </AppBar>
    },

    handleClick(e) {
        console.log('click ', e);
        this.setState({
            current: e.key
        });
        console.log("this.state.current", this.state.current);
        switch (e.key) {
            case "mail/.$mail":
                this.handleTabChange('/list');
                break;
            case "app/.$app":
                this.handleTabChange('/catalog');
                break;

        }
    },
});

module.exports = Radium(Header);