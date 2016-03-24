/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-31
 *
 * AppsContainer Component contains all the app boxes of the main page, called by "routes"
 *******************************************************************************/
var AppBox = require('./AppBox.jsx');
var AddNewApp = require('./AddNewApp.jsx');
var PluginInstallDialog = require('./PluginInstallDialog.jsx');
var CredentialDialog = require('./CredentialDialog.jsx');
var EditDialog = require('./EditDialog.jsx');
var RegisterDialog = require('./RegisterDialog.jsx');
var FocusOverlay = require('./FocusOverlay.jsx');
var FloatingEditButton = require('./FloatingEditButton.jsx');

const {
    Grid,
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

var AppsContainer = React.createClass({
    mixins: [ReactMeteorData],

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    getMeteorData(){
        if (Meteor.user()) {
            // appId, appName,logoURL,loginLink,registerLink,userNames,defaultUserName,lastLoginTime
            let findUserApps = UserApps.find({userId: Meteor.userId()}).fetch()[0];

            return {
                currentUser: Meteor.user(),
                chosenPublicApps: findUserApps ? findUserApps.publicApps : [],
                hexIv: findUserApps && findUserApps.hexIv ? findUserApps.hexIv : "",
            }
        } else {
            return {
                currentUser: null,
                chosenPublicApps: [],
                salt: "",
                hexIv: "",
            }
        }
    },

    getInitialState(){
        return {
            openDialogCredential: false,
            userEditStatus: "default",
            openDialogEdit: false,
            openDialogPlugin: false,
            openDialogRegister: false,
            registerRequest: defaultRequest,
        }
    },

    componentWillMount(){
        window.addEventListener("message", this.handleUpdateProgress);
    },

    componentWillUnmount(){
        window.removeEventListener("message", this.handleUpdateProgress);
    },

    render(){
        if (this.data.chosenPublicApps.length > 0) {
            var appBoxes = this.data.chosenPublicApps.map(function (userApp, i) {
                return <AppBox key={userApp.appId}
                               appId={userApp.appId}
                               logoURL={userApp.logoURL}
                               usernames = {userApp.userNames}
                               appName = {userApp.appName}
                               width="100%"
                               whenAppTileClicked={this.handleAppTileClick}
                               userEditStatus={this.state.userEditStatus}
                />
            }, this);
        } else {
            var appBoxes = <AddNewApp whenClicked={this.handleNavigateToCatalog}/>;
        }

        //console.log("appBoxes",appBoxes.count, appBoxes);
        let isPublicApp = publicFocusedIndex > -1;
        let appName = "", appId = "", loginLink, registerLink;
        if (this.state.openDialogCredential ||
            this.state.openDialogEdit ||
            this.state.openDialogRegister) {//Dialog is about to open
            if (isPublicApp) {
                appName = this.data.chosenPublicApps[publicFocusedIndex].appName;
                appId = this.data.chosenPublicApps[publicFocusedIndex].appId;
                loginLink = this.data.chosenPublicApps[publicFocusedIndex].loginLink;
                registerLink = this.data.chosenPublicApps[publicFocusedIndex].registerLink;
            } else {//private app
                alert("it is a private app!");
                appName = "";
                appId = "";
            }
        }

        return <div>
            <PluginInstallDialog openDialogPlugin={this.state.openDialogPlugin}
                                 whenCloseDialog={()=>{this.setState({openDialogPlugin:false})}}/>

            <CredentialDialog appName={appName}
                              appId={appId}
                              isPublicApp={isPublicApp}
                              openDialogCredential={this.state.openDialogCredential}
                              whenCloseDialog={this.handleCloseDialogCredential}
                              whenSubmitCredential={this.handleLogin}
                              hexIv={this.data.hexIv}
            />

            {this.state.openDialogEdit ?
                <EditDialog appName={appName}
                            appId={appId}
                            isPublicApp={isPublicApp}
                            usernames={isPublicApp?this.data.chosenPublicApps[publicFocusedIndex].userNames:null}
                            openDialogEdit={this.state.openDialogEdit}
                            whenCloseDialog={()=>{this.setState({openDialogEdit: false})}}
                            hexIv={this.data.hexIv}
                /> : null}

            <RegisterDialog appName={appName}
                            appId={appId}
                            registerRequest={this.state.registerRequest}
                            openDialogRegister={this.state.openDialogRegister}
                            whenLogin={this.handleLogin.bind(this, registeredUsername, "")}
                            whenCloseDialog={()=>{this.setState({openDialogRegister:false, registerRequest:defaultRequest})}}
                            registerLink = {registerLink}
            />

            <FocusOverlay visibility={_.indexOf(["config", "remove"],this.state.userEditStatus)>-1}/>

            <FloatingEditButton
                whenEditButtonClicked={this.handleEditButtonClick}
                userEditStatus={this.state.userEditStatus}
            />

            <Paper zDepth={1}
                   style={{
                   zIndex:"400",
                   position:"relative",
                   backgroundColor:ZenColor.white,
                   boxShadow:"0 1px 6px rgba(0, 0, 0, 0.12)",
                   padding:0,
                   borderRadius:"5px"}}>
                <Row style={{marginLeft:0, marginRight:0}}>
                    {appBoxes}
                </Row>
            </Paper>
        </div>
    },

    handleAppTileClick(appId, username){
        //console.log("chrome.app.isInstalled", chrome.app.isInstalled);
        if (!this.extensionIsInstalled()) {
            this.setState({openDialogPlugin: true});
            return;
        }

        publicFocusedIndex = _.findIndex(this.data.chosenPublicApps, function (publicApp) {
            return publicApp.appId === appId;
        });
        privateFocusedIndex = -1;
        //TODO getPrivateFocusedIndex in the same way

        let isPublicApp = publicFocusedIndex !== -1 && privateFocusedIndex === -1;

        if (this.state.userEditStatus === "default") {
            if (isPublicApp) {//是public app
                //if (this.data.chosenPublicApps[publicFocusedIndex].userNames.length > 0) {
                if (username) {
                    this.handleLogin(username, "");
                }
                else {
                    this.handleOpenDialogCredential(publicFocusedIndex);
                }
            }
            else {//
                console.log("is private app")
            }
        }

        else if (this.state.userEditStatus === "remove") {
            if (isPublicApp) {
                Meteor.call("removePublicApp", appId);
            } else {
                alert("remove private app!")
            }
        }
        else if (this.state.userEditStatus === "config") {
            if (isPublicApp) {
                this.setState({openDialogEdit: true});
            } else {
                alert("edit private app!")
            }
        }
        else if (this.state.userEditStatus === "register") {
            if (isPublicApp) {
                //Todo get profile info from database / ask user to create profile
                const profile = this.generateProfile();
                this.handleRegister(profile);
            } else {
                alert("Register for a private app is not allowed!")
            }
        }
    },

    handleEditButtonClick(i){
        //console.log(i);
        if (typeof i === "object") {
            this.setState({userEditStatus: "default"});
        } else switch (i) {
            case 0:
                this.handleNavigateToCatalog();
                break;
            case 1:
                this.setState({userEditStatus: "remove"});
                break;
            case 2:
                this.setState({userEditStatus: "config"});
                break;
            case 3:
                this.setState({userEditStatus: "register"});
                break;
            default:
                alert(i + " is clicked, don't know how to handle.");
        }
        //this.setState({focusedIndex:i});
    },

    handleNavigateToCatalog(){
        this.context.router.push("/catalog");
    },

    handleOpenDialogCredential() {
        this.setState({openDialogCredential: true});
    },

    handleCloseDialogCredential() {
        this.setState({openDialogCredential: false});
    },

    handleLogin(username, password){
        let targetUrl = document.location.origin;

        //console.log("username: ",username);
        let isPublicApp = publicFocusedIndex > -1;
        let appId = "", loginLink = "";
        if (isPublicApp) {
            appId = this.data.chosenPublicApps[publicFocusedIndex].appId;
            loginLink = this.data.chosenPublicApps[publicFocusedIndex].loginLink;
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
                hexIv: this.data.hexIv,
                hexKey: Session.get("hexKey")
            },
            targetUrl);
        //console.log("Meteor.userId(), appId, loginLink, username, password, this.data.hexIv,Session.get(hexKey)",
            //Meteor.userId(), appId, loginLink, username, password, this.data.hexIv,Session.get("hexKey"));
    },

    handleRegister(profile){
        let targetUrl = document.location.origin;

        //console.log("username: ",username);
        let isPublicApp = publicFocusedIndex > -1;
        if (!isPublicApp) {
            alert("You can't create account for private app!");
            return;
        }

        let appId = this.data.chosenPublicApps[publicFocusedIndex].appId;
        //loginLink = this.data.chosenPublicApps[publicFocusedIndex].loginLink;
        let registerLink = this.data.chosenPublicApps[publicFocusedIndex].registerLink;
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

    extensionIsInstalled(){
        return !!document.getElementById("extension-is-installed-nehponjfbiigcobaphdahhhiemfpaeob");
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
                if (event.data.userId === this.data.currentUser._id) {//Check if its still the same user
                    registeredUsername = event.data.username;
                    OctoAPI.saveCredential(event.data.appId, this.data.hexIv, event.data.username, event.data.password, true)
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
        const newEmail = email.substr(0,atSignIndex) + '+' + randomNumber + email.substr(atSignIndex,email.length-atSignIndex);

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

module.exports = AppsContainer;