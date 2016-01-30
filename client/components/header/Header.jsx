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

const passengerAllowedLink = ["/login","/reset", "/signUp"];
Header = React.createClass({
    propTypes: {
      location: React.PropTypes.object.isRequired,
    },

    mixins: [ReactMeteorData, History],

    getInitialState(){
        return {routeValue: "/login"}
    },

    getMeteorData(){
        return {
            currentUser: Meteor.user()
        }
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState({
            routeValue: nextProps.location.pathname
        });
    },

    handleTabChange(value) {
        if (this.data.currentUser) {//用户已经登录
            if (value === "/login") this.handleLogout();

            this.setState({routeValue: value}, function(){
                this.context.history.pushState(null, value);
            }.bind(this));
        }
        else if (_.indexOf(passengerAllowedLink, value)>-1) {//是任何人都可以访问的link
            this.setState({routeValue: value}, function(){
                this.context.history.pushState(null, value);
            }.bind(this));
        } else{//无权限访问, 把tab换回之前的位置
            this.setState({routeValue: this.state.routeValue})
        }
    },

    handleLogout(){
        Accounts.logout();
    },

    render(){
        const addNewImage = (
            <img className="headerSVG " src="/img/addNew.svg"/>
        );

        const logo = (
            <img className="headerSVG " src="/img/logo.svg"/>
        );

        //header + inkbar: 64+4=68px;
        return <AppBar
            style={{marginTop:"-68px", boxShadow:"0 1px 16px rgba(0, 0, 0, 0.18)", backgroundColor:ZenColor.white}}
            showMenuIconButton={false}>
            <div className="container">
                <Tabs onChange={this.handleTabChange}
                      value={this.state.routeValue}
                      style={{maxWidth:"800px",marginLeft:"auto", marginRight:"auto"}}
                      inkBarStyle={{height:"4px", width:"20%", marginLeft:"6.7%",backgroundColor:ZenColor.cyan}}>

                    <Tab className="headerTab" value="/login" label={<AccountTab currentUser={this.data.currentUser}/>}/>

                    <Tab className="headerTab" value="/list" label={logo}/>

                    <Tab className="headerTab" value="/catalog" label={addNewImage}/>
                </Tabs>
            </div>
        </AppBar>
    }
});