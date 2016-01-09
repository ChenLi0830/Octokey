const {
  Table,
  Panel
  } = ReactBootstrap;

const {
  Paper,
  RaisedButton,
  } = MUI;

const {
  NavigationExpandMoreIcon
  } = SvgIcons;

CatalogAppsBox = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData(){
    var handle = Meteor.subscribe("zenApps");
    return {
      zenApps: ZenApps.find().fetch(),
      appsReady: handle.ready()
    }
  },

  render(){
    const title = (
      <h3>网站列表</h3>
    );

    const publicApps = (this.data.zenApps.map(function (app) {
        let logoURL = getLogoUrl(app._id);
        return <CatelogSingleApp key={app._id}
                                 logoURL={logoURL}
                                 appName={app.appName}
                                 loginLink={app.loginLink}
                                 appId={app._id}/>
      })
    );

    return <div>

      <Paper style={{backgroundColor:"white", minHeight:"560px"}}>
        {this.data.appsReady ? publicApps /*<AppLoading/>*/: <AppLoading/>}
      </Paper>

    </div>
  }
});