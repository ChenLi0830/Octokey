const {
  Row,
  Col,
  Button
  } = ReactBootstrap;

CatelogSingleAppBox = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData(){
    return {
      added: _.includes(Meteor.user().publicApps,this.props.appId),
      currentUser:Meteor.user()
    }
  },

  //getInitialState(){
  //  return {
  //    added: false
  //  }
  //},

  render(){
    let addButton = this.data.added ? <Button bsStyle="success" className="add-button" onClick={this.handleRemove}>Added</Button> :
      <Button onClick={this.handleAdd} className="add-button">Add</Button>;

    return <Row className="single-app-row">
      <Col md={3} className="vertical-center"><LogoContainer logoURL={this.props.logoURL} showConfig={false}/></Col>
      <Col md={7} className="vertical-center">{this.props.appName}</Col>
      <Col md={2} className="vertical-center">{addButton}</Col>
    </Row>
  },

  handleAdd(){
    Meteor.call("addPublicApp", this.props.appId);
    console.log("added new app");
    //this.setState({added: true});
  },

  handleRemove(){
    Meteor.call("removePublicApp",this.props.appId);
  }
});