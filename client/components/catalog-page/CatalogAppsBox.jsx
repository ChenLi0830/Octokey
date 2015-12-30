const {
  Table,
  Panel
  } = ReactBootstrap;


CatalogAppsBox = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData(){
    return {
      apps: ZenApps.find().fetch()
    }
  },

  render(){
    const title = (
      <h3>网站列表</h3>
    );

    const publicApps = (this.data.apps.map(function (app) {
        let logoURL = "cfs/files/zenApps/" + app._id;
        return <CatelogSingleAppBox key={app._id} logoURL={logoURL}
                                    appName={app.appName}
                                    loginLink={app.loginLink}
                                    appId = {app._id}
                                    showConfig={false}/>
      })
    );

    return <div>
      <Panel header={title} bsStyle="primary">
        {publicApps}
      </Panel>

    </div>
  }
});