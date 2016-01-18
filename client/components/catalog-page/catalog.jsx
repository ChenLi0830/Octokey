const {
  Grid,
  Row,
  Col
  } = ReactBootstrap;

Catalog = React.createClass({
  mixins: [
    ReactMeteorData,
    Reflux.listenTo(CategoryStore, 'categoryChange')
  ],


  getInitialState(){
    return {
      chosenCategory: "all",
    }
  },

  getMeteorData(){
    const subsHandles = [
      Meteor.subscribe("zenApps"),
      Meteor.subscribe("zenCategories")
    ];
    const subsReady = _.all(subsHandles, function (subsHandle) {
      //console.log("subsHandle", subsHandle, "is ready?", subsHandle.ready());
      return subsHandle.ready();
    });

    //const zenApps = ZenApps.find().fetch();
    const chosenApps = ZenApps.find({
      categoryNames:{
        $in: [this.state.chosenCategory]
      }
    }).fetch();

    return {
      zenApps: chosenApps,
      zenCategories: ZenCategories.find().fetch(),
      subsReady: subsReady
    }
  },


  render(){
    //console.log("Actions",Actions);

    const chosenZenApps = this.data.zenApps;

    //console.log("state.chosenCategory: ", this.state.chosenCategory);
    let catalogPage = (<Grid>
      <Row>
        <Col sm={3}>
          <CatalogSideBar zenCategories={this.data.zenCategories}/>
        </Col>
        <Col sm={9}>
          <CatalogAppsBox zenApps={this.data.zenApps} zenCategories={this.data.zenCategories}/>
        </Col>
      </Row>
    </Grid>);

    return <div>
      {this.data.subsReady ? catalogPage /*<AppLoading/>*/ : <AppLoading/>}
    </div>
  },

  categoryChange(event, categoryName){
    //console.log("event",event);
    this.setState({
      chosenCategory: categoryName
    });
  }
});