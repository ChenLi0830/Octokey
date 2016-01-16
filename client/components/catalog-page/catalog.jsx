const {
  Grid,
  Row,
  Col
  } = ReactBootstrap;

Catalog = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData(){
    const subsHandles = [
      Meteor.subscribe("zenApps"),
      Meteor.subscribe("zenCategories")
    ];
    const subsReady = _.all(subsHandles, function (subsHandle) {
      //console.log("subsHandle", subsHandle, "is ready?", subsHandle.ready());
      return subsHandle.ready();
    });
    return {
      zenApps: ZenApps.find().fetch(),
      zenCategories: ZenCategories.find().fetch(),
      subsReady: subsReady
    }
  },

  getInitialState(){
    return {
      chosenCategory : ""
    }
  },

  render(){
    let catalogPage = (<Grid>
      <Row>
        <Col sm={3}>
          <CatalogSideBar zenCategories={this.data.zenCategories}/>
        </Col>
        <Col sm={9}>
          <CatalogAppsBox zenApps = {this.data.zenApps} chosenCategory={this.state.chosenCategory}/>
        </Col>
      </Row>
    </Grid>);

    return <div>
      {this.data.subsReady ? catalogPage /*<AppLoading/>*/ : <AppLoading/>}
    </div>

  }
});