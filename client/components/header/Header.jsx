/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-26
 *
 * Header component, called by "App" component
 *******************************************************************************/
const {
    Navbar,
    Nav
    } = ReactBootstrap;

const {AppBar,
    Tabs,
    Tab,
    IconMenu,
    IconButton,
    MenuItem
    } = MUI;

const {ToggleStar,
    ActionLanguage
    } = SvgIcons;

const {Link} = ReactRouter;

const passengerAllowedLink = ["/login", "/reset", "/signUp"];

const styles = {
    tab:{
        paddingLeft: 30,
        paddingRight: 30,
        backgroundColor: ZenColor.white,
    },
    headerSVG:{
        height: 64,
    }
};

Header = React.createClass({
    propTypes: {
        location: React.PropTypes.object.isRequired,
    },

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    mixins: [ReactMeteorData],

    getInitialState(){
        return {
            routeValue: "/login",
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
        if (this.data.currentUser) {//用户已经登录
            if (value === "/login") Meteor.logout();

            this.setState({routeValue: value}, function () {
                this.context.router.push(value);
            }.bind(this));
        }
        else if (_.indexOf(passengerAllowedLink, value) > -1) {//是任何人都可以访问的link
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

        //header + inkbar: 64+4=68px;
        return <AppBar
            style={{marginTop:"-68px", boxShadow:"0 1px 16px rgba(0, 0, 0, 0.18)", backgroundColor:ZenColor.white}}
            iconElementLeft={
                  <IconMenu
                  value={this.state.language}
                  onChange={this.handleLanguageChange}
                    iconButtonElement={
                      <IconButton iconStyle={{fill:ZenColor.orange}}><ActionLanguage /></IconButton>
                    }
                    //targetOrigin={{horizontal: 'right', vertical: 'top'}}
                    //anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                  >
                    <MenuItem primaryText="中文" value="zh"/>
                    <MenuItem primaryText="English" value="en-US"/>
                  </IconMenu>
            }
            showMenuIconButton={true}>
            <div className="container">
                <Tabs onChange={this.handleTabChange}
                      value={this.state.routeValue}
                      style={{maxWidth:"800px",marginLeft:"auto", marginRight:"auto"}}
                      inkBarStyle={{height:"4px", width:"20%", marginLeft:"6.7%",backgroundColor:ZenColor.cyan}}>

                    <Tab style={styles.tab} value="/login"
                         label={<AccountTab currentUser={this.data.currentUser}/>}/>

                    <Tab style={styles.tab} value="/list" label={logo}/>

                    <Tab style={styles.tab} value="/catalog" label={addNewImage}/>
                </Tabs>

            </div>
        </AppBar>
    },

    handleLanguageChange(event, value){
        Actions.selectNewLanguage(value);
        this.setState({language:value});
    },
});