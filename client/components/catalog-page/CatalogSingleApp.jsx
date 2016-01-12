const {
  Row,
  Col,
  Button
  } = ReactBootstrap;

const {
  ListItem,
  Avatar,
  Divider,
  Checkbox,
  Toggle
  } = MUI;

const {
  ToggleStar,
  ToggleStarBorder
  } = SvgIcons;

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
      hovered: false
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
    let handleToggle = this.data.added ? this.handleRemove : this.handleAdd;
    let labelText = this.data.added ? "已添加" : "添加";
    let toggleState = this.data.added ? true : false;

    let toggleButton = <Toggle
      name="toggleName1"
      value="toggleValue1"
      label={labelText}
      labelPosition="right"
      labelStyle={{fontWeight:"lighter",color:ZenColor.blueGrey}}
      onToggle={handleToggle}
      defaultToggled={toggleState}/>;

    let appItem = (<Row className="single-app-row"
                        style={this.state.hovered?
                        {backgroundColor:  "#f7f7f7"}
                        :{backgroundColor:  "#ffffff"}}
                        onMouseOver={this.handleMouseOver}
                        onMouseOut={this.handleMouseOut}>
      <Col xs={5} sm={3} md={3} style={{height:"100%", textAlign:"center"}}>
        <span className="helper"></span><img className="vertial-middle " src={this.props.logoURL}
                                             style={{width:"50px", top:"18apx"}}/>
      </Col>
      <Col xs={2} sm={5} md={6} className="vertical-center">{this.props.appName}</Col>
      <Col xs={5} sm={4} md={3} className="vertical-center">{toggleButton}</Col>
    </Row>);

    return <div>
      {appItem}
    </div>
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