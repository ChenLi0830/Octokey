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
    Nav
    } = ReactBootstrap;

const {AppBar,
    Tabs,
    Tab,
    IconMenu,
    IconButton,
    DropDownMenu,
    MenuItem,
    SvgIcon
    } = MUI;

const {
    ToggleStar,
    ActionLanguage
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
        height: "4px",
        top: "8px",
        width: "20%",
        marginLeft: "6.7%",
        backgroundColor: ZenColor.cyan,

        ':hover': {
            backgroundColor: 'red'
        },
    },
};

var Header = React.createClass({
    propTypes: {
        location: React.PropTypes.object.isRequired,
    },

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    mixins: [ReactMeteorData],

    getInitialState(){
        return {
            routeValue: "/loginMobile",
            language: "zh",
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
        const addNewImage = (
            <img style={styles.headerSVG} src="/img/addNew.svg"/>
        );

        const logo = (
            <img style={styles.headerSVG} src="/img/logo.svg"/>
        );

        return <AppBar
            style={{marginTop:"-68px", boxShadow:"0 1px 16px rgba(0, 0, 0, 0.18)", backgroundColor:ZenColor.white}}
            iconElementLeft={
                             <IconMenu
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
                             </IconMenu>
                         }
            showMenuIconButton={true}>

            <div className="container">
                <Tabs onChange={this.handleTabChange}
                      value={this.state.routeValue}
                      style={{maxWidth:"800px",marginLeft:"auto", marginRight:"auto"}}
                      tabItemContainerStyle={{backgroundColor:ZenColor.white}}
                      inkBarStyle={styles.inkBar}>

                    <Tab style={styles.tab} value="/loginMobile"
                         disableTouchRipple
                         label={<AccountTab currentUser={this.data.currentUser}/>}/>

                    <Tab style={styles.tab} disableTouchRipple value="/list" label={logo}/>

                    <Tab style={styles.tab} value="/catalog" disableTouchRipple label={addNewImage}/>
                </Tabs>

            </div>
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

    handleLanguageChange(event, value){
        //console.log("language value", value);
        Actions.selectNewLanguage(value);
        this.setState({language: value});
    },
});

module.exports = Radium(Header);