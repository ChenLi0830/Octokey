var {ThemeManager} = MUI.Styles;
var {AppCanvas,Paper} = MUI;
var {Grid,Row,Col} = ReactBootstrap;

injectTapEventPlugin();

App = React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData() {
        const subHandles = Meteor.userId() ?
            [Meteor.subscribe("userApps"),] : [];

        const subsReady = _.all(subHandles, function (handle) {
            return handle.ready();
        });
        // Get the current routes from React Router
        const routes = this.props.routes;
        // If we are at the root route, and the subscrioptions are ready
        if (routes.length > 1 && !routes[1].path && subsReady) {
            // Redirect to the route for the first todo list
            this.props.history.replaceState(null, `/list`);
        }
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
            muiTheme:zenMUITheme
        };
    },

    render(){
        return (
            <div id="wrapper">
                <Header />
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
