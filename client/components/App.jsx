var {ThemeManager} = MUI.Styles;
var {AppCanvas,Paper} = MUI;
var {Grid,Row,Col} = ReactBootstrap;


injectTapEventPlugin();

App = React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData() {
        const subHandles = Meteor.userId() ?
            [Meteor.subscribe("userApps"),] : [];

        const subsReady = _.every(subHandles, function (handle) {
            return handle.ready();
        });
        return {
            subsReady: subsReady
        };
    },

    childContextTypes: {
        muiTheme: React.PropTypes.object
    },

    getChildContext() {
        let muiTheme = ThemeManager.getMuiTheme(ZenRawTheme);
        let zenMUITheme = customizeMUITheme(muiTheme);
        return {
            muiTheme: zenMUITheme
        };
    },

    render(){
        //Todo check userlogin status and check if the children is a restricted link, if it is, redirect to login
        return (
            <div id="wrapper">
                <Header location={this.props.location}/>
                <Grid>
                    <Row style={{marginTop:"60px"}}>
                        <Col xs={12}>
                            {this.data.subsReady ?
                                this.props.children :
                                <AppLoading />}
                        </Col>
                    </Row>
                </Grid>
            </div>
        )
    }
});
