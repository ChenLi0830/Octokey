const {
  Table,
  Panel
  } = ReactBootstrap;

const {
  Paper,
  RaisedButton,
  List,
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
      <Paper style={{backgroundColor:"white", minHeight:"560px",boxShadow:"none", border:"#eee solid 1px"}}>
        <List subheader="网站列表" style={{backgroundColor:"white"}}>
          {this.data.appsReady ? publicApps /*<AppLoading/>*/ : <AppLoading/>}
        </List>
      </Paper>


    </div>
  }
});