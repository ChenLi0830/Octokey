/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-31
 *
 * App component is the root element to load the app. Called by "router".
 *******************************************************************************/
var AppLoading = require('./AppLoading.jsx');
var Header = require('./header/Header.jsx');
import getMuiTheme from 'material-ui/styles/getMuiTheme';

var {AppCanvas,Paper} = MUI;
var {Grid,Row,Col} = ReactBootstrap;

injectTapEventPlugin();

const styles = {
  wrapper: {
    //padding: "0 0 0 0",
    //padding: "64px 0 0 0",
    minHeight: "100%",
    position: "relative",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "lightslategrey",
  }
};

//let zIndex = {
//    zIndex: {
//        popover: 201,
//        layer: 200
//    }
//};

var App = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    const subHandles = Meteor.userId() ?
        [Meteor.subscribe("userApps"),] : [];

    const subsReady = _.every(subHandles, function (handle) {
      return handle.ready();
    });
    const currentUserId = Meteor.userId();
    return {
      subsReady: subsReady,
      currentUserId: currentUserId,
      UserApps: currentUserId ? UserApps.find({userId: currentUserId}).fetch()[0] : null,
    };
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  componentWillMount(){
    // Listen to the Extension's request for user's login info and hexIv
    window.addEventListener("message", this.checkAndSendData);
  },

  componentWillUnmount(){
    window.removeEventListener("message", this.checkAndSendData);
  },

  getChildContext() {
    let muiTheme = getMuiTheme(ZenRawTheme/*, zIndex*/);
    let zenMUITheme = customizeMUITheme(muiTheme);
    return {
      muiTheme: zenMUITheme
    };
  },

  render(){
    //console.log("this.data.UserApps", this.data.UserApps);
    //console.log("Session.get(hexKey)", Session.get("hexKey"));
    if (this.data.UserApps) {
      if (!Session.get("hexKey")) {//when user logged in with fresh session
        // Set Session variable "hexKey"
        Actions.initKeySaltIv(this.data.UserApps.hexSalt, this.data.UserApps.hexIv);
      }
    }

    //Todo check userlogin status and check if the children is a restricted link, if it is,
    // redirect to login
    return (
        <div style={styles.wrapper}>
          <Header location={this.props.location}/>
          <Grid>
            <Row style={{marginTop:"60px"}}>
              <Col xs={12}>
                {this.data.subsReady ?
                    this.props.children :
                    <AppLoading />}
              </Col>
            </Row>
          </Grid>
          <LanguageSelection/>
        </div>
    )
  },

  checkAndSendData(event){//Wait for meteor data to be ready
    if (event.data.type === "extensionRequestInfo") {
      if (this.data.subsReady) {
        this.handleSendInfoToExtension(event);
      } else {
        //console.log("meteor data not ready");
        setTimeout(this.checkAndSendData.bind(this, event), 100);
      }
    }
  },

  handleSendInfoToExtension(event){
    var origin = event.origin || event.originalEvent.origin;
    if (origin !== document.location.origin) {//make sure message comes from Octokey
      return;
    }

    const targetUrl = document.location.origin;
    if (event.data.type === "extensionRequestInfo") {
      //console.log("send meteor data");
      window.postMessage(//Communicate with plugin, post the message to the 'targetUrl'
          {
            event: "sendInfoToExtension",
            loginToken: localStorage["Meteor.loginToken"],
            loginTokenExpires: localStorage["Meteor.loginTokenExpires"],
            userId: localStorage["Meteor.userId"],
            hexIv: this.data.UserApps.hexIv,
            hexKey: Session.get("hexKey"),
          },
          targetUrl
      );
    }
  },
});

module.exports = App;