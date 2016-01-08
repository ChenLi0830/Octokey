const {
  Row,
  Col,
  Button
  } = ReactBootstrap;

CatelogSingleApp = React.createClass({
  propTypes: {
    logoURL: React.PropTypes.string.isRequired,
    appName: React.PropTypes.string.isRequired,
    loginLink: React.PropTypes.string.isRequired,
    appId: React.PropTypes.string.isRequired,
  },

  mixins: [ReactMeteorData],

  getMeteorData(){
    const appAddedQuery = {
      $and: [
        {userId: Meteor.userId()},
        {
          publicApps: {
            $elemMatch: {appId: this.props.appId}
          }
        }
      ]
    };

    return {
      added: UserApps.find(appAddedQuery).fetch().length > 0,
      currentUser: Meteor.user()
    }
  },

  render(){
    let addButton = this.data.added ?
      <Button bsStyle="success" className="add-button" onClick={this.handleRemove}>Added</Button> :
      <Button onClick={this.handleAdd} className="add-button">Add</Button>;

    return <Row className="single-app-row">
      <Col md={3} className="vertical-center"><LogoContainer logoURL={this.props.logoURL} /></Col>
      <Col md={7} className="vertical-center">{this.props.appName}</Col>
      <Col md={2} className="vertical-center">{addButton}</Col>
    </Row>
  },

  handleAdd(){
    const {logoURL,appName,loginLink,appId} = this.props;
    Meteor.call("addPublicApp", appId, appName, logoURL, loginLink);
    //this.setState({added: true});
  },

  handleRemove(){
    Meteor.call("removePublicApp", this.props.appId);
  }
});