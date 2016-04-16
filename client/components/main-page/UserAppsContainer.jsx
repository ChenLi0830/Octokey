/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-4-16
 *
 * Component for a the container of user apps in the list page, called by "ListPage"
 *******************************************************************************/
const AppBox = require('./AppBox.jsx');
const AddNewApp = require('./AddNewApp.jsx');
const PluginInstallDialog = require('./PluginInstallDialog.jsx');
const CredentialDialog = require('./CredentialDialog.jsx');
const EditDialog = require('./EditDialog.jsx');
const RegisterDialog = require('./RegisterDialog.jsx');
const FocusOverlay = require('./FocusOverlay.jsx');
const FloatingEditButton = require('./FloatingEditButton.jsx');

const {
    Row
    } = ReactBootstrap;

const {
    Paper,
    } = MUI;

let publicFocusedIndex = -1, privateFocusedIndex = -1;
let defaultRequest = {
  "progress": 10,
  "message": "ext_msg_connect",
};
let registeredUsername = "";

var UserAppsContainer = React.createClass({
  propTypes: {
    chosenTopics: React.PropTypes.array.isRequired,
    chosenPublicApps: React.PropTypes.array.isRequired,
    currentUser: React.PropTypes.object.isRequired,
    hexIv: React.PropTypes.string.isRequired,
    userEditStatus: React.PropTypes.string.isRequired,
    appContainerZIndex: React.PropTypes.string.isRequired,
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState(){
    return {
      openDialogCredential: false,
      openDialogEdit: false,
      openDialogPlugin: false,
      openDialogRegister: false,
      registerRequest: defaultRequest,
      openChooseTopicPage: false,
      openChooseAppPage: false,
    }
  },

  componentWillMount(){
    //if chosenTopics is empty, show choose topic page
    window.addEventListener("message", this.handleUpdateProgress);
  },

  componentWillUnmount(){
    window.removeEventListener("message", this.handleUpdateProgress);
  },

  render (){
    let appBoxes;
    if (this.props.chosenPublicApps.length > 0) {
      appBoxes = this.props.chosenPublicApps.map(function (userApp, i) {
        return <AppBox key={userApp.appId}
                       appId={userApp.appId}
                       logoURL={userApp.logoURL}
                       usernames={userApp.userNames}
                       appName={userApp.appName}
                       width="100%"
                       whenAppTileClicked={this.handleAppTileClick}
                       userEditStatus={this.props.userEditStatus}
        />
      }, this);
    } else {
      appBoxes = <AddNewApp whenClicked={this.handleNavigateToCatalog}/>;
    }

    let isPublicApp = publicFocusedIndex > -1;
    let appName = "", appId = "", loginLink, registerLink;
    if (this.state.openDialogCredential ||
        this.state.openDialogEdit ||
        this.state.openDialogRegister) {//Dialog is about to open
      if (isPublicApp) {
        appName = this.props.chosenPublicApps[publicFocusedIndex].appName;
        appId = this.props.chosenPublicApps[publicFocusedIndex].appId;
        loginLink = this.props.chosenPublicApps[publicFocusedIndex].loginLink;
        registerLink = this.props.chosenPublicApps[publicFocusedIndex].registerLink;
      } else {//private app
        alert("it is a private app!");
        appName = "";
        appId = "";
      }
    }

    return (
        <div>
          <Paper zDepth={1}
                 style={{
                   zIndex:this.props.appContainerZIndex,
                   position:"relative",
                   backgroundColor:ZenColor.white,
                   boxShadow:"0 1px 6px rgba(0, 0, 0, 0.12)",
                   padding:0,
                   marginBottom:70,
                   borderRadius:"5px"}}>
            <Row style={{marginLeft:0, marginRight:0}}>
              {appBoxes}
            </Row>
          </Paper>

          <PluginInstallDialog openDialogPlugin={this.state.openDialogPlugin}
                               whenCloseDialog={()=>{this.setState({openDialogPlugin:false})}}/>

          <CredentialDialog appName={appName}
                            appId={appId}
                            isPublicApp={isPublicApp}
                            openDialogCredential={this.state.openDialogCredential}
                            whenCloseDialog={()=>{this.setState({openDialogCredential: false})}}
                            whenSubmitCredential={this.handleLogin}
                            hexIv={this.props.hexIv}
          />

          {this.state.openDialogEdit ?
              <EditDialog appName={appName}
                          appId={appId}
                          isPublicApp={isPublicApp}
                          usernames={isPublicApp?this.props.chosenPublicApps[publicFocusedIndex].userNames:null}
                          openDialogEdit={this.state.openDialogEdit}
                          whenCloseDialog={()=>{this.setState({openDialogEdit: false})}}
                          hexIv={this.props.hexIv}
              /> : null}

          <RegisterDialog appName={appName}
                          appId={appId}
                          registerRequest={this.state.registerRequest}
                          openDialogRegister={this.state.openDialogRegister}
                          whenLogin={this.handleLogin.bind(this, registeredUsername, "")}
                          whenCloseDialog={()=>{this.setState({openDialogRegister:false, registerRequest:defaultRequest})}}
                          registerLink={registerLink}
          />

          <FocusOverlay visibility={_.indexOf(["config", "remove"],this.props.userEditStatus)>-1}/>
        </div>
    )
  },

  handleNavigateToCatalog(){
    this.context.router.push("/catalog");
  },

  handleAppTileClick(appId, username){
    // console.log("chrome.app.isInstalled", chrome.app.isInstalled);
    if (!this.extensionIsInstalled()) {
      this.props.onDialogPluginOpen();
      this.setState({openDialogPlugin: true});
      return;
    }

    publicFocusedIndex = _.findIndex(this.props.chosenPublicApps, function (publicApp) {
      return publicApp.appId === appId;
    });
    privateFocusedIndex = -1;
    //TODO getPrivateFocusedIndex in the same way

    let isPublicApp = publicFocusedIndex !== -1 && privateFocusedIndex === -1;

    if (this.props.userEditStatus === "default") {
      if (isPublicApp) {//是public app
        //if (this.props.chosenPublicApps[publicFocusedIndex].userNames.length > 0) {
        if (username) {
          this.handleLogin(username, "");
        }
        else {
          this.setState({openDialogCredential: true});
        }
      }
      else {//
        console.log("is private app")
      }
    }

    else if (this.props.userEditStatus === "remove") {
      if (isPublicApp) {
        Meteor.call("unsubscribePublicApp", appId);
      } else {
        alert("remove private app!")
      }
    }
    else if (this.props.userEditStatus === "config") {
      if (isPublicApp) {
        this.setState({openDialogEdit: true});
      } else {
        alert("edit private app!")
      }
    }
    else if (this.props.userEditStatus === "register") {
      if (isPublicApp) {
        //Todo get profile info from database / ask user to create profile
        const profile = this.generateProfile();
        this.handleRegister(profile);
      } else {
        alert("Register for a private app is not allowed!")
      }
    }
  },

  extensionIsInstalled(){
    return !!document.getElementById("extension-is-installed-nehponjfbiigcobaphdahhhiemfpaeob");
  },

  handleLogin(username, password){
    let targetUrl = document.location.origin;

    //console.log("username: ",username);
    let isPublicApp = publicFocusedIndex > -1;
    let appId = "", loginLink = "";
    if (isPublicApp) {
      appId = this.props.chosenPublicApps[publicFocusedIndex].appId;
      loginLink = this.props.chosenPublicApps[publicFocusedIndex].loginLink;
    } else {//private app
      alert("it is a private app!");
      appId = "";
      loginLink = "";
    }
    //Todo 让这一步的Meteor.userID()放到server里执行
    window.postMessage(//Communicate with plugin
        {
          event: "logIn",
          userId: Meteor.userId(),
          appId: appId,
          loginLink: loginLink,
          username: username,
          password: password,
          hexIv: this.props.hexIv,
          hexKey: Session.get("hexKey")
        },
        targetUrl);
    //console.log("Meteor.userId(), appId, loginLink, username, password,
    // this.props.hexIv,Session.get(hexKey)", Meteor.userId(), appId, loginLink, username, password,
    // this.props.hexIv,Session.get("hexKey"));
  },

  handleRegister(profile){
    let targetUrl = document.location.origin;

    //console.log("username: ",username);
    let isPublicApp = publicFocusedIndex > -1;
    if (!isPublicApp) {
      alert("You can't create account for private app!");
      return;
    }

    let appId = this.props.chosenPublicApps[publicFocusedIndex].appId;
    //loginLink = this.props.chosenPublicApps[publicFocusedIndex].loginLink;
    let registerLink = this.props.chosenPublicApps[publicFocusedIndex].registerLink;
    //Todo 让这一步的Meteor.userID()放到server里执行

    if (registerLink) {//If there is a register link for this app
      this.setState({openDialogRegister: true});
      window.postMessage(//Communicate with plugin
          {
            event: "register",
            userId: Meteor.userId(),
            appId: appId,
            registerLink: registerLink,
            profile: profile,
          },
          targetUrl
      );
    } else {
      alert("Registration is not set up for this app.");
    }
  },

  handleUpdateProgress(event){
    var origin = event.origin || event.originalEvent.origin;
    if (origin !== document.location.origin) {//make sure message comes from Octokey
      return;
    }
    if (event.data.type === "registerProgress" && this.state.openDialogRegister) {
      //console.log(event.data);
      this.setState({registerRequest: event.data});
      //console.log("this.state", this.state);
      if (event.data.username && event.data.password) {//event contains username && password
        if (event.data.userId === this.props.currentUser._id) {//Check if its still the same user
          registeredUsername = event.data.username;
          OctoClientAPI.saveCredential(event.data.appId, this.props.hexIv, event.data.username,
              event.data.password, true)
        }
      }
    }
  },

  generateProfile(){//For text purpose
    const randomNumber = Math.floor(Math.random() * 10000);
    const cellNumber = "7097490481";
    const nickName = "ChenLizhangyu" + randomNumber;

    let email = Meteor.user().emails[0].address;
    const atSignIndex = email.indexOf('@');
    const newEmail = email.substr(0, atSignIndex) + '+' + randomNumber +
        email.substr(atSignIndex, email.length - atSignIndex);

    const firstName = "demo";
    const lastName = "account";
    return {
      cellNumber: cellNumber,
      nickName: nickName,
      email: newEmail,
      firstName: firstName,
      lastName: lastName,
    };
  },

});

module.exports = UserAppsContainer;