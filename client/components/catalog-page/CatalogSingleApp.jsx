const {
  Row,
  Col,
  Button
  } = ReactBootstrap;

const {
  ListItem,
  Avatar,
  Divider
  } = MUI;

CatelogSingleApp = React.createClass({
  propTypes: {
    logoURL: React.PropTypes.string.isRequired,
    appName: React.PropTypes.string.isRequired,
    loginLink: React.PropTypes.string.isRequired,
    appId: React.PropTypes.string.isRequired,
  },

  mixins: [ReactMeteorData],

  getInitialState(){
    return {
      hovered: false,
      open: false
    }
  },

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

  handleMouseOver(){
    this.setState({
      hovered: true
    })
  },

  handleMouseOut(){
    this.setState({
      hovered: false
    })
  },

  render(){
    let addButton = this.data.added ?
      <Button bsStyle="success" className="add-button" onClick={this.handleRemove}>Added</Button> :
      <Button onClick={this.handleAdd} className="add-button">Add</Button>;

    //return <Row className="single-app-row">
    //  <Col md={3} className="vertical-center"><LogoContainer logoURL={this.props.logoURL} /></Col>
    //  <Col md={7} className="vertical-center">{this.props.appName}</Col>
    //  <Col md={2} className="vertical-center">{addButton}</Col>
    //</Row>

    let logoAvatar = <img src={this.props.logoURL} style={{width:"50px", top:"28px"}}
                          className="vertical-center horizontal-center"/>;


    return <ListItem
      className="app-list"
      style={{
        padding:"20px 26px 20px 20px",
        backgroundColor:this.state.hovered?"#FAFAFA":"rgba(255, 255, 255, 0.0)",
        boxShadow:this.state.hovered? "0 1px 6px rgba(0, 0, 0, 0.12)" : "none"
      }}
      leftAvatar={logoAvatar}
      rightIconButton={addButton}
      primaryText={this.props.appName}
      onMouseOver={this.handleMouseOver}
      onMouseOut={this.handleMouseOut} zDepth={this.state.hovered?1:0}
    />
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