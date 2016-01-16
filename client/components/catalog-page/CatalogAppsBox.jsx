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
  propTypes:{
    zenApps: React.PropTypes.array.isRequired,
    chosenCategory: React.PropTypes.any.isRequired
  },

  render(){
    const publicApps = (this.props.zenApps.map(function (app) {
        let logoURL = getLogoUrl(app._id);
        return <CatelogSingleApp key={app._id}
                                 logoURL={logoURL}
                                 appName={app.appName}
                                 loginLink={app.loginLink}
                                 appId={app._id}/>
      })
    );

    return <div className = "layout-margin">
      <Paper zDepth={1}
             style={{
             backgroundColor:"#ffffff",
             padding:0,
             borderRadius:"5px"}}>
        <List subheader="网站列表" style={{backgroundColor:"white"}}>
          {publicApps}
        </List>
      </Paper>
    </div>
  }
});