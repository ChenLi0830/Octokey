/**
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-26
 *
 * The component for a Single App, called by "CatalogAppsBox"
 */
const {
    Row,
    Col,
    } = ReactBootstrap;

const {
  // ListItem,
  // Avatar,
  // Divider,
  // Checkbox,
    Toggle,
    } = MUI;

const {
  // ToggleStar,
  // ToggleStarBorder
    } = SvgIcons;

const styles = {
  row: {
    height: 100,
    marginLeft: "auto",
    marginRight: "auto",
    minWidth: "340px",
  },
};

const AppModalContainerEdit = require('./AppModalContainerEdit.jsx');

var CatalogSingleApp = React.createClass({
  propTypes: {
    logoURL: React.PropTypes.string.isRequired,
    appName: React.PropTypes.string.isRequired,
    loginLink: React.PropTypes.string.isRequired,
    registerLink: React.PropTypes.string,
    appId: React.PropTypes.string.isRequired,
    selectedCategoryNames: React.PropTypes.array.isRequired,
    whenClicked: React.PropTypes.func,
    subscribed: React.PropTypes.bool.isRequired,
    condensed: React.PropTypes.bool,
    subsCount: React.PropTypes.number,
    zenCategories: React.PropTypes.array.isRequired,
  },

  getDefaultProps: function () {
    return {
      condensed: false,
      whenClicked: ()=> {
      },
      subsCount: 0,
      registerLink: "",
    };
  },

  contextTypes: {
    intl: React.PropTypes.object.isRequired,
  },

  getInitialState(){
    return {
      hovered: false,
      modalOpen: false,
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
    const {messages} = this.context.intl;
    const {logoURL,appName,loginLink,registerLink,appId,selectedCategoryNames, condensed,subsCount} = this.props;

    let handleToggle = this.props.subscribed ? this.handleUnsubscribe : this.handleSubscribe;
    let labelText = this.props.subscribed ? messages.cata_added : messages.cata_add;
    let toggleState = this.props.subscribed ? true : false;

    let toggleButton = <Toggle
        name="toggleName1"
        value="toggleValue1"
        label={labelText}
        labelPosition="right"
        labelStyle={{fontWeight:"lighter",color:ZenColor.blueGrey}}
        onToggle={handleToggle}
        defaultToggled={toggleState}/>;

    return <div>
      <AppModalContainerEdit
          modalOpen={this.state.modalOpen}
          logoURL={logoURL}
          appName={appName}
          loginLink={loginLink}
          registerLink={registerLink}
          appId={appId}
          selectedCategoryNames={selectedCategoryNames}
          onModalClose={()=>{this.setState({modalOpen:false});}}
          zenCategories={this.props.zenCategories}
      />

      <Row style={_.extend({}, styles.row,
                                    {backgroundColor: this.state.hovered? ZenColor.grey1_5 : ZenColor.white}
                            )}
           onMouseOver={this.handleMouseOver}
           onMouseOut={this.handleMouseOut}>
        <Col xs={3} sm={3} md={condensed? 2:3}
             onClick={()=>{this.setState({modalOpen:true})}}
             style={{height:"100%", textAlign:"center"}}>
          <span className="helper"></span><img className="vertial-middle " src={logoURL}
                                               style={{width:condensed ? "25px": "50px", top:"18px"}}/>
        </Col>

        <Col xs={5} sm={4} md={condensed? 5:/*4*/6}
             className="vertical-center">
          <p>{appName}</p>
        </Col>

        <Col xs={4} sm={3} md={condensed? 5:3} className="vertical-center">
          {toggleButton}
        </Col>

        {/*<Col xs={0} sm={2} md={2} xsHidden
         style={{display:condensed?"none":"block",color:ZenColor.grey3}}
         className="vertical-center">
         <p>{subsCount + messages.cata_peopleUse}</p>

         </Col>*/}
      </Row>
    </div>;
  },

  handleSubscribe() {
    const {logoURL,appName,loginLink,registerLink,appId} = this.props;
    Meteor.call("addPublicApp", appId, appName, logoURL, loginLink, registerLink);
  },

  handleUnsubscribe() {
    Meteor.call("removePublicApp", this.props.appId);
  }
});

module.exports = CatalogSingleApp;