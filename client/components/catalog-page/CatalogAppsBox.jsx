const {
  Panel,
  ListGroup,
  ListGroupItem,
  Image
  } = ReactBootstrap;

CatalogAppsBox = React.createClass({
  mixins:[ReactMeteorData],

  getMeteorData(){
    return {
      apps: ZenApps.find().fetch()
    }
  },

  renderFormalApps(){
    //console.log("one of the logos",this.data.logos);
    return this.data.apps.map(function(app){
      console.log(app);
      let logoURL = "cfs/files/zenApps/"+app._id;
      return <ListGroupItem header={app.appName}>
        <Image src={logoURL} rounded />
        {app.loginLink}
      </ListGroupItem>
    });
  },

  render(){
    const title = (
      <h3>Panel title</h3>
    );
    return <div>
        <Panel header={title} bsStyle="primary">
        <ListGroup>
          {this.renderFormalApps()}
          <ListGroupItem>Item 2</ListGroupItem>
          <ListGroupItem>...</ListGroupItem>
        </ListGroup>
      </Panel>

    </div>
  }
});